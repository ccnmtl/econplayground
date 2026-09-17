from django.conf import settings
from econplayground.main.models import GRAPH_TYPES

INSTRUCTOR_LIST = ['tg2451']


def user_is_instructor(user: object, course: object = None) -> bool:
    try:
        # Use INSTRUCTOR_LIST from local_settings if it exists.
        instructor_list = settings.INSTRUCTOR_LIST
    except AttributeError:
        instructor_list = INSTRUCTOR_LIST

    courses_taught = user.courses_taught.all()

    return user.is_staff or (user in instructor_list) or \
        (course in courses_taught)


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
