from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView
from econplayground.main.models import Graph


class IndexView(TemplateView):
    template_name = "main/index.html"


class GraphCreateView(LoginRequiredMixin, CreateView):
    model = Graph
    fields = ['title', 'description', 'graph_type']


class GraphDetailView(LoginRequiredMixin, DetailView):
    model = Graph
