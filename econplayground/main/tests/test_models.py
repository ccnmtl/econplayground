from django.test import TestCase
from django.db.utils import IntegrityError
from econplayground.main.models import (
    Assessment, Cohort, Graph, Topic
)
from econplayground.main.tests.factories import (
    InstructorFactory, GraphFactory,
    SubmissionFactory, TopicFactory,
    AssessmentFactory, AssessmentRuleFactory, CohortFactory
)


class GraphTest(TestCase):
    def setUp(self):
        self.x = GraphFactory()

    def test_is_valid_from_factory(self):
        self.x.full_clean()
        self.assertIsInstance(self.x.assessment, Assessment)

    def test_default_ranges(self):
        default = GraphFactory()
        self.assertEqual(default.x_axis_max, 5)
        self.assertEqual(default.x_axis_min, 0)
        self.assertEqual(default.y_axis_max, 5)
        self.assertEqual(default.y_axis_min, 0)

        basic = GraphFactory(x_axis_max=10, x_axis_min=2,
                             y_axis_max=15, y_axis_min=3)
        self.assertEqual(basic.x_axis_max, 10)
        self.assertEqual(basic.x_axis_min, 2)
        self.assertEqual(basic.y_axis_max, 15)
        self.assertEqual(basic.y_axis_min, 3)

    def test_default_grid(self):
        self.assertEqual(self.x.major_grid_type, 0)
        # self.assertEqual(self.x.minor_grid_type, 'none')

        self.x.major_grid_type = 1
        # self.x.minor_grid_type = 'line'
        self.x.save()
        self.x.refresh_from_db()

        self.assertEqual(self.x.major_grid_type, 1)
        # self.assertEqual(self.x.minor_grid_type, 'line')

        basic = GraphFactory(major_grid_type=1)  # , minor_grid_type='point')
        self.assertEqual(basic.major_grid_type, 1)
        # self.assertEqual(basic.minor_grid_type, 'point')

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

    def test_get_rule_options(self):
        rule_options = self.x.get_rule_options()
        self.assertTrue(isinstance(rule_options, dict))

        # Valid graphs
        rule_options = self.x.get_rule_options(1)
        self.assertTrue(isinstance(rule_options, dict))

        rule_options = self.x.get_rule_options(3)
        self.assertTrue(isinstance(rule_options, dict))

        # Invalid
        rule_options = self.x.get_rule_options(-1)
        self.assertTrue(
            isinstance(rule_options, dict),
            'Doesn\'t fail on invalid graph type.')

        rule_options = self.x.get_rule_options(99)
        self.assertTrue(
            isinstance(rule_options, dict),
            'Doesn\'t fail on invalid graph type.')


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

    def test_str(self):
        rule1 = AssessmentRuleFactory(name='')
        rule2 = AssessmentRuleFactory(name='line2')
        rule3 = AssessmentRuleFactory(name='a')
        rule4 = AssessmentRuleFactory(name='x_axis_label')

        self.assertEqual(
            str(rule1),
            'AssessmentRule: {} - {}'.format(rule1.name, rule1.value))
        self.assertEqual(
            str(rule2),
            'AssessmentRule: Blue line - {}'.format(rule2.value))
        self.assertEqual(
            str(rule3),
            'AssessmentRule: {} - {}'.format(rule3.name, rule3.value))
        self.assertEqual(
            str(rule4),
            'AssessmentRule: {} - {}'.format(rule4.name, rule4.value))

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
        self.assertEqual(g3.order, 0)

        # Check that when save is called on a graph whose featured val
        # has been toggled, that ordering is condensed
        self.assertEqual(Graph.objects.get(title="g4").order, 1)
        g2.featured = False
        g2.save()
        g1.refresh_from_db()
        g2.refresh_from_db()
        g3.refresh_from_db()
        g4.refresh_from_db()
        # Check order of featured = True
        self.assertEqual(g1.order, 0)
        self.assertEqual(g3.order, 0)
        # Check order of featured = False
        self.assertEqual(g4.order, 1)
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
