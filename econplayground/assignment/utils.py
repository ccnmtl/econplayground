from graphviz import Graph
from econplayground.assignment.models import AssessmentRule, MultipleChoice


def make_rules(request: object, question: object) -> None:
    """
    Given a POST request, find the rule form fields and make
    AssessmentRule objects based on that, attached to the
    given Question.
    """

    # Limit to ten rules per question, for now. Should be more
    # than enough.
    for i in range(10):
        if 'rule_assessment_name_{}'.format(i) not in request.POST:
            break

        AssessmentRule.objects.create(
            question=question,
            assessment_name=request.POST.get(
                'rule_assessment_name_{}'.format(i)),
            assessment_value=request.POST.get(
                'rule_assessment_value_{}'.format(i)),
            feedback_fulfilled=request.POST.get(
                'rule_feedback_fulfilled_{}'.format(i)),
            media_fulfilled=request.POST.get(
                'rule_media_fulfilled_{}'.format(i)),
            feedback_unfulfilled=request.POST.get(
                'rule_feedback_unfulfilled_{}'.format(i)),
            media_unfulfilled=request.POST.get(
                'rule_media_unfulfilled_{}'.format(i))
        )


def make_multiple_choice(request: object, question: object) -> None:
    """
    Given a POST request, find the multiple choice form fields and make
    MultipleChoice objects based on that, attached to the
    given Question.
    """

    # Limit to ten rules per question, for now. Should be more
    # than enough.
    for i in range(10):
        if 'mc-text-{}'.format(i) not in request.POST:
            break

        choices = []
        correct = None

        for j in range(10):
            if 'choice-text-{}-{}'.format(i, j) not in request.POST:
                break
            choices.append(request.POST.get(
                'choice-text-{}-{}'.format(i, j)))
            if request.POST.get('select-{}-{}'.format(i, j)):
                correct = j

        if correct is None:
            correct = 0

        MultipleChoice.objects.create(
            question=question,
            text=request.POST.get(
                'mc-text-{}'.format(i)),
            choices=choices,
            correct=correct
        )


def render_assignment_graph(root: object) -> str:
    """
    Given an assignment's root node, render this to an SVG string
    with graphviz.
    """
    graph = Graph(format='svg')
    # graph.graph_attr['rankdir'] = 'LR'
    steps = root.get('children')

    for x in range(len(steps)):
        step = steps[x]
        print(step)

        step_label = 'Step {}'.format(step.get('id'))
        if x > 0:
            prev_step = steps[x-1]
            prev_step_label = 'Step {}'.format(prev_step.get('id'))
            graph.edge(prev_step_label, step_label)

        for substep in step.get('children'):
            substep_label = 'Sub-step {}'.format(str(substep.get('id')))
            graph.edge(step_label, substep_label)

    # Output to string
    return graph.pipe().decode('utf-8')
