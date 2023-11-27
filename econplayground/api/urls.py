from django.urls import include, path
from rest_framework import routers
from econplayground.api.views import (
    AssessmentViewSet, CohortViewSet,
    GraphViewSet, SubmissionViewSet, TopicViewSet,

    QuestionViewSet
)


router = routers.DefaultRouter()
router.register(r'assessments', AssessmentViewSet)
router.register(r'cohorts', CohortViewSet)
router.register(r'graphs', GraphViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'topics', TopicViewSet)

# Used by Rubric react component in the assignment builder
router.register(r'questions', QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
