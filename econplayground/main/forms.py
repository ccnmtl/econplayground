from django import forms
from econplayground.main.models import (
    Cohort, Assignment, Question, QuestionBank
)


class CohortCloneForm(forms.Form):
    title = forms.CharField()

    def __init__(self, user, *args, **kwargs):
        r = super(CohortCloneForm, self).__init__(*args, **kwargs)

        return r


class GraphCloneForm(forms.Form):
    course = forms.ModelChoiceField(Cohort.objects.none())

    def __init__(self, user, *args, **kwargs):
        r = super(GraphCloneForm, self).__init__(*args, **kwargs)

        self.fields['course'].queryset = Cohort.objects.filter(
            instructors__in=(user,))

        return r


class AssignmentCloneForm(forms.Form):
    title = forms.CharField()
    cohorts = forms.ModelChoiceField(Cohort.objects.none())

    def __init__(self, user, *args, **kwargs):
        r = super(AssignmentCloneForm, self).__init__(*args, **kwargs)

        self.fields['cohorts'].queryset = Cohort.objects.filter(
            instructors__in=(user,))

        return r


class QuestionBankForm(forms.ModelForm):
    class Meta:
        model = QuestionBank
        fields = ('title', 'assignment', 'description',
                  'questions', 'supplemental')
        widgets = {
            'title': forms.TextInput(),
        }


class QuestionBankCloneForm(forms.Form):
    title = forms.CharField()
    assignment = forms.ModelChoiceField(Assignment.objects.none())

    def __init__(self, user, *args, **kwargs):
        r = super(QuestionBankCloneForm, self).__init__(*args, **kwargs)

        self.fields['assignment'].queryset = Assignment.objects.filter(
            instructor__in=(user,))

        return r


class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = (
            'title', 'prompt', 'embedded_media', 'graph'
        )
        widgets = {
            'title': forms.TextInput(),
        }


class QuestionCloneForm(forms.Form):
    title = forms.CharField()

    def __init__(self, *args, **kwargs):
        r = super(QuestionCloneForm, self).__init__(*args, **kwargs)

        return r
