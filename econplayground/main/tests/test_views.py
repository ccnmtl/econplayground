from django.test import TestCase, RequestFactory
from econplayground.main.views import MyLTILandingPage
from econplayground.main.tests.factories import (
    GraphFactory, SubmissionFactory
)
from econplayground.main.tests.mixins import LoggedInTestMixin


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


class GraphListViewTest(LoggedInTestMixin, TestCase):
    def setUp(self):
        super(GraphListViewTest, self).setUp()
        GraphFactory(title='Graph 1', is_published=True)
        GraphFactory(title='Demand-Supply', is_published=True)
        GraphFactory(title='abc', is_published=True)
        GraphFactory(title='Submittable graph', needs_submit=True,
                     is_published=True)
        GraphFactory(title='Draft graph', is_published=False)

    def test_get(self):
        r = self.client.get('/')
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertNotContains(r, 'Submittable graph')
        self.assertNotContains(r, 'Draft graph')


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
        self.submission = SubmissionFactory(
            graph=self.g, user=self.u, choice=3)

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
        self.assertEqual(submission.choice, 3)
