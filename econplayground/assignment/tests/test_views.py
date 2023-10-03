from django.test import TestCase
from django.urls import reverse
from econplayground.assignment.tests.factories import (
    AssignmentFactory, QuestionFactory, AssignmentMixin
)
from econplayground.assignment.models import Step, Question
from econplayground.main.tests.mixins import (
    LoggedInTestInstructorMixin, LoggedInTestStudentMixin
)


class AssignmentManagementViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.assignment = AssignmentFactory()

    def test_create_question(self):
        r = self.client.post(
            reverse(
                'assignment_question_create',
                kwargs={'assignment_pk': self.assignment.pk}), {
                'title': 'Test question',
            }, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Test question')
        self.assertContains(r, 'created.')

        q = Question.objects.last()
        self.assertEqual(q.title, 'Test question')

    def test_delete_question(self):
        question = QuestionFactory()
        question_pk = question.pk
        r = self.client.post(
            reverse(
                'assignment_question_delete',
                kwargs={
                    'assignment_pk': self.assignment.pk,
                    'pk': question_pk,
                }), follow=True)

        self.assertEqual(r.status_code, 200)

    def test_update_question(self):
        question = QuestionFactory()
        question_pk = question.pk
        media_path = 'https://example.com/image.png'
        r = self.client.post(
            reverse(
                'assignment_question_edit',
                kwargs={
                    'assignment_pk': self.assignment.pk,
                    'pk': question_pk,
                }), {
                    'title': 'New title',
                    'rule_assessment_type_0': '',
                    'rule_assessment_name_0': 'rule_name',
                    'rule_assessment_value_0': 'rule_value',
                    'rule_feedback_fulfilled_0': '',
                    'rule_media_fulfilled_0': media_path,
                    'rule_feedback_unfulfilled_0': '',
                    'rule_media_unfulfilled_0': '',
                }, follow=True)

        self.assertEqual(r.status_code, 200)
        question.refresh_from_db()
        self.assertEqual(question.title, 'New title')
        self.assertContains(r, 'New title')
        self.assertContains(r, 'updated.')

        self.assertEqual(question.assessmentrule_set.count(), 1)
        rule = question.assessmentrule_set.first()
        self.assertEqual(rule.assessment_name, 'rule_name')
        self.assertEqual(rule.assessment_value, 'rule_value')
        self.assertEqual(rule.media_fulfilled, media_path)

    def test_step_question_management(self):
        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'add_step',
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'New step added.')
        self.assertEqual(Step.objects.count(), 2)
        step = Step.objects.last()
        q = QuestionFactory()

        # Save question
        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'save',
                'step_question_' + str(step.pk): q.pk,
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Steps updated.')
        self.assertEqual(Step.objects.count(), 2)
        step.refresh_from_db()
        self.assertEqual(step.question, q)

        # Remove question
        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'save',
                'step_question_' + str(step.pk): 0,
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Steps updated.')
        self.assertEqual(Step.objects.count(), 2)
        step.refresh_from_db()
        self.assertEqual(step.question, None)

        # Save next step
        new_step = Step(assignment=self.assignment)
        self.assignment.get_root().add_sibling(
            instance=new_step, pos='last-sibling')

        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'save',
                'step_next_' + str(step.pk): new_step.pk,
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Steps updated.')
        self.assertEqual(Step.objects.count(), 3)
        step.refresh_from_db()
        self.assertEqual(step.next_step, new_step)

    def test_build_linear_assignment(self):
        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'add_step',
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'New step added.')
        self.assertEqual(Step.objects.count(), 2)

        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'add_step',
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'New step added.')
        self.assertEqual(Step.objects.count(), 3)

        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'add_step',
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'New step added.')
        self.assertEqual(Step.objects.count(), 4)

        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'add_step',
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'New step added.')
        self.assertEqual(Step.objects.count(), 5)

        r = self.client.post(
            reverse(
                'assignment_question_create',
                kwargs={'assignment_pk': self.assignment.pk}), follow=True)

        self.assertContains(r, Question.objects.last().pk)
        self.assertContains(r, 'created.')
        self.assertEqual(Question.objects.count(), 1)

        q = QuestionFactory()
        q2 = QuestionFactory()

        # Save question
        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'save',
                'step_question_' + str(Step.objects.first().pk): q.pk,
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Steps updated.')
        self.assertEqual(Step.objects.count(), 5)
        self.assertEqual(Step.objects.first().question, q)

        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'save',
                'step_question_' + str(Step.objects.all()[1].pk): q2.pk,
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Steps updated.')
        self.assertEqual(Step.objects.all()[1].question, q2)


class AssignmentStudentFlowViewTest(
        LoggedInTestStudentMixin, AssignmentMixin, TestCase):
    def test_assignment_step_view(self):
        assignment = self.setup_sample_assignment()

        first_step = assignment.get_root().get_first_child()

        r = self.client.get(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': first_step.pk
        }))

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, first_step.question.title)

    def test_assignment_step_submit_empty_action(self):
        assignment = self.setup_sample_assignment()

        first_step = assignment.get_root().get_first_child()

        r = self.client.post(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': first_step.pk
        }), {
            'action_name': '',
            'action_value': '',
        }, follow=True)

        self.assertEqual(r.status_code, 200)

    def test_assignment_step_submit_empty_assessment(self):
        assignment = self.setup_sample_assignment()

        first_step = assignment.get_root().get_first_child()

        r = self.client.post(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': first_step.pk
        }), {
            'action_name': 'line_1',
            'action_value': 'down',
        }, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Correct!')

        r = self.client.post(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': first_step.pk
        }), {
            'action_name': 'line_1',
            'action_value': 'up',
        }, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Correct!')

    def test_assignment_step_empty_submission(self):
        assignment = self.setup_sample_assignment()

        first_step = assignment.get_root().get_first_child()
        rule = first_step.question.assessmentrule_set.first()
        rule.assessment_name = 'line_1'
        rule.assessment_value = 'up'
        rule.save()

        r = self.client.post(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': first_step.pk
        }), {}, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Incorrect!')

    def test_assignment_step_submit(self):
        assignment = self.setup_sample_assignment()

        first_step = assignment.get_root().get_first_child()
        second_step = self.b1
        rule = first_step.question.assessmentrule_set.first()
        rule.assessment_name = 'line_1'
        rule.assessment_value = 'up'
        rule.save()

        rule2 = second_step.question.assessmentrule_set.first()
        rule2.assessment_name = 'line_1_label'
        rule2.assessment_value = 'Demand'
        rule2.save()

        r = self.client.post(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': first_step.pk
        }), {
            'action_name': 'line_1',
            'action_value': 'down',
        }, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Incorrect!')

        session = self.client.session
        self.assertEqual(
            session['step_{}_{}'.format(assignment.pk, first_step.pk)],
            False)

        r = self.client.post(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': first_step.pk
        }), {
            'action_name': 'line_1',
            'action_value': 'up',
        }, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Correct!')

        session = self.client.session
        self.assertEqual(
            session['step_{}_{}'.format(assignment.pk, first_step.pk)],
            True)

        r = self.client.post(reverse('step_detail', kwargs={
            'assignment_pk': assignment.pk,
            'pk': second_step.pk
        }), {
            'action_name': 'gLine1Label',
            'action_value': 'demand',
        }, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Correct!')

        session = self.client.session
        self.assertEqual(
            session['step_{}_{}'.format(assignment.pk, second_step.pk)],
            True)
