# flake8: noqa
from econplayground.settings_shared import *
from ccnmtlsettings.staging import common

locals().update(
    common(
        project=project,
        base=base,
        STATIC_ROOT=STATIC_ROOT,
        INSTALLED_APPS=INSTALLED_APPS,
# if you use cloudfront:
#        cloudfront="justtheidhere",
# if you don't use S3/cloudfront at all:
#       s3static=False,
    ))

try:
    from econplayground.local_settings import *
except ImportError:
    pass
