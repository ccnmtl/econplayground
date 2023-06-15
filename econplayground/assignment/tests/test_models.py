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

    #
    # Make a test assignment that looks like this:
    #
    # a1 - b1 - c1 - d1 - e1
    #      |         |
    #      b2        d2
    #      |
    #      b3
    #
    def test_make_test_assignment(self):
        a1 = self.x.get_root()

        b1 = Step(tree=a1.tree)
        a1.add_child(instance=b1)

        b2 = Step(tree=a1.tree)
        b1.add_sibling(instance=b2)
        b3 = Step(tree=a1.tree)
        b1.add_sibling(instance=b3)

        c1 = Step(tree=a1.tree)
        b1.add_child(instance=c1)

        d1 = Step(tree=a1.tree)
        c1.add_child(instance=d1)
        d2 = Step(tree=a1.tree)
        d1.add_sibling(instance=d2)

        e1 = Step(tree=a1.tree)
        d1.add_child(instance=e1)

        self.assertEqual(a1.get_depth(), 1)
        self.assertEqual(e1.get_depth(), 5)
        self.assertEqual(a1.get_children_count(), 1)
        self.assertEqual(a1.get_children()[0].get_depth(), 2)
