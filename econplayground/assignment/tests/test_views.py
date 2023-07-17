from django.test import TestCase
from django.urls import reverse
from econplayground.assignment.tests.factories import (
    AssignmentFactory, QuestionFactory
)
from econplayground.assignment.models import Step
from econplayground.main.tests.mixins import (
    LoggedInTestInstructorMixin, LoggedInTestStudentMixin
)


class AssignmentManagementViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.assignment = AssignmentFactory()

    def test_question_management(self):
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
        self.assertContains(r, 'Questions updated.')
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
        self.assertContains(r, 'Questions updated.')
        self.assertEqual(Step.objects.count(), 2)
        step.refresh_from_db()
        self.assertEqual(step.question, None)

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

        # TODO
        # r = self.client.post(
        #     reverse(
        #         'assignment_question_create',
        #         kwargs={'pk': self.assignment.pk}), follow=True)
        # self.assertEqual(Question.objects.count(), 1)

        q = QuestionFactory()
        q2 = QuestionFactory()

        # Save question
        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'save',
                'step_question_' + str(Step.objects.first().pk): q.pk,
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Questions updated.')
        self.assertEqual(Step.objects.count(), 5)
        self.assertEqual(Step.objects.first().question, q)

        r = self.client.post(
            reverse('tree_edit', kwargs={'pk': self.assignment.pk}), {
                'action': 'save',
                'step_question_' + str(Step.objects.all()[1].pk): q2.pk,
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Questions updated.')
        self.assertEqual(Step.objects.all()[1].question, q2)


class AssignmentStudentFlowViewTest(LoggedInTestStudentMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.assignment = AssignmentFactory()

    def test_complete_assignment(self):
        pass
