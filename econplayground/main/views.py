from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.views.generic import ListView, DetailView, DeleteView
from django.views.generic.edit import CreateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from lti_provider.mixins import LTIAuthMixin
from lti_provider.views import LTILandingPage
from braces.views import CsrfExemptMixin
from econplayground.main.models import Graph, Submission


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
    fields = ['title', 'description', 'graph_type']

    def test_func(self):
        return self.request.user.is_staff


class GraphDetailView(LoginRequiredMixin, DetailView):
    model = Graph

    def embed_url(self):
        path = reverse('graph_embed', kwargs={'pk': self.object.pk})
        iframe_url = '{}://{}{}'.format(
            self.request.scheme, self.request.get_host(), path)
        return iframe_url

    def get_context_data(self, *args, **kwargs):
        ctx = super(GraphDetailView, self).get_context_data(*args, **kwargs)

        ctx.update({
            'embed_url': self.embed_url()
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


class GraphDeleteView(UserPassesTestMixin, DeleteView):
    model = Graph
    success_url = '/'

    def test_func(self):
        return self.request.user.is_staff


class GraphListView(LoginRequiredMixin, ListView):
    model = Graph

    def get_queryset(self):
        if self.request.user.is_staff:
            return Graph.objects.all()

        return Graph.objects.filter(needs_submit=False, is_published=True)


class MyLTILandingPage(LTILandingPage):
    def get_context_data(self, *args, **kwargs):
        ctx = super(MyLTILandingPage, self).get_context_data(*args, **kwargs)

        submissions = Submission.objects.filter(
            user=self.request.user).order_by('-created_at')
        ctx.update({
            'submissions': submissions,
        })

        return ctx
