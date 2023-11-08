# These typing extensions can be removed when we upgrade off Python
# 3.8:
# https://docs.python.org/3/library/typing.html#typing.Self
try:
    from typing import Self
except ImportError:
    from typing_extensions import Self

import re
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.db import models
from treebeard.mp_tree import MP_Node

from econplayground.main.models import Cohort, Graph
from econplayground.assignment.custom_storage import MediaStorage


class Question(models.Model):
    title = models.TextField(blank=True, default='')
    prompt = models.TextField(blank=True, default='')

    graph = models.ForeignKey(
        Graph, on_delete=models.CASCADE,
        blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title or 'Question {}'.format(self.pk)

    def evaluate_action(self, action_name: str, action_value: str) -> bool:
        return self.assessmentrule_set.first().evaluate_action(
            action_name, action_value)

    def first_rule(self) -> 'AssessmentRule':
        return self.assessmentrule_set.first()


def convert_action_name(s: str) -> str:
    """
    Convert a string from the form: gLine1Label

    To: line_1_label
    """
    if s and len(s) > 1 and s.startswith('g') and s[1].isupper():
        s = s[1:]
        return re.sub(r'(?<!^)(?=[A-Z])', '_', s).lower()

    return s or ''


class AssessmentRule(models.Model):
    """
    Question evaluation data. The following fields are based on the
    main.models.AssessmentRule structure.

    You can constrain this by setting a value for assessment_name,
    allowing any action on, e.g. line1_slope to succeed. And then
    you can further constrain this action on line1_slope by setting
    the assessment_value to something like 'increase' or 'decrease'.
    """
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    # The graph characteristic to assess, i.e. slope, position, label
    assessment_name = models.CharField(max_length=1024)

    # The value we are looking for (i.e. user action), increase,
    # decrease, or label match
    assessment_value = models.CharField(max_length=1024)

    # Optional custom feedback for this assessment rule
    feedback_fulfilled = models.TextField(blank=True, default='')
    media_fulfilled = models.FileField(
        storage=MediaStorage, blank=True, null=True)

    feedback_unfulfilled = models.TextField(blank=True, default='')
    media_unfulfilled = models.FileField(
        storage=MediaStorage, blank=True, null=True)

    def has_fulfilled_feedback(self) -> bool:
        return self.feedback_fulfilled or self.media_fulfilled

    def has_unfulfilled_feedback(self) -> bool:
        return self.feedback_unfulfilled or self.media_unfulfilled

    def has_feedback(self) -> bool:
        return self.has_fulfilled_feedback() or self.has_unfulfilled_feedback()

    def evaluate_action(self, action_name: str, action_value: str) -> bool:
        """
        Evaluate a user action, based on action type and value.

        Returns a boolean: True for success, False for failure.
        """
        # Remove underscores and lower-case both names for more lax comparison.
        action_name = convert_action_name(action_name).lower().replace('_', '')
        self.assessment_name = self.assessment_name.lower().replace('_', '')

        if self.assessment_name and self.assessment_value:
            return action_name == self.assessment_name and \
                action_value.lower() == self.assessment_value.lower()

        if self.assessment_name:
            return action_name == self.assessment_name

        if not self.assessment_name and not self.assessment_value:
            return True

        return False


class Assignment(models.Model):
    title = models.TextField(max_length=1024, default='Untitled')
    published = models.BooleanField(default=False)
    prompt = models.TextField(blank=True, default='')
    cohorts = models.ManyToManyField(Cohort, blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_root(self) -> 'Step':
        try:
            root = Step.objects.get(
                assignment=self, is_root_node=True).get_root()
        except Step.DoesNotExist:
            root = Step.add_root(
                assignment=self, is_root_node=True)

        return root

    @property
    def first_step(self) -> 'Step':
        return self.get_root().get_first_child()

    def add_step(self, pos='last-sibling') -> 'Step':
        """Add a node on the main path.

        Returns the new Step.
        """
        root = self.get_root()
        new_step = Step(assignment=self)
        first_child = root.get_first_child()

        if first_child:
            first_child.add_sibling(instance=new_step, pos=pos)
        else:
            root.add_child(instance=new_step)

        return new_step

    def add_substep(self, step_id: int) -> 'Step':
        """Add a node on a sub path.

        Returns the new Step.
        """
        step = Step.objects.get(assignment=self, pk=step_id)
        new_step = Step(assignment=self)
        step.add_child(instance=new_step)
        return new_step

    def remove_step(self, step_id: int) -> None:
        step = Step.objects.get(assignment=self, pk=step_id)
        step.delete()


class Step(MP_Node):
    is_root_node = models.BooleanField(default=False)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

    question = models.ForeignKey(
        Question, on_delete=models.SET_NULL,
        blank=True, null=True)

    next_step = models.ForeignKey(
        'self', on_delete=models.SET_NULL,
        blank=True, null=True)

    def get_prev(self) -> Self:
        """Return the previous child, or the prev sibling, or None."""

        node = self.get_prev_sibling()
        if node:
            child = node.get_last_child()
            if child:
                return child

        if not node:
            return self.get_parent()

        return node

    def get_next(self) -> Self:
        """Return the next child, or the next sibling, or None.

        This is probably the result of a correct answer on the student
        side.
        """
        node = self.get_next_sibling()
        if node:
            return node

        parent = self.get_parent()
        if parent:
            node = parent.get_next_sibling()

        if node:
            return node

        child = self.get_first_child()
        if child:
            return child

        return None

    def closest_next_sibling(self) -> Self:
        """
        Return the closest next sibling to this node, traversing
        up its line of descendents.
        """
        node = self
        while node:
            sibling = node.get_next_sibling()
            if sibling:
                return sibling

            node = node.get_parent()

        return None

    def get_next_intervention(self) -> Self:
        """The student answered incorrectly, so find the intervention path."""
        node = self.get_first_child()
        if node:
            return node

        node = self.closest_next_sibling()

        if node:
            return node

        return None


class StepResult(models.Model):
    """
    Record of a student's score status on a given step.
    """
    step = models.ForeignKey(Step, on_delete=models.CASCADE)

    # For now, score is either correct or incorrect. This may change
    # in the future.
    result = models.BooleanField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ScorePath(models.Model):
    """
    ScorePath represents a student's linear path through an assignment.
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Array of StepResult id's
    steps = ArrayField(
        models.PositiveBigIntegerField(),
        # Default to the empty list
        default=list,
        blank=True
    )

    @property
    def score(self) -> float:
        """
        Returns the percentage of correct results in this ScorePath as
        a float between 0 and 1.
        """
        if len(self.steps) == 0:
            return 0.0

        # Populate list with saved results
        steps = list(map(
            lambda x: StepResult.objects.get(pk=x).result,
            self.steps))

        return len([x for x in steps if x is True]) / len(steps)
