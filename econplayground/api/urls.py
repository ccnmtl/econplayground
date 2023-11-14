from django.urls import include, path
from rest_framework import routers
from econplayground.api.views import (
    AssessmentViewSet, CohortViewSet,
    GraphViewSet, SubmissionViewSet, TopicViewSet,
    EvaluationViewSet, UserAssignmentViewSet,
    QuestionEvaluationViewSet,

    QuestionViewSet, StepViewSet
)


router = routers.DefaultRouter()
router.register(r'assessments', AssessmentViewSet)
router.register(r'cohorts', CohortViewSet)
router.register(r'graphs', GraphViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'evaluations', EvaluationViewSet)
router.register(r'user_assignments', UserAssignmentViewSet)
router.register(r'question_evaluations', QuestionEvaluationViewSet)

# Used by Rubric react component in the assignment builder
router.register(r'questions', QuestionViewSet)
router.register(r'steps', StepViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
