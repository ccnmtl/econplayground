# These typing extensions can be removed when we upgrade off Python
# 3.8:
# https://docs.python.org/3/library/typing.html#typing.List
try:
    from typing import List, Tuple
except ImportError:
    from typing_extensions import List, Tuple

import re

from time import mktime
from django import forms
from django.contrib import messages
from django.contrib.auth.mixins import (
    LoginRequiredMixin, UserPassesTestMixin
)
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views import View
from django.views.generic import ListView, DetailView
from django.views.generic.edit import (
    CreateView, UpdateView, DeleteView
)
from django.shortcuts import get_object_or_404
from econplayground.assignment.utils import (
    make_rules, render_assignment_graph
)
from econplayground.main.views import EnsureCsrfCookieMixin
from econplayground.main.utils import user_is_instructor
from econplayground.assignment.models import (
    Assignment, Step, Question,
    StepResult, ScorePath, QuestionAnalysis
)
from econplayground.assignment.utils import (
    apply_default_assessment_type, update_score_path
)


class AssignmentListView(LoginRequiredMixin, ListView):
    model = Assignment
    template_name = 'assignment/assignment_list.html'

    def get_queryset(self):
        return Assignment.objects.filter(
            instructor=self.request.user
        ).order_by('created_at')


class AssignmentListStudentView(LoginRequiredMixin, ListView):
    model = Assignment
    template_name = 'assignment/assignment_list_student.html'

    def get_queryset(self):
        return Assignment.objects.filter(published=True).order_by('created_at')


class AssignmentCreateView(
        EnsureCsrfCookieMixin, UserPassesTestMixin,
        LoginRequiredMixin, CreateView):
    model = Assignment
    fields = ['title', 'prompt', 'cohorts']
    template_name = 'assignment/assignment_form.html'

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['title'].widget = forms.TextInput()
        form.fields['cohorts'].queryset = \
            self.request.user.courses_taught.all()
        return form

    def get_success_url(self):
        return reverse('assignment_list')

    def form_valid(self, form):
        title = form.cleaned_data.get('title')
        form.instance.instructor = self.request.user

        result = super(AssignmentCreateView, self).form_valid(form)

        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> assignment created.'.format(title),
            extra_tags='safe'
        )

        return result


class AssignmentDetailView(
        LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = Assignment
    template_name = 'assignment/assignment_detail.html'

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        root = self.object.get_root()
        bulk_tree = Step.dump_bulk(parent=root)
        root = bulk_tree[0]

        questions = Question.objects.order_by('created_at')
        steps = Step.objects.filter(assignment=self.object)

        last_step_id = None
        for step in steps:
            if step.is_last_step:
                last_step_id = step.pk

        ctx.update({
            'tree': root.get('children'),
            'steps': steps,
            'questions': questions,
            'last_step_id': last_step_id,
        })
        return ctx


class AssignmentDetailStudentView(LoginRequiredMixin, DetailView):
    """
    Read-only view for working through an assignment.
    """
    model = Assignment
    template_name = 'assignment/assignment_detail_student.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        score_path = None
        try:
            score_path = ScorePath.objects.get(
                assignment=self.object,
                student=self.request.user)
        except ScorePath.DoesNotExist:
            pass

        step_results = []
        if score_path:
            step_results = score_path.get_step_results()

        ctx.update({
            'step_results': step_results,
            'graph': render_assignment_graph(self.object),
        })
        return ctx


class AssignmentEmbedPublicView(DetailView):
    model = Assignment
    template_name = 'assignment/assignment_embed_public.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        score_path = None
        try:
            score_path = ScorePath.objects.get(
                assignment=self.object,
                student=self.request.user)
        except ScorePath.DoesNotExist:
            pass

        steps = []
        if score_path:
            steps = score_path.get_step_results()

        ctx.update({
            'steps': steps,
            'graph': render_assignment_graph(self.object),
        })
        return ctx


class AssignmentEmbedPublicMinimalView(DetailView):
    model = Assignment
    template_name = 'assignment/assignment_embed_public_minimal.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        root = self.object.get_root()
        bulk_tree = Step.dump_bulk(parent=root)
        root = bulk_tree[0]

        score_path = None
        try:
            score_path = ScorePath.objects.get(
                assignment=self.object,
                student=self.request.user)
        except ScorePath.DoesNotExist:
            pass

        steps = []
        if score_path:
            steps = score_path.get_step_results()

        ctx.update({
            'steps': steps,
            'graph': render_assignment_graph(self.object),
        })
        return ctx


class AssignmentTreeUpdateView(LoginRequiredMixin, UserPassesTestMixin, View):
    """
    Add and remove nodes from the assignment tree.
    """
    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_success_url(self, pk):
        return reverse('assignment_detail', kwargs={'pk': pk})

    @staticmethod
    def save_steps(request) -> None:
        """Update questions for each step in the POST"""
        for key in request.POST.keys():
            if key.startswith('step_question_'):
                match = re.search(r'\d+$', key)
                step_id = match.group()
                question_id = request.POST.get(key)

                step = Step.objects.get(pk=step_id)

                if question_id and question_id != '0':
                    step.question = Question.objects.get(pk=question_id)
                else:
                    step.question = None

                step.save()

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        tree = Assignment.objects.get(pk=pk)
        action = request.POST.get('action')

        if action == 'add_step_beginning':
            tree.add_step('first-sibling')
            messages.add_message(request, messages.SUCCESS, 'New step added.')
        elif action == 'add_step':
            tree.add_step()
            messages.add_message(request, messages.SUCCESS, 'New step added.')
        elif action == 'add_substep':
            # Add a node on a sub path.
            step_id = request.POST.get('step_id')
            tree.add_substep(step_id)
            messages.add_message(
                request, messages.SUCCESS, 'New sub-step added.')
        elif action == 'rename_step':
            step_id = request.POST.get('step_id')
            name = request.POST.get('step_name').strip()

            step = Step.objects.get(pk=step_id)
            step.name = name
            step.save()

            messages.add_message(request, messages.SUCCESS, 'Step renamed.')
        elif action == 'remove_step':
            step_id = request.POST.get('step_id')
            tree.remove_step(step_id)
            messages.add_message(request, messages.SUCCESS, 'Step removed.')
        elif action == 'save':
            AssignmentTreeUpdateView.save_steps(request)
            messages.add_message(request, messages.SUCCESS, 'Steps updated.')

        return HttpResponseRedirect(self.get_success_url(pk))


class AssignmentUpdateView(
        LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Assignment
    template_name = 'assignment/assignment_form.html'
    fields = ['title', 'published', 'prompt', 'cohorts']

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['title'].widget = forms.TextInput()
        form.fields['cohorts'].queryset = \
            self.request.user.courses_taught.all()
        return form

    def get_success_url(self):
        return reverse('assignment_detail', kwargs={'pk': self.object.pk})


class AssignmentDeleteView(
        LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Assignment
    template_name = 'assignment/assignment_confirm_delete.html'

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_success_url(self):
        return reverse('assignment_list')

    def form_valid(self, form):
        result = super().form_valid(form)

        messages.add_message(
            self.request, messages.SUCCESS,
            'Assignment deleted.')

        return result


class StepDetailView(LoginRequiredMixin, DetailView):
    model = Step
    template_name = 'assignment/step_detail.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        StepResult.objects.get_or_create(
                step=self.object, student=self.request.user)

        if self.object.question:
            QuestionAnalysis.objects.get_or_create(
                question=self.object.question,
                student=self.request.user
            )

        assignment = Assignment.objects.get(
            pk=self.kwargs.get('assignment_pk'))
        next_step = self.object.get_next()
        next_incorrect_step = self.object.get_next_intervention()
        prev_step = self.object.get_prev()

        next_url = None
        next_incorrect_url = None
        prev_url = None

        if next_step:
            next_url = reverse('step_detail', kwargs={
                'pk': next_step.pk,
                'assignment_pk': assignment.pk,
            })

        if next_incorrect_step:
            next_incorrect_url = reverse('step_detail', kwargs={
                'pk': next_incorrect_step.pk,
                'assignment_pk': assignment.pk,
            })

        if prev_step:
            prev_url = reverse('step_detail', kwargs={
                'pk': prev_step.pk,
                'assignment_pk': assignment.pk,
            })

        step_name = 'step_{}_{}'.format(
            self.object.assignment.pk, self.object.pk)
        submission = self.request.session.get(step_name)

        if self.object.question:
            multiple_choice = self.object.question.multiplechoice_set.all()
        else:
            multiple_choice = []

        ctx.update({
            'assignment': assignment,
            'next_url': next_url,
            'next_incorrect_url': next_incorrect_url,
            'prev_url': prev_url,
            'submission': submission,
            'multiple_choice': multiple_choice,
        })
        return ctx

    @staticmethod
    def append_graph_form_fields(
            request: object,
            actions: List[Tuple[str, str]],
            assessment_type: int = 0
    ) -> List[Tuple[str, str]]:
        """
        Find the filled-in form fields.
        """
        fields = []

        if assessment_type == 0:
            fields = [x for x in request.POST if x.startswith('g')]
        elif assessment_type == 1:
            fields = [
                x for x in request.POST if x.startswith('multiple_choice')
            ]

        for field in fields:
            if request.POST.get(field):
                action_name = field
                action_value = request.POST.get(field)
                actions.append((action_name, action_value))

        return actions

    def unsubmit(self, request, step):
        step_name = 'step_{}_{}'.format(step.assignment.pk, step.pk)
        del request.session[step_name]
        return HttpResponseRedirect(reverse('step_detail', kwargs={
            'assignment_pk': step.assignment.pk,
            'pk': step.pk,
        }))

    def get_avg_diff(self, curr_step: Step) -> tuple:
        """
        Return the average time difference between the student's time taken
        on Steps related to a given Question
        """
        avg = 0
        steplist = StepResult.objects.filter(
            student=self.request.user,
            step__in=Step.objects.filter(question=curr_step.question)).all()
        qty = len(steplist)
        for step in steplist:
            end = mktime(step.updated_at.timetuple())
            start = mktime(step.created_at.timetuple())
            avg += end - start
        avg = avg / qty

        return avg, qty

    def post(self, request, *args, **kwargs):
        """
        This method handles what happens when students submit their
        answer to a Question.
        """
        step = self.get_object()

        unsubmit = request.POST.get('unsubmit')

        if unsubmit == 'true':
            return self.unsubmit(request, step)

        question = step.question

        actions = []
        action_name = request.POST.get('action_name')
        action_value = request.POST.get('action_value')
        actions.append((action_name, action_value))

        actions = self.append_graph_form_fields(
            request, actions, question.assessment_type)

        if question:
            # Check all actions for a success.
            if question.assessment_type == 0:
                results = [
                    question.evaluate_action(x[0], x[1]) for x in actions if x
                ]
            elif question.assessment_type == 1:
                results = [
                    question.evaluate_multiple_choice(x[0], x[1])
                    for x in actions if x
                ]

            result = any(results)

            # Store the result in the user's session.
            step_name = 'step_{}_{}'.format(step.assignment.pk, step.pk)
            request.session[step_name] = result

            # Store the result in the StepResult model.
            step_result, _ = StepResult.objects.get_or_create(
                step=step, student=request.user)
            step_result.result = result
            step_result.save()

            # Update student's ScorePath with this result.
            update_score_path(request.user, step.assignment, step_result)

            if step.question:
                curr, _ = QuestionAnalysis.objects.get_or_create(
                    question=step.question, student=request.user)
                avg, qty = self.get_avg_diff(step)
                QuestionAnalysis.objects.filter(
                    question=step.question,
                    student=request.user
                ).update(
                    attempts=curr.attempts + 1,
                    avg_sec=avg,
                    appearances=qty,
                )

            if result:
                messages.add_message(
                    self.request, messages.SUCCESS, 'Correct!')
            else:
                messages.add_message(
                    self.request, messages.ERROR, 'Incorrect!')

        return HttpResponseRedirect(reverse('step_detail', kwargs={
            'assignment_pk': step.assignment.pk,
            'pk': step.pk,
        }))


class AssignmentQuestionListView(
        UserPassesTestMixin, LoginRequiredMixin, ListView):
    model = Question
    template_name = 'assignment/assignment_question_list.html'

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        assignment = get_object_or_404(
            Assignment, pk=self.kwargs.get('assignment_pk'))
        questions = Question.objects.order_by('title')

        ctx.update({
            'assignment': assignment,
            'questions': questions,
        })
        return ctx


class QuestionCreateView(
        EnsureCsrfCookieMixin, UserPassesTestMixin,
        LoginRequiredMixin, CreateView):
    model = Question
    fields = [
        'title', 'prompt', 'graph', 'assessment_type',
    ]

    def test_func(self):
        return user_is_instructor(self.request.user)

    def dispatch(self, *args, **kwargs):
        self.assignment_pk = kwargs.get('assignment_pk')
        return super().dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        assignment = get_object_or_404(
            Assignment, pk=self.kwargs.get('assignment_pk'))

        graphs = []
        for cohort in assignment.cohorts.all():
            graphs += cohort.get_graphs()

        ctx.update({
            'assignment': assignment,
            'graphs': graphs,
        })
        return ctx

    def post(self, request, *args, **kwargs):
        request = apply_default_assessment_type(request)

        result = super().post(request, *args, **kwargs)

        make_rules(request, self.object)

        return result

    def form_valid(self, form):
        title = form.cleaned_data.get('title')
        result = super().form_valid(form)

        if not title:
            title = self.object.pk

        question_url = reverse(
            'assignment_question_edit',
            kwargs={
                'assignment_pk': self.assignment_pk,
                'pk': self.object.pk,
            })

        messages.add_message(
            self.request, messages.SUCCESS,
            'Question <a href="{}">{}</a> created.'.format(
                question_url, title),
            extra_tags='safe'
        )

        return result

    def get_success_url(self):
        return reverse(
            'assignment_question_edit',
            kwargs={
                'assignment_pk': self.assignment_pk,
                'pk': self.object.pk,
            })


class QuestionUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Question
    fields = [
        'title', 'prompt', 'graph', 'assessment_type',
    ]

    def test_func(self):
        return user_is_instructor(self.request.user)

    def dispatch(self, *args, **kwargs):
        self.assignment_pk = kwargs.get('assignment_pk')
        return super().dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        assignment = get_object_or_404(
            Assignment, pk=self.kwargs.get('assignment_pk'))

        graphs = []
        for cohort in assignment.cohorts.all():
            graphs += cohort.get_graphs()

        ctx.update({
            'question_id': self.object.pk,
            'assignment': assignment,
            'graphs': graphs,
        })

        return ctx

    def get_success_url(self):
        return reverse(
            'assignment_question_edit',
            kwargs={
                'assignment_pk': self.assignment_pk,
                'pk': self.object.pk,
            })

    def post(self, request, *args, **kwargs):
        request = apply_default_assessment_type(request)

        result = super().post(request, *args, **kwargs)

        # Clear this question's existing rules. TODO: we could make
        # this better by updating existing rules, but this is simplest
        # for now.
        self.object.assessmentrule_set.all().delete()

        make_rules(request, self.object)

        return result

    def form_valid(self, form):
        result = super().form_valid(form)

        question_url = reverse(
            'assignment_question_edit',
            kwargs={
                'assignment_pk': self.assignment_pk,
                'pk': self.object.pk,
            })

        messages.add_message(
            self.request, messages.SUCCESS,
            'Question <a href="{}">{}</a> updated.'.format(
                question_url, self.object),
            extra_tags='safe'
        )

        return result


class QuestionDeleteView(
        LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Question

    def test_func(self):
        return user_is_instructor(self.request.user)

    def dispatch(self, *args, **kwargs):
        self.assignment_pk = kwargs.get('assignment_pk')
        return super().dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update({
            'assignment_pk': self.assignment_pk,
        })
        return ctx

    def get_success_url(self):
        return reverse(
            'assignment_question_list',
            kwargs={'assignment_pk': self.assignment_pk})


class QuestionPreview(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = Question
    template_name = 'assignment/assignment_question_preview.html'

    def test_func(self):
        return user_is_instructor(self.request.user)

    def dispatch(self, *args, **kwargs):
        self.assignment_pk = kwargs.get('assignment_pk')
        return super().dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        assignment = get_object_or_404(Assignment, pk=self.assignment_pk)

        if self.object:
            multiple_choice = self.object.multiplechoice_set.all()
        else:
            multiple_choice = []

        ctx.update({
            'assignment': assignment,
            'assignment_pk': self.kwargs.get('assignment_pk'),
            'multiple_choice': multiple_choice,
        })
        return ctx

    def get_success_url(self):
        return reverse(
            'assignment_question_preview',
            kwargs={'assignment_pk': self.assignment_pk, 'pk': self.object.pk})
