from django.test import TestCase
from django.db.utils import IntegrityError
from econplayground.main.models import Assessment
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

    def test_only_one_assessment_per_graph(self):
        self.assertEqual(Assessment.objects.count(), 1)
        with self.assertRaises(IntegrityError):
            AssessmentFactory(graph=self.x.graph)


class AssessmentRuleTest(TestCase):
    def setUp(self):
        self.x = AssessmentRuleFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
