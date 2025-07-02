# Django settings for econplayground project.
import sys
import os
import os.path
from corsheaders.defaults import default_headers
from ctlsettings.shared import common

project = 'econplayground'
base = os.path.dirname(__file__)

locals().update(common(project=project, base=base))

PROJECT_APPS = [
    'econplayground.main',
]

if 'test' in sys.argv or 'jenkins' in sys.argv:
    # GitHub Actions needs a slightly different postgres config
    # than local dev / jenkins.
    GITHUB = os.environ.get('GITHUB')

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': project,
            'HOST': 'localhost' if GITHUB else '',
            'PORT': 5432,
            'USER': 'postgres' if GITHUB else '',
            'PASSWORD': 'postgres' if GITHUB else '',
            'ATOMIC_REQUESTS': True,
        }
    }

USE_TZ = True

REST_FRAMEWORK = {
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django_statsd.middleware.GraphiteRequestTimingMiddleware',
    'django_statsd.middleware.GraphiteMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',

    'django_cas_ng.middleware.CASMiddleware',

    'lti_tool.middleware.LtiLaunchMiddleware',

    'lti_authentication.middleware.LtiLaunchAuthenticationMiddleware',
]

INSTALLED_APPS = [  # noqa
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.flatpages',
    'django.contrib.staticfiles',
    'django.contrib.messages',
    'registration',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django_statsd',
    'smoketest',
    'gunicorn',
    'django_cas_ng',

    'debug_toolbar',
    'django_bootstrap5',
    'django_extensions',

    'rest_framework',
    'lti_provider',
    'econplayground.main',
    'econplayground.assignment',
    'contactus',
    'ordered_model',
    's3sign',
    'treebeard',
    'markdownify.apps.MarkdownifyConfig',
    'corsheaders',

    'lti_tool',

    'ctlsettings',
]

CONTACT_US_EMAIL = 'ctl-dev@columbia.edu'

CONTACTUS_SUBJECT_CHOICES = (
    ('-----', '-----'),
    ('info', 'Request more information'),
    ('requestaccount', 'Request instructor account'),
    ('bug', 'Correction or bug report'),
    ('other', 'Other (please specify)'),
)

THUMBNAIL_SUBDIR = "thumbs"
LOGIN_REDIRECT_URL = "/"

ACCOUNT_ACTIVATION_DAYS = 7

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'django_cas_ng.backends.CASBackend',

    # django-lti-provider (LTI 1.1)
    'lti_provider.auth.LTIBackend',

    # django-lti-authentication (LTI 1.3)
    'lti_authentication.backends.LtiLaunchAuthenticationBackend',
]

CSRF_TRUSTED_ORIGINS = [
    'https://*.ctl.columbia.edu',
]

LTI_TOOL_CONFIGURATION = {
    'title': 'EconPractice',
    'description': 'Interactive economics graphs',
    'launch_url': 'lti11/',
    'embed_url': '',
    'embed_icon_url': 'img/icons/icon-16.png',
    'embed_tool_id': 'econpractice',
    'navigation': True,
    'new_tab': True,
    'course_aware': False,
    'frame_width': 1024,
    'frame_height': 1024,
    'landing_url': '',
    'allow_ta_access': False
}

LTI_AUTHENTICATION = {
    'use_person_sourcedid': True,
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(base, "templates"),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',
                'stagingcontext.staging_processor',
                'ctlsettings.context_processors.env',
                'gacontext.ga_processor',
                'globalcontext.globalcontext_processor',
            ],
        },
    },
]

# https://django-markdownify.readthedocs.io/en/latest/settings.html#whitelist-tags
MARKDOWNIFY = {
    'default': {
        'WHITELIST_TAGS': [
            'a',
            'abbr',
            'acronym',
            'b',
            'blockquote',
            'em',
            'i',
            'li',
            'ol',
            'p',
            'strong',
            'ul'
        ]
    }
}

CORS_ALLOW_HEADERS = (
    *default_headers,
    'sentry-trace',
    'baggage',
)
