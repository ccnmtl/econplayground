from django.test import TestCase
from econplayground.main.tests.factories import GraphFactory


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
