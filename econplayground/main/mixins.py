from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404

from econplayground.main.models import Cohort
from econplayground.main.utils import user_is_instructor


class CohortInstructorMixin(object):
    def dispatch(self, *args, **kwargs):
        if not user_is_instructor(self.request.user):
            return HttpResponseForbidden()

        pk = kwargs.get('pk', None)
        cohort = get_object_or_404(Cohort, pk=pk)

        if self.request.user not in cohort.instructors.all():
            return HttpResponseForbidden()

        return super(CohortInstructorMixin, self).dispatch(
            self.request, *args, **kwargs)
