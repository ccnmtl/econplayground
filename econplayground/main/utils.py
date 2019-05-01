from django.conf import settings

INSTRUCTOR_LIST = ['tg2451']


def user_is_instructor(user):
    try:
        # Use INSTRUCTOR_LIST from local_settings if it exists.
        instructor_list = settings.INSTRUCTOR_LIST
    except AttributeError:
        instructor_list = INSTRUCTOR_LIST

    return (user.username in instructor_list) or user.is_staff
