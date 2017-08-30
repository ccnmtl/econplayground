import factory
from factory import fuzzy
from econplayground.main.models import Graph, Curve, Point


class GraphFactory(factory.DjangoModelFactory):
    class Meta:
        model = Graph

    title = fuzzy.FuzzyText()
    description = fuzzy.FuzzyText()


class CurveFactory(factory.DjangoModelFactory):
    class Meta:
        model = Curve

    label = fuzzy.FuzzyText()


class PointFactory(factory.DjangoModelFactory):
    class Meta:
        model = Point

    label = fuzzy.FuzzyText()
