# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import copy
from decimal import Decimal
from django.contrib.auth.models import User
from django.db import models
from ordered_model.models import OrderedModel
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_delete
import importlib

from econplayground.main.graphs import GRAPH_TYPES, BaseGraph


ASSIGNMENT_TYPES = (
    (0, 'Template'),
    (1, 'Labeling'),
    (2, 'Modification'),
)


class Cohort(models.Model):
    """A Cohort is a grouping of instructors and students.

    A cohort is another word for course. EconPractice is not currently
    using django_courseaffils.

    Note that LTI uses the term "Context" for a course.
    https://www.imsglobal.org/spec/lti/v1p3#contexts-and-resources
    """
    title = models.CharField(max_length=256, verbose_name='Course Title')
    description = models.TextField(null=True, blank=True)
    password = models.CharField(max_length=256, null=True, blank=True)

    # Optional LTI course ID, if this course is associated with an LTI
    # course in e.g. Canvas.
    context_id = models.CharField(max_length=1024, blank=True, default='')
    # LTI deployment instance ID, used with context_id
    deployment_id = models.CharField(max_length=256, blank=True, default='')

    instructors = models.ManyToManyField(User, related_name='courses_taught')
    students = models.ManyToManyField(User, related_name='courses_enrolled',
                                      blank=True)

    is_sample = models.BooleanField(null=True, blank=True, unique=True)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_graphs(self):
        return Graph.objects.filter(
            topic__in=Topic.objects.filter(cohort=self))

    def graph_count(self):
        return self.get_graphs().count()

    def get_general_topic(self):
        return Topic.objects.get(cohort=self, name='General')

    def __str__(self):
        return '{} (id:{})'.format(self.title, self.pk)

    def clone(self):
        c = copy.copy(self)
        c.pk = None
        c.is_sample = None
        c.save()

        # Clone the topics.
        for topic in self.topic_set.all():
            if topic.name == 'General':
                # The General topic is created automatically in the
                # post_save hook.
                cloned_topic = c.get_general_topic()
            else:
                cloned_topic = Topic.objects.create(cohort=c, name=topic.name)

            for graph in topic.graph_set.all():
                cloned_graph = graph.clone()
                cloned_graph.topic = cloned_topic
                cloned_graph.save()

        return c


class Topic(OrderedModel):
    class Meta(OrderedModel.Meta):
        ordering = ('cohort', 'order')
        unique_together = ('name', 'cohort')

    name = models.CharField(max_length=256)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order_with_respect_to = 'cohort'

    def get_graphs(self):
        return Graph.objects.filter(topic=self)

    def graph_count(self):
        return self.get_graphs().count()

    def published_graph_count(self):
        return Graph.objects.filter(topic=self,
                                    needs_submit=False,
                                    is_published=True).count()

    def __str__(self):
        return self.name


@receiver(post_save, sender=Cohort)
def create_general_topic(sender, instance, created, **kwargs):
    if created:
        Topic.objects.create(name='General', cohort=instance)


@receiver(pre_delete, sender=Topic)
def move_graphs_to_general_topic(sender, instance, **kwargs):
    cohort = instance.cohort
    g_topic = cohort.get_general_topic()
    for graph in Graph.objects.filter(topic=instance):
        graph.topic = g_topic
        graph.save()


@receiver(pre_delete, sender=Cohort)
def orphan_remaining_graphs(sender, instance, **kwargs):
    """If the Cohort is deleted, just leave the graphs hidden in the system."""
    for graph in instance.get_graphs():
        graph.topic = None
        graph.save()


class Graph(OrderedModel):
    class Meta(OrderedModel.Meta):
        ordering = ('topic__cohort', 'order')

    title = models.TextField()
    instructions = models.TextField(blank=True, null=True, default='')
    summary = models.TextField(
        blank=True, null=True, default='', max_length=250)
    instructor_notes = models.TextField(blank=True, null=True, default='')
    topic = models.ForeignKey(
        Topic,
        # Handle this in the Topic pre_delete signal.
        on_delete=models.DO_NOTHING,
        null=True, blank=True)
    featured = models.BooleanField(default=False)
    order_with_respect_to = ('topic__cohort', 'featured')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False)
    needs_submit = models.BooleanField(default=False)
    display_feedback = models.BooleanField(default=True)
    display_shadow = models.BooleanField(default=True)

    graph_type = models.PositiveSmallIntegerField(
        choices=GRAPH_TYPES,
        default=0)
    assignment_type = models.PositiveSmallIntegerField(
        choices=ASSIGNMENT_TYPES,
        default=0)

    show_intersection = models.BooleanField(default=True)
    display_intersection_1 = models.BooleanField(default=False)
    display_intersection_2 = models.BooleanField(default=False)
    display_intersection_3 = models.BooleanField(default=False)

    intersection_label = models.TextField(blank=True, null=True, default='')
    intersection_2_label = models.TextField(blank=True, null=True, default='')
    intersection_3_label = models.TextField(blank=True, null=True, default='')

    intersection_horiz_line_label = models.TextField(blank=True, null=True,
                                                     default='')
    intersection_vert_line_label = models.TextField(blank=True, null=True,
                                                    default='')

    intersection_2_horiz_line_label = models.TextField(blank=True, null=True,
                                                       default='')
    intersection_2_vert_line_label = models.TextField(blank=True, null=True,
                                                      default='')

    intersection_3_horiz_line_label = models.TextField(blank=True, null=True,
                                                       default='')
    intersection_3_vert_line_label = models.TextField(blank=True, null=True,
                                                      default='')

    x_axis_label = models.TextField(blank=True, null=True, default='')
    x_axis_max = models.PositiveIntegerField(default=5)
    x_axis_min = models.PositiveIntegerField(default=0)
    y_axis_label = models.TextField(blank=True, null=True, default='')
    y_axis_max = models.PositiveIntegerField(default=5)
    y_axis_min = models.PositiveIntegerField(default=0)

    x_axis_2_label = models.TextField(blank=True, null=True, default='')
    y_axis_2_label = models.TextField(blank=True, null=True, default='')

    line_1_slope = models.DecimalField(max_digits=12, decimal_places=4)
    line_1_offset_x = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_1_offset_y = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_1_label = models.TextField(blank=True, null=True, default='')
    line_1_dashed = models.BooleanField(default=False)

    line_2_slope = models.DecimalField(max_digits=12, decimal_places=4)
    line_2_offset_x = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_2_offset_y = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_2_label = models.TextField(blank=True, null=True, default='')
    line_2_dashed = models.BooleanField(default=False)

    line_3_slope = models.DecimalField(max_digits=12, decimal_places=4,
                                       default=Decimal('999'))
    line_3_offset_x = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_3_offset_y = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_3_label = models.TextField(blank=True, null=True, default='')
    line_3_dashed = models.BooleanField(default=False)

    line_4_slope = models.DecimalField(max_digits=12, decimal_places=4,
                                       default=Decimal('-1'))
    line_4_offset_x = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_4_offset_y = models.DecimalField(
        max_digits=12, decimal_places=4, default=0)
    line_4_label = models.TextField(blank=True, null=True, default='')
    line_4_dashed = models.BooleanField(default=False)

    # Arbitrary number storage to be used as needed for the altering
    # functions of the various graph types.
    #
    # These intentionally use Python's decimal type instead of the
    # more typical float type, for fixed precision:
    # https://docs.python.org/3/library/decimal.html#module-decimal
    #
    # A1
    a1 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a1_max = models.IntegerField(default=10)
    a1_min = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a1_name = models.TextField(default='', blank=True,)

    # A2
    a2 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a2_max = models.IntegerField(default=10)
    a2_min = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a2_name = models.TextField(default='', blank=True)

    # A3
    a3 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a3_max = models.IntegerField(default=10)
    a3_min = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a3_name = models.TextField(default='', blank=True)

    # A4
    a4 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a4_max = models.IntegerField(default=10)
    a4_min = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a4_name = models.TextField(default='', blank=True)

    # A5
    a5 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a5_max = models.IntegerField(default=10)
    a5_min = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a5_name = models.TextField(default='', blank=True)

    a6 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a7 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a8 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))

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
    cobb_douglas_l = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'),
        null=True, help_text='L = Labor input')
    cobb_douglas_l_name = models.TextField(default='L')
    cobb_douglas_k = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('1'),
        null=True, help_text='K = Capital input')
    cobb_douglas_k_name = models.TextField(default='K')
    cobb_douglas_alpha = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0.65'),
        null=True, help_text='α = output elasticity of capital')
    cobb_douglas_alpha_name = models.TextField(default='α')

    cobb_douglas_y_name = models.TextField(default='Y')

    # Text field for an arbitrary N value used in NLDS.
    n_name = models.TextField(default='N')

    # A graph may contain a few different functions that
    # can be toggled.
    function_choice = models.PositiveSmallIntegerField(default=0)

    # Generic boolean field for use in some graph types
    toggle = models.BooleanField(default=False)

    # An Area under Curve (AUC) graph has different cases handling
    # which areas are displayed.
    area_configuration = models.PositiveSmallIntegerField(default=0)
    is_area_displayed = models.BooleanField(default=True)
    area_a_name = models.TextField(default='A', blank=True,)
    area_b_name = models.TextField(default='B', blank=True,)
    area_c_name = models.TextField(default='C', blank=True,)

    # A graph may use a custon formula to define the x-function
    expression = models.TextField(default='x', blank=True)
    expression_2 = models.TextField(default='', blank=True)
    expression_3 = models.TextField(default='', blank=True)

    # A graph may display different grid types.
    # Grid types:
    #   0: none
    #   1: point
    #   2: line
    major_grid_type = models.PositiveIntegerField(default=0)
    minor_grid_type = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        if not self.topic:
            return '/graph/{}/'.format(self.pk)

        return '/course/{}/graph/{}/'.format(self.topic.cohort.pk, self.pk)

    def is_visible_to_students(self):
        return self.is_published and not self.needs_submit

    def clone(self):
        g = copy.copy(self)
        g.pk = None
        g.save()
        return g

    @staticmethod
    def get_rule_options(graph_type: int = 0) -> dict:
        """
        This is a back-end version of Graph.getRuleOptions() on the
        front-end. Most of the logic is built out there at the moment,
        but I expect to consolidate these two pieces of logic.
        """
        module = importlib.import_module('econplayground.main.graphs')

        # Find dynamic graph class name using its graph type. Fall
        # back to the generic BaseGraph's implementation.
        graph_class = getattr(module, 'Graph{}'.format(graph_type), BaseGraph)
        return graph_class.get_rule_options()


class Assessment(models.Model):
    graph = models.OneToOneField(Graph, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'Assessment for: {}'.format(self.graph.title)

    def evaluate_action(
            self, name: str, value: str | list[str]) -> tuple[bool, str]:
        for rule in self.assessmentrule_set.all():
            if name == rule.name:
                result = None, None
                if value == rule.value:
                    result = True, rule.feedback_fulfilled
                elif (
                        isinstance(value, list) and
                        rule.value is not None and
                        rule.value in value
                ):
                    result = True, rule.feedback_fulfilled
                else:
                    result = False, rule.feedback_unfulfilled

                return result

        # No matching rules found.
        return None, None


@receiver(post_save, sender=Graph)
def create_assessment(sender, instance, created, **kwargs):
    if created:
        Assessment.objects.create(graph=instance)


class AssessmentRule(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    name = models.TextField()
    value = models.TextField()
    feedback_fulfilled = models.TextField(blank=True, default='')
    feedback_unfulfilled = models.TextField(blank=True, default='')
    score = models.DecimalField(
        max_digits=6, decimal_places=2, default=Decimal('0'))

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)
        unique_together = ('assessment', 'name', 'value',)


class Submission(models.Model):
    class Meta:
        # A user can only have one submission per graph.
        unique_together = ('user', 'graph')

    graph = models.ForeignKey(Graph, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Corresponds to the line_x_x_score
    score = models.DecimalField(max_digits=8, decimal_places=4, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
