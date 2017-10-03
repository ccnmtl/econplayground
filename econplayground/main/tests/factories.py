from django.contrib.auth.models import User
import factory
from factory import fuzzy
from econplayground.main.models import Graph


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    username = fuzzy.FuzzyText(prefix='user_')


class GraphFactory(factory.DjangoModelFactory):
    class Meta:
        model = Graph

    title = fuzzy.FuzzyText()
    description = fuzzy.FuzzyText()
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
