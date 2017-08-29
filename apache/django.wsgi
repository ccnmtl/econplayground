import os, sys, site

# enable the virtualenv
site.addsitedir('/var/www/econplayground/econplayground/ve/lib/python2.7/site-packages')

# paths we might need to pick up the project's settings
sys.path.append('/var/www/econplayground/econplayground/')

os.environ['DJANGO_SETTINGS_MODULE'] = 'econplayground.settings_production'

import django
django.setup()

import django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
