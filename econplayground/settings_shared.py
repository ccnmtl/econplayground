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
]

INSTALLED_APPS = [  # noqa
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.flatpages',
    'django.contrib.staticfiles',
    'django.contrib.messages',
    'django.contrib.admin',
    'django_statsd',
    'smoketest',
    'django_jenkins',
    'gunicorn',
    'compressor',
    'djangowind',
    'waffle',
    'django_markwhat',

    'debug_toolbar',
    'bootstrap4',
    'infranil',
    'django_extensions',
    'registration',
    'rest_framework',
    'lti_provider',
    'econplayground.main',
    'contactus',
]

CONTACT_US_EMAIL = 'ctl-econ-playground@columbia.edu'

THUMBNAIL_SUBDIR = "thumbs"
LOGIN_REDIRECT_URL = "/"

ACCOUNT_ACTIVATION_DAYS = 7

AUTHENTICATION_BACKENDS = [
    'djangowind.auth.SAMLAuthBackend',
    'django.contrib.auth.backends.ModelBackend',
    'lti_provider.auth.LTIBackend',
]

LTI_TOOL_CONFIGURATION = {
    'title': 'EconPractice',
    'description': 'Interactive economics graphs',
    'launch_url': 'lti/',
    'embed_url': '',
    'embed_icon_url': 'img/icons/icon-16.png',
    'embed_tool_id': 'econpractice',
    'navigation': True,
    'new_tab': True,
    'course_aware': False,
    'frame_width': 1024,
    'frame_height': 1024,
    'landing_url': '/',
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
                'djangowind.context.context_processor',
                'stagingcontext.staging_processor',
                'gacontext.ga_processor',
                'globalcontext.globalcontext_processor',
            ],
        },
    },
]
