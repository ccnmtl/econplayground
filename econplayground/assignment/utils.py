from graphviz import Graph
from econplayground.assignment.models import AssessmentRule, ScorePath


def make_rules(request: object, question: object) -> None:
    """
    Given a POST request, find the rule form fields and make
    AssessmentRule objects based on that, attached to the
    given Question.
    """
    assessment_type = int(request.POST.get('assessment_type', 0))

    correct_choice = None
    if assessment_type == 1:
        rule_assessment_value = request.POST.get('rule_assessment_value', None)
        if rule_assessment_value:
            correct_choice = int(rule_assessment_value)

    for i in range(10):
        if 'rule_assessment_name_{}'.format(i) not in request.POST:
            break

        feedback_fulfilled = request.POST.get(
            'rule_feedback_fulfilled_{}'.format(i), '')
        feedback_unfulfilled = request.POST.get(
            'rule_feedback_unfulfilled_{}'.format(i), '')

        assessment_value = request.POST.get(
            'rule_assessment_value_{}'.format(i))

        if assessment_type == 1:
            # Multiple choice
            assessment_value = 'false'
            if i == correct_choice:
                assessment_value = 'true'

        AssessmentRule.objects.create(
            question=question,

            assessment_name=request.POST.get(
                'rule_assessment_name_{}'.format(i)),
            assessment_value=assessment_value,

            feedback_fulfilled=feedback_fulfilled,
            media_fulfilled=request.POST.get(
                'rule_media_fulfilled_{}'.format(i)),
            feedback_unfulfilled=feedback_unfulfilled,
            media_unfulfilled=request.POST.get(
                'rule_media_unfulfilled_{}'.format(i))
        )


def render_assignment_graph(root: object) -> str:
    """
    Given an assignment's root node, render this to an SVG string
    with graphviz.
    """
    graph = Graph(format='svg',
                  node_attr={
                      'shape': 'box',
                      'fixedsize': 'true',
                      'width': '0.30',
                      'height': '0.25',
                      'rank': 'same',
                      'pin': 'true'},
                  edge_attr={
                      'arrowsize': '0.5'
                  },
                  graph_attr={
                      'rankdir': 'LR',
                  })
    steps = root.get('children')

    graph.node(str(1), style='filled', color='#0e48a1',
               shape='circle', fontcolor='white')
    for x in range(1, len(steps)):
        step = steps[x]
        graph.edge(str(x), str(x+1))

        children = step.get('children')
        with graph.subgraph(name='{}'.format(x+1)) as c:
            c.attr(rank='same')
            if children:
                c.edge(str(x+1), '{}.1'.format(x+1))
                for y in range(1, len(children)):
                    child_label = '{}.{}'.format(x+1, y+1)
                    prev_child = '{}.{}'.format(x+1, y)
                    if children[y].get('next_step'):
                        child_label = 'Q{}'.format(children[y].get('id'))
                    c.edge(prev_child, child_label)

    # Output to string
    return graph.pipe().decode('utf-8')


def apply_default_assessment_type(request: object) -> object:
    if 'assessment_type' not in request.POST:
        # Default this field to 0. Don't fail if it's not present,
        # for whatever reason.
        post_copy = request.POST.copy()
        post_copy['assessment_type'] = 0
        request.POST = post_copy

    return request


def update_score_path(
        user: object, assignment: object, step_result: object
) -> None:
    """
    Update the student's ScorePath with the given StepResult.
    """
    score_path, _ = ScorePath.objects.get_or_create(
        student=user, assignment=assignment)
    step_ids = score_path.step_ids

    step = step_result.step

    if step.pk not in step_ids:
        score_path.step_results.append(step_result.pk)
    else:
        index = step_ids.index(step.pk)
        score_path.step_results[index] = step_result.pk

    score_path.save()
