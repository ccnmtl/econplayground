import hashlib
from braces.views import CsrfExemptMixin
from django.contrib import messages
from django.contrib.auth.mixins import (
    LoginRequiredMixin, UserPassesTestMixin
)
from django.db.models import Count, Q
from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import ListView, DetailView
from django.views.generic.base import View
from django.views.generic.edit import (
    CreateView, FormView, UpdateView, DeleteView
)
from django.views.generic.detail import SingleObjectMixin
from django.shortcuts import get_object_or_404
from lti_provider.mixins import LTIAuthMixin
from lti_provider.views import LTILandingPage

from econplayground.main.forms import (
    CohortCloneForm, GraphCloneForm
)
from econplayground.main.mixins import (
    CohortGraphMixin, CohortPasswordMixin,
    CohortInstructorMixin
)
from econplayground.main.models import Cohort, Graph, Submission, Topic
from econplayground.main.utils import user_is_instructor


class EnsureCsrfCookieMixin(object):
    """
    Ensures that the CSRF cookie will be passed to the client.
    NOTE:
        This should be the left-most mixin of a view.
    """

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(EnsureCsrfCookieMixin, self).dispatch(*args, **kwargs)


class CohortGraphCreateView(
        EnsureCsrfCookieMixin, UserPassesTestMixin, CreateView):
    model = Graph
    fields = ['title', 'summary', 'instructions', 'graph_type']

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        self.cohort = get_object_or_404(Cohort, pk=pk)
        return super(CohortGraphCreateView, self).get(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        ctx = super(CohortGraphCreateView, self).get_context_data(
            *args, **kwargs)
        ctx.update({'cohort': self.cohort})
        return ctx

    def test_func(self):
        return user_is_instructor(self.request.user)


class GraphCloneDisplay(LoginRequiredMixin, CohortInstructorMixin, DetailView):
    model = Graph
    template_name = 'main/graph_clone_form.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'cohort': self.cohort,
            'form': GraphCloneForm(user=self.request.user),
        })
        return ctx


class GraphCloneFormView(LoginRequiredMixin, CohortInstructorMixin,
                         SingleObjectMixin, FormView):
    template_name = 'main/graph_clone_form.html'
    form_class = GraphCloneForm
    model = Graph

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'cohort': self.cohort,
            'form': GraphCloneForm(user=self.request.user),
        })
        return ctx

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().post(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cohort_detail', kwargs={'pk': self.cohort.pk})

    def form_valid(self, form):
        cohort_pk = int(form.data.get('course'))
        cohort = Cohort.objects.get(pk=cohort_pk)
        g_topic = cohort.get_general_topic()

        cloned = self.object.clone()

        cloned.title = self.object.title
        if cohort == self.object.topic.cohort:
            # If this graph got cloned to the same course,
            # differentiate it in the title.
            cloned.title = cloned.title + ' (clone)'

        cloned.author = self.request.user
        cloned.topic = g_topic
        cloned.is_published = False
        cloned.save()

        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> copied to <strong>{}</strong>.'.format(
                cloned.title, cohort.title),
            extra_tags='safe'
        )

        return super().form_valid(form)


# Following the pattern here:
# https://docs.djangoproject.com/en/2.2/topics/class-based-views/mixins/#an-alternative-better-solution
class GraphCloneView(LoginRequiredMixin, CohortInstructorMixin, View):
    def get(self, request, *args, **kwargs):
        view = GraphCloneDisplay.as_view()
        return view(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        view = GraphCloneFormView.as_view()
        return view(request, *args, **kwargs)


class FeaturedGraphUpdateView(
        LoginRequiredMixin, CohortInstructorMixin, UpdateView):
    model = Graph

    def get(self, request, *args, **kwargs):
        if request.GET.get('move') == 'down' or \
           request.GET.get('move') == 'up':
            graph = self.get_object()
            if request.GET.get('move') == 'down':
                graph.down()
            else:
                graph.up()

            return HttpResponseRedirect(self.get_success_url())

        return HttpResponseForbidden()

    def get_success_url(self):
        return reverse('featuredgraph_list', kwargs={
            'cohort_pk': self.cohort.pk
        })


class GraphDetailView(CohortGraphMixin, CohortPasswordMixin, DetailView):
    model = Graph

    def embed_url(self, name='graph_embed'):
        path = reverse(name, kwargs={'pk': self.object.pk})
        iframe_url = '{}://{}{}'.format(
            self.request.scheme, self.request.get_host(), path)
        return iframe_url

    @staticmethod
    def embed_code(embed_url):
        return '<iframe width="600" height="600" src="{}"></iframe>'.format(
            embed_url)

    def get_context_data(self, *args, **kwargs):
        ctx = super(GraphDetailView, self).get_context_data(*args, **kwargs)

        ctx.update({
            'cohort': self.cohort,
            'embed_url': self.embed_url('graph_embed'),
            'embed_public_code': self.embed_code(
                self.embed_url('graph_embed_public_minimal')),
        })
        return ctx

    def post(self, request, pk):
        return_url = request.POST.get('return_url', '')

        path = reverse('graph_embed', kwargs={'pk': pk})
        iframe_url = '{}://{}{}'.format(
            self.request.scheme, self.request.get_host(), path)

        url = '{}?return_type=iframe&width={}&height={}&url={}'.format(
            return_url, 640, 600, iframe_url)
        return HttpResponseRedirect(url)


class GraphEmbedView(CsrfExemptMixin, LTIAuthMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed.html'

    def post(self, request, pk=None):
        url = reverse('graph_embed', kwargs={'pk': pk})
        return HttpResponseRedirect(url)


class GraphEmbedPublicView(CohortGraphMixin, CohortPasswordMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed_public.html'


class GraphEmbedPublicMinimalView(
        CohortGraphMixin, CohortPasswordMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed_public_minimal.html'


class GraphDeleteView(UserPassesTestMixin, DeleteView):
    model = Graph
    success_url = '/'

    def test_func(self):
        return user_is_instructor(self.request.user)


class MyLTILandingPage(LTILandingPage):
    def get_context_data(self, *args, **kwargs):
        ctx = super(MyLTILandingPage, self).get_context_data(*args, **kwargs)

        submissions = Submission.objects.filter(
            user=self.request.user).order_by('-created_at')
        ctx.update({
            'submissions': submissions,
        })

        return ctx


class CohortDetailView(CohortPasswordMixin, DetailView):
    model = Cohort

    def get_graph_queryset(self):
        # First, set up graphs based on a users role
        graphs = Graph.objects.filter(
            topic__in=self.object.topic_set.all())

        if not user_is_instructor(self.request.user):
            graphs = graphs.filter(needs_submit=False, is_published=True)

        # Then apply filtering based on query string params
        params = self.request.GET
        if len(params) == 0:
            graphs = graphs.filter(featured=True)
            return graphs.order_by('order')
        elif 'topic' in params:
            tid = None

            try:
                tid = int(params.get('topic', ''))
            except ValueError:
                return graphs.order_by('title')

            if tid:
                graphs = graphs.filter(topic=tid)

        return graphs.order_by('title')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        graph_list = self.get_graph_queryset()

        if user_is_instructor(self.request.user):
            topics = self.object.topic_set.all()
            graphs = Graph.objects.filter(topic__in=topics)
        else:
            topics = self.object.topic_set.annotate(
                num_graphs=Count('graph', filter=Q(
                    graph__is_published=True)
                )).filter(num_graphs__gt=0)
            graphs = Graph.objects.filter(
                topic__in=topics,
                needs_submit=False, is_published=True)

        context['topic_list'] = topics
        context['graph_list'] = graph_list
        context['all_count'] = graphs.count()
        context['featured_count'] = graphs.filter(featured=True).count()

        # If there are no query string params, then set featured to true.
        # Set active_topic guard condition, and assign to an id if present in
        # the query string.
        params = self.request.GET
        context['featured'] = False
        context['active_topic'] = ''

        if len(params) == 0:
            context['featured'] = True
        elif 'topic' in params:
            tid = params.get('topic', '')
            try:
                context['active_topic'] = int(tid)
            except ValueError:
                pass

        return context


class CohortPasswordView(DetailView):
    model = Cohort
    template_name = 'main/cohort_password_form.html'

    def post(self, request, pk):
        cohort = self.get_object()
        user_pass = request.POST.get('password')

        if cohort.password.strip() == user_pass.strip():
            hashed_pass = hashlib.sha224(
               cohort.password.strip().encode('utf-8')).hexdigest()
            request.session['cohort_{}'.format(cohort.pk)] = hashed_pass
            url = reverse('cohort_detail', kwargs={'pk': cohort.pk})
        else:
            messages.error(
                self.request, 'Incorrect Password')
            url = reverse('cohort_password', kwargs={'pk': cohort.pk})

        return HttpResponseRedirect(url)


class CohortCreateView(EnsureCsrfCookieMixin, UserPassesTestMixin, CreateView):
    model = Cohort
    fields = ['title', 'description', 'password']

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_success_url(self):
        return '/'

    def form_valid(self, form):
        title = form.cleaned_data.get('title')
        instructor = self.request.user

        result = CreateView.form_valid(self, form)

        form.instance.instructors.add(instructor)

        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> cohort created.'.format(title),
            extra_tags='safe'
        )

        return result


class CohortUpdateView(LoginRequiredMixin, CohortInstructorMixin, UpdateView):
    model = Cohort
    fields = ['title',  'description', 'password']

    def get_success_url(self):
        return reverse('cohort_detail', kwargs={'pk': self.object.pk})


class CohortCloneDisplay(LoginRequiredMixin, CohortInstructorMixin,
                         DetailView):
    model = Cohort
    template_name = 'main/cohort_clone_form.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'form': CohortCloneForm(user=self.request.user),
        })
        return ctx


class CohortCloneFormView(LoginRequiredMixin, CohortInstructorMixin,
                          SingleObjectMixin, FormView):
    template_name = 'main/cohort_clone_form.html'
    form_class = CohortCloneForm
    model = Cohort

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'cohort': self.object,
            'form': CohortCloneForm(user=self.request.user),
        })
        return ctx

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().post(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cohort_detail', kwargs={'pk': self.object.pk})

    def form_valid(self, form):
        cloned = self.object.clone()

        cloned.title = form.data.get('title')
        cloned.instructors.add(self.request.user)
        cloned.save()

        url = reverse('cohort_detail', kwargs={'pk': cloned.pk})
        messages.add_message(
            self.request, messages.SUCCESS,
            'Course <strong><a href="{}">{}</a></strong> created.'.format(
                url, cloned.title),
            extra_tags='safe'
        )

        return super().form_valid(form)


# Following the pattern here:
# https://docs.djangoproject.com/en/2.2/topics/class-based-views/mixins/#an-alternative-better-solution
class CohortCloneView(LoginRequiredMixin, CohortInstructorMixin,
                      SingleObjectMixin, View):
    model = Cohort

    def get(self, request, *args, **kwargs):
        view = CohortCloneDisplay.as_view()
        return view(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        view = CohortCloneFormView.as_view()
        return view(request, *args, **kwargs)


class CohortListView(LoginRequiredMixin, ListView):
    model = Cohort

    def dispatch(self, request, *args, **kwargs):
        if not user_is_instructor(request.user):
            url = '/accounts/login/'
            return HttpResponseRedirect(url)

        return super(CohortListView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(CohortListView, self).get_context_data(**kwargs)

        # This area should never be reached if this user isn't an instructor,
        # but just in case.
        if not user_is_instructor(self.request.user):
            return context

        # Create a clone of the sample course if this user has no
        # courses.
        if not Cohort.objects.filter(
                instructors__in=(self.request.user,)).exists():
            try:
                sample_course = Cohort.objects.get(is_sample=True)
            except Cohort.DoesNotExist:
                sample_course = None

            if sample_course:
                cloned_sample = sample_course.clone()
                cloned_sample.instructors.clear()
                cloned_sample.instructors.add(self.request.user)

        context['cohorts'] = Cohort.objects.filter(
            instructors__in=(self.request.user,))

        return context


class TopicCreateView(LoginRequiredMixin, CohortInstructorMixin, CreateView):
    model = Topic
    fields = ['cohort', 'name']

    def get_context_data(self, **kwargs):
        ctx = super(TopicCreateView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx

    def form_valid(self, form):
        name = form.cleaned_data.get('name')

        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> created.'.format(name),
            extra_tags='safe')

        return super(TopicCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk})


class TopicListView(LoginRequiredMixin, CohortInstructorMixin, ListView):
    model = Topic

    def get_queryset(self):
        return Topic.objects.filter(cohort=self.cohort).order_by('order')

    def get_context_data(self, **kwargs):
        ctx = super(TopicListView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx


class FeaturedGraphListView(
        LoginRequiredMixin, CohortInstructorMixin, ListView):
    model = Graph
    template_name = 'main/featuredgraph_list.html'

    def get_queryset(self):
        return self.cohort.get_graphs().filter(featured=True).order_by('order')

    def get_context_data(self, **kwargs):
        ctx = super(FeaturedGraphListView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx


class TopicUpdateView(LoginRequiredMixin, CohortInstructorMixin, UpdateView):
    model = Topic
    fields = ['name']

    def get(self, request, *args, **kwargs):
        if request.GET.get('move') == 'down' or \
           request.GET.get('move') == 'up':
            topic = self.get_object()
            if request.GET.get('move') == 'down':
                topic.down()
            else:
                topic.up()

            return HttpResponseRedirect(self.get_success_url())

        return super(TopicUpdateView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super(TopicUpdateView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx

    def get_success_url(self):
        return reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk})


class TopicDeleteView(LoginRequiredMixin, CohortInstructorMixin, DeleteView):
    model = Topic

    def get_context_data(self, **kwargs):
        ctx = super(TopicDeleteView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> has been deleted.'.format(self.object.name),
            extra_tags='safe')

        return reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk})
