import os.path

from django.urls import include, path
from django.contrib import admin
from django.contrib.auth.views import logout
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve
from econplayground.main import views


site_media_root = os.path.join(os.path.dirname(__file__), "../media")

redirect_after_logout = getattr(settings, 'LOGOUT_REDIRECT_URL', None)
auth_urls = path('accounts/', include('django.contrib.auth.urls'))
logout_page = path(
    'accounts/logout/',
    logout,
    {'next_page': redirect_after_logout})
if hasattr(settings, 'CAS_BASE'):
    from djangowind.views import logout as windlogout
    auth_urls = path('accounts/', include('djangowind.urls'))
    logout_page = path(
        'accounts/logout/',
        windlogout,
        {'next_page': redirect_after_logout})

urlpatterns = [
    auth_urls,
    logout_page,
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
