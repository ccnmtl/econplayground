from decimal import Decimal
from rest_framework.test import APITestCase
from econplayground.main.models import Graph
from econplayground.main.tests.mixins import LoggedInTestMixin
from econplayground.main.tests.factories import GraphFactory


class GraphViewSetTest(LoggedInTestMixin, APITestCase):
    def test_create(self):
        response = self.client.post('/api/graphs/', {
            'title': 'Graph title',
            'description': 'Graph description',
            'author': self.u.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Graph.objects.count(), 1)

        g = Graph.objects.first()
        self.assertEqual(g.title, 'Graph title')
        self.assertEqual(g.description, 'Graph description')
        self.assertEqual(g.author, self.u)

    def test_get_empty(self):
        response = self.client.get('/api/graphs/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_get(self):
        GraphFactory(author=self.u)
        GraphFactory(author=self.u)
        GraphFactory(author=self.u)
        response = self.client.get('/api/graphs/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_update(self):
        g = GraphFactory(author=self.u)
        response = self.client.put(
            '/api/graphs/{}/'.format(g.pk), {
                'title': 'New title',
                'author': self.u.pk,
                'line_1_slope': 1,
                'line_2_slope': -1,
            })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('title'), 'New title')
        self.assertEqual(response.data.get('author'), self.u.pk)
        self.assertEqual(
            Decimal(response.data.get('line_1_slope')), Decimal(1))
        self.assertEqual(
            Decimal(response.data.get('line_2_slope')), Decimal(-1))
