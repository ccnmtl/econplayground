from django.test import TestCase
from econplayground.assignment.tests.factories import TreeFactory
from econplayground.assignment.models import Tree, Step


class TreeTest(TestCase):
    def setUp(self):
        self.x = TreeFactory()

    def make_test_assignment(self):
        """
        Make a test assignment with a specific structure.

        a1 - b1 - c1 - d1 - e1
        |    |         |
        a2   b2        d2
        |    |         |
        a3   b3        d3
        |
        a4

        a1 is the root node, a2-a4 are its siblings. e1 is the deepest
        child node, and can be thought of as the final step of the
        assignment. This is just the convention I'm currently going
        with, and can be adjusted if needed.

        Additionally, each node may have custom instructor-defined
        behavior regarding where it navigates to next.


        This method returns the root node of this assignment tree.
        """
        self.a1 = self.x.get_root()

        self.a2 = Step(tree=self.a1.tree)
        self.a1.add_sibling(instance=self.a2)
        self.a3 = Step(tree=self.a1.tree)
        self.a2.add_sibling(instance=self.a3)
        self.a4 = Step(tree=self.a1.tree)
        self.a3.add_sibling(instance=self.a4)

        self.b1 = Step(tree=self.a1.tree)
        self.a1.add_child(instance=self.b1)

        self.b2 = Step(tree=self.a1.tree)
        self.b1.add_sibling(instance=self.b2)
        self.b3 = Step(tree=self.a1.tree)
        self.b1.add_sibling(instance=self.b3)

        self.c1 = Step(tree=self.a1.tree)
        self.b1.add_child(instance=self.c1)

        self.d1 = Step(tree=self.a1.tree)
        self.c1.add_child(instance=self.d1)
        self.d2 = Step(tree=self.a1.tree)
        self.d1.add_sibling(instance=self.d2)
        self.d3 = Step(tree=self.a1.tree)
        self.d2.add_sibling(instance=self.d3)

        self.e1 = Step(tree=self.a1.tree)
        self.d1.add_child(instance=self.e1)

        return self.a1

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
    def test_make_simple_assignment(self):
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

    # Test basic assignment flow.
    def test_assignment_navigation(self):

        # I'm a student at the first step of my assignment. In this
        # situation, there are two possible paths forward, depending
        # on how I answer the question.
        step_1 = self.make_test_assignment()
        self.assertTrue(step_1.is_root)
        self.assertEqual(step_1.get_depth(), 1)
        self.assertEqual(step_1, self.a1)

        # I answer the question incorrectly. This leads me to the
        # node's sibling, the intervention path, if it has one.
        # I'm now at node a2 in the assignment.
        step_2 = step_1.get_next_intervention()
        self.assertEqual(step_2.get_depth(), 1)
        self.assertEqual(step_2, self.a2)

        step_3 = step_2.get_next_intervention()
        self.assertEqual(step_3, self.a3)

        step_4 = step_3.get_next_intervention()
        self.assertEqual(step_4, self.a4)

        step_5 = step_4.get_next_intervention()
        self.assertEqual(step_5, self.b1)
        self.assertEqual(step_5.get_depth(), 2)

        # I answer this question correctly, skipping the intervention path.
        step_6 = step_5.get_next()
        self.assertEqual(step_6, self.c1)
        self.assertEqual(step_6.get_depth(), 3)

        # I answer this question incorrectly, but there is no
        # intervention path defined, moving me on to the child node
        # d1.
        step_7 = step_6.get_next_intervention()
        self.assertEqual(step_7, self.d1)
        self.assertEqual(step_7.get_depth(), 4)
