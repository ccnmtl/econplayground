from django.contrib.auth.models import User
import factory
from factory import fuzzy
from econplayground.main.models import (
    Graph, JXGLine, JXGLineTransformation, Submission
)


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    username = fuzzy.FuzzyText(prefix='user_')


class InstructorFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    is_staff = True
    username = fuzzy.FuzzyText(prefix='instructor_')


class StudentFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    is_staff = False
    username = fuzzy.FuzzyText(prefix='student_')


class GraphFactory(factory.DjangoModelFactory):
    class Meta:
        model = Graph

    title = fuzzy.FuzzyText()
    description = fuzzy.FuzzyText()
    instructor_notes = fuzzy.FuzzyText()
    author = factory.SubFactory(UserFactory)

    x_axis_label = fuzzy.FuzzyText()
    y_axis_label = fuzzy.FuzzyText()

    line_1_slope = fuzzy.FuzzyDecimal(-3.0, 0.0)
    line_1_label = fuzzy.FuzzyText()
    line_1_feedback_increase = fuzzy.FuzzyText()
    line_1_feedback_decrease = fuzzy.FuzzyText()

    line_2_slope = fuzzy.FuzzyDecimal(3.01, 6.0)
    line_2_label = fuzzy.FuzzyText()
    line_2_feedback_increase = fuzzy.FuzzyText()
    line_2_feedback_decrease = fuzzy.FuzzyText()

    cobb_douglas_alpha = fuzzy.FuzzyDecimal(0.0, 1.0)


class JXGLineFactory(factory.DjangoModelFactory):
    class Meta:
        model = JXGLine


class JXGLineTransformationFactory(factory.DjangoModelFactory):
    class Meta:
        model = JXGLineTransformation


class SubmissionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Submission

    graph = factory.SubFactory(GraphFactory)
    user = factory.SubFactory(UserFactory)
    choice = fuzzy.FuzzyInteger(0, 100)
    score = fuzzy.FuzzyDecimal(0.0, 1.0)
