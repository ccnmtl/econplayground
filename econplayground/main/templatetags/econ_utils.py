from django import template
from econplayground.main.utils import get_graph_name


register = template.Library()


@register.simple_tag(name='get_graph_name')
def tag(graph_type):
    return get_graph_name(graph_type)


@register.filter
def is_str(value):
    return isinstance(value, str)
