import os.path

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import logout
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve
from econplayground.main import views


site_media_root = os.path.join(os.path.dirname(__file__), "../media")

redirect_after_logout = getattr(settings, 'LOGOUT_REDIRECT_URL', None)
auth_urls = url(r'^accounts/', include('django.contrib.auth.urls'))
logout_page = url(
    r'^accounts/logout/$',
    logout,
    {'next_page': redirect_after_logout})
if hasattr(settings, 'CAS_BASE'):
    from djangowind.views import logout as windlogout
    auth_urls = url(r'^accounts/', include('djangowind.urls'))
    logout_page = url(
        r'^accounts/logout/$',
        windlogout,
        {'next_page': redirect_after_logout})

urlpatterns = [
    auth_urls,
    logout_page,
    url(r'^api/', include('econplayground.api.urls')),
    url(r'^registration/', include('registration.backends.default.urls')),
    url(r'^$', views.IndexView.as_view()),
    url(r'^graph/(?P<pk>\d+)/$',
        views.GraphDetailView.as_view()),
    url(r'^graph/create/',
        views.GraphCreateView.as_view(),
        name='graph_create'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^_impersonate/', include('impersonate.urls')),
    url(r'^stats/$', TemplateView.as_view(template_name="stats.html")),
    url(r'smoketest/', include('smoketest.urls')),
    url(r'infranil/', include('infranil.urls')),
    url(r'^uploads/(?P<path>.*)$',
        serve, {'document_root': settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
