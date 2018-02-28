from django.test import TestCase
from econplayground.main.tests.factories import (
    GraphFactory, JXGLineFactory, JXGLineTransformationFactory,
    SubmissionFactory
)


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class JXGLineTest(TestCase):
    def setUp(self):
        graph = GraphFactory()
        self.x = JXGLineFactory(graph=graph)

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class JXGLineTransformationTest(TestCase):
    def setUp(self):
        graph = GraphFactory()
        line = JXGLineFactory(graph=graph)
        self.x = JXGLineTransformationFactory(line=line)

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class SubmissionTest(TestCase):
    def setUp(self):
        self.x = SubmissionFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
