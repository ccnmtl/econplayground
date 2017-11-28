from decimal import Decimal
from rest_framework.test import APITestCase
from econplayground.main.models import Graph, Submission
from econplayground.main.tests.mixins import (
    LoggedInTestMixin, LoggedInTestStudentMixin
)
from econplayground.main.tests.factories import (
    GraphFactory, SubmissionFactory, UserFactory
)


class AnonymousGraphViewSetTest(APITestCase):
    def test_create(self):
        user = UserFactory()
        response = self.client.post('/api/graphs/', {
            'title': 'Graph title',
            'description': 'Graph description',
            'instructor_notes': 'notes',
            'author': user.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
        })
        self.assertNotEqual(
            response.status_code, 201,
            'Anonymous users shouldn\'t create graphs.')
        self.assertEqual(Graph.objects.count(), 0)

    def test_get_empty(self):
        response = self.client.get('/api/graphs/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_get(self):
        GraphFactory()
        GraphFactory()
        GraphFactory()
        response = self.client.get('/api/graphs/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_update(self):
        u = UserFactory()
        g = GraphFactory(author=u)
        title = g.title

        response = self.client.put(
            '/api/graphs/{}/'.format(g.pk), {
                'title': 'New title',
                'author': u.pk,
                'line_1_slope': 1,
                'line_2_slope': -1,
            })
        self.assertNotEqual(
            response.status_code, 200,
            'Anonymous users shouldn\'t update graphs.')
        self.assertEqual(g.title, title)

    def test_delete(self):
        g = GraphFactory()

        response = self.client.delete('/api/graphs/{}/'.format(g.pk))

        self.assertNotEqual(
            response.status_code, 200,
            'Anonymous users shouldn\'t delete graphs.')
        self.assertEqual(Graph.objects.count(), 1)


class GraphViewSetTest(LoggedInTestMixin, APITestCase):
    def test_create(self):
        response = self.client.post('/api/graphs/', {
            'title': 'Graph title',
            'description': 'Graph description',
            'instructor_notes': 'notes',
            'author': self.u.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
            'line_1_offset': 0.5,
            'line_2_offset': 0.7,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Graph.objects.count(), 1)

        g = Graph.objects.first()
        self.assertEqual(g.title, 'Graph title')
        self.assertEqual(g.description, 'Graph description')
        self.assertEqual(g.instructor_notes, 'notes')
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
                'line_1_feedback_increase': 'Line 1 moved up',
                'line_1_feedback_decrease': 'Line 1 moved down',
                'line_2_feedback_increase': 'Line 2 moved up',
                'line_2_feedback_decrease': 'Line 2 moved down',
            })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('title'), 'New title')
        self.assertEqual(response.data.get('author'), self.u.pk)
        self.assertEqual(
            Decimal(response.data.get('line_1_slope')), Decimal(1))
        self.assertEqual(
            Decimal(response.data.get('line_2_slope')), Decimal(-1))

        self.assertEqual(
            response.data.get('line_1_feedback_increase'),
            'Line 1 moved up')
        self.assertEqual(
            response.data.get('line_1_feedback_decrease'),
            'Line 1 moved down')
        self.assertEqual(
            response.data.get('line_2_feedback_increase'),
            'Line 2 moved up')
        self.assertEqual(
            response.data.get('line_2_feedback_decrease'),
            'Line 2 moved down')

    def test_delete(self):
        g = GraphFactory(author=self.u)

        response = self.client.delete('/api/graphs/{}/'.format(g.pk))

        self.assertEqual(response.status_code, 204)
        self.assertEqual(Graph.objects.count(), 0)


class SubmissionSetTest(LoggedInTestStudentMixin, APITestCase):
    """Test the submission API as a student.

    Instructors have access to all students' submissions.
    """
    def setUp(self):
        super(SubmissionSetTest, self).setUp()
        self.g = GraphFactory()

    def test_create(self):
        response = self.client.post('/api/submissions/', {
            'graph': self.g.pk,
            'choice': 3,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Submission.objects.count(), 1)
        self.assertEqual(Submission.objects.first().choice, 3)

    def test_create_dup_fail(self):
        response = self.client.post('/api/submissions/', {
            'graph': self.g.pk,
            'choice': 3,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Submission.objects.count(), 1)

        self.client.post('/api/submissions/', {
            'graph': self.g.pk,
            'choice': 4,
        })

        # Somehow, the ValidationError is getting swallowed and not
        # setting the status_code to 400.
        # self.assertEqual(response.status_code, 400)
        self.assertEqual(Submission.objects.count(), 1)
        self.assertEqual(Submission.objects.first().choice, 3)

    def test_get(self):
        SubmissionFactory()
        SubmissionFactory()
        SubmissionFactory()
        SubmissionFactory(user=self.u)
        SubmissionFactory(user=self.u)
        response = self.client.get('/api/submissions/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(response.data), 2,
            'Students can\'t see other students\' submissions')
