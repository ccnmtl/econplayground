from django.test import TestCase, RequestFactory
from econplayground.main.views import MyLTILandingPage
from econplayground.main.tests.factories import (
    GraphFactory, SubmissionFactory, TopicFactory
)
from econplayground.main.tests.mixins import (
    LoggedInTestMixin, LoggedInTestInstructorMixin, LoggedInTestStudentMixin
)


class BasicTest(TestCase):
    def test_root(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 302)

    def test_smoketest(self):
        response = self.client.get("/smoketest/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "PASS")


class EmbedViewTest(LoggedInTestMixin, TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get('/graph/{}/embed/'.format(g.pk))
        self.assertEqual(r.status_code, 302)


class EmbedViewPublicTest(LoggedInTestMixin, TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get('/graph/{}/public/'.format(g.pk))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)


class EmbedViewPublicAnonTest(TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get('/graph/{}/public/'.format(g.pk))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)


class GraphListInstructorViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(GraphListInstructorViewTest, self).setUp()
        self.t1 = TopicFactory(name='Topic A')
        self.t2 = TopicFactory(name='Topic B')
        GraphFactory(title='Graph 1', is_published=True,
                     topic=self.t1, featured=True)
        GraphFactory(title='Demand-Supply',
                     is_published=True, topic=self.t1, featured=True)
        GraphFactory(title='abc', is_published=True, topic=self.t1)
        GraphFactory(title='Submittable graph',
                     needs_submit=True, is_published=True, topic=self.t2)
        GraphFactory(title='Draft graph', is_published=False, topic=self.t2)

    def test_get(self):
        # Test four cases: '/', '/?all=true', '/?topic=1', /?topic=2'
        # Each case test: All expected graphs are present, the expected
        # are in the context
        r = self.client.get('/')
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
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 5)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)

        r = self.client.get('/?all=true')
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
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 5)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)

        r = self.client.get('/?topic=2')
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 2)
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 5)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)

        r = self.client.get('/?topic=3')
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertNotContains(r, 'Graph 1')
        self.assertNotContains(r, 'Demand-Supply')
        self.assertNotContains(r, 'abc')
        self.assertContains(r, 'Submittable graph')
        self.assertContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 3)
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 5)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].graph_count(), 3)
        self.assertEqual(r.context['topic_list'][1].graph_count(), 2)
        self.assertEqual(r.context['topic_list'][2].graph_count(), 2)


class GraphListStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def setUp(self):
        super(GraphListStudentViewTest, self).setUp()
        self.t1 = TopicFactory(name='Topic A')
        self.t2 = TopicFactory(name='Topic B')
        GraphFactory(title='Graph 1', is_published=True,
                     topic=self.t1, featured=True)
        GraphFactory(title='Demand-Supply',
                     is_published=True, topic=self.t1, featured=True)
        GraphFactory(title='abc', is_published=True, topic=self.t2)
        GraphFactory(title='Submittable graph',
                     needs_submit=True, is_published=True, topic=self.t1)
        GraphFactory(title='Draft graph', is_published=False, topic=self.t2)

    def test_get(self):
        r = self.client.get('/')
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
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)
        self.assertEqual(r.context['topic_list'][2].published_graph_count(), 1)

        r = self.client.get('/?all=true')
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
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)
        self.assertEqual(r.context['topic_list'][2].published_graph_count(), 1)

        r = self.client.get('/?topic=2')
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertNotContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 2)
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)
        self.assertEqual(r.context['topic_list'][2].published_graph_count(), 1)

        r = self.client.get('/?topic=3')
        self.assertEqual(r.status_code, 200)
        # Graphs
        self.assertNotContains(r, 'Graph 1')
        self.assertNotContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')
        # Context Data
        self.assertEqual(r.context['featured'], False)
        self.assertEqual(r.context['active_topic'], 3)
        self.assertEqual(r.context['topic_list'].count(), 3)
        self.assertContains(r, 'Topic A')
        self.assertContains(r, 'Topic B')
        self.assertEqual(r.context['all_count'], 3)
        self.assertEqual(r.context['featured_count'], 2)
        self.assertEqual(r.context['topic_list'][0].published_graph_count(), 2)
        self.assertEqual(r.context['topic_list'][1].published_graph_count(), 1)
        self.assertEqual(r.context['topic_list'][2].published_graph_count(), 1)


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
