from django.test import TestCase
from econplayground.assignment.tests.factories import TreeFactory
from econplayground.assignment.models import Tree, Step


class TreeTest(TestCase):
    def setUp(self):
        self.x = TreeFactory()

    def make_test_assignment(self):
        """
        Make a test assignment with a specific structure.

        r
        |
        a1 - b1 - c1 - d1 - e1
        |    |         |
        a2   b2        d2
        |    |         |
        a3   b3        d3
        |
        a4

        r is the root node, a1 is the first node of the assignment
        structure, and b1-e1 are its siblings. e1 is the right-most
        sibling, and can be thought of as the final step of the
        assignment. This is just the convention I'm currently going
        with, and can be adjusted if needed.

        Additionally, each node may have custom instructor-defined
        behavior regarding where it navigates to next.


        This method returns the a1 node.
        """
        self.root = self.x.get_root()

        self.a1 = Step(tree=self.root.tree)
        self.root.add_child(instance=self.a1)

        self.a2 = Step(tree=self.root.tree)
        self.a1.add_child(instance=self.a2)
        self.a3 = Step(tree=self.root.tree)
        self.a2.add_child(instance=self.a3)
        self.a4 = Step(tree=self.root.tree)
        self.a3.add_child(instance=self.a4)

        self.b1 = Step(tree=self.root.tree)
        self.a1.add_sibling(instance=self.b1, pos='last-sibling')

        self.b2 = Step(tree=self.root.tree)
        self.b1.add_child(instance=self.b2)
        self.b3 = Step(tree=self.root.tree)
        self.b1.add_child(instance=self.b3)

        self.c1 = Step(tree=self.root.tree)
        self.b1.add_sibling(instance=self.c1, pos='last-sibling')

        self.d1 = Step(tree=self.root.tree)
        self.c1.add_child(instance=self.d1)
        self.d2 = Step(tree=self.root.tree)
        self.d1.add_child(instance=self.d2)
        self.d3 = Step(tree=self.root.tree)
        self.d2.add_child(instance=self.d3)

        self.e1 = Step(tree=self.root.tree)
        self.d1.add_sibling(instance=self.e1, pos='last-sibling')

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

    def test_make_simple_assignment(self):
        """Test some add/remove functionality.

        Make a test assignment that looks like this:

        a1 - b1 - c1 - d1 - e1
             |         |
             b2        d2
             |
             b3
        """
        a1 = self.x.add_step()

        b1 = self.x.add_step()
        # b2
        self.x.add_substep(b1.pk)
        # b3
        self.x.add_substep(b1.pk)

        # c1
        self.x.add_step()

        d1 = self.x.add_step()
        # d2
        self.x.add_substep(d1.pk)

        e1 = self.x.add_step()

        a1.refresh_from_db()
        self.assertEqual(a1.get_depth(), 2)
        self.assertEqual(e1.get_depth(), 2)
        self.assertEqual(a1.get_children_count(), 0)

        b1.refresh_from_db()
        self.assertEqual(b1.get_children_count(), 2)
        self.assertEqual(b1.get_descendant_count(), 2)
        self.assertEqual(b1.get_children()[0].get_depth(), 3)

    def test_multiple_assignments(self):
        a1 = self.x.get_root()

        b1 = Step(tree=a1.tree)
        a1.add_child(instance=b1)

        a2 = TreeFactory()

        a2root = a2.get_root()
        b2 = Step(tree=a2root.tree)
        a2root.add_child(instance=b2)

        self.assertNotEqual(a1, a2)
        self.assertNotEqual(b1.tree, b2.tree)

    # Test basic assignment flow.
    def test_assignment_navigation(self):

        # I'm a student at the first step of my assignment. In this
        # situation, there are two possible paths forward, depending
        # on how I answer the question.
        step_1 = self.make_test_assignment()
        self.assertEqual(step_1.get_depth(), 2)
        self.assertEqual(step_1, self.a1)

        # I answer the question incorrectly. This leads me to the
        # node's child, the intervention path, if it has one.
        # I'm now at node a2 in the assignment.
        step_2 = step_1.get_next_intervention()
        self.assertEqual(step_2.get_depth(), 3)
        self.assertEqual(step_2, self.a2)

        # a3
        step_3 = step_2.get_next_intervention()
        self.assertEqual(step_3, self.a3)

        # a4
        step_4 = step_3.get_next_intervention()
        self.assertEqual(step_4, self.a4)

        # TODO
        # b1
        # step_5 = step_4.get_next_intervention()
        # from pdb import set_trace; set_trace()
        # self.assertEqual(step_5, self.b1)
        # self.assertEqual(step_5.get_depth(), 2)

        # # I answer this question correctly, skipping the intervention path.
        # step_6 = step_5.get_next()
        # self.assertEqual(step_6, self.c1)
        # self.assertEqual(step_6.get_depth(), 4)

        # # I answer this question incorrectly, but there is no
        # # intervention path defined, moving me on to the child node
        # # d1.
        # step_7 = step_6.get_next_intervention()
        # self.assertEqual(step_7, self.d1)
        # self.assertEqual(step_7.get_depth(), 2)
