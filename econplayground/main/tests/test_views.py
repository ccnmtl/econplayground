from django.test import TestCase
from django.test.client import Client
from econplayground.main.tests.factories import GraphFactory
from econplayground.main.tests.mixins import LoggedInTestMixin


class BasicTest(TestCase):
    def setUp(self):
        self.c = Client()

    def test_root(self):
        response = self.c.get("/")
        self.assertEqual(response.status_code, 200)

    def test_smoketest(self):
        response = self.c.get("/smoketest/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "PASS")


class EmbedViewTest(LoggedInTestMixin, TestCase):
    def test_get(self):
        g = GraphFactory()
        r = self.client.get('/graph/{}/embed/'.format(g.pk))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, g.title)
