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
    line_1_slope = fuzzy.FuzzyDecimal(-3.0, 0.0)
    line_2_slope = fuzzy.FuzzyDecimal(3.01, 6.0)
