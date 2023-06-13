from django.contrib.auth.models import User
from django.db import models
from treebeard.mp_tree import MP_Node

from econplayground.main.models import Cohort, Graph
from .custom_storage import MediaStorage


class Question(models.Model):
    title = models.TextField(max_length=1024, default='Untitled')
    embedded_media = models.TextField(blank=True, default='')
    media_upload = models.FileField(
        storage=MediaStorage, blank=True, null=True)
    graph = models.ForeignKey(
        Graph, on_delete=models.CASCADE, blank=True, null=True,
        related_name='assignment_question'
    )
    keywords = models.TextField(blank=True, default='')

    prompt = models.TextField(blank=True, default='')
    value = models.PositiveSmallIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


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
            return Step.objects.get(tree=self).get_root()
        except Step.DoesNotExist:
            return Step.add_root(tree=self)


class Step(MP_Node):
    tree = models.ForeignKey(Tree, on_delete=models.CASCADE)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, blank=True, null=True)
