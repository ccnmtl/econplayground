# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import models


GRAPH_TYPES = (
    (0, 'Demand-Supply Graph'),
    (1, 'Labor Market'),
    (2, 'Labor Market (perfectly inelastic)'),
    (3, 'Cobb-Douglas'),
    (4, 'Labor Supply'),
    (5, 'Consumption - Saving'),
    (6, 'Saving - Investment'),
    (7, 'Money Market'),
)


class Graph(models.Model):
    class Meta:
        ordering = ('created_at',)

    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    instructor_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User)

    graph_type = models.PositiveSmallIntegerField(
        choices=GRAPH_TYPES,
        default=0)
    show_intersection = models.BooleanField(default=True)

    x_axis_label = models.TextField(blank=True, null=True)
    y_axis_label = models.TextField(blank=True, null=True)

    line_1_slope = models.DecimalField(max_digits=12, decimal_places=2)
    line_1_label = models.TextField(blank=True, null=True)

    # The following are what the user is shown when line 1 is moved up
    # and down.
    line_1_feedback_increase = models.TextField(blank=True, null=True)
    line_1_feedback_decrease = models.TextField(blank=True, null=True)

    line_2_slope = models.DecimalField(max_digits=12, decimal_places=2)
    line_2_label = models.TextField(blank=True, null=True)

    # The following are what the user is shown when line 2 is moved up
    # and down.
    line_2_feedback_increase = models.TextField(blank=True, null=True)
    line_2_feedback_decrease = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return '/graph/{}/'.format(self.pk)
