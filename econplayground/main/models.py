# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from decimal import Decimal
from django.contrib.auth.models import User
from django.db import models


GRAPH_TYPES = (
    (0, 'Linear Demand and Supply'),
    (1, 'Non-Linear Demand and Supply'),
    (2, 'Labor Market (perfectly inelastic)'),
    (3, 'Cobb-Douglas'),
    (4, 'Labor Supply'),
    (5, 'Consumption - Leisure'),
    (6, 'Saving - Investment'),
    (7, 'Consumption - Saving'),
    (8, 'Aggregate Demand - Aggregate Supply'),
)

INTERACTION_TYPES = (
    (0, 'Draggable lines'),
    (1, 'Area selection'),
)

COBB_DOUGLAS_SCENARIOS = (
    (0, 'Param 1 (A) increased'),
    (1, 'Param 1 (A) decreased'),
    (2, 'Param 2 (K) increased'),
    (3, 'Param 2 (K) decreased'),
    (4, 'Param 3 (α) increased'),
    (5, 'Param 3 (α) decreased'),
    (6, 'Param 4 (L) increased'),
    (7, 'Param 4 (L) decreased'),
)


class Graph(models.Model):
    class Meta:
        ordering = ('-created_at',)

    title = models.TextField()
    description = models.TextField(blank=True, null=True, default='')
    instructor_notes = models.TextField(blank=True, null=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False)
    needs_submit = models.BooleanField(default=False)
    display_feedback = models.BooleanField(default=True)
    display_shadow = models.BooleanField(default=True)
    correct_feedback = models.TextField(blank=True, null=True, default='')
    incorrect_feedback = models.TextField(blank=True, null=True, default='')

    graph_type = models.PositiveSmallIntegerField(
        choices=GRAPH_TYPES,
        default=0)
    interaction_type = models.PositiveSmallIntegerField(
        choices=INTERACTION_TYPES,
        default=0)

    show_intersection = models.BooleanField(default=True)
    display_intersection_1 = models.BooleanField(default=False)
    display_intersection_2 = models.BooleanField(default=False)
    display_intersection_3 = models.BooleanField(default=False)

    intersection_label = models.TextField(blank=True, null=True, default='')
    intersection_label_editable = models.BooleanField(default=False)
    intersection_2_label = models.TextField(blank=True, null=True, default='')
    intersection_2_label_editable = models.BooleanField(default=False)
    intersection_3_label = models.TextField(blank=True, null=True, default='')
    intersection_3_label_editable = models.BooleanField(default=False)

    intersection_horiz_line_label = models.TextField(blank=True, null=True,
                                                     default='')
    intersection_horiz_line_label_editable = models.BooleanField(default=False)
    intersection_vert_line_label = models.TextField(blank=True, null=True,
                                                    default='')
    intersection_vert_line_label_editable = models.BooleanField(default=False)

    intersection_2_horiz_line_label = models.TextField(blank=True, null=True,
                                                       default='')
    intersection_2_horiz_line_label_editable = models.BooleanField(
        default=False)
    intersection_2_vert_line_label = models.TextField(blank=True, null=True,
                                                      default='')
    intersection_2_vert_line_label_editable = models.BooleanField(
        default=False)

    intersection_3_horiz_line_label = models.TextField(blank=True, null=True,
                                                       default='')
    intersection_3_horiz_line_label_editable = models.BooleanField(
        default=False)
    intersection_3_vert_line_label = models.TextField(blank=True, null=True,
                                                      default='')
    intersection_3_vert_line_label_editable = models.BooleanField(
        default=False)

    x_axis_label = models.TextField(blank=True, null=True, default='')
    x_axis_label_editable = models.BooleanField(default=False)
    y_axis_label = models.TextField(blank=True, null=True, default='')
    y_axis_label_editable = models.BooleanField(default=False)

    line_1_slope = models.DecimalField(max_digits=12, decimal_places=4)
    line_1_slope_editable = models.BooleanField(default=False)
    line_1_offset_x = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_1_offset_y = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_1_label = models.TextField(blank=True, null=True, default='')
    line_1_label_editable = models.BooleanField(default=False)
    line_1_dashed = models.BooleanField(default=False)
    line_1_dashed_editable = models.BooleanField(default=False)

    # The following are what the user is shown when line 1 is moved up
    # and down.
    line_1_feedback_increase = models.TextField(blank=True, null=True,
                                                default='')
    line_1_increase_score = models.DecimalField(
        max_digits=8, decimal_places=4, default=0)
    line_1_feedback_decrease = models.TextField(blank=True, null=True,
                                                default='')
    line_1_decrease_score = models.DecimalField(
        max_digits=8, decimal_places=4, default=0)

    line_2_slope = models.DecimalField(max_digits=12, decimal_places=4)
    line_2_slope_editable = models.BooleanField(default=False)
    line_2_offset_x = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_2_offset_y = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_2_label = models.TextField(blank=True, null=True, default='')
    line_2_label_editable = models.BooleanField(default=False)
    line_2_dashed = models.BooleanField(default=False)
    line_2_dashed_editable = models.BooleanField(default=False)

    # The following are what the user is shown when line 2 is moved up
    # and down.
    line_2_feedback_increase = models.TextField(blank=True, null=True,
                                                default='')
    line_2_increase_score = models.DecimalField(
        max_digits=8, decimal_places=4, default=0)
    line_2_feedback_decrease = models.TextField(blank=True, null=True,
                                                default='')
    line_2_decrease_score = models.DecimalField(
        max_digits=8, decimal_places=4, default=0)

    line_3_slope = models.DecimalField(max_digits=12, decimal_places=4,
                                       default=Decimal('999'))
    line_3_slope_editable = models.BooleanField(default=False)
    line_3_offset_x = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_3_offset_y = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_3_label = models.TextField(blank=True, null=True, default='')
    line_3_label_editable = models.BooleanField(default=False)
    line_3_dashed = models.BooleanField(default=False)
    line_3_dashed_editable = models.BooleanField(default=False)

    # TODO: migrate these to a1, a2, etc.
    alpha = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0.3'))
    omega = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))

    # Arbitrary float storage to be used as needed for the altering
    # functions of the various graph types.
    a1 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a1_editable = models.BooleanField(default=True)
    a1_name = models.TextField(default='', blank=True,)
    a2 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a2_editable = models.BooleanField(default=True)
    a2_name = models.TextField(default='', blank=True)
    a3 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a3_editable = models.BooleanField(default=True)
    a3_name = models.TextField(default='', blank=True)
    a4 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a4_editable = models.BooleanField(default=True)
    a4_name = models.TextField(default='', blank=True)
    a5 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a5_editable = models.BooleanField(default=True)

    # TODO: migrate these to a1, a2, etc.
    a = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('3'))
    k = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('2'))
    r = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    y1 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    y2 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))

    # The following are input values for the Cobb-Douglas function,
    # only used if this is a Cobb-Douglas graph.
    # TODO: migrate these to a1, a2, etc.
    cobb_douglas_a = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('2'),
        null=True, help_text='A = Total factor productivity')
    cobb_douglas_a_name = models.TextField(default='A')
    cobb_douglas_a_editable = models.BooleanField(default=False)
    cobb_douglas_l = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'),
        null=True, help_text='L = Labor input')
    cobb_douglas_l_name = models.TextField(default='L')
    cobb_douglas_l_editable = models.BooleanField(default=False)
    cobb_douglas_k = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('1'),
        null=True, help_text='K = Capital input')
    cobb_douglas_k_name = models.TextField(default='K')
    cobb_douglas_k_editable = models.BooleanField(default=False)
    cobb_douglas_alpha = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0.65'),
        null=True, help_text='α = output elasticity of capital')
    cobb_douglas_alpha_name = models.TextField(default='α')
    cobb_douglas_alpha_editable = models.BooleanField(default=False)

    cobb_douglas_y_name = models.TextField(default='Y')

    cobb_douglas_correct_scenario = models.PositiveSmallIntegerField(
        choices=COBB_DOUGLAS_SCENARIOS,
        default=0,
        help_text='Define the correct scenario for this submittable graph.')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return '/graph/{}/'.format(self.pk)


class JXGLine(models.Model):
    class Meta:
        unique_together = ('graph', 'number')
    graph = models.ForeignKey(Graph, on_delete=models.CASCADE,
                              related_name='lines')
    number = models.PositiveSmallIntegerField(
        default=1,
        help_text='Is this line one or two on the graph?')


class JXGLineTransformation(models.Model):
    """
    This model stores a JSXGraph transformation.

    https://jsxgraph.org/docs/symbols/JXG.Transformation.html

    A transformation can be applied to any geometry object in
    JSXGraph. Here, I'm using it on lines. This is a more robust way
    of saving position in JSXGraph than my cobbled together method of
    offsets and slopes. This allows the rotation transformation to
    work correctly, which is needed for some things in EconPractice.
    """
    line = models.ForeignKey(JXGLine, on_delete=models.CASCADE,
                             related_name='transformations')
    z1 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    x1 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    y1 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    z2 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    x2 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    y2 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    z3 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    x3 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))
    y3 = models.DecimalField(max_digits=12, decimal_places=6,
                             default=Decimal('0'))


class Submission(models.Model):
    class Meta:
        # A user can only have one submission per graph.
        unique_together = ('user', 'graph')

    graph = models.ForeignKey(Graph, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # The selection that the user made, encoded as a number.
    choice = models.PositiveSmallIntegerField(default=0)

    # Corresponds to the line_x_x_score
    score = models.DecimalField(max_digits=8, decimal_places=4, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
