from django import template
from econplayground.main.utils import user_is_instructor


register = template.Library()


@register.simple_tag(name='user_is_instructor')
def tag(user):
    return user_is_instructor(user)
