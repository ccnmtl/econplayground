# flake8: noqa
from econplayground.settings_shared import *

try:
    from local_settings import *
except ImportError:
    pass
