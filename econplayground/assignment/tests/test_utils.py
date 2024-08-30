from django.urls import reverse
from django.test import TestCase, RequestFactory
from econplayground.assignment.tests.factories import (
    AssignmentFactory, QuestionFactory
)
from econplayground.assignment.models import AssessmentRule
from econplayground.assignment.utils import make_rules


class UtilsTest(TestCase):
    def setUp(self):
        self.request_factory = RequestFactory()
        self.assignment = AssignmentFactory()
        self.question = QuestionFactory()

    def test_make_rules(self):
        """
        Test that make_rules() handles a variety of input.
        """

        request = self.request_factory.post(
            reverse(
                'assignment_question_edit',
                kwargs={
                    'assignment_pk': self.assignment.pk,
                    'pk': self.question.pk,
                }
            ), {
                'title': 'New title',
                'rule_assessment_name_0': 'rule_name',
                'rule_assessment_value_0': 'rule_value',
                'rule_feedback_fulfilled_0': '',
                'rule_media_fulfilled_0': '',
                'rule_feedback_unfulfilled_0': '',
                'rule_media_unfulfilled_0': '',
            }, follow=True)

        make_rules(request, self.question)
        self.assertEqual(AssessmentRule.objects.count(), 1)

        rule = AssessmentRule.objects.first()
        self.assertEqual(rule.question, self.question)
        self.question.assessmentrule_set.all().delete()

        request = self.request_factory.post(
            reverse(
                'assignment_question_edit',
                kwargs={
                    'assignment_pk': self.assignment.pk,
                    'pk': self.question.pk,
                }
            ), {
                # Multiple choice data with no 'correct' answer, which
                # would be specified in rule_assessment_value.
                'title': 'New title',
                'assessment_type': 1,
                'rule_assessment_name_0': 'rule_name',
                'rule_assessment_value_0': '',
                'rule_feedback_fulfilled_0': '',
                'rule_media_fulfilled_0': '',
                'rule_feedback_unfulfilled_0': '',
                'rule_media_unfulfilled_0': '',
            }, follow=True)

        make_rules(request, self.question)
        self.assertEqual(AssessmentRule.objects.count(), 1)

        rule = AssessmentRule.objects.first()
        self.assertEqual(rule.question, self.question)
