from braces.views import CsrfExemptMixin
from braces.views._ajax import JSONResponseMixin
from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import logout as auth_logout_view, LoginView
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import ListView, DetailView, DeleteView
from django.views.generic.base import View
from django.views.generic.edit import CreateView
from djangowind.views import logout as wind_logout_view
from lti_provider.mixins import LTIAuthMixin
from lti_provider.views import LTILandingPage

from econplayground.main.models import Graph, Submission, Topic
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


class GraphCreateView(EnsureCsrfCookieMixin, UserPassesTestMixin, CreateView):
    model = Graph
    fields = ['title', 'summary', 'instructions', 'graph_type']

    def test_func(self):
        return user_is_instructor(self.request.user)


class GraphDetailView(LoginRequiredMixin, DetailView):
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


class GraphListView(LoginRequiredMixin, ListView):
    model = Graph

    def get_queryset(self):
        # First, set up graphs based on a users role
        params = self.request.GET
        if user_is_instructor(self.request.user):
            graphs = Graph.objects.all()
        else:
            graphs = Graph.objects.filter(
                needs_submit=False, is_published=True)

        # Then apply filtering based on query string params
        if len(params) == 0:
            graphs = graphs.filter(featured=True)
        elif 'topic' in params:
            tid = params.get('topic', '')
            if tid:
                graphs = graphs.filter(topic=tid).order_by('title')
        else:
            graphs = graphs.order_by('title')

        return graphs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        if user_is_instructor(self.request.user):
            graphs = Graph.objects.all()
        else:
            graphs = Graph.objects.filter(
                needs_submit=False, is_published=True)

        context['topic_list'] = Topic.objects.all()
        context['all_count'] = graphs.count()
        context['featured_count'] = graphs.filter(featured=True).count()
        context['graphs_without_topics'] = graphs.filter(topic=None)

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


class MyLTILandingPage(LTILandingPage):
    def get_context_data(self, *args, **kwargs):
        ctx = super(MyLTILandingPage, self).get_context_data(*args, **kwargs)

        submissions = Submission.objects.filter(
            user=self.request.user).order_by('-created_at')
        ctx.update({
            'submissions': submissions,
        })

        return ctx


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
            return auth_logout_view(request, "/")
