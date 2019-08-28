from django.test import TestCase
from django.db.utils import IntegrityError
from econplayground.main.models import Assessment, Graph, Topic
from econplayground.main.tests.factories import (
    InstructorFactory,
    GraphFactory, JXGLineFactory, JXGLineTransformationFactory,
    SubmissionFactory, TopicFactory,
    AssessmentFactory, AssessmentRuleFactory, CohortFactory
)


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()

    def test_clone(self):
        original = GraphFactory(title='cloned graph')
        cloned = original.clone()

        self.assertNotEqual(original.pk, cloned.pk)
        self.assertEqual(original.title, 'cloned graph')
        self.assertEqual(cloned.title, 'cloned graph')

        cloned.title = 'new title'
        original.save()
        cloned.save()

        self.assertNotEqual(original.pk, cloned.pk)
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

    def test_bottom(self):
        g1 = GraphFactory(featured=True, topic=self.topic)
        g2 = GraphFactory(featured=True, topic=self.topic)
        self.assertEqual(g1.order, 0)
        self.assertEqual(g2.order, 1)

        g1.bottom()
        self.assertTrue(g1.order > g2.order)

        # Assert that new item is correctly ordered
        g3 = GraphFactory(featured=False, topic=self.topic)
        self.assertEqual(g3.order, 0)
        # Verify that the other items are still correctly ordered
        self.assertEqual(g1.order, 2)
        self.assertEqual(g2.order, 1)

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
