from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView
from econplayground.main.models import PlaygroundGraph


class IndexView(TemplateView):
    template_name = "main/index.html"


class PlaygroundGraphCreateView(LoginRequiredMixin, CreateView):
    model = PlaygroundGraph
    fields = ['title', 'description', 'data']


class PlaygroundGraphDetailView(LoginRequiredMixin, DetailView):
    model = PlaygroundGraph
