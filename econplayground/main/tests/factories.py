import factory
from factory import fuzzy
from econplayground.main.models import PlaygroundGraph, ProblemGraph


class PlaygroundGraphFactory(factory.DjangoModelFactory):
    class Meta:
        model = PlaygroundGraph

    title = fuzzy.FuzzyText()
    description = fuzzy.FuzzyText()
    data = {'a': 'b'}


class ProblemGraphFactory(factory.DjangoModelFactory):
    class Meta:
        model = ProblemGraph

    title = fuzzy.FuzzyText()
    description = fuzzy.FuzzyText()
    data = {'a': 'b'}
