from django import template
from econplayground.assignment.models import Step

register = template.Library()


@register.simple_tag
def step_name(step_id: int, step_index: int) -> str:
    """
    TemplateTag to return a step's name attribute, with a graceful
    fallback.

    Default to using the step's index, i.e. position in the
    assignment.
    """
    step = None
    name = 'Step {}'.format(step_index)

    try:
        step = Step.objects.get(pk=step_id)
    except Step.DoesNotExist:
        pass

    if step:
        my_step_name = step.get_name()
        if my_step_name:
            name = my_step_name

    return name
