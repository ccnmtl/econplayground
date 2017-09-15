# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import viewsets
from econplayground.main.models import Graph
from econplayground.api.serializers import GraphSerializer


class GraphViewSet(viewsets.ModelViewSet):
    queryset = Graph.objects.all()
    serializer_class = GraphSerializer
