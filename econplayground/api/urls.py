from django.conf.urls import include, url
from rest_framework import routers
from econplayground.api.views import (
    AssessmentViewSet, GraphViewSet, SubmissionViewSet
)


router = routers.DefaultRouter()
router.register(r'assessments', AssessmentViewSet)
router.register(r'graphs', GraphViewSet)
router.register(r'submissions', SubmissionViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
