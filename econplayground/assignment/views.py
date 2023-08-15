import re

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
from econplayground.main.views import EnsureCsrfCookieMixin
from econplayground.main.utils import user_is_instructor
from econplayground.assignment.models import Assignment, Step, Question
from econplayground.assignment.assessment import build_assessment_structure


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
        return Assignment.objects.order_by('created_at')


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
        form.fields['cohorts'].queryset = self.request.user.cohort_set.all()
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

        graphs = []
        for cohort in self.object.cohorts.all():
            graphs += cohort.get_graphs()

        steps = Step.objects.filter(assignment=self.object)

        ctx.update({
            'tree': root.get('children'),
            'questions': Question.objects.order_by('created_at'),
            'graphs': graphs,
            'steps': steps,
            'assessment_types': build_assessment_structure(),
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

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        tree = Assignment.objects.get(pk=pk)
        action = request.POST.get('action')

        if action == 'add_step':
            tree.add_step()
            messages.add_message(request, messages.SUCCESS, 'New step added.')
        if action == 'add_substep':
            # Add a node on a sub path.
            step_id = request.POST.get('step_id')
            tree.add_substep(step_id)
            messages.add_message(
                request, messages.SUCCESS, 'New sub-step added.')
        elif action == 'remove_step':
            step_id = request.POST.get('step_id')
            tree.remove_step(step_id)
            messages.add_message(request, messages.SUCCESS, 'Step removed.')
        elif action == 'save':
            # Update questions for each step in the POST
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

                elif key.startswith('step_next_'):
                    match = re.search(r'\d+$', key)
                    step_id = match.group()
                    next_step_id = request.POST.get(key)

                    step = Step.objects.get(pk=step_id)

                    if next_step_id and next_step_id != '0':
                        step.next_step = Step.objects.get(pk=next_step_id)
                    else:
                        step.next_step = None

                    step.save()

            messages.add_message(
                request, messages.SUCCESS, 'Steps updated.')

        return HttpResponseRedirect(self.get_success_url(pk))


class AssignmentUpdateView(
        LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Assignment
    template_name = 'assignment/assignment_form.html'
    fields = ['title', 'prompt', 'cohorts']

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['title'].widget = forms.TextInput()
        form.fields['cohorts'].queryset = self.request.user.cohort_set.all()
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

        ctx.update({
            'assignment': assignment,
            'next_url': next_url,
            'next_incorrect_url': next_incorrect_url,
            'prev_url': prev_url,
            'submission': submission,
        })
        return ctx

    def post(self, request, *args, **kwargs):
        step = self.get_object()

        unsubmit = request.POST.get('unsubmit')

        if unsubmit == 'true':
            step_name = 'step_{}_{}'.format(step.assignment.pk, step.pk)
            del request.session[step_name]
            return HttpResponseRedirect(reverse('step_detail', kwargs={
                'assignment_pk': step.assignment.pk,
                'pk': step.pk,
            }))

        question = step.question

        action_name = request.POST.get('action_name')
        action_value = request.POST.get('action_value')

        if question:
            result = question.evaluate_action(action_name, action_value)

            # Store the result in the user's session.
            step_name = 'step_{}_{}'.format(step.assignment.pk, step.pk)
            request.session[step_name] = result

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


class QuestionCreateView(
        EnsureCsrfCookieMixin, UserPassesTestMixin,
        LoginRequiredMixin, CreateView):
    model = Question
    fields = [
        'title', 'prompt', 'graph', 'assessment_name',
        'assessment_value',
    ]

    def test_func(self):
        return user_is_instructor(self.request.user)

    def dispatch(self, *args, **kwargs):
        self.assignment_pk = kwargs.get('assignment_pk')
        return super().dispatch(*args, **kwargs)

    def form_valid(self, form):
        title = form.cleaned_data.get('title')
        result = super().form_valid(form)

        if not title:
            title = self.object.pk

        onclick = 'selectQuestionTab({})'.format(self.object.pk)
        messages.add_message(
            self.request, messages.SUCCESS,
            'Question <a href="#" onclick="{}">{}</a> created.'.format(
                onclick, title),
            extra_tags='safe'
        )

        return result

    def get_success_url(self):
        return reverse(
            'assignment_detail', kwargs={'pk': self.assignment_pk})


class QuestionUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Question
    fields = [
        'title', 'prompt',
        'graph',
        'assessment_name', 'assessment_value',
        'feedback_fulfilled', 'feedback_unfulfilled',
    ]

    def test_func(self):
        return user_is_instructor(self.request.user)

    def dispatch(self, *args, **kwargs):
        self.assignment_pk = kwargs.get('assignment_pk')
        return super().dispatch(*args, **kwargs)

    def get_success_url(self):
        return reverse(
            'assignment_detail', kwargs={'pk': self.assignment_pk})

    def form_valid(self, form):
        result = super().form_valid(form)

        onclick = 'selectQuestionTab({})'.format(self.object.pk)
        messages.add_message(
            self.request, messages.SUCCESS,
            'Question <a href="#" onclick="{}">{}</a> updated.'.format(
                onclick, self.object.title),
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
            'assignment_detail', kwargs={'pk': self.assignment_pk})
