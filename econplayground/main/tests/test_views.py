from django.test import TestCase, RequestFactory
from django.urls import reverse
from econplayground.main.views import MyLTILandingPage, CohortCreateView
from econplayground.main.tests.factories import (
    CohortFactory, GraphFactory, SubmissionFactory, TopicFactory
)
from econplayground.main.tests.mixins import (
    LoggedInTestMixin, LoggedInTestInstructorMixin, LoggedInTestStudentMixin
)
from econplayground.main.models import Cohort, Graph, Topic


class BasicTest(TestCase):
    def test_root(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 302)

    def test_smoketest(self):
        response = self.client.get("/smoketest/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "PASS")


class GraphDetailViewTest(LoggedInTestMixin, TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get(reverse('graph_detail', kwargs={'pk': g.pk}))
        self.assertEqual(r.status_code, 200)

        r = self.client.get(
            reverse('cohort_graph_detail', kwargs={
                'cohort_pk': g.topic.cohort.pk,
                'pk': g.pk,
            }))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)


class CloneGraphUnauthorizedViewTest(LoggedInTestMixin, TestCase):
    def test_get(self):
        g = GraphFactory()

        self.assertEqual(Graph.objects.count(), 1)

        r = self.client.get(
            reverse('cohort_graph_clone', kwargs={
                'cohort_pk': g.topic.cohort.pk,
                'pk': g.pk
            }))
        self.assertEqual(r.status_code, 403)

        r = self.client.post(
            reverse('cohort_graph_clone', kwargs={
                'cohort_pk': g.topic.cohort.pk,
                'pk': g.pk,
            }))
        self.assertEqual(r.status_code, 403)

        self.assertEqual(Graph.objects.count(), 1)


class CloneGraphViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)
        TopicFactory(cohort=self.cohort)
        TopicFactory(cohort=self.cohort)
        self.topic = self.cohort.get_general_topic()

    def test_clone(self):
        g = GraphFactory(topic=self.topic)

        self.assertEqual(Graph.objects.count(), 1)

        r = self.client.get(
            reverse('cohort_graph_clone', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': g.pk
            }))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Cloning <strong>{}</strong>'.format(g.title))

        # Clone it to this cohort.
        r = self.client.post(
            reverse('cohort_graph_clone', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': g.pk,
            }), {
                'course': self.cohort.pk
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)
        self.assertContains(r, 'copied to')
        self.assertContains(r, self.cohort.title)

        new_graph = Graph.objects.filter(
            topic=self.topic,
            title='{} (clone)'.format(g.title)).first()

        self.assertEqual(new_graph.title, g.title + ' (clone)')
        self.assertEqual(new_graph.topic, self.topic)
        self.assertEqual(new_graph.author, self.u)

        self.assertEqual(Graph.objects.count(), 2)

        # Clone it to a new cohort.
        new_cohort = CohortFactory()
        new_cohort.instructors.add(self.u)
        new_topic = new_cohort.get_general_topic()

        r = self.client.post(
            reverse('cohort_graph_clone', kwargs={
                'cohort_pk': new_cohort.pk,
                'pk': g.pk,
            }), {
                'course': new_cohort.pk
            }, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)
        self.assertContains(r, 'copied to')
        self.assertContains(r, new_cohort.title)

        self.assertEqual(Graph.objects.count(), 3)

        new_graph = Graph.objects.filter(
            topic=new_topic,
            title=g.title).first()

        self.assertEqual(new_graph.title, g.title)
        self.assertEqual(new_graph.topic, new_topic)
        self.assertEqual(new_graph.author, self.u)


class FeaturedGraphUpdateViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(FeaturedGraphUpdateViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)
        TopicFactory(cohort=self.cohort)
        self.topic = TopicFactory(cohort=self.cohort)
        TopicFactory(cohort=self.cohort)
        TopicFactory(cohort=self.cohort)
        self.graph = GraphFactory(topic=self.topic, featured=True)
        GraphFactory(topic=self.topic, featured=True)
        GraphFactory(topic=self.topic, featured=True)
        GraphFactory(topic=self.topic, featured=False)
        GraphFactory(topic=self.topic, featured=False)

    def test_get(self):
        r = self.client.get(
            reverse('cohort_graph_edit', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.topic.pk,
            }))

        self.assertEqual(r.status_code, 403)

    def test_get_move(self):
        self.assertEqual(self.graph.order, 0)

        r = self.client.get(
            reverse('cohort_graph_edit', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.graph.pk,
            }) + '?move=down')

        self.assertEqual(r.status_code, 302)
        self.assertEqual(self.graph.order, 0)

        r = self.client.get(
            reverse('cohort_graph_edit', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.graph.pk,
            }) + '?move=up',
            follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Manage Featured Graphs')

        self.graph.refresh_from_db()

        # TODO:
        self.assertEqual(self.graph.order, 0)

    def test_get_move_unassociated(self):
        cohort = CohortFactory()
        topic = TopicFactory(cohort=cohort)
        graph = GraphFactory(topic=topic, featured=True)

        self.assertEqual(graph.order, 3)

        r = self.client.get(
            reverse('cohort_graph_edit', kwargs={
                'cohort_pk': cohort.pk,
                'pk': graph.pk,
            }) + '?move=down')

        self.assertEqual(r.status_code, 403)
        self.assertEqual(graph.order, 3)

        r = self.client.get(
            reverse('cohort_graph_edit', kwargs={
                'cohort_pk': cohort.pk,
                'pk': graph.pk,
            }) + '?move=up',
            follow=True)

        self.assertEqual(r.status_code, 403)

        graph.refresh_from_db()

        self.assertEqual(graph.order, 3)


class EmbedViewTest(LoggedInTestMixin, TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get(reverse('graph_embed', kwargs={'pk': g.pk}))
        self.assertEqual(r.status_code, 302)

        r = self.client.get(
            reverse('cohort_graph_embed', kwargs={
                'cohort_pk': g.topic.cohort.pk,
                'pk': g.pk,
            }))
        self.assertEqual(r.status_code, 302)


class EmbedViewPublicTest(LoggedInTestMixin, TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get(reverse('graph_embed_public', kwargs={'pk': g.pk}))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)

        r = self.client.get(
            reverse('cohort_graph_embed_public', kwargs={
                'cohort_pk': g.topic.cohort.pk,
                'pk': g.pk,
            }))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)


class EmbedViewPublicAnonTest(TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get(reverse('graph_embed_public', kwargs={'pk': g.pk}))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)

        r = self.client.get(
            reverse('cohort_graph_embed_public', kwargs={
                'cohort_pk': g.topic.cohort.pk,
                'pk': g.pk,
            }))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)


class CohortListInstructorViewTest(LoggedInTestInstructorMixin, TestCase):
    def test_get(self):
        cohort = CohortFactory()
        my_cohort = CohortFactory()
        my_cohort.instructors.add(self.u)

        r = self.client.get(reverse('cohort_list'))

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'My Courses')

        # Hide cohorts this instructor isn't a part of.
        self.assertNotContains(r, cohort.title)

        self.assertContains(r, 'Create a new course.')

        self.assertContains(r, my_cohort.title)
        self.assertContains(r, my_cohort.description)


class CohortListStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def test_get(self):
        CohortFactory()
        r = self.client.get(reverse('cohort_list'), follow=True)
        self.assertEqual(r.status_code, 200)

        first_course = Cohort.objects.order_by('created_at').first()
        self.assertEqual(
            r.request.get('PATH_INFO'),
            reverse('cohort_detail', kwargs={'pk': first_course.pk}),
            'Accessing cohort list page as a student '
            'redirects to first course.')

        self.assertContains(r, 'Tom&#39;s Course')


class CohortCreateViewTest(LoggedInTestInstructorMixin, TestCase):
    def test_get_success_url(self):
        url = CohortCreateView().get_success_url()
        self.assertEqual(url, '/')

    def test_create_cohort(self):
        url = reverse('cohort_create')

        instructor = self.u

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = self.client.post(url, {'title': 'Lorem Ipsum'})

        self.assertEqual(instructor.cohort_set.count(), 1)
        cohort = instructor.cohort_set.first()
        self.assertEqual(cohort.title, 'Lorem Ipsum')
        self.assertEqual(
            cohort.instructors.filter(username=self.u.username).count(),
            1)
        self.assertEqual(Topic.objects.filter(cohort=cohort).count(), 1)
        self.assertEqual(
            Topic.objects.filter(cohort=cohort).first().name, 'General')

        self.assertTrue('<strong>Lorem Ipsum</strong> cohort created'
                        in response.cookies['messages'].value)

        response = self.client.post(url, {'title': 'Course 2'})

        self.assertEqual(instructor.cohort_set.count(), 2)
        cohort = instructor.cohort_set.filter(title='Course 2').first()
        self.assertEqual(cohort.title, 'Course 2')
        self.assertEqual(
            cohort.instructors.filter(username=self.u.username).count(),
            1)
        self.assertEqual(Topic.objects.filter(cohort=cohort).count(), 1)
        self.assertEqual(
            Topic.objects.filter(cohort=cohort).first().name, 'General')

        self.assertTrue('<strong>Course 2</strong> cohort created'
                        in response.cookies['messages'].value)


class CohortCreateStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def test_create_cohort(self):
        CohortFactory()

        url = reverse('cohort_create')

        response = self.client.get(url)
        self.assertEqual(
            response.status_code, 403, 'Students can\'t create cohorts.')

        response = self.client.post(url, {'title': 'Lorem Ipsum'})

        self.assertEqual(self.u.cohort_set.count(), 0)
        self.assertFalse('messages' in response.cookies)


class CohortUpdateViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(CohortUpdateViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)

    def test_edit_cohort(self):
        url = reverse('cohort_edit', kwargs={'pk': self.cohort.pk})

        instructor = self.u

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = self.client.post(url, {'title': 'Lorem Ipsum'})

        self.assertEqual(instructor.cohort_set.count(), 1)
        cohort = instructor.cohort_set.first()
        self.assertEqual(cohort.title, 'Lorem Ipsum')
        self.assertEqual(Topic.objects.filter(cohort=cohort).count(), 1)
        self.assertEqual(
            cohort.instructors.filter(username=self.u.username).count(),
            1)
        self.assertEqual(
            Topic.objects.filter(cohort=cohort).first().name, 'General')

    def test_edit_wrong_cohort(self):
        cohort = CohortFactory()
        title = cohort.title
        url = reverse('cohort_edit', kwargs={'pk': cohort.pk})

        instructor = self.u

        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)

        response = self.client.post(url, {'title': 'Lorem Ipsum'})

        self.assertEqual(instructor.cohort_set.count(), 1)
        self.assertEqual(cohort.title, title)
        self.assertEqual(Topic.objects.filter(cohort=cohort).count(), 1)
        self.assertEqual(
            cohort.instructors.filter(username=self.u.username).count(),
            0)
        self.assertEqual(
            Topic.objects.filter(cohort=cohort).first().name, 'General')


class CohortUpdateStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def setUp(self):
        super(CohortUpdateStudentViewTest, self).setUp()
        self.cohort = CohortFactory()

    def test_edit_cohort(self):
        CohortFactory()

        url = reverse('cohort_edit', kwargs={'pk': self.cohort.pk})

        response = self.client.get(url)
        self.assertEqual(
            response.status_code, 403, 'Students can\'t edit cohorts.')

        response = self.client.post(url, {'title': 'Lorem Ipsum'})

        self.assertEqual(self.u.cohort_set.count(), 0)
        self.assertFalse('messages' in response.cookies)


class CohortDetailInstructorViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(CohortDetailInstructorViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.t1 = TopicFactory(name='Topic A', cohort=self.cohort)
        self.t2 = TopicFactory(name='Topic B', cohort=self.cohort)
        self.t3 = TopicFactory(name='Empty Topic', cohort=self.cohort)
        self.t4 = TopicFactory(
            name='Topic with unpublished graph', cohort=self.cohort)
        GraphFactory(
            title='Graph 1', is_published=True, featured=True, topic=self.t1)
        GraphFactory(
            title='Demand-Supply', is_published=True, topic=self.t1,
            featured=True)
        GraphFactory(title='abc', is_published=True, topic=self.t1)
        GraphFactory(
            title='Submittable graph',
            needs_submit=True, is_published=True, topic=self.t2)
        GraphFactory(title='Draft graph', is_published=False, topic=self.t2)
        GraphFactory(title='Another draft', is_published=False, topic=self.t4)

    def test_get(self):
        r = self.client.get(reverse(
            'cohort_detail', kwargs={'pk': self.cohort.pk}))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertNotContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], True)
        self.assertEqual(r.context['active_topic'], '')
        self.assertEqual(r.context['topic_list'].count(), 5)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 6)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].name, 'General')
        self.assertEqual(r.context['topic_list'][0].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][1].name, 'Topic A')
        self.assertEqual(r.context['topic_list'][1].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][2].name, 'Topic B')
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][3].name, 'Empty Topic')
        self.assertEqual(r.context['topic_list'][3].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][4].name,
                         'Topic with unpublished graph')
        self.assertEqual(r.context['topic_list'][4].graph_count(), 1)

        r = self.client.get(
            '{}?all=true'.format(
                reverse('cohort_detail', kwargs={'pk': self.cohort.pk})))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertContains(r, 'Submittable graph')
        self.assertContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], '')
        self.assertEqual(r.context['topic_list'].count(), 5)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 6)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].name, 'General')
        self.assertEqual(r.context['topic_list'][0].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][3].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][4].graph_count(), 1)

        r = self.client.get(
            '{}?topic={}'.format(
                reverse('cohort_detail', kwargs={'pk': self.cohort.pk}),
                self.t1.pk)
        )
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 3)
        self.assertEqual(r.context['topic_list'].count(), 5)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 6)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].name, 'General')
        self.assertEqual(r.context['topic_list'][0].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][3].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][4].graph_count(), 1)

        r = self.client.get(
            '{}?topic={}'.format(
                reverse('cohort_detail', kwargs={'pk': self.cohort.pk}),
                self.t2.pk))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertNotContains(r, 'Graph 1')
        self.assertNotContains(r, 'Demand-Supply')
        self.assertNotContains(r, 'abc')
        self.assertContains(r, 'Submittable graph')
        self.assertContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 4)
        self.assertEqual(r.context['topic_list'].count(), 5)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 6)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].name, 'General')
        self.assertEqual(r.context['topic_list'][0].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][3].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][4].graph_count(), 1)

        r = self.client.get(
            '{}?topic={}'.format(
                reverse('cohort_detail', kwargs={'pk': self.cohort.pk}),
                self.t3.pk))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertNotContains(r, 'Graph 1')
        self.assertNotContains(r, 'Demand-Supply')
        self.assertNotContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 5)
        self.assertEqual(r.context['topic_list'].count(), 5)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 6)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].name, 'General')
        self.assertEqual(r.context['topic_list'][0].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][3].graph_count(), 0)
        self.assertEqual(r.context['topic_list'][4].graph_count(), 1)

    def test_get_bad_topic(self):
        r = self.client.get(
            reverse('cohort_detail', kwargs={'pk': self.cohort.pk}) +
            '?topic=abc')
        self.assertEqual(r.status_code, 200)


class CohortDetailStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def setUp(self):
        super(CohortDetailStudentViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.t1 = TopicFactory(name='Topic A', cohort=self.cohort)
        self.t2 = TopicFactory(name='Topic B', cohort=self.cohort)
        self.t3 = TopicFactory(name='Empty Topic', cohort=self.cohort)
        self.t4 = TopicFactory(name='Topic with unpublished graph',
                               cohort=self.cohort)
        GraphFactory(title='Graph 1', is_published=True, featured=True,
                     topic=self.t1)
        GraphFactory(title='Demand-Supply',
                     is_published=True, topic=self.t1, featured=True)
        GraphFactory(title='abc', is_published=True, topic=self.t2)
        GraphFactory(title='Submittable graph',
                     needs_submit=True, is_published=True, topic=self.t1)
        GraphFactory(title='Draft graph', is_published=False, topic=self.t2)
        GraphFactory(title='Another draft', is_published=False, topic=self.t4)

    def test_get(self):
        r = self.client.get(
            reverse('cohort_detail', kwargs={'pk': self.cohort.pk}))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertNotContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], True)
        self.assertEqual(r.context['active_topic'], '')
        self.assertEqual(r.context['topic_list'].count(), 2)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)

        r = self.client.get(
            '{}?all=true'.format(
                reverse('cohort_detail', kwargs={'pk': self.cohort.pk})))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], '')
        self.assertEqual(r.context['topic_list'].count(), 2)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)

        r = self.client.get(
            '{}?topic={}'.format(
                reverse('cohort_detail', kwargs={'pk': self.cohort.pk}),
                self.t1.pk
            ))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertNotContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 3)
        self.assertEqual(r.context['topic_list'].count(), 2)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)

        r = self.client.get(
            '{}?topic={}'.format(
                reverse('cohort_detail', kwargs={'pk': self.cohort.pk}),
                self.t2.pk
            ))
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertNotContains(r, 'Graph 1')
        self.assertNotContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 4)
        self.assertEqual(r.context['topic_list'].count(), 2)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)


class MockLTI(object):
    def course_context(self, request):
        return None

    def is_administrator(self, request):
        return False

    def is_instructor(self, request):
        return False


class MyLTILandingPageTest(LoggedInTestMixin, TestCase):
    def setUp(self):
        super(MyLTILandingPageTest, self).setUp()
        self.factory = RequestFactory()
        g1 = GraphFactory(title='Graph 1')
        g2 = GraphFactory(title='Demand-Supply')
        g3 = GraphFactory(title='abc')
        self.g = GraphFactory(title='Submittable graph', needs_submit=True)
        SubmissionFactory(graph=g1)
        SubmissionFactory(graph=g2)
        SubmissionFactory(graph=g2)
        SubmissionFactory(graph=g3)
        SubmissionFactory(graph=self.g)
        self.submission = SubmissionFactory(graph=self.g, user=self.u)

    def test_get(self):
        request = self.factory.get('/lti/landing/')
        request.user = self.u
        view = MyLTILandingPage()
        view.lti = MockLTI()
        view.request = request

        ctx = view.get_context_data()
        self.assertEqual(ctx.get('submissions').count(), 1)
        submission = ctx.get('submissions').first()
        self.assertEqual(submission.user, self.u)


class TopicListAnonViewTest(TestCase):
    def setUp(self):
        super(TopicListAnonViewTest, self).setUp()
        self.cohort = CohortFactory()

    def test_get(self):
        r = self.client.get(
            reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk}))
        self.assertEqual(r.status_code, 302)


class TopicListStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def setUp(self):
        super(TopicListStudentViewTest, self).setUp()
        self.cohort = CohortFactory()

    def test_get(self):
        r = self.client.get(
            reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk}))
        self.assertEqual(r.status_code, 403)


class TopicListViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(TopicListViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)

    def test_get(self):
        r = self.client.get(
            reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk}))

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Manage Topics: {}'.format(self.cohort.title))
        self.assertContains(r, 'General')


class TopicCreateViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(TopicCreateViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)

    def test_get(self):
        r = self.client.get(
            reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk}))

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Manage Topics: {}'.format(self.cohort.title))
        self.assertContains(r, 'General')


class TopicUpdateViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(TopicUpdateViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)
        TopicFactory(cohort=self.cohort)
        self.topic = TopicFactory(cohort=self.cohort)
        TopicFactory(cohort=self.cohort)
        TopicFactory(cohort=self.cohort)

    def test_get(self):
        r = self.client.get(
            reverse('topic_edit', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.topic.pk,
            }))

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Save')
        self.assertContains(r, 'Cancel')

    def test_post(self):
        r = self.client.post(
            reverse('topic_edit', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.topic.pk,
            }), {
                'name': 'New Topic Name'
            }, follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Manage Topics: {}'.format(self.cohort.title))
        self.assertContains(r, 'New Topic Name')
        self.topic.refresh_from_db()
        self.assertEqual(self.topic.name, 'New Topic Name')

    def test_post_unassociated(self):
        cohort = CohortFactory()
        topic = TopicFactory(cohort=cohort)
        original_topic_name = topic.name
        r = self.client.post(
            reverse('topic_edit', kwargs={
                'cohort_pk': cohort.pk,
                'pk': topic.pk,
            }), {
                'name': 'New Topic Name'
            }, follow=True)

        self.assertEqual(
            r.status_code, 403,
            "Can't update a topic of a cohort I'm not an instructor of.")

        topic.refresh_from_db()
        self.assertEqual(topic.name, original_topic_name)

    def test_get_move(self):
        self.assertEqual(self.topic.order, 2)

        r = self.client.get(
            reverse('topic_edit', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.topic.pk,
            }) + '?move=down')

        self.assertEqual(r.status_code, 302)
        self.assertEqual(self.topic.order, 2)

        r = self.client.get(
            reverse('topic_edit', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.topic.pk,
            }) + '?move=up',
            follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Manage Topics')

        self.topic.refresh_from_db()

        # TODO: why isn't the new order 3? or 1?
        self.assertEqual(self.topic.order, 2)

    def test_get_move_unassociated(self):
        cohort = CohortFactory()
        topic = TopicFactory(cohort=cohort)

        self.assertEqual(topic.order, 1)

        r = self.client.get(
            reverse('topic_edit', kwargs={
                'cohort_pk': cohort.pk,
                'pk': topic.pk,
            }) + '?move=down')

        self.assertEqual(r.status_code, 403)
        self.assertEqual(topic.order, 1)

        r = self.client.get(
            reverse('topic_edit', kwargs={
                'cohort_pk': cohort.pk,
                'pk': topic.pk,
            }) + '?move=up',
            follow=True)

        self.assertEqual(r.status_code, 403)

        topic.refresh_from_db()

        self.assertEqual(topic.order, 1)


class TopicDeleteViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(TopicDeleteViewTest, self).setUp()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)
        self.topic = TopicFactory(cohort=self.cohort)

    def test_get(self):
        r = self.client.get(
            reverse('topic_delete', kwargs={
                'cohort_pk': self.cohort.pk,
                'pk': self.topic.pk,
            }))

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Delete')
        self.assertContains(r, 'Cancel')
        self.assertContains(r, self.topic.name)

    def test_get_unassociated(self):
        cohort = CohortFactory()
        topic = TopicFactory(cohort=cohort)
        r = self.client.get(
            reverse('topic_delete', kwargs={
                'cohort_pk': cohort.pk,
                'pk': topic.pk,
            }))

        self.assertEqual(
            r.status_code, 403,
            "Can't delete a topic of a cohort I'm not an instructor of.")

    def test_post(self):
        self.assertEqual(
            Topic.objects.filter(cohort=self.cohort).count(), 2,
            'Topics are: General, and a custom topic.')

        cohort = self.topic.cohort
        graph = GraphFactory(topic=self.topic)
        self.assertEqual(graph.topic, self.topic)

        r = self.client.post(
            reverse('topic_delete', kwargs={
                'cohort_pk': cohort.pk,
                'pk': self.topic.pk,
            }),
            follow=True)

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'deleted')

        with self.assertRaises(Topic.DoesNotExist):
            Topic.objects.get(pk=self.topic.pk)

        graph.refresh_from_db()
        self.assertEqual(graph.topic, cohort.get_general_topic())
