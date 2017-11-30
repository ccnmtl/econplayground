# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
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

    def retrieve(self, request, *args, **kwargs):
        # When querying for a single submission, interpret the
        # id as the graph id, not the submission id. This makes the
        # /api/submissions/x/ route more useful.
        graph_pk = request.parser_context.get('kwargs').get('pk')
        instance = get_object_or_404(Submission,
                                     user=self.request.user,
                                     graph=graph_pk)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        return Submission.objects.filter(user=user)

    def perform_create(self, serializer):
        if Submission.objects.filter(
                graph=serializer.validated_data.get('graph'),
                user=self.request.user).exists():
            raise ValidationError('Submission exists')

        serializer.save(user=self.request.user)
