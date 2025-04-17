from django.urls import path

from econplayground.lti.views import (
    JSONConfigView, LTI1p3LaunchView, MyOIDCLoginInitView
)
from lti_tool.views import jwks


urlpatterns = [
    # django-lti
    path('.well-known/jwks.json', jwks, name='jwks'),
    path('init/<uuid:registration_uuid>/',
         MyOIDCLoginInitView.as_view(), name='oidc_init'),
    path('<uuid:registration_uuid>/config.json',
         JSONConfigView.as_view()),
    path('launch/', LTI1p3LaunchView.as_view(), name='lti-launch'),
]
