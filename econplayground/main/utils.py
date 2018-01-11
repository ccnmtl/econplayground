INSTRUCTOR_LIST = ['tg2451']


def user_is_instructor(user):
    return user.username in INSTRUCTOR_LIST or user.is_staff
