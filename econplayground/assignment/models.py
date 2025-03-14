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


def compare_names(name1: str, name2: str) -> bool:
    """
    Remove underscores and lower-case both names for more lax comparison.

    Returns a boolean, True if the strings match.
    """
    return name1.lower().replace('_', '') == name2.lower().replace('_', '')


def convert_action_name(s: str) -> str:
    """
    Convert a string from the form: gLine1Label

    To: line_1_label
    """
    if s and len(s) > 1 and s.startswith('g') and s[1].isupper():
        s = s[1:]
        return re.sub(r'(?<!^)(?=[A-Z]|\d)', '_', s).lower()
    return s or ''


class Question(models.Model):
    title = models.CharField(max_length=1024)
    prompt = models.TextField(blank=True, default='')
    assessment_type = models.PositiveSmallIntegerField(default=0)

    graph = models.ForeignKey(
        Graph, on_delete=models.SET_NULL,
        blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title or '(Untitled) {}'.format(self.pk)

    def evaluate_action(self, action_name: str, action_value: str) -> bool:
        """
        Evaluate the given action.

        This method evaluates the given action with this question's
        AssessmentRules.

        Returns True or False.
        """
        rules = self.assessmentrule_set.filter(~models.Q(assessment_name=''))

        if rules.count() == 0:
            # This question has no rules, so return success.
            return True

        action_name = convert_action_name(action_name)
        for rule in rules:
            if compare_names(rule.assessment_name, action_name):
                return rule.evaluate_action(
                    action_name, action_value, self.assessment_type)

        # No rules matched, so return failure.
        return False

    def evaluate_multiple_choice(
            self, action_name: str, action_value: str
    ) -> bool:
        """
        Evaluate the given multiple choice.

        Determine whether the given choice is correct or not.

        Returns True or False.
        """
        if not action_name or not action_value:
            return False

        rule_pk = int(action_value)
        rule = None
        try:
            rule = AssessmentRule.objects.get(pk=rule_pk)
        except AssessmentRule.DoesNotExist:
            return False

        if rule.assessment_value == 'true':
            return True

        return False

    def first_rule(self) -> 'AssessmentRule':
        return self.assessmentrule_set.first()

    @property
    def rules(self) -> list:
        return self.assessmentrule_set.order_by('pk')

    @property
    def has_assessment(self) -> bool:
        return self.multiplechoice_set.count() > 0 or \
            self.assessmentrule_set.filter(
                ~models.Q(assessment_name='')
            ).count() > 0


class QuestionAnalysis(models.Model):
    class Meta:
        unique_together = ('question', 'student')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)

    attempts = models.IntegerField(default=0)
    appearances = models.IntegerField(default=1)
    avg_sec = models.IntegerField(blank=True, null=True)

    def get_avg_diff(self) -> float:
        """
        Return the average time difference between the student's time
        taken on Steps related to this Question.

        Returns the number of seconds, as a float.
        """
        avg = 0
        steplist = StepResult.objects.filter(
            student=self.student,
            step__in=Step.objects.filter(question=self.question)).all()
        for step in steplist:
            avg += step.updated_at.total_seconds() \
                    - step.created_at.total_seconds()

        if len(steplist) > 0:
            avg = avg / len(steplist)
        else:
            avg = 0.0

        return avg


class MultipleChoice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.TextField(max_length=1024, default='Untitled')
    choices = ArrayField(
        models.TextField(max_length=1024, blank=True, default=''),
    )
    correct = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '{} (id:{})'.format(self.text, self.pk)


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

    def evaluate_action(
            self, action_name: str, action_value: str, assessment_type: int = 0
    ) -> bool:
        """
        Evaluate a user action, based on action type and value.

        Returns a boolean: True for success, False for failure.
        """
        action_name = convert_action_name(action_name)
        self.assessment_name = convert_action_name(self.assessment_name)

        if self.assessment_name and self.assessment_value:
            return compare_names(action_name, self.assessment_name) and \
                action_value.lower() == self.assessment_value.lower()

        if self.assessment_name:
            return compare_names(action_name, self.assessment_name)

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

    name = models.TextField(max_length=1024, blank=True, null=True)

    question = models.ForeignKey(
        Question, on_delete=models.SET_NULL,
        blank=True, null=True)

    def get_name(self) -> str:
        return self.name or ''

    def __str__(self) -> str:
        return self.get_name()

    @property
    def is_last_step(self) -> bool:
        return self.get_next_sibling() is None and \
            self.get_next() is None

    def get_prev(self) -> Self:
        """Return the previous child, or the prev sibling, or None."""
        if self.is_root_node:
            return None

        node = self.get_prev_sibling()
        if node:
            child = node.get_last_child()
            if child:
                return child

        if not node:
            parent = self.get_parent()
            if parent and not parent.is_root_node:
                return parent
            else:
                return None

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
        if parent and not parent.is_root_node:
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
    class Meta:
        unique_together = ('step', 'student')

    step = models.ForeignKey(Step, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)

    # For now, score is either correct or incorrect. This may change
    # in the future.
    result = models.BooleanField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return '{}, {}: {}'.format(
            self.step.pk, self.student.username, self.result)


class ScorePath(models.Model):
    """
    ScorePath represents a student's linear path through an assignment.
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Array of StepResult id's
    step_results = ArrayField(
        models.PositiveBigIntegerField(),
        # Default to the empty list
        default=list,
        blank=True
    )

    def __str__(self) -> str:
        return 'ScorePath: {} - {}'.format(
            self.assignment.title, self.student.username)

    @property
    def step_ids(self) -> list:
        """
        Get the list of Step ID's associated with the ScorePath's StepResults.
        """
        step_ids = []

        for step_result_pk in self.step_results:
            step_result = None
            try:
                step_result = StepResult.objects.get(pk=step_result_pk)
            except StepResult.DoesNotExist:
                pass

            if step_result and step_result.step:
                step_ids.append(step_result.step.pk)
            else:
                step_ids.append(None)

        return step_ids

    def get_step_results(self) -> list:
        """
        Get the step results based on this ScorePath.

        Returns a list of StepResult objects.
        """
        results = []
        for step_result_pk in self.step_results:
            step_result = None
            try:
                step_result = StepResult.objects.get(pk=step_result_pk)
            except StepResult.DoesNotExist:
                pass

            if step_result:
                results.append(step_result)

        return results

    def get_avg_diff(self, step) -> float:
        """
        Return the average time difference between the student's time taken
        on Steps related to a given Question
        """
        avg = 0
        steplist = StepResult.objects.filter(
            step__in=Step.objects.filter(question=step.question)).all()
        for step in steplist:
            avg += step.updated_at.total_seconds() \
                    - step.created_at.total_seconds()
        avg = avg / len(steplist)

        return avg

    @property
    def score(self) -> float:
        """
        Returns the percentage of correct results in this ScorePath as
        a float between 0 and 1.
        """
        valid_steps = []
        for step_result_pk in self.step_results:
            step = None
            try:
                step = StepResult.objects.get(pk=step_result_pk)
            except StepResult.DoesNotExist:
                # Ignore steps that can't be found
                pass

            if step:
                valid_steps.append(step.result)

        if len(valid_steps) == 0:
            return 0

        correct_results = [x for x in valid_steps if x is True]
        return len(correct_results) / len(valid_steps)
