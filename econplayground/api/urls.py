from django.conf.urls import include, url
from rest_framework import routers
from econplayground.api.views import (
    AssessmentViewSet, CohortViewSet,
    GraphViewSet, SubmissionViewSet, TopicViewSet,
)


router = routers.DefaultRouter()
router.register(r'assessments', AssessmentViewSet)
router.register(r'cohorts', CohortViewSet)
router.register(r'graphs', GraphViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'topics', TopicViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
