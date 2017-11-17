from django.test import TestCase
from econplayground.main.tests.factories import GraphFactory, SubmissionFactory


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class SubmissionTest(TestCase):
    def setUp(self):
        self.x = SubmissionFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
