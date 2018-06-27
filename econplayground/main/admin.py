from django import forms
from django.contrib import admin
from django.db import models
from ordered_model.admin import OrderedModelAdmin
from econplayground.main.models import (
    Graph, Assessment, AssessmentRule, Topic
)


class GraphAdmin(admin.ModelAdmin):
    model = Graph
    list_display = ('title', 'topic')
    list_filter = ('topic',)


class AssessmentRuleInline(admin.TabularInline):
    model = AssessmentRule
    formfield_overrides = {
        models.TextField: {'widget': forms.TextInput()}
    }


class AssessmentAdmin(admin.ModelAdmin):
    list_filter = ('graph__assignment_type', 'graph__title')
    inlines = [
        AssessmentRuleInline,
    ]


class TopicAdmin(OrderedModelAdmin):
    list_display = ('name', 'move_up_down_links')


admin.site.register(Graph, GraphAdmin)
admin.site.register(Assessment, AssessmentAdmin)
admin.site.register(Topic, TopicAdmin)
