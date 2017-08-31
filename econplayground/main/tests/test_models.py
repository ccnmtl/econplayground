from django.test import TestCase
from econplayground.main.tests.factories import (
    PlaygroundGraphFactory, ProblemGraphFactory
)


class PlaygroundGraphTest(TestCase):
    def setUp(self):
        self.x = PlaygroundGraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class ProblemGraphTest(TestCase):
    def setUp(self):
        self.x = ProblemGraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
