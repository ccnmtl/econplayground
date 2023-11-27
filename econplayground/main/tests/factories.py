from django.contrib.auth.models import User
from django.db.models.signals import post_save
import factory
from factory.django import DjangoModelFactory
from factory import fuzzy
from econplayground.main.models import (
    GRAPH_TYPES,
    Graph, JXGLine, JXGLineTransformation, Submission,
    Assessment, AssessmentRule, Topic, Cohort
)


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = fuzzy.FuzzyText(prefix='user_')


class InstructorFactory(DjangoModelFactory):
    class Meta:
        model = User

    is_staff = True
    username = fuzzy.FuzzyText(prefix='instructor_')


class StudentFactory(DjangoModelFactory):
    class Meta:
        model = User

    is_staff = False
    username = fuzzy.FuzzyText(prefix='student_')


class CohortFactory(DjangoModelFactory):
    class Meta:
        model = Cohort

    title = fuzzy.FuzzyText()
    description = fuzzy.FuzzyText()

    @factory.post_generation
    def instructors(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for instructor in extracted:
                self.instructors.add(instructor)


class TopicFactory(DjangoModelFactory):
    class Meta:
        model = Topic

    name = fuzzy.FuzzyText()
    cohort = factory.SubFactory(CohortFactory)


class GraphFactory(DjangoModelFactory):
    class Meta:
        model = Graph

    graph_type = fuzzy.FuzzyChoice(choices=[x[0] for x in GRAPH_TYPES])
    title = fuzzy.FuzzyText()
    instructions = fuzzy.FuzzyText()
    instructor_notes = fuzzy.FuzzyText()
    author = factory.SubFactory(UserFactory)

    x_axis_label = fuzzy.FuzzyText()
    y_axis_label = fuzzy.FuzzyText()

    line_1_slope = fuzzy.FuzzyDecimal(-3.0, 0.0)
    line_1_label = fuzzy.FuzzyText()

    line_2_slope = fuzzy.FuzzyDecimal(3.01, 6.0)
    line_2_label = fuzzy.FuzzyText()

    cobb_douglas_alpha = fuzzy.FuzzyDecimal(0.0, 1.0)

    topic = factory.SubFactory(TopicFactory)


class JXGLineFactory(DjangoModelFactory):
    class Meta:
        model = JXGLine

    graph = factory.SubFactory(GraphFactory)


class JXGLineTransformationFactory(DjangoModelFactory):
    class Meta:
        model = JXGLineTransformation

    line = factory.SubFactory(JXGLineFactory)
    z1 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    x1 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    y1 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    z2 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    x2 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    y2 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    z3 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    x3 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)
    y3 = fuzzy.FuzzyDecimal(-5.1234, 5.1234)


class SubmissionFactory(DjangoModelFactory):
    class Meta:
        model = Submission

    graph = factory.SubFactory(GraphFactory)
    user = factory.SubFactory(UserFactory)
    feedback_fulfilled = fuzzy.FuzzyText()
    feedback_unfulfilled = fuzzy.FuzzyText()
    score = fuzzy.FuzzyDecimal(0.0, 1.0)


@factory.django.mute_signals(post_save)
class AssessmentFactory(DjangoModelFactory):
    class Meta:
        model = Assessment

    graph = factory.SubFactory(GraphFactory)


@factory.django.mute_signals(post_save)
class AssessmentRuleFactory(DjangoModelFactory):
    class Meta:
        model = AssessmentRule

    assessment = factory.SubFactory(AssessmentFactory)
    name = fuzzy.FuzzyText()
    value = fuzzy.FuzzyText()
    feedback_fulfilled = fuzzy.FuzzyText()
    feedback_unfulfilled = fuzzy.FuzzyText()
    score = fuzzy.FuzzyDecimal(0, 1)
