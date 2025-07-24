from django.urls import path

from econplayground.lti.views import (
    JSONConfigView, LtiLaunchView, MyOIDCLoginInitView,
    DynamicRegistrationView
)
from lti_tool.views import jwks


urlpatterns = [
    # django-lti
    path('.well-known/jwks.json', jwks, name='jwks'),
    path('init/<uuid:registration_uuid>/',
         MyOIDCLoginInitView.as_view(), name='oidc_init'),
    path('<uuid:registration_uuid>/config.json',
         JSONConfigView.as_view()),
    path('launch/', LtiLaunchView.as_view(), name='lti-launch'),
    path('tool_configuration', DynamicRegistrationView.as_view()),
]
