# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import copy
from decimal import Decimal
from django.contrib.auth.models import User
from django.db import models
from ordered_model.models import OrderedModel
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_delete
from .custom_storage import MediaStorage
import random


GRAPH_TYPES = (
    (0, 'Linear Demand and Supply'),
    (1, 'Non-Linear Demand and Supply'),
    (2, 'Labor Market (perfectly inelastic)'),  # Unused
    (3, 'Cobb-Douglas Production Function'),
    (4, 'Labor Supply'),  # Unused
    (5, 'Consumption-Leisure: Constraint'),
    (6, 'Saving - Investment'),  # Unused
    (7, 'Consumption-Saving: Constraint'),
    (8, 'Linear Demand and Supply: 3 Functions'),

    # Area Under Curve graphs
    (9, 'Linear Demand and Supply: AUC'),
    (10, 'Non-Linear Demand and Supply: AUC'),

    (11, 'Consumption-Saving: Optimal Choice'),
    (15, 'Consumption-Leisure: Optimal Choice'),

    # Joint Graphs
    (12, 'Cobb-Douglas NLDS'),
    (13, 'Linear Demand-Supply x2'),
    (14, 'Non-Linear Demand-Supply x2'),
)

ASSIGNMENT_TYPES = (
    (0, 'Template graph'),
    (1, 'Labeling'),
    (2, 'Modification'),
)

DIRECTION = (
    (-1, 'Negative'),
    (0, 'None'),
    (1, 'Positive'),
)

QUESTION_FACTORS = [
    'intersection_label', 'intersection_2_label', 'intersection_3_label',
    'intersection_horiz_line_label', 'intersection_vert_line_label',
    'intersection_2_horiz_line_label', 'intersection_2_vert_line_label',
    'intersection_3_horiz_line_label', 'intersection_3_vert_line_label',
    'x_axis_label', 'y_axis_label', 'x_axis_2_label', 'y_axis_2_label',
    'line_1_label', 'line_2_label', 'line_3_label', 'line_4_label',
    'line_1_slope', 'line_2_slope', 'line_3_slope', 'line_4_slope',
    'line_1_offset_x', 'line_1_offset_y',
    'line_2_offset_x', 'line_2_offset_y',
    'line_3_offset_x', 'line_3_offset_y',
    'line_4_offset_x', 'line_4_offset_y',
    'a1', 'a1_name', 'a2', 'a2_name', 'a3', 'a3_name', 'a4', 'a4_name', 'a5',
    'alpha', 'omega', 'a', 'k', 'r', 'y1', 'y2',
    'cobb_douglas_a', 'cobb_douglas_a_name',
    'cobb_douglas_l', 'cobb_douglas_l_name',
    'cobb_douglas_k', 'cobb_douglas_k_name',
    'cobb_douglas_alpha', 'cobb_douglas_alpha_name',
    'cobb_douglas_y_name',
    'n_name', 'function_choice',
    'area_a_name', 'area_b_name', 'area_c_name'
]


class Cohort(models.Model):
    """A Cohort is a grouping of instructors and students.

    Generally referred to as a "Course" in the UI. That may change as
    we iron things out.
    """
    title = models.CharField(max_length=256, verbose_name='Course Title')
    description = models.TextField(null=True, blank=True)
    password = models.CharField(max_length=256, null=True, blank=True)

    instructors = models.ManyToManyField(User)
    is_sample = models.BooleanField(null=True, blank=True, unique=True)

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
        ordering = ('topic__cohort', 'featured', 'order')

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
    order_with_respect_to = ('topic__cohort')
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
    y_axis_label = models.TextField(blank=True, null=True, default='')

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

    # TODO: migrate these to a1, a2, etc.
    alpha = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0.3'))
    omega = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))

    # Arbitrary float storage to be used as needed for the altering
    # functions of the various graph types.
    a1 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a1_name = models.TextField(default='', blank=True,)
    a2 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a2_name = models.TextField(default='', blank=True)
    a3 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a3_name = models.TextField(default='', blank=True)
    a4 = models.DecimalField(
        max_digits=12, decimal_places=4, default=Decimal('0'))
    a4_name = models.TextField(default='', blank=True)
    a5 = models.DecimalField(
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

    # An Area under Curve (AUC) graph has different cases handling
    # which areas are displayed.
    area_configuration = models.PositiveSmallIntegerField(default=0)
    is_area_displayed = models.BooleanField(default=True)
    area_a_name = models.TextField(default='A', blank=True,)
    area_b_name = models.TextField(default='B', blank=True,)
    area_c_name = models.TextField(default='C', blank=True,)

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


class Assessment(models.Model):
    """
    The Assessment model handles graph feedback and scoring in
    EconPractice.

    To make feedback and scores in a graph, click Add Assessment in
    the top right.

    In the Graph dropdown, select the name of the graph you're
    making. You can add as many Assessment Rules as you want. The Name
    field expects values like:

    - line1label
    - line1slope
    - line1intercept

    Line 1 refers to the orange line, line 2 is the blue line, and
    line 3 is the red line.

    For intersection labels, use "intersectionLabel" as the
    Assessment's name to assess the main intersection label. If the
    graph has more than two lines, these names correspond to these
    intersection labels:

    - intersectionLabel: Orange-Blue intersection
    - intersection2Label: Blue-Red intersection
    - intersection3Label: Orange-Red intersection

    Here's how the dotted line labels correspond:

    - intersectionHorizLineLabel: Orange-Blue intersection horizontal
    - intersectionVertLineLabel: Orange-Blue intersection vertical
    - intersection2HorizLineLabel: Blue-Red intersection horizontal
    - intersection2VertLineLabel: Blue-Red intersection vertical
    - intersection3HorizLineLabel: Orange-Red intersection horizontal
    - intersection3VertLineLabel: Orange-Red intersection vertical

    The Value column is how you expect the user to modify this
    field. If it's a label field, just type in the correct label,
    e.g. "Demand". Spaces uppercase will be ignored during assessment.

    To assess a line movement, do something like 'line1intercept' with
    a value of 'up', 'down', or 'any'. To assess rotations, do
    'line1slope' with a value of 'increase', 'decrease', or 'any'.

    Use the feedback_fulfilled and feedback_unfulfilled columns to
    give textual feedback to the users.

    The score column specifies how many points the user will receive
    for fulfilling this case.
    """
    graph = models.OneToOneField(Graph, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'Assessment for: {}'.format(self.graph.title)


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

    def __str__(self):
        return 'AssessmentRule: {}, {}'.format(self.name, self.value)

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

    feedback_fulfilled = models.TextField(blank=True, default='')
    feedback_unfulfilled = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Assignment(models.Model):
    cohorts = models.ManyToManyField(Cohort, blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.TextField(blank=True, default='')
    published = models.BooleanField(default=False)
    title = models.TextField(max_length=1024, default='Untitled')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '{} (id:{})'.format(self.title, self.pk)

    def __len__(self):
        return self.bank_count()

    def get_question_banks(self):
        return QuestionBank.objects.filter(assignment=self)

    def get_user_assignment(self, user):
        return UserAssignment.objects.get(
            assignment=self, user=user)

    def bank_count(self):
        count = 0
        for key_question in self.get_question_banks():
            count = count + 1 + len(key_question)
        return count

    def flip_published(self):
        self.published = not self.published
        self.save()
        return self.published

    def clone(self):
        c = copy.copy(self)
        c.pk = None
        c.title = self.title + '_copy'
        c.save()

        for bank in self.get_question_banks():
            cloned_bank = bank.clone(c.pk)
            cloned_bank.assignment = c
            cloned_bank.save()

        return c


class Question(models.Model):
    title = models.TextField(max_length=1024, default='Untitled')
    embedded_media = models.TextField(blank=True, default='')
    media_upload = models.FileField(
        storage=MediaStorage, blank=True, null=True)
    graph = models.ForeignKey(
        Graph, on_delete=models.CASCADE, blank=True, null=True)
    keywords = models.TextField(max_length=1024, blank=True, default='')

    prompt = models.TextField(blank=True, default='')
    value = models.PositiveSmallIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_url_embed(self):
        return self.embedded_media

    def get_graph_name(self):
        return self.graph.title

    # TODO Finish method
    def evaluate(self):
        rules = self.evaluation_set.all()
        total = 0
        for prop in QUESTION_FACTORS:
            rule = rules.get(field=prop)
            total += rule.value
        return total

    def generate_tags(self):
        tags = []
        for bank in list(self.questionbank_set.all()):
            # A question may appear in different banks of the same assignment
            if bank.assignment not in tags:
                tags.append(bank.assignment)
        return tags

    def parse_keywords(self):
        # Keywords will be separated by spaces.
        # Multiword keywords must be joined with underscores
        return [x for x in self.keywords.split(' ') if x]

    def __str__(self):
        return '{} (id:{})'.format(self.title, self.pk)

    def clone(self):
        c = copy.copy(self)
        c.pk = None
        c.title = self.title + '_copy'
        c.save()
        evaluations = self.evaluation_set.all()
        for evaluation in evaluations:
            Evaluation.objects.create(
                question=c, field=evaluation.field,
                comparison=evaluation.comparison, value=evaluation.value)
        return c


class Evaluation(models.Model):
    class Meta:
        unique_together = ('field', 'question')

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    field = models.TextField(max_length=1024, default='line_1_label')
    comparison = models.IntegerField(choices=DIRECTION, default=0)
    value = models.IntegerField(default=1)


class QuestionBank(OrderedModel):
    class Meta(OrderedModel.Meta):
        ordering = ('assignment', 'order')
        unique_together = ('title', 'assignment')

    adaptive = models.BooleanField(default=False)
    ap_correct = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ap_continue'
    )
    ap_incorrect = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ap_intervene'
    )
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE
    )
    questions = models.ManyToManyField(Question, blank=True)
    supplemental = models.ManyToManyField(
        'self', blank=True, symmetrical=False)
    title = models.TextField(max_length=1024, default='Untitled')
    description = models.TextField(max_length=1024, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __len__(self):
        return self.questions.count()

    def __str__(self):
        return '{} (id:{})'.format(self.title, self.pk)

    def get_random(self):
        entry_list = list(self.questions.all())
        if len(entry_list) > 0:
            pick = random.randrange(len(entry_list))  # nosec
            return entry_list[pick]
        else:
            return None

    def change_assignment(self):
        for sup in list(self.supplemental.all()):
            sup.assignment = self.assignment
            sup.save()
        self.save()

        return self

    def clone(self, assignment):
        c = copy.copy(self)
        c.assignment = Assignment.objects.get(id=assignment)
        c.pk = None
        c.title = self.title
        c.adaptive = False
        c.ap_correct = None
        c.ap_incorrect = None
        c.save()
        c.supplemental.clear()
        for sup in list(self.supplemental.all()):
            cloned_sub = copy.copy(sup)
            cloned_sub.pk = None
            cloned_sub.assigment = c.assignment
            cloned_sub.save()
            cloned_sub.supplemental.clear()
            cloned_sub.save()
            c.supplemental.add(cloned_sub)

        c.save()

        return c


class UserAssignment(models.Model):
    class Meta:
        unique_together = ('assignment', 'user')

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __len__(self):
        return len(self.assignment)

    def __str__(self):
        return 'User: {}, Score: {}, Questions: {})'.format(
            self.user,
            self.get_score(),
            QuestionEvaluation.objects.filter(user_assignment=self))

    def get_score(self):
        evaluations = QuestionEvaluation.objects.filter(user_assignment=self)
        denominator = sum(map(lambda den: den.question.value, evaluations))
        return sum(map(lambda num: num.score, evaluations))/(
            1 if denominator == 0 else denominator)*100


class QuestionEvaluation(OrderedModel):
    class Meta(OrderedModel.Meta):
        ordering = ('user_assignment', 'order')
        unique_together = ('question', 'user_assignment')

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_assignment = models.ForeignKey(
        UserAssignment, on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(default=0)

    order_with_respect_to = ('user_assignment')

    def __str__(self):
        return '{}, {}'.format(self.question.title, self.score)

    def get_score(self):
        return (self.score/self.question.value)*100
