from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404

from econplayground.main.models import Cohort, Graph
from econplayground.main.utils import user_is_instructor


class CohortMixin(object):
    """Find the cohort and attach it to self.cohort.

    First, look for the cohort id in the URL, i.e. at
    /course/<id>/etc..

    Otherwise, look for a graph id, and find the cohort based on
    that.
    """
    def dispatch(self, *args, **kwargs):
        cohort_pk = kwargs.get('cohort_pk', None)
        graph_pk = kwargs.get('pk', None)

        if cohort_pk:
            self.cohort = get_object_or_404(Cohort, pk=cohort_pk)
        elif graph_pk:
            # No cohort id in the URL! Get the cohort from the graph.
            graph = get_object_or_404(Graph, pk=graph_pk)
            self.cohort = graph.topic.cohort

        return super(CohortMixin, self).dispatch(
            self.request, *args, **kwargs)


class CohortInstructorMixin(object):
    """Find the cohort and attach it to self.cohort.

    Additionally, return a Forbidden error if the current user isn't
    an instructor of this cohort.
    """
    def dispatch(self, *args, **kwargs):
        if not user_is_instructor(self.request.user):
            return HttpResponseForbidden()

        cohort_pk = kwargs.get('cohort_pk', None)
        pk = kwargs.get('pk', None)
        if cohort_pk:
            self.cohort = get_object_or_404(Cohort, pk=cohort_pk)
        elif pk:
            self.cohort = get_object_or_404(Cohort, pk=pk)

        if self.request.user not in self.cohort.instructors.all():
            return HttpResponseForbidden()

        return super(CohortInstructorMixin, self).dispatch(
            self.request, *args, **kwargs)
