from django.conf import settings
from django.contrib.auth.models import Group
from econplayground.main.models import GRAPH_TYPES

INSTRUCTOR_LIST = ['tg2451']


def user_is_instructor(user: object) -> bool:
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


def get_graph_name(graph_type: int) -> str:
    """
    Given a graph type, return its name.
    """
    result = [x[1] for x in GRAPH_TYPES if x[0] == graph_type]

    if len(result) < 1:
        raise ValueError('graph type not found')

    return result[0]


def compare_strings(a: str, b: str) -> bool:
    """
    Compare two strings in a safe and case-insensitive way.
    """
    if hasattr(a, 'lower') and hasattr(b, 'lower'):
        return a.lower() == b.lower()

    return a == b
