from django.test import TestCase
from django.test.client import Client


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
