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
            return Step.objects.get(tree=self, is_root=True).get_root()
        except Step.DoesNotExist:
            return Step.add_root(tree=self, is_root=True)


class Step(MP_Node):
    is_root = models.BooleanField(default=False)
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
        """Return the next child, or the next sibling, or None."""

        child = self.get_first_child()
        if child:
            return child

        node = self.get_next_sibling()
        if node:
            return node

        node = self.get_parent()
        if node:
            return node.get_next_sibling()

        return None
