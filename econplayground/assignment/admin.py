from django.contrib import admin

from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

from econplayground.assignment.models import Step, Question, AssessmentRule


class StepAdmin(TreeAdmin):
    form = movenodeform_factory(Step)


admin.site.register(Step, StepAdmin)


class AssessmentRuleInline(admin.TabularInline):
    model = AssessmentRule


class QuestionAdmin(admin.ModelAdmin):
    model = Question
    inlines = [
        AssessmentRuleInline,
    ]


admin.site.register(Question, QuestionAdmin)
