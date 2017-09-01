# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.postgres.fields import JSONField
from django.db import models


# GRAPH_CHOICES = (
#     (0, 'Demand-Supply Graph'),
#     (1, 'Labor Market'),
#     (2, 'Labor Market (perfectly inelastic)'),
#     (3, 'Cobb-Douglas'),
#     (4, 'Labor Supply'),
#     (5, 'Consumption - Saving'),
#     (6, 'Saving - Investment'),
#     (7, 'Money Market'),
# )


class PlaygroundGraph(models.Model):
    title = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    data = JSONField(default={})

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return '/playgroundgraph/{}/'.format(self.pk)


class ProblemGraph(models.Model):
    title = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    data = JSONField(default={})

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return '/problemgraph/{}/'.format(self.pk)
