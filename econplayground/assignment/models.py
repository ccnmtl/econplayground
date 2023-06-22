from django.contrib.auth.models import User
from django.db import models
from treebeard.mp_tree import MP_Node

from econplayground.main.models import Cohort


class Tree(models.Model):
    title = models.TextField(max_length=1024, default='Untitled')
    published = models.BooleanField(default=False)
    prompt = models.TextField(blank=True, default='')
    cohorts = models.ManyToManyField(Cohort, blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_root(self):
        try:
            root = Step.objects.get(tree=self, is_root_node=True).get_root()
        except Step.DoesNotExist:
            root = Step.add_root(tree=self, is_root_node=True)

        return root

    def add_step(self):
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

    def add_substep(self, step_id):
        """Add a node on a sub path.

        Returns the new Step.
        """
        step = Step.objects.get(tree=self, pk=step_id)
        new_step = Step(tree=self)
        step.add_child(instance=new_step)
        return new_step

    def remove_step(self, step_id):
        step = Step.objects.get(tree=self, pk=step_id)
        step.delete()


class Step(MP_Node):
    is_root_node = models.BooleanField(default=False)
    tree = models.ForeignKey(Tree, on_delete=models.CASCADE)

    def get_prev(self):
        """Return the previous child, or the prev sibling, or None."""

        node = self.get_prev_sibling()
        if node:
            child = node.get_last_child()
            if child:
                return child

        if not node:
            return self.get_parent()

        return node

    def get_next(self):
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

    def get_next_intervention(self):
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
