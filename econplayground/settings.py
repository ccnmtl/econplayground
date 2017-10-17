# flake8: noqa
from econplayground.settings_shared import *

try:
    from econplayground.local_settings import *
except ImportError:
    pass
