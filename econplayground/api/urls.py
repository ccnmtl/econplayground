from django.conf.urls import include, url
from rest_framework import routers
from econplayground.api.views import GraphViewSet


router = routers.DefaultRouter()
router.register(r'graphs', GraphViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
