from django.contrib import admin

from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

from econplayground.assignment.models import (
    Assignment, Step, Question, AssessmentRule, ScorePath, MultipleChoice,
    QuestionAnalysis, StepResult
)


class AssignmentAdmin(admin.ModelAdmin):
    pass


class StepAdmin(TreeAdmin):
    form = movenodeform_factory(Step)


class AssessmentRuleInline(admin.TabularInline):
    model = AssessmentRule


class MultipleChoiceAdmin(admin.ModelAdmin):
    pass


class QuestionAdmin(admin.ModelAdmin):
    model = Question
    inlines = [
        AssessmentRuleInline,
    ]


class QuestionAnalysisAdmin(admin.ModelAdmin):
    pass


class ScorePathAdmin(admin.ModelAdmin):
    pass


class StepResultAdmin(admin.ModelAdmin):
    pass


admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(MultipleChoice, MultipleChoiceAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(QuestionAnalysis, QuestionAnalysisAdmin)
admin.site.register(ScorePath, ScorePathAdmin)
admin.site.register(Step, StepAdmin)
admin.site.register(StepResult, StepResultAdmin)
