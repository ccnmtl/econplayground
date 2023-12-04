import unittest
from django.conf import settings
from django.test import TestCase
from econplayground.assignment.tests.factories import (
    AssignmentFactory, QuestionFactory, AssessmentRuleFactory,
    StepResultFactory, ScorePathFactory, AssignmentMixin,
    MultipleChoiceFactory
)
from econplayground.assignment.models import (
    Assignment, Step, Question, AssessmentRule, Graph,
    ScorePath
)


class AssignmentTreeTest(TestCase):
    """Structure tests for unpopulated assignments"""
    def setUp(self):
        self.x = AssignmentFactory()
        self.x2 = AssignmentFactory()

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

        self.a1 = Step(assignment=self.root.assignment)
        self.root.add_child(instance=self.a1)

        self.a2 = Step(assignment=self.root.assignment)
        self.a1.add_child(instance=self.a2)
        self.a3 = Step(assignment=self.root.assignment)
        self.a2.add_child(instance=self.a3)
        self.a4 = Step(assignment=self.root.assignment)
        self.a3.add_child(instance=self.a4)

        self.b1 = Step(assignment=self.root.assignment)
        self.a1.add_sibling(instance=self.b1, pos='last-sibling')

        self.b2 = Step(assignment=self.root.assignment)
        self.b1.add_child(instance=self.b2)
        self.b3 = Step(assignment=self.root.assignment)
        self.b1.add_child(instance=self.b3)

        self.c1 = Step(assignment=self.root.assignment)
        self.b1.add_sibling(instance=self.c1, pos='last-sibling')

        self.d1 = Step(assignment=self.root.assignment)
        self.c1.add_sibling(instance=self.d1, pos='last-sibling')
        self.d2 = Step(assignment=self.root.assignment)
        self.d1.add_child(instance=self.d2)
        self.d3 = Step(assignment=self.root.assignment)
        self.d2.add_child(instance=self.d3)

        self.e1 = Step(assignment=self.root.assignment)
        self.d1.add_sibling(instance=self.e1, pos='last-sibling')
        self.root2 = self.x2.get_root()

        return self.a1

    def test_is_valid_from_factory(self):
        self.x.full_clean()
        self.assertIsInstance(self.x, Assignment)

    def test_get_root(self):
        self.assertIsInstance(self.x.get_root(), Step)

    def test_last_step(self):
        self.make_test_assignment()
        self.assertFalse(self.a1.is_last_step)
        self.assertFalse(self.b1.is_last_step)
        self.assertFalse(self.c1.is_last_step)
        self.assertFalse(self.d1.is_last_step)
        self.assertTrue(self.e1.is_last_step)

    def test_make_steps(self):
        root = self.x.get_root()
        step = Step(assignment=root.assignment)
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

        b1 = Step(assignment=a1.assignment)
        a1.add_child(instance=b1)

        a2 = AssignmentFactory()

        a2root = a2.get_root()
        b2 = Step(assignment=a2root.assignment)
        a2root.add_child(instance=b2)

        self.assertNotEqual(a1, a2)
        self.assertNotEqual(b1.assignment, b2.assignment)

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

        # b1
        step_5 = step_4.get_next_intervention()
        self.assertEqual(step_5, self.b1)
        self.assertEqual(step_5.get_depth(), 2)

        # I answer this question correctly, skipping the intervention path.
        step_6 = step_5.get_next()
        self.assertEqual(step_6, self.c1)
        self.assertEqual(step_6.get_depth(), 2)

        # I answer this question incorrectly, but there is no
        # intervention path defined, moving me on to the sibling node
        # d1.
        step_7 = step_6.get_next_intervention()
        self.assertEqual(step_7, self.d1)
        self.assertEqual(step_7.get_depth(), 2)

    def test_assignment_delete_cascade(self):
        pk = self.x.pk
        self.x.delete()
        self.assertFalse(Step.objects.filter(assignment=pk).exists())


class QuestionTest(TestCase):
    """Tests the Question model and Question methods"""

    def setUp(self):
        self.x = QuestionFactory()
        self.rule_1 = AssessmentRuleFactory(
            question=self.x,
            assessment_name='name1', assessment_value='value')
        self.rule_2 = AssessmentRuleFactory(
            question=self.x,
            assessment_name='name2', assessment_value='value')

        # TODO Ensure that different Assessment Rules with the same
        #   assessment_name cannot be assigned to the same question.

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_first_rule(self):
        self.assertEqual(self.x.first_rule(), self.rule_1)
        self.assertNotEqual(self.x.first_rule(), self.rule_2)

    def test_eval_with_no_rules(self):
        q = QuestionFactory()
        self.assertIsNone(q.evaluate_action('line1', 'up'))


class MultipleChoiceTest(TestCase):
    """Test the MultipleChoice model and MultipleChoice methods"""

    def setUp(self):
        self.x = MultipleChoiceFactory()
        self.x2 = MultipleChoiceFactory(
            choices=[x for x in range(10)],
            correct=3)

    def test_is_valid_from_factory(self):
        self.x.full_clean()
        self.x2.full_clean()

    def test_correct_choice(self):
        self.assertEqual(0, self.x.correct)
        self.assertEqual(3, self.x2.correct)

    def test_add_choice(self):
        self.assertEqual(len(self.x.choices), 4)
        self.x.choices.append('add_choice')
        self.assertEqual(len(self.x.choices), 5)

    def test_remove_choice(self):
        self.assertEqual(len(self.x.choices), 5)
        self.x.choices.pop()
        self.assertEqual(len(self.x.choices), 4)

    def test_choice_length(self):
        self.assertEqual(len(self.x2.choices), 10)


class AssessmentRuleTest(TestCase):
    """Tests the AssessmentRule model and AssessmentRule methods"""

    def test_has_feedback(self):
        """Test various possible feedback entries"""
        q = QuestionFactory()
        self.x = AssessmentRuleFactory(
            question=q, feedback_fulfilled='Question Feedback',
            assessment_name='test_1', assessment_value='value_a')
        self.y = AssessmentRuleFactory(
            question=q, feedback_unfulfilled='',
            assessment_name='test_2', assessment_value='value_b')
        # AssessmentRuleFactory automatically generates randomized feedback
        # In this case use AssessmentRule
        self.z = AssessmentRule(
            assessment_name='test_3', assessment_value='value_c')

        self.assertTrue(self.x.has_feedback())
        self.assertTrue(self.y.has_feedback())
        self.assertFalse(self.z.has_feedback())


class AssignmentTest(TestCase):
    """Tests for populated assignments (Assignment + Questions)"""

    def setUp(self):
        """Make a populated, linear assignment"""
        self.x = AssignmentFactory()

        self.root = self.x.get_root()

        self.a1 = Step(assignment=self.root.assignment)
        self.root.add_child(instance=self.a1)
        self.a2 = Step(assignment=self.root.assignment)
        self.a1.add_child(instance=self.a2)
        self.b1 = Step(assignment=self.root.assignment)
        self.a1.add_sibling(instance=self.b1, pos='last-sibling')
        self.b2 = Step(assignment=self.root.assignment)
        self.b3 = Step(assignment=self.root.assignment)
        self.b1.add_child(instance=self.b2)
        self.b1.add_child(instance=self.b3)
        self.c1 = Step(assignment=self.root.assignment)
        self.b1.add_sibling(instance=self.c1, pos='last-sibling')
        self.d1 = Step(assignment=self.root.assignment)
        self.c1.add_sibling(instance=self.d1, pos='last-sibling')
        self.d2 = Step(assignment=self.root.assignment)
        self.d1.add_child(instance=self.d2)

        # TODO Low Priority -- Allow for multiple AssessmentRules
        # Populate it with questions
        q1 = QuestionFactory()
        AssessmentRuleFactory(
            question=q1,
            assessment_name='line_1', assessment_value='up')
        self.a1.question = q1
        self.a1.save()

        q2 = QuestionFactory()
        AssessmentRuleFactory(
            question=q2,
            assessment_name='line_1', assessment_value='increase')
        self.b1.question = q2
        self.b1.save()

        q2_3 = QuestionFactory()
        AssessmentRuleFactory(
            question=q2_3,
            assessment_name='line_1_label', assessment_value='Test_Label')
        self.b3.question = q2_3
        self.b3.save()

        q3 = QuestionFactory()
        AssessmentRuleFactory(
            question=q3,
            assessment_name='line_1_label', assessment_value='Demand')
        AssessmentRuleFactory(
            question=q3,
            assessment_name='line_2_label', assessment_value='Supply')
        AssessmentRuleFactory(
            question=q3,
            assessment_name='line_1', assessment_value='up')
        self.c1.question = q3
        self.c1.save()

        # Evaluation of say, the alpha value of a cobb-douglas graph.
        q4 = QuestionFactory()
        AssessmentRuleFactory(
            question=q4,
            assessment_name='alpha', assessment_value='0.6')
        self.d1.question = q4
        self.d1.save()

    def test_assingment_setup(self):
        step = self.root
        self.assertIsInstance(step, Step)
        step = step.get_next()
        self.assertIsInstance(step, Step)
        self.assertIsInstance(step.question, Question)
        self.assertIsInstance(step.question.graph, Graph)

    def test_assignment_flow(self):
        result1 = self.a1.question.evaluate_action('line_2', 'down')
        self.assertFalse(result1)

        result2 = self.a1.question.evaluate_action('line_1', 'up')
        self.assertTrue(result2)

        step2 = self.a1.get_next()
        result3 = step2.question.evaluate_action('line_1', 'increase')
        self.assertTrue(result3)

        step3 = step2.get_next()
        result4 = step3.question.evaluate_action('line_1_label', 'demand')
        self.assertTrue(result4)

        step4 = step3.get_next()
        self.assertFalse(
            step4.question.evaluate_action('alpha', '0.5'))
        self.assertTrue(
            step4.question.evaluate_action('alpha', '0.6'))

    def test_assignment_flow_2(self):
        result = self.a1.question.evaluate_action('', 'down')
        self.assertFalse(result)
        result = self.a1.question.evaluate_action('line_2', '')
        self.assertFalse(result)
        result = self.a1.question.evaluate_action('line_2', 2)
        self.assertFalse(result)

        self.assertIsNone(self.a2.question)

        next_target = self.a1.get_next()
        self.assertNotEqual(next_target, self.a2)
        next_target = self.a2.get_next()
        # The next target after the end of a list should be b1
        self.assertEqual(next_target, self.b1)

        result = next_target.get_next_intervention()
        self.assertEqual(result, self.b2)
        result = result.get_next()
        self.assertEqual(result, self.b3)
        self.assertIsInstance(result.question, Question)
        result = result.get_next()
        self.assertEqual(result, self.c1)
        result = result.get_next()
        self.assertEqual(result, self.d1)
        result = result.get_prev()
        self.assertEqual(result, self.c1)

        self.assertIsNone(self.root.closest_next_sibling())
        self.assertEqual(self.a1.closest_next_sibling(), self.b1)
        self.assertEqual(self.b2.closest_next_sibling(), self.b3)
        self.assertEqual(self.b3.closest_next_sibling(), self.c1)
        self.assertEqual(self.d1.closest_next_sibling(), None)

    def test_question_assessment(self):
        c1_rules = self.c1.question.assessmentrule_set
        self.assertTrue(c1_rules)
        self.assertIsInstance(c1_rules.first(), AssessmentRule)
        self.assertGreater(len(c1_rules.all()), 1)

        # TODO Low Priority -- Allow for the evaluation of multiple rules
        # self.assertTrue(self.c1.question.evaluate_action([
        #     ['line_1_label', 'Demand'],
        #     ['line_2_label', 'Supply']
        # ]))
        # self.assertFalse(self.c1.question.evaluate_action([
        #     ['line_1_label', ''],
        #     ['line_2_label', 'Supply']
        # ]))
        # self.assertFalse(self.c1.question.evaluate_action([
        #     ['line_1_label', 'Demand'],
        #     ['', 'Supply']
        # ]))
        # self.assertFalse(self.c1.question.evaluate_action([
        #     ['line_1_label', 'Demand']
        # ]))
        # self.assertFalse(self.c1.question.evaluate_action(
        #     'line_1_label', 'Demand'
        # ))

    def test_eval_type(self):
        # Remove pass when the implementation is ready for testing
        pass
        # TODO -- Require type validation on user entry. Using a select element
        #   should help to eliminate the need but the test should exist in case
        #   another element is used, or someone tries to insert something else.

        # eval_type = ['line', 'label', 'value']
        # line_val = ['up', 'down', 'increase', 'decrease']
        # eval_list = self.a1.question.assessmentrule_set.all()

        # for rule in list:
        #     self.assertIn(rule.eval_type, eval_type)
        #     if rule.eval_type == 'line':
        #         self.assertIn(rule.assessment_value, line_val)
        #     elif rule.eval_type == 'value':
        #         self.assertIsInstance(rule.assessment_value, int)  # integers
        #         # or
        #         self.assertIsInstance(rule.assessment_value, float)  # floats


@unittest.skipIf(
    settings.DATABASES['default']['ENGINE'] != 'django.db.backends.postgresql',
    'This test uses postgres-specific fields')
class ScorePathTest(AssignmentMixin, TestCase):
    def setUp(self):
        self.x = ScorePathFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
        self.assertIsInstance(self.x, ScorePath)
        self.assertEqual(self.x.score, 0)

    def test_score(self):
        self.setup_sample_assignment()
        self.x.steps.append(
            StepResultFactory(step=self.a1, result=True).pk)
        self.x.steps.append(
            StepResultFactory(step=self.b1, result=True).pk)
        self.x.steps.append(
            StepResultFactory(step=self.c1, result=False).pk)

        self.assertEqual(self.x.score, 2 / 3)
