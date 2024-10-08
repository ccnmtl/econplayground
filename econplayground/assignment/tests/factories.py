import factory
from factory.django import DjangoModelFactory
from factory import fuzzy
from econplayground.assignment.models import (
    Assignment, Question, QuestionAnalysis, AssessmentRule,
    StepResult, ScorePath, MultipleChoice
)
from econplayground.main.tests.factories import (
    GraphFactory, InstructorFactory, StudentFactory
)


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


class QuestionAnalysisFactory(DjangoModelFactory):
    class Meta:
        model = QuestionAnalysis

    question = factory.SubFactory(QuestionFactory)
    student = factory.SubFactory(StudentFactory)


class MultipleChoiceFactory(DjangoModelFactory):
    class Meta:
        model = MultipleChoice

    question = factory.SubFactory(QuestionFactory)
    text = fuzzy.FuzzyText()
    correct = 0
    choices = [fuzzy.FuzzyText() for _ in range(4)]


class AssessmentRuleFactory(DjangoModelFactory):
    class Meta:
        model = AssessmentRule

    question = factory.SubFactory(QuestionFactory)
    assessment_name = fuzzy.FuzzyText()
    assessment_value = fuzzy.FuzzyText()

    feedback_fulfilled = fuzzy.FuzzyText()
    feedback_unfulfilled = fuzzy.FuzzyText()


class StepResultFactory(DjangoModelFactory):
    class Meta:
        model = StepResult
    student = factory.SubFactory(StudentFactory)


class ScorePathFactory(DjangoModelFactory):
    class Meta:
        model = ScorePath

    assignment = factory.SubFactory(AssignmentFactory)
    student = factory.SubFactory(StudentFactory)
    step_results = []


class AssignmentMixin(object):
    def setup_sample_assignment(self):
        """
        Make a sample assignment and associate some questions with it.

        Returns the new assignment.
        """
        assignment = AssignmentFactory()
        self.student = StudentFactory()

        self.a1 = assignment.add_step()
        self.b1 = assignment.add_step()
        self.c1 = assignment.add_step()
        assignment.add_step()
        assignment.add_step()

        q1 = QuestionFactory()
        AssessmentRuleFactory(
            question=q1, assessment_name='', assessment_value='')
        self.a1.question = q1
        self.a1.save()

        q2 = QuestionFactory()
        AssessmentRuleFactory(question=q2)
        self.b1.question = q2
        self.b1.save()

        q3 = QuestionFactory()
        AssessmentRuleFactory(question=q3)
        self.c1.question = q3
        self.c1.save()

        return assignment
