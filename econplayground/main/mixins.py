import hashlib
from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import reverse

from econplayground.main.models import (
    Cohort, Graph, Assignment, Question, QuestionBank
)
from econplayground.main.utils import user_is_instructor


def attach_cohort(view, **kwargs):
    if not hasattr(view, 'cohort'):
        cohort_pk = kwargs.get('cohort_pk', None)
        graph_pk = kwargs.get('pk', None)
        if cohort_pk:
            view.cohort = get_object_or_404(Cohort, pk=cohort_pk)
        elif hasattr(view, 'get_object'):
            view.cohort = view.get_object()
        elif graph_pk:
            graph = get_object_or_404(Graph, pk=graph_pk)
            view.cohort = graph.topic.cohort


def attach_assignment(view, **kwargs):
    if not hasattr(view, 'assignment'):
        assignment_pk = kwargs.get('assignment_pk', None)
        if assignment_pk:
            view.assignment = get_object_or_404(Assignment, pk=assignment_pk)
        elif hasattr(view, 'get_object'):
            view.assignment = view.get_object()


def attach_question_bank(view, **kwargs):
    if not hasattr(view, 'question_bank'):
        question_bank_pk = kwargs.get('question_bank_pk', None)
        if question_bank_pk:
            view.question_bank = get_object_or_404(
                QuestionBank, pk=question_bank_pk)
        elif hasattr(view, 'get_object'):
            view.question_bank = view.get_object()


def attach_question(view, **kwargs):
    if not hasattr(view, 'question'):
        question_pk = kwargs.get('question_pk', None)
        if question_pk:
            view.question = get_object_or_404(Question, pk=question_pk)
        elif hasattr(view, 'get_object'):
            view.question = view.get_object()


class CohortGraphMixin(object):
    """Find the cohort and attach it to self.cohort.

    To be used on Graph model views.
    """
    def dispatch(self, *args, **kwargs):
        if not hasattr(self, 'cohort'):
            graph_pk = kwargs.get('pk', None)
            if graph_pk:
                graph = get_object_or_404(Graph, pk=graph_pk)
                self.cohort = graph.topic.cohort

        return super(CohortGraphMixin, self).dispatch(
            self.request, *args, **kwargs)


class CohortPasswordMixin(object):
    """Require the cohort's password.

    Redirect to the cohort password page if this cohort's password
    isn't saved in the current session.

    If there's a current user who is an instructor for this cohort, don't
    redirect to the password page.
    """
    @staticmethod
    def password_match(plaintext_pass, hashed_pass2):
        hashed_pass1 = hashlib.sha224(
               plaintext_pass.strip().encode('utf-8')).hexdigest()
        return hashed_pass1 == hashed_pass2

    def dispatch(self, *args, **kwargs):
        attach_cohort(self, **kwargs)

        is_instructor = self.request.user in self.cohort.instructors.all()
        pass_idx = 'cohort_{}'.format(self.cohort.pk)

        if not is_instructor and self.cohort and self.cohort.password and (
                (pass_idx not in self.request.session) or
                not self.password_match(
                    self.cohort.password,
                    self.request.session.get(pass_idx))):
            # Password required. Redirect to password page.
            url = reverse('cohort_password', kwargs={'pk': self.cohort.pk})
            return HttpResponseRedirect(url)

        return super(CohortPasswordMixin, self).dispatch(*args, **kwargs)


class CohortInstructorMixin(object):
    """Find the cohort and attach it to self.cohort.

    Additionally, return a Forbidden error if the current user isn't
    an instructor of this cohort.
    """
    def dispatch(self, *args, **kwargs):
        if not user_is_instructor(self.request.user):
            return HttpResponseForbidden()

        attach_cohort(self, **kwargs)

        if self.request.user not in self.cohort.instructors.all():
            return HttpResponseForbidden()

        return super(CohortInstructorMixin, self).dispatch(
            self.request, *args, **kwargs)


class AssignmentInstructorMixin(object):
    """Find the assignment and attach it to self.assignment.

    Additionally, return a Forbidden error if the current user isn't
    an instructor.
    """
    def dispatch(self, *args, **kwargs):
        if not user_is_instructor(self.request.user):
            return HttpResponseForbidden()

        attach_assignment(self, **kwargs)

        return super(AssignmentInstructorMixin, self).dispatch(
            self.request, *args, **kwargs)


class QuestionBankInstructorMixin(object):
    """Find the question bank and attach it to self.question_bank.

    Additionally, return a Forbidden error if the current user isn't
    an instructor.
    """
    def dispatch(self, *args, **kwargs):
        if not user_is_instructor(self.request.user):
            return HttpResponseForbidden()

        attach_question_bank(self, **kwargs)

        return super(QuestionBankInstructorMixin, self).dispatch(
            self.request, *args, **kwargs)
