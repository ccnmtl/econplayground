# Django settings for econplayground project.
import os.path
from ccnmtlsettings.shared import common

project = 'econplayground'
base = os.path.dirname(__file__)

locals().update(common(project=project, base=base))

CAS_SERVER_URL = 'https://cas.columbia.edu/cas/'
CAS_VERSION = '3'
CAS_ADMIN_REDIRECT = False

# Translate CUIT's CAS user attributes to the Django user model.
# https://cuit.columbia.edu/content/cas-3-ticket-validation-response
CAS_APPLY_ATTRIBUTES_TO_USER = True
CAS_RENAME_ATTRIBUTES = {
    'givenName': 'first_name',
    'lastName': 'last_name',
    'mail': 'email',
}

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

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

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
    'django_cas_ng.middleware.CASMiddleware',
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
    'compressor',
    'django_cas_ng',
    'waffle',
    'django_markwhat',

    'debug_toolbar',
    'bootstrap4',
    'infranil',
    'django_extensions',

    'rest_framework',
    'lti_provider',
    'econplayground.main',
    'contactus',
    'ordered_model',
]

CONTACT_US_EMAIL = 'econpractice@columbia.edu'

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
    'allow_ta_access': False
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
                'gacontext.ga_processor',
                'globalcontext.globalcontext_processor',
            ],
        },
    },
]
