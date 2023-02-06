from django import forms
from econplayground.main.models import Cohort


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

    def __init__(self, *args, **kwargs):
        r = super(AssignmentCloneForm, self).__init__(*args, **kwargs)

        return r


class QuestionBankCloneForm(forms.Form):
    title = forms.CharField()

    def __init__(self, *args, **kwargs):
        r = super(QuestionBankCloneForm, self).__init__(*args, **kwargs)

        return r


class QuestionCloneForm(forms.Form):
    title = forms.CharField()

    def __init__(self, *args, **kwargs):
        r = super(QuestionCloneForm, self).__init__(*args, **kwargs)

        return r
