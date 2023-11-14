# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import messages
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from econplayground.api.permissions import IsInstructor
from econplayground.main.models import (
    Assessment, Cohort, Graph, Submission, Topic, Evaluation,
    UserAssignment, QuestionEvaluation
)
from econplayground.assignment.models import Question, Step
from econplayground.api.serializers import (
    AssessmentSerializer, CohortSerializer, GraphSerializer,
    SubmissionSerializer, TopicSerializer,
    EvaluationSerializer, UserAssignmentSerializer,
    QuestionEvaluationSerializer,

    QuestionSerializer, StepSerializer
)


class AssessmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

    def retrieve(self, request, *args, **kwargs):
        # When querying for a single assessment, interpret the
        # id as the graph id, not the assessment id. This makes the
        # /api/assessments/x/ route more useful.
        graph_pk = request.parser_context.get('kwargs').get('pk')
        instance = get_object_or_404(Assessment, graph=graph_pk)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class GraphViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Graph.objects.all()
    serializer_class = GraphSerializer

    def create(self, request):
        r = super(GraphViewSet, self).create(request)
        if r:
            messages.success(
                request,
                'Graph "{}" created.'.format(r.data.get('title')))

        return r


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


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


class CohortViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cohort.objects.all()
    serializer_class = CohortSerializer

    def get_queryset(self):
        user = self.request.user
        return Cohort.objects.filter(instructors__in=(user,))


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    def get_queryset(self):
        qId = self.request.query_params.get('qId')
        question = Question.objects.get(id=qId)
        return self.queryset.filter(question=question)


class UserAssignmentViewSet(viewsets.ModelViewSet):
    queryset = UserAssignment.objects.all()
    serializer_class = UserAssignmentSerializer

    def get_queryset(self):
        id = self.request.query_params.get('id')
        return UserAssignment.objects.get(id=id)


class QuestionEvaluationViewSet(viewsets.ModelViewSet):
    queryset = QuestionEvaluation.objects.all()
    serializer_class = QuestionEvaluationSerializer


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = (IsInstructor,)


class StepViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Step.objects.all()
    serializer_class = StepSerializer
    permission_classes = (IsInstructor,)
