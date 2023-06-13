from django.test import TestCase
from econplayground.assignment.tests.factories import TreeFactory
from econplayground.assignment.models import Tree, Step


class TreeTest(TestCase):
    def setUp(self):
        self.x = TreeFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
        self.assertIsInstance(self.x, Tree)

    def test_get_root(self):
        self.x.get_root()

    def test_make_steps(self):
        root = self.x.get_root()
        step = Step(tree=root.tree)
        root.add_child(instance=step)

        self.assertEqual(root.get_depth(), 1)
        self.assertEqual(root.get_children_count(), 1)
        self.assertEqual(root.get_children()[0].get_depth(), 2)
