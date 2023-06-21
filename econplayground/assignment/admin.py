from django.contrib import admin

from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

from econplayground.assignment.models import Step


class StepAdmin(TreeAdmin):
    form = movenodeform_factory(Step)


admin.site.register(Step, StepAdmin)
