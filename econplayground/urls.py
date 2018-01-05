import os.path

from django.conf import settings
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import (
    password_change, password_change_done,
    password_reset, password_reset_done, password_reset_confirm,
    password_reset_complete)
from django.urls import include, path
from django.views.generic import TemplateView
from django.views.static import serve

from econplayground.main import views


site_media_root = os.path.join(os.path.dirname(__file__), "../media")

auth_urls = path('accounts/', include('django.contrib.auth.urls'))
if hasattr(settings, 'CAS_BASE'):
    auth_urls = path('accounts/', include('djangowind.urls'))

urlpatterns = [

    path('accounts/login/', views.LoginView.as_view()),
    path('accounts/logout/', views.LogoutView.as_view()),

    # password change & reset. overriding to gate them.
    path('accounts/password_change/',
         login_required(password_change),
         name='password_change'),
    path('accounts/password_change/done/',
         login_required(password_change_done),
         name='password_change_done'),
    path('password/reset/',
         password_reset,
         name='password_reset'),
    path('password/reset/done/', password_reset_done,
         name='password_reset_done'),
    path('password/reset/confirm/<uuid:uidb64>-<slug:token>/',
         password_reset_confirm,
         name='password_reset_confirm'),
    path('password/reset/complete/',
         password_reset_complete, name='password_reset_complete'),

    auth_urls,

    path('api/', include('econplayground.api.urls')),
    path('registration/', include('registration.backends.default.urls')),
    path('', views.GraphListView.as_view()),
    path('graph/<int:pk>/',
         views.GraphDetailView.as_view(), name='graph_detail'),
    path('graph/<int:pk>/embed/',
         views.GraphEmbedView.as_view(), name='graph_embed'),
    path('graph/<int:pk>/delete/',
         views.GraphDeleteView.as_view(), name='graph_delete'),
    path('graph/create/',
         views.GraphCreateView.as_view(),
         name='graph_create'),
    path('admin/', admin.site.urls),
    path('stats/', TemplateView.as_view(template_name="stats.html")),
    path('smoketest/', include('smoketest.urls')),
    path('infranil/', include('infranil.urls')),
    path('uploads/<path>',
         serve, {'document_root': settings.MEDIA_ROOT}),
    path('lti/landing/', views.MyLTILandingPage.as_view()),
    path('lti/', include('lti_provider.urls')),
    path('contact/', include('contactus.urls'))
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
