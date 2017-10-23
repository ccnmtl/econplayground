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
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    )
}

MIDDLEWARE_CLASSES += [  # noqa
    'django.middleware.csrf.CsrfViewMiddleware',
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

LTI_TOOL_CONFIGURATION = {
    'title': 'econplayground',
    'description': 'Interactive economics graphs',
    'launch_url': 'lti/',
    'embed_url': '',
    'embed_icon_url': '',
    'embed_tool_id': 'econplayground',
    'navigation': True,
    'new_tab': True,
    'course_aware': False,
    'landing_url': '/',
}
