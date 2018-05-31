from django.test import TestCase
from econplayground.main.tests.factories import (
    GraphFactory, JXGLineFactory, JXGLineTransformationFactory,
    SubmissionFactory,
    AssessmentFactory, AssessmentRuleFactory,
)


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class JXGLineTest(TestCase):
    def setUp(self):
        self.x = JXGLineFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class JXGLineTransformationTest(TestCase):
    def setUp(self):
        self.x = JXGLineTransformationFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class SubmissionTest(TestCase):
    def setUp(self):
        self.x = SubmissionFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class AssessmentTest(TestCase):
    def setUp(self):
        self.x = AssessmentFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class AssessmentRuleTest(TestCase):
    def setUp(self):
        self.x = AssessmentRuleFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
