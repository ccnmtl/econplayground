from django.test import TestCase
from django.db.utils import IntegrityError
from econplayground.main.models import (
    Assessment, Cohort, Graph, Topic, Assignment, Question,
    QuestionBank
)
from econplayground.main.tests.factories import (
    InstructorFactory, GraphFactory, JXGLineFactory,
    JXGLineTransformationFactory, SubmissionFactory, TopicFactory,
    AssessmentFactory, AssessmentRuleFactory, CohortFactory,
    AssignmentFactory, QuestionFactory, QuestionBankFactory
)


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
        self.assertIsInstance(self.x.assessment, Assessment)

    def test_clone(self):
        original = GraphFactory(title='cloned graph')

        cloned_pk = original.clone().pk
        cloned = Graph.objects.get(pk=cloned_pk)

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned graph')
        self.assertEqual(cloned.title, 'cloned graph')

        cloned.title = 'new title'
        original.save()
        cloned.save()

        original.refresh_from_db()
        cloned.refresh_from_db()
        original.full_clean()
        cloned.full_clean()

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertNotEqual(
            cloned.assessment.pk, original.assessment.pk,
            'The clone operation clones the assessment as well.')
        self.assertIsInstance(cloned.assessment, Assessment)
        self.assertEqual(original.title, 'cloned graph')
        self.assertEqual(cloned.title, 'new title')
        self.assertEqual(original.graph_type, cloned.graph_type)
        self.assertEqual(original.author, cloned.author)
        self.assertEqual(original.topic, cloned.topic)
        self.assertEqual(original.a1, cloned.a1)
        self.assertEqual(original.a1_name, cloned.a1_name)


class JXGLineTest(TestCase):
    def setUp(self):
        self.x = JXGLineFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class JXGLineTransformationTest(TestCase):
    def setUp(self):
        self.x = JXGLineTransformationFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class SubmissionTest(TestCase):
    def setUp(self):
        self.x = SubmissionFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()


class AssessmentTest(TestCase):
    def setUp(self):
        self.x = AssessmentFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_only_one_assessment_per_graph(self):
        self.assertEqual(Assessment.objects.count(), 1)
        with self.assertRaises(IntegrityError):
            AssessmentFactory(graph=self.x.graph)


class AssessmentRuleTest(TestCase):
    def setUp(self):
        self.x = AssessmentRuleFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_multiple_rules(self):
        AssessmentRuleFactory(assessment=self.x.assessment)
        AssessmentRuleFactory(assessment=self.x.assessment)
        AssessmentRuleFactory(assessment=self.x.assessment)
        AssessmentRuleFactory(assessment=self.x.assessment)

        AssessmentRuleFactory(
            name=self.x.name,
            value=self.x.value)

        with self.assertRaises(IntegrityError):
            AssessmentRuleFactory(
                assessment=self.x.assessment,
                name=self.x.name,
                value=self.x.value)


class TopicTest(TestCase):
    def setUp(self):
        self.x = TopicFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_can_delete_topics(self):
        # Verify that Topic.delete() still works
        cohort = CohortFactory()
        t = Topic.objects.create(name='Topic', order=2, cohort=cohort)
        t.delete()

    def test_can_delete_topics_qs(self):
        # Verify that the QuerySet delete method still works
        cohort = CohortFactory()
        Topic.objects.create(name='topic 1', order=2, cohort=cohort)
        Topic.objects.create(name='Topic 2', order=3, cohort=cohort)
        Topic.objects.all().delete()


class GraphOrderTest(TestCase):
    def setUp(self):
        super(GraphOrderTest, self).setUp()
        self.topic = TopicFactory()

    def test_save_ordering(self):
        # Assert that newly created items are placed in the
        # expected order
        g1 = GraphFactory(title="g1", featured=True, topic=self.topic)
        g2 = GraphFactory(title="g2", featured=True, topic=self.topic)
        self.assertEqual(g1.order, 0)
        self.assertEqual(g2.order, 1)

        # Assert that an existing item is ordered correctly
        # when featured is toggled
        g3 = GraphFactory(title="g3", featured=False, topic=self.topic)
        g4 = GraphFactory(title="g4", featured=False, topic=self.topic)
        self.assertEqual(g3.order, 0)
        self.assertEqual(g4.order, 1)
        # Verify that the other items are still correctly ordered
        self.assertEqual(g1.order, 0)
        self.assertEqual(g2.order, 1)
        g3.featured = True
        g3.save()
        g1.refresh_from_db()
        g2.refresh_from_db()
        g3.refresh_from_db()
        g4.refresh_from_db()
        self.assertEqual(g1.order, 0)
        self.assertEqual(g2.order, 1)
        self.assertEqual(g3.order, 2)

        # Check that when save is called on a graph whose featured val
        # has been toggled, that ordering is condensed
        self.assertEqual(Graph.objects.get(title="g4").order, 0)
        g2.featured = False
        g2.save()
        g1.refresh_from_db()
        g2.refresh_from_db()
        g3.refresh_from_db()
        g4.refresh_from_db()
        # Check order of featured = True
        self.assertEqual(g1.order, 0)
        self.assertEqual(g3.order, 1)
        # Check order of featured = False
        self.assertEqual(g4.order, 0)
        self.assertEqual(g2.order, 1)


class CohortTest(TestCase):
    def setUp(self):
        self.instructor = InstructorFactory()
        self.x = CohortFactory(instructors=(self.instructor,))

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_clone(self):
        GraphFactory(topic=self.x.get_general_topic())
        GraphFactory(topic=self.x.get_general_topic())

        self.assertEqual(Graph.objects.count(), 2)
        self.assertEqual(Topic.objects.count(), 2)
        self.assertEqual(Cohort.objects.count(), 2)
        self.assertEqual(self.x.graph_count(), 2)
        cloned = self.x.clone()
        self.assertNotEqual(cloned.pk, self.x.pk)
        self.assertEqual(cloned.graph_count(), 2)
        self.assertEqual(Graph.objects.count(), 4)
        self.assertEqual(Topic.objects.count(), 3)
        self.assertEqual(Cohort.objects.count(), 3)

        # Test that cloning the sample course works too.
        sample = CohortFactory(is_sample=True)
        cloned = sample.clone()
        self.assertNotEqual(cloned.pk, sample.pk)
        self.assertFalse(cloned.is_sample)
        self.assertEqual(cloned.graph_count(), 0)
        self.assertEqual(Graph.objects.count(), 4)
        self.assertEqual(Topic.objects.count(), 5)
        self.assertEqual(Cohort.objects.count(), 5)


class QuestionTest(TestCase):
    def setUp(self):
        self.instructor = InstructorFactory()
        self.x = QuestionFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_clone(self):
        original = QuestionFactory(title='cloned question')

        cloned_pk = original.clone().pk
        cloned = Question.objects.get(pk=cloned_pk)

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned question')
        self.assertEqual(cloned.title, 'cloned question_copy')

        cloned.title = 'new title'
        original.save()
        cloned.save()

        original.refresh_from_db()
        cloned.refresh_from_db()
        original.full_clean()
        cloned.full_clean()

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned question')
        self.assertEqual(cloned.title, 'new title')
        self.assertEqual(original.embedded_media, cloned.embedded_media)
        self.assertEqual(original.graph, cloned.graph)
        self.assertEqual(original.prompt, cloned.prompt)


class QuestionBankTest(TestCase):
    def setUp(self):
        self.question = QuestionFactory(title='q1')
        self.supplement = QuestionBankFactory(
            assignment=AssignmentFactory(cohorts=(CohortFactory(),)),
            title='supplemental')
        self.x = QuestionBankFactory(
            assignment=AssignmentFactory(cohorts=(CohortFactory(),)),
            questions=(self.question,),
            supplemental=(self.supplement,))

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_clone(self):
        original = QuestionBankFactory(
            title='cloned question_bank',
            adaptive=True,
            assignment=AssignmentFactory(cohorts=(CohortFactory(),)),
            ap_correct=QuestionBankFactory(
                assignment=AssignmentFactory(cohorts=(CohortFactory(),)),
                title='correct'),
            ap_incorrect=QuestionBankFactory(
                assignment=AssignmentFactory(cohorts=(CohortFactory(),)),
                title='incorrect'),
            supplemental=QuestionBankFactory(
                assignment=AssignmentFactory(cohorts=(CohortFactory(),)),
                title='supplemental'),
        )

        cloned_pk = original.clone(AssignmentFactory(
            cohorts=(CohortFactory(),)).pk).pk
        cloned = QuestionBank.objects.get(pk=cloned_pk)

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned question_bank')
        self.assertEqual(cloned.title, 'cloned question_bank')

        cloned.title = 'new title'
        original.save()
        cloned.save()

        original.refresh_from_db()
        cloned.refresh_from_db()
        original.full_clean()
        cloned.full_clean()

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned question_bank')
        self.assertEqual(cloned.title, 'new title')
        self.assertNotEqual(cloned.assignment, original.assignment)
        self.assertEqual(cloned.adaptive, False)
        self.assertEqual(cloned.ap_correct, None)
        self.assertEqual(cloned.ap_incorrect, None)
        self.assertEqual(list(cloned.supplemental.all()), [])


class AssignmentTest(TestCase):
    def setUp(self):
        self.cohort = CohortFactory()
        self.x = AssignmentFactory(cohorts=(self.cohort,))

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_clone(self):
        original = AssignmentFactory(title='cloned assignment')

        cloned_pk = original.clone().pk
        cloned = Assignment.objects.get(pk=cloned_pk)

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned assignment')
        self.assertEqual(cloned.title, 'cloned assignment_copy')

        cloned.title = 'new title'
        original.save()
        cloned.save()

        original.refresh_from_db()
        cloned.refresh_from_db()
        original.full_clean()
        cloned.full_clean()

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned assignment')
        self.assertEqual(cloned.title, 'new title')
