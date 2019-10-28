from django.conf import settings
from django.contrib.auth.models import Group

INSTRUCTOR_LIST = ['tg2451']


def user_is_instructor(user):
    try:
        # Use INSTRUCTOR_LIST from local_settings if it exists.
        instructor_list = settings.INSTRUCTOR_LIST
    except AttributeError:
        instructor_list = INSTRUCTOR_LIST

    try:
        instructors_group = Group.objects.get(name='instructors')
    except Group.DoesNotExist:
        instructors_group = None

    return (instructors_group and
            (instructors_group in user.groups.all())) or \
        (user.username in instructor_list) or \
        user.is_staff
