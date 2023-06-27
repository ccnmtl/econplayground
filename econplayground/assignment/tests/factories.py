import factory
from factory.django import DjangoModelFactory
from factory import fuzzy
from econplayground.assignment.models import Tree, Question
from econplayground.main.tests.factories import GraphFactory, InstructorFactory


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


class QuestionFactory(DjangoModelFactory):
    class Meta:
        model = Question

    title = fuzzy.FuzzyText()
    prompt = fuzzy.FuzzyText()
    graph = factory.SubFactory(GraphFactory)
