from django import forms
from django.contrib import admin, messages
from django.db import models
from ordered_model.admin import OrderedModelAdmin
from django.db.models import ProtectedError
from django.urls import reverse
from django.http import HttpResponseRedirect
from econplayground.main.models import (
    Cohort, Graph, Assessment, AssessmentRule, Topic
)


class CohortAdmin(admin.ModelAdmin):
    pass


class GraphAdmin(OrderedModelAdmin):
    model = Graph
    list_display = ('title', 'move_up_down_links')
    list_filter = ('featured',)


class FeaturedGraph(Graph):
    class Meta:
        proxy = True


class FeaturedGraphAdmin(OrderedModelAdmin):
    model = FeaturedGraph
    list_display = ('title', 'move_up_down_links')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(featured=True)

    def has_add_permission(self, request):
        return False


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

    # Below prevents the default topic from being deleted
    # Its largely taken from:
    # https://stackoverflow.com/questions/49326282
    #       /django-admin-not-handling-protectederror-exception
    def delete_view(self, request, object_id, extra_context=None):
        try:
            return super().delete_view(request, object_id, extra_context=None)
        except ProtectedError:
            msg = "{} can not be deleted." \
                .format(self.model.objects.get(id=object_id).name)
            self.message_user(request, msg, messages.ERROR)
            opts = self.model._meta
            return_url = reverse(
                'admin:{}_{}_change'.format(opts.app_label, opts.model_name),
                args=(object_id,),
                current_app=self.admin_site.name,
            )
            return HttpResponseRedirect(return_url)

    def response_action(self, request, queryset):
        try:
            return super().response_action(request, queryset)
        except ProtectedError:
            msg = "This object can not be deleted."
            self.message_user(request, msg, messages.ERROR)
            opts = self.model._meta
            return_url = reverse(
                'admin:{}_{}_change'.format(opts.app_label, opts.model_name),
                current_app=self.admin_site.name,
            )
            return HttpResponseRedirect(return_url)

    def has_delete_permission(self, request, obj=None):
        return super().has_delete_permission(request, obj) and (
            not obj or obj.id != 1
        )


admin.site.register(Cohort, CohortAdmin)
admin.site.register(Graph, GraphAdmin)
admin.site.register(FeaturedGraph, FeaturedGraphAdmin)
admin.site.register(Assessment, AssessmentAdmin)
admin.site.register(Topic, TopicAdmin)
