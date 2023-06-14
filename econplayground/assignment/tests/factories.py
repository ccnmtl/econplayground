import factory
from factory.django import DjangoModelFactory
from factory import fuzzy
from econplayground.assignment.models import Tree
from econplayground.main.tests.factories import InstructorFactory


class TreeFactory(DjangoModelFactory):
    class Meta:
        model = Tree

    title = fuzzy.FuzzyText()
    instructor = factory.SubFactory(InstructorFactory)

    @factory.post_generation
    def cohorts(self, create, extracted):
        if not create:
            return

        if extracted:
            for cohort in extracted:
                self.cohorts.add(cohort)
