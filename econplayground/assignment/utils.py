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
