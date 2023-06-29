try:
    from typing import Self
except ImportError:
    from typing_extensions import Self

from django.contrib.auth.models import User
from django.db import models
from treebeard.mp_tree import MP_Node

from econplayground.main.models import Cohort, Graph
from .custom_storage import MediaStorage


class Question(models.Model):
    title = models.TextField(blank=True, default='')
    prompt = models.TextField(blank=True, default='')

    graph = models.ForeignKey(
        Graph, on_delete=models.CASCADE,
        blank=True, null=True)
    media_upload = models.FileField(
        storage=MediaStorage, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #
    # Question evaluation data. The following fields are based on the
    # main.AssessmentRule structure.
    #
    # The default empty value for these fields will allow any user
    # action to succeed.
    #
    # You can constrain this by setting a value for assessment_name,
    # allowing any action on, e.g. line1_slope to succeed. And then
    # you can further constrain this action on line1_slope by setting
    # the assessment_value to something like 'increase' or 'decrease'.
    #

    # The graph characteristic to assess, i.e. slope, position, label
    assessment_name = models.CharField(
        blank=True, default='', max_length=1024)

    # The value we are looking for (i.e. user action), increase,
    # decrease, or label match
    assessment_value = models.CharField(
        blank=True, default='', max_length=1024)

    # Optional custom feedback for this assessment rule
    feedback_fulfilled = models.TextField(blank=True, default='')
    feedback_unfulfilled = models.TextField(blank=True, default='')

    def evaluate_action(self, action_name: str, action_value: str) -> bool:
        """
        Evaluate a user action, based on action type and value.


        Returns a boolean: True for success, False for failure.
        """
        if self.assessment_name and self.assessment_value:
            return action_name == self.assessment_name and \
                action_value.lower() == self.assessment_value.lower()

        if self.assessment_name:
            return action_name == self.assessment_name

        if not self.assessment_name and not self.assessment_value:
            return True

        return False


class Tree(models.Model):
    title = models.TextField(max_length=1024, default='Untitled')
    published = models.BooleanField(default=False)
    prompt = models.TextField(blank=True, default='')
    cohorts = models.ManyToManyField(Cohort, blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_root(self) -> 'Step':
        try:
            root = Step.objects.get(tree=self, is_root_node=True).get_root()
        except Step.DoesNotExist:
            root = Step.add_root(tree=self, is_root_node=True)

        return root

    def add_step(self) -> 'Step':
        """Add a node on the main path.

        Returns the new Step.
        """
        root = self.get_root()
        new_step = Step(tree=self)
        first_child = root.get_first_child()

        if first_child:
            first_child.add_sibling(instance=new_step, pos='last-sibling')
        else:
            root.add_child(instance=new_step)

        return new_step

    def add_substep(self, step_id: int) -> 'Step':
        """Add a node on a sub path.

        Returns the new Step.
        """
        step = Step.objects.get(tree=self, pk=step_id)
        new_step = Step(tree=self)
        step.add_child(instance=new_step)
        return new_step

    def remove_step(self, step_id: int) -> None:
        step = Step.objects.get(tree=self, pk=step_id)
        step.delete()


class Step(MP_Node):
    is_root_node = models.BooleanField(default=False)
    tree = models.ForeignKey(Tree, on_delete=models.CASCADE)

    question = models.ForeignKey(
        Question, on_delete=models.CASCADE,
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

        node = self.get_parent().get_next_sibling()
        if node:
            return node

        child = self.get_first_child()
        if child:
            return child

        return None

    def get_next_intervention(self) -> Self:
        """The student answered incorrectly, so find the intervention path."""
        node = self.get_first_child()
        if node:
            return node

        node = self.get_next_sibling()
        if node:
            return node

        node = self.get_parent().get_next_sibling()
        if node:
            return node

        return None
