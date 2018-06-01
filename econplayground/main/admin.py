from django import forms
from django.contrib import admin
from django.db import models
from econplayground.main.models import Graph, Assessment, AssessmentRule


class AssessmentRuleInline(admin.TabularInline):
    model = AssessmentRule
    formfield_overrides = {
        models.TextField: {'widget': forms.TextInput()}
    }


class AssessmentAdmin(admin.ModelAdmin):
    inlines = [
        AssessmentRuleInline,
    ]


admin.site.register(Graph)
admin.site.register(Assessment, AssessmentAdmin)
