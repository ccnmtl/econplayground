from django.test import TestCase
from econplayground.main.tests.factories import GraphFactory
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
        GraphFactory(title='Graph 1')
        GraphFactory(title='Demand-Supply')
        GraphFactory(title='abc')
        GraphFactory(title='Quiz graph', needs_submit=True)

    def test_get(self):
        r = self.client.get('/')
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Graph 1')
        self.assertContains(r, 'Demand-Supply')
        self.assertContains(r, 'abc')
        self.assertNotContains(r, 'Quiz graph')
