# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import viewsets
from econplayground.main.models import Graph, Submission
from econplayground.api.serializers import (
    GraphSerializer, SubmissionSerializer
)


class GraphViewSet(viewsets.ModelViewSet):
    queryset = Graph.objects.all()
    serializer_class = GraphSerializer


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def get_queryset(self):
        user = self.request.user
        return Submission.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
