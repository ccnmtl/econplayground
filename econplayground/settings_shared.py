# Django settings for econplayground project.
import os.path
from ccnmtlsettings.shared import common

project = 'econplayground'
base = os.path.dirname(__file__)

locals().update(common(project=project, base=base))


PROJECT_APPS = [
    'econplayground.main',
]

USE_TZ = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

MIDDLEWARE = [
    'django_statsd.middleware.GraphiteRequestTimingMiddleware',
    'django_statsd.middleware.GraphiteMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'waffle.middleware.WaffleMiddleware',
    'impersonate.middleware.ImpersonateMiddleware',
]

INSTALLED_APPS += [  # noqa
    'bootstrap4',
    'infranil',
    'django_extensions',
    'registration',
    'rest_framework',
    'lti_provider',
    'econplayground.main',
]


THUMBNAIL_SUBDIR = "thumbs"
LOGIN_REDIRECT_URL = "/"

ACCOUNT_ACTIVATION_DAYS = 7

AUTHENTICATION_BACKENDS = [
    'djangowind.auth.SAMLAuthBackend',
    'django.contrib.auth.backends.ModelBackend',
    'lti_provider.auth.LTIBackend',
]

LTI_TOOL_CONFIGURATION = {
    'title': 'econplayground',
    'description': 'Interactive economics graphs',
    'launch_url': 'lti/',
    'embed_url': '',
    'embed_icon_url': 'img/icons/icon-16.png',
    'embed_tool_id': 'econplayground',
    'navigation': True,
    'new_tab': True,
    'course_aware': False,
    'frame_width': 600,
    'frame_height': 620,
    'landing_url': '/',
}
