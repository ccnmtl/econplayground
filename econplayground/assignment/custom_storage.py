from django.conf import settings
from storages.backends.s3 import S3Storage


class MediaStorage(S3Storage):
    # Bucket is publicly readable, don't need querystring_auth.
    querystring_auth = False

    def __init__(self):
        super(MediaStorage, self).__init__()
        self.bucket_name = getattr(
            settings,
            'S3_MEDIA_BUCKET_NAME', 'econpractice-media')
