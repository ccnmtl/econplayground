import factory
from factory.django import DjangoModelFactory
from factory import fuzzy
from econplayground.assignment.models import Assignment, Question
from econplayground.main.tests.factories import GraphFactory, InstructorFactory


class AssignmentFactory(DjangoModelFactory):
    class Meta:
        model = Assignment

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


class AssignmentMixin(object):
    def setup_sample_assignment(self):
        """
        Make a sample assignment and associate some questions with it.

        Returns the new assignment.
        """
        assignment = AssignmentFactory()

        a1 = assignment.add_step()
        b1 = assignment.add_step()
        c1 = assignment.add_step()
        assignment.add_step()
        assignment.add_step()

        q1 = QuestionFactory()
        a1.question = q1
        a1.save()

        q2 = QuestionFactory()
        b1.question = q2
        b1.save()

        q3 = QuestionFactory()
        c1.question = q3
        c1.save()

        return assignment
