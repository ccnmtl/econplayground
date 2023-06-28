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
from econplayground.assignment.models import Tree, Step, Question


class AssignmentListView(LoginRequiredMixin, ListView):
    model = Tree
    template_name = 'assignment/assignment_list.html'

    def get_queryset(self):
        return Tree.objects.filter(
            instructor=self.request.user
        ).order_by('created_at')


class AssignmentCreateView(
        EnsureCsrfCookieMixin, UserPassesTestMixin,
        LoginRequiredMixin, CreateView):
    model = Tree
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
        return reverse('assignment_assignment_list')

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
    model = Tree
    template_name = 'assignment/assignment_detail.html'

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        root = self.object.get_root()
        bulk_tree = Step.dump_bulk(parent=root)
        root = bulk_tree[0]

        ctx.update({
            'tree': root.get('children'),
            'questions': Question.objects.all(),
        })
        return ctx


class TreeUpdateView(LoginRequiredMixin, UserPassesTestMixin, View):
    """
    Add and remove nodes from the assignment tree.
    """
    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_success_url(self, pk):
        return reverse('assignment_assignment_detail', kwargs={'pk': pk})

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        tree = Tree.objects.get(pk=pk)
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

        return HttpResponseRedirect(self.get_success_url(pk))


class AssignmentUpdateView(
        LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Tree
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
        return reverse('assignment_assignment_detail',
                       kwargs={'pk': self.object.pk})


class AssignmentDeleteView(
        LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Tree
    template_name = 'assignment/assignment_delete.html'

    def test_func(self):
        return user_is_instructor(self.request.user)


class AssignmentStepDetailView(LoginRequiredMixin, DetailView):
    model = Step
    template_name = 'assignment/step_detail.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        assignment = Tree.objects.get(pk=self.kwargs.get('assignment_pk'))
        next_step = self.object.get_next()
        prev_step = self.object.get_prev()

        next_url = None
        prev_url = None

        if next_step:
            next_url = reverse('step_detail', kwargs={
                'pk': next_step.pk,
                'assignment_pk': assignment.pk,
            })

        if prev_step:
            prev_url = reverse('step_detail', kwargs={
                'pk': prev_step.pk,
                'assignment_pk': assignment.pk,
            })

        ctx.update({
            'assignment': assignment,
            'next_url': next_url,
            'prev_url': prev_url,
        })
        return ctx
