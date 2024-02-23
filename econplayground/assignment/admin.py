from django.contrib import admin

from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

from econplayground.main.models import User, Graph

from econplayground.assignment.models import (
    Assignment, Step, Question, AssessmentRule, ScorePath, QuestionAnalysis,
    StepResult
)


class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'published', 'view_instructor')

    @admin.display(description='instructor')
    def view_instructor(self, obj):
        instructor = User.objects.get(id=obj.instructor_id)
        return instructor.username + ' ({})'.format(obj.instructor_id)


class StepAdmin(TreeAdmin):
    form = movenodeform_factory(Step)
    list_display = ('get_name', 'view_assignment', 'id', 'question_title')

    @admin.display(description='assignment')
    def view_assignment(self, obj):
        assignment = Assignment.objects.get(id=obj.assignment_id)
        return assignment.title + ' ({})'.format(obj.assignment_id)

    @admin.display(description='name')
    def get_name(self, obj):
        name = ''
        if obj.name:
            name = obj.name + ' ({})'.format(obj.id)
        else:
            name = 'Step {}'.format(obj.id)
        if obj.is_root_node:
            name += ' (root)'
        return name

    @admin.display(description='question')
    def question_title(self, obj):
        question = Question.objects.get(id=obj.question_id)
        return question.title + ' ({})'.format(obj.question_id)


class AssessmentRuleInline(admin.TabularInline):
    model = AssessmentRule


class QuestionAdmin(admin.ModelAdmin):
    model = Question
    list_display = ('title', 'view_graph')
    inlines = [
        AssessmentRuleInline,
    ]

    @admin.display(description='graph')
    def view_graph(self, obj):
        if obj.graph is None:
            return '-'
        graph = Graph.objects.get(id=obj.graph_id)
        return graph.title + ' ({})'.format(obj.id)


class QuestionAnalysisAdmin(admin.ModelAdmin):
    pass


class ScorePathAdmin(admin.ModelAdmin):
    pass


class StepResultAdmin(admin.ModelAdmin):
    list_display = ('view_step_user', 'view_assignment', 'get_step', 'result')

    @admin.display(description='step / user')
    def view_step_user(self, obj):
        step = Step.objects.get(id=obj.step_id)
        user = User.objects.get(id=obj.student_id)
        label = ''
        if step.name is None:
            label = 'Step {}'.format(step.id)
        else:
            label = step.name + ' ({})'.format(step.id)
        return label + ' / ' + user.username + ' ({})'.format(obj.student_id)

    @admin.display(description='username')
    def view_username(self, obj):
        user = User.objects.get(id=obj.student_id)
        return user.username + ' ({})'.format(obj.student_id)

    @admin.display(description='step')
    def get_step(self, obj):
        step = Step.objects.get(id=obj.step_id)
        if step.name is None:
            return obj.step_id
        return step.name + ' ({})'.format(obj.step_id)

    @admin.display(description='assignment')
    def view_assignment(self, obj):
        assignment = Assignment.objects.get(
            id=Step.objects.get(id=obj.step_id).assignment_id)
        return assignment.title + ' ({})'.format(assignment.id)


admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(QuestionAnalysis, QuestionAnalysisAdmin)
admin.site.register(ScorePath, ScorePathAdmin)
admin.site.register(Step, StepAdmin)
admin.site.register(StepResult, StepResultAdmin)
