from graphviz import Graph
from econplayground.assignment.models import AssessmentRule


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

        feedback_fulfilled = request.POST.get(
            'rule_feedback_fulfilled_{}'.format(i), '')
        feedback_unfulfilled = request.POST.get(
            'rule_feedback_unfulfilled_{}'.format(i), '')

        AssessmentRule.objects.create(
            question=question,
            assessment_name=request.POST.get(
                'rule_assessment_name_{}'.format(i)),
            assessment_value=request.POST.get(
                'rule_assessment_value_{}'.format(i)),
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
