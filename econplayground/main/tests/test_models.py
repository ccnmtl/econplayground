from django.test import TestCase
from econplayground.main.tests.factories import (
    GraphFactory, CurveFactory, PointFactory
)


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class CurveTest(TestCase):
    def setUp(self):
        graph = GraphFactory()
        self.x = CurveFactory(graph=graph)

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class PointTest(TestCase):
    def setUp(self):
        graph = GraphFactory()
        curve = CurveFactory(graph=graph)
        self.x = PointFactory(curve=curve)

    def test_is_valid_from_factory(self):
        self.x.full_clean()
