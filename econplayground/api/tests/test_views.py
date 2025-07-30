from decimal import Decimal
from rest_framework.test import APITestCase
from econplayground.main.models import Graph
from econplayground.main.tests.mixins import (
    LoggedInTestMixin, LoggedInTestInstructorMixin, LoggedInTestStudentMixin
)
from econplayground.main.tests.factories import (
    GraphFactory, UserFactory, TopicFactory
)
from econplayground.assignment.tests.factories import (
    QuestionFactory, AssessmentRuleFactory
)


class AnonymousGraphViewSetTest(APITestCase):
    def test_create(self):
        user = UserFactory()
        response = self.client.post('/api/graphs/', {
            'title': 'Graph title',
            'instructions': 'Graph instructions',
            'instructor_notes': 'notes',
            'author': user.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
        })
        self.assertEqual(
            response.status_code, 403,
            'Anonymous users shouldn\'t create graphs.')
        self.assertEqual(Graph.objects.count(), 0)

    def test_get_empty(self):
        response = self.client.get('/api/graphs/')
        self.assertEqual(response.status_code, 200)

    def test_get(self):
        GraphFactory()
        GraphFactory()
        GraphFactory()
        response = self.client.get('/api/graphs/')
        self.assertEqual(response.status_code, 200)

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
        self.assertEqual(
            response.status_code, 403,
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
        topic = TopicFactory()
        response = self.client.post('/api/graphs/', {
            'title': 'Graph title',
            'instructions': 'Graph instructions',
            'instructor_notes': 'notes',
            'author': self.u.pk,
            'graph_type': 0,
            'topic': topic.pk,
            'line_1_slope': 0,
            'line_2_slope': 0,
            'line_1_offset_y': 0.5,
            'line_2_offset_y': 0.7,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Graph.objects.count(), 1)

        g = Graph.objects.first()
        self.assertEqual(g.title, 'Graph title')
        self.assertEqual(g.instructions, 'Graph instructions')
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

    def test_get_detail(self):
        GraphFactory(author=self.u)

        g = GraphFactory(author=self.u)

        GraphFactory(author=self.u)

        response = self.client.get('/api/graphs/{}/'.format(g.pk))
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertEqual(data['title'], g.title)
        self.assertEqual(data['instructions'], g.instructions)

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

    def test_delete(self):
        g = GraphFactory(author=self.u)

        response = self.client.delete('/api/graphs/{}/'.format(g.pk))

        self.assertEqual(response.status_code, 204)
        self.assertEqual(Graph.objects.count(), 0)


class InstructorQuestionViewSetTest(LoggedInTestInstructorMixin, APITestCase):
    def test_get_detail(self):
        question = QuestionFactory()
        title = question.title
        AssessmentRuleFactory(question=question)

        response = self.client.get('/api/questions/{}/'.format(question.pk))
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertEqual(data.get('title'), title)
        self.assertEqual(len(data.get('assessmentrule_set')), 1)


class StudentQuestionViewSetTest(LoggedInTestStudentMixin, APITestCase):
    def test_get_detail(self):
        question = QuestionFactory()
        AssessmentRuleFactory(question=question)

        response = self.client.get('/api/questions/{}/'.format(question.pk))
        self.assertEqual(response.status_code, 403)


class AnonQuestionViewSetTest(APITestCase):
    def test_get_detail(self):
        question = QuestionFactory()
        AssessmentRuleFactory(question=question)

        response = self.client.get('/api/questions/{}/'.format(question.pk))
        self.assertEqual(response.status_code, 403)
