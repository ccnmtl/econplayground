from django import forms
from econplayground.main.models import Cohort


class GraphCloneForm(forms.Form):
    course = forms.ModelChoiceField(Cohort.objects.none())

    def __init__(self, user, *args, **kwargs):
        r = super(GraphCloneForm, self).__init__(*args, **kwargs)

        self.fields['course'].queryset = Cohort.objects.filter(
            instructors__in=(user,))

        return r
