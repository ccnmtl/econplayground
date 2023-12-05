from django import template
from econplayground.assignment.models import Step

register = template.Library()


@register.simple_tag
def step_name(step_id) -> str:
    """
    TemplateTag to return a step's name attribute, with a graceful
    fallback.

    This is necessary because we don't have direct access to the Step
    object itself when rendering the tree in certain cases.
    """
    try:
        step = Step.objects.get(pk=step_id)
    except Step.DoesNotExist:
        return 'Step {}'.format(step_id)

    return step.get_name()
