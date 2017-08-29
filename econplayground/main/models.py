# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


GRAPH_CHOICES = (
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
    title = models.TextField()
    description = models.TextField()
    graph_type = models.PositiveSmallIntegerField(
        choices=GRAPH_CHOICES, default=0)


class Curve(models.Model):
    # A graph has any number of curves. Most have 2.
    graph = models.ForeignKey(Graph)

    # Each Curve has a default position on its Graph. These x and
    # y values are the offset.
    x = models.DecimalField(max_digits=12, decimal_places=5, default=0)
    y = models.DecimalField(max_digits=12, decimal_places=5, default=0)

    label = models.TextField()
    is_draggable = models.BooleanField(
        default=False, help_text='Can a user drag this?')


class Point(models.Model):
    # Each point is connected to a Curve.
    curve = models.ForeignKey(Curve)

    # pos is the offset of this point along the single dimension of
    # its Curve.
    pos = models.DecimalField(max_digits=12, decimal_places=5, default=0)

    label = models.TextField()
    is_draggable = models.BooleanField(
        default=False, help_text='Can a user drag this?')
