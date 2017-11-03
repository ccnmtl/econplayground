from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView, DetailView, DeleteView
from django.views.generic.edit import CreateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from lti_provider.mixins import LTIAuthMixin
from econplayground.main.models import Graph


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


class GraphEmbedView(EnsureCsrfCookieMixin, LTIAuthMixin,
                     LoginRequiredMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed.html'


class GraphDeleteView(UserPassesTestMixin, DeleteView):
    model = Graph
    success_url = '/'

    def test_func(self):
        return self.request.user.is_staff


class GraphListView(LoginRequiredMixin, ListView):
    model = Graph
