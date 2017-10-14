from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
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


class GraphCreateView(EnsureCsrfCookieMixin, LoginRequiredMixin, CreateView):
    model = Graph
    fields = ['title', 'description', 'graph_type']


class GraphDetailView(LoginRequiredMixin, DetailView):
    model = Graph


class GraphEmbedView(LoginRequiredMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed.html'


class GraphListView(LoginRequiredMixin, ListView):
    model = Graph
