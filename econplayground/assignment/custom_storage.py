from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    location = 'uploads'

    def __init__(self):
        super(MediaStorage, self).__init__()
        self.bucket_name = getattr(
            settings,
            'S3_MEDIA_BUCKET_NAME', 'econpractice-media')
