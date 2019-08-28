from braces.views import CsrfExemptMixin
from braces.views._ajax import JSONResponseMixin
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.mixins import (
    LoginRequiredMixin, UserPassesTestMixin
)
from django.contrib.auth.views import (
    LogoutView as DjangoLogoutView, LoginView
)
from django.db.models import Count, Q
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import ListView, DetailView
from django.views.generic.base import View
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.shortcuts import get_object_or_404
from djangowind.views import logout as wind_logout_view
from lti_provider.mixins import LTIAuthMixin
from lti_provider.views import LTILandingPage

from econplayground.main.mixins import CohortMixin, CohortInstructorMixin
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


class GraphDetailView(LoginRequiredMixin, CohortMixin, DetailView):
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


class GraphEmbedPublicView(DetailView):
    model = Graph
    template_name = 'main/graph_embed_public.html'


class GraphEmbedPublicMinimalView(DetailView):
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


class CohortDetailView(LoginRequiredMixin, DetailView):
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
            tid = params.get('topic', '')
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
            context['active_topic'] = int(tid)

        return context


class CohortCreateView(EnsureCsrfCookieMixin, UserPassesTestMixin, CreateView):
    model = Cohort
    fields = ['title', 'description']

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
    fields = ['title',  'description']

    def get_success_url(self):
        return reverse('cohort_detail', kwargs={'pk': self.object.pk})


class CohortDeleteView(LoginRequiredMixin, CohortInstructorMixin, DeleteView):
    model = Cohort

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        cohort = get_object_or_404(Cohort, pk=pk)
        if (cohort == Cohort.objects.order_by('created_at').first()) or (
                cohort.title == 'Tom\'s Course'):
            messages.add_message(
                request, messages.INFO,
                '<strong>{}</strong> can\'t be deleted.'.format(cohort.title),
                extra_tags='safe')
            return HttpResponseRedirect(reverse('cohort_list'))

        return super(CohortDeleteView, self).delete(request, *args, **kwargs)

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> has been deleted.'.format(self.object.title),
            extra_tags='safe')

        return reverse('cohort_list')


class CohortListView(LoginRequiredMixin, ListView):
    model = Cohort

    def dispatch(self, request, *args, **kwargs):
        if not user_is_instructor(request.user):
            # Redirect students to Tom's Course for now.
            url = reverse(
                'cohort_detail',
                kwargs={
                    'pk': Cohort.objects.order_by('created_at').first().pk
                })
            return HttpResponseRedirect(url)

        return super(CohortListView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(CohortListView, self).get_context_data(**kwargs)
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


class LoginView(JSONResponseMixin, LoginView):

    def post(self, request):
        request.session.set_test_cookie()
        login_form = AuthenticationForm(request, request.POST)
        if login_form.is_valid():
            login(request, login_form.get_user())
            if request.user is not None:
                next_url = request.POST.get('next', '/')
                return self.render_json_response({'next': next_url})

        return self.render_json_response({'error': True})


class LogoutView(LoginRequiredMixin, View):

    def get(self, request):
        if hasattr(settings, 'CAS_BASE'):
            return wind_logout_view(request, next_page="/")
        else:
            return DjangoLogoutView.as_view()(request, "/")
