import os
from econplayground.settings_shared import *  # noqa: F401,F403


# docker-compose db container
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_NAME'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': 'db',
        'PORT': 5432,
    }
}


try:
    from econplayground.local_settings import *  # noqa: F401,F403
except ImportError:
    pass
