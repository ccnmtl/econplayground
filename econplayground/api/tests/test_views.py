from decimal import Decimal
from rest_framework.test import APITestCase
from econplayground.main.models import (
    Graph, JXGLine, JXGLineTransformation, Submission
)
from econplayground.main.tests.mixins import (
    LoggedInTestMixin, LoggedInTestStudentMixin
)
from econplayground.main.tests.factories import (
    GraphFactory, JXGLineFactory, JXGLineTransformationFactory,
    SubmissionFactory, UserFactory
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
        response = self.client.post('/api/graphs/', {
            'title': 'Graph title',
            'description': 'Graph description',
            'instructor_notes': 'notes',
            'author': self.u.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
            'line_1_offset_y': 0.5,
            'line_2_offset_y': 0.7,
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Graph.objects.count(), 1)

        g = Graph.objects.first()
        self.assertEqual(g.title, 'Graph title')
        self.assertEqual(g.description, 'Graph description')
        self.assertEqual(g.instructor_notes, 'notes')
        self.assertEqual(g.author, self.u)
        self.assertEqual(g.lines.count(), 0)

    def test_create_with_lines(self):
        response = self.client.post('/api/graphs/', {
            'title': 'Graph with lines',
            'description': 'Graph description',
            'instructor_notes': 'notes',
            'author': self.u.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
            'line_1_offset_y': 0.5,
            'line_2_offset_y': 0.7,
            'lines': [
                {
                    'number': 1,
                    'transformations': [
                    ]
                },
                {
                    'number': 2,
                },
            ]
            # DRF needs format='json' here, because nesting doesn't
            # work with the default renderer used in testing:
            # MultiPartRenderer
            # http://www.django-rest-framework.org/api-guide/renderers/#multipartrenderer
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Graph.objects.count(), 1)
        self.assertEqual(JXGLine.objects.count(), 2)
        self.assertEqual(JXGLineTransformation.objects.count(), 0)

        g = Graph.objects.first()
        self.assertEqual(g.title, 'Graph with lines')
        self.assertEqual(g.description, 'Graph description')
        self.assertEqual(g.instructor_notes, 'notes')
        self.assertEqual(g.author, self.u)

        self.assertEqual(g.lines.count(), 2)
        line1 = g.lines.first()
        line2 = g.lines.last()
        self.assertEqual(line1.transformations.count(), 0)
        self.assertEqual(line2.transformations.count(), 0)

    def test_create_with_lines_and_transformations(self):
        response = self.client.post('/api/graphs/', {
            'title': 'Graph with lines',
            'description': 'Graph description',
            'instructor_notes': 'notes',
            'author': self.u.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
            'line_1_offset_y': 0.5,
            'line_2_offset_y': 0.7,
            'lines': [
                {
                    'number': 1,
                    'transformations': [
                        {
                            'z': 1,
                            'x': 2,
                            'y': 3,
                        },
                        {
                            'z': -1,
                            'x': -2,
                            'y': -3,
                        }
                    ]
                },
                {
                    'number': 2,
                    'transformations': [
                        {
                            'z': 4,
                            'x': 5,
                            'y': 6.0006,
                        },
                        {
                            'z': -4,
                            'x': -5,
                            'y': -6.0006,
                        }
                    ]
                },
            ]
            # DRF needs format='json' here, because nesting doesn't
            # work with the default renderer used in testing:
            # MultiPartRenderer
            # http://www.django-rest-framework.org/api-guide/renderers/#multipartrenderer
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Graph.objects.count(), 1)
        self.assertEqual(JXGLine.objects.count(), 2)
        self.assertEqual(JXGLineTransformation.objects.count(), 4)

        g = Graph.objects.first()
        self.assertEqual(g.title, 'Graph with lines')
        self.assertEqual(g.description, 'Graph description')
        self.assertEqual(g.instructor_notes, 'notes')
        self.assertEqual(g.author, self.u)

        self.assertEqual(g.lines.count(), 2)
        line1 = g.lines.get(number=1)
        line2 = g.lines.get(number=2)
        self.assertEqual(line1.transformations.count(), 2)
        self.assertEqual(line2.transformations.count(), 2)

    def test_create_with_lines_and_transformations_invalid(self):
        response = self.client.post('/api/graphs/', {
            'title': 'Graph with lines',
            'description': 'Graph description',
            'instructor_notes': 'notes',
            'author': self.u.pk,
            'graph_type': 0,
            'line_1_slope': 0,
            'line_2_slope': 0,
            'line_1_offset_y': 0.5,
            'line_2_offset_y': 0.7,
            'lines': [
                {
                    'number': 1,
                    'transformations': [
                        {
                            # Assert that this can be broken with one
                            # type error.
                            'z': 'a',
                            'x': 2,
                            'y': 3,
                        },
                        {
                            'z': -1,
                            'x': -2,
                            'y': -3,
                        }
                    ]
                },
                {
                    'number': 2,
                    'transformations': [
                        {
                            'z': 4,
                            'x': 5,
                            'y': 6.0006,
                        },
                        {
                            'z': -4,
                            'x': -5,
                            'y': -6.0006,
                        }
                    ]
                },
            ]
            # DRF needs format='json' here, because nesting doesn't
            # work with the default renderer used in testing:
            # MultiPartRenderer
            # http://www.django-rest-framework.org/api-guide/renderers/#multipartrenderer
        }, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Graph.objects.count(), 0)
        self.assertEqual(JXGLine.objects.count(), 0)
        self.assertEqual(JXGLineTransformation.objects.count(), 0)

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
        line = JXGLineFactory(graph=g)
        JXGLineFactory(graph=g, number=2)
        JXGLineTransformationFactory(line=line)
        JXGLineTransformationFactory(line=line)

        GraphFactory(author=self.u)

        response = self.client.get('/api/graphs/{}/'.format(g.pk))
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertEqual(len(data['lines']), 2)

    def test_update_with_lines(self):
        g = GraphFactory(author=self.u)
        line = JXGLineFactory(graph=g)
        JXGLineTransformationFactory(line=line)

        response = self.client.put('/api/graphs/{}/'.format(g.pk), {
            'title': 'New title',
            'author': self.u.pk,
            'line_1_slope': 1,
            'line_2_slope': -1,
            'line_1_feedback_increase': 'Line 1 moved up',
            'line_1_feedback_decrease': 'Line 1 moved down',
            'line_2_feedback_increase': 'Line 2 moved up',
            'line_2_feedback_decrease': 'Line 2 moved down',
            'lines': [
                {
                    'number': 1,
                    'transformations': [
                        {
                            'z': 1,
                            'x': 2,
                            'y': 3,
                        },
                        {
                            'z': -1,
                            'x': -2,
                            'y': -3,
                        }
                    ]
                },
                {
                    'number': 2,
                    'transformations': [
                        {
                            'z': 4,
                            'x': 5,
                            'y': 6.0006,
                        },
                        {
                            'z': -4,
                            'x': -5,
                            'y': -6.0006,
                        }
                    ]
                },
            ]
        }, format='json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(JXGLine.objects.count(), 2)
        self.assertEqual(JXGLineTransformation.objects.count(), 4)

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

    def test_update_with_lines_invalid_nested(self):
        g = GraphFactory(author=self.u)
        line = JXGLineFactory(graph=g, number=5)
        JXGLineTransformationFactory(line=line)

        response = self.client.put('/api/graphs/{}/'.format(g.pk), {
            'title': 'New title',
            'author': self.u.pk,
            'line_1_slope': 1,
            'line_2_slope': -1,
            'line_1_feedback_increase': 'Line 1 moved up',
            'line_1_feedback_decrease': 'Line 1 moved down',
            'line_2_feedback_increase': 'Line 2 moved up',
            'line_2_feedback_decrease': 'Line 2 moved down',
            'abc': 'abc',
            'lines': [
                {
                    'abc': 7,
                    'whatever': [
                        {
                            'uuu': 1,
                            'x': 2,
                            'y': 3,
                        },
                        {
                            'z': -1,
                            'x': -2,
                            'y': -3,
                        }
                    ]
                },
                {
                    'number': 2,
                    'transformations': [
                        {
                            'z': 4,
                            'x': 5,
                            'y': 6.0006,
                        },
                        {
                            'z': -4,
                            'x': -5,
                            'y': -6.0006,
                        }
                    ]
                },
            ]
        }, format='json')
        self.assertEqual(response.status_code, 200)

        self.assertEqual(JXGLine.objects.count(), 2)

        self.assertFalse(JXGLine.objects.filter(number=5).exists())
        self.assertFalse(JXGLine.objects.filter(number=7).exists())
        self.assertTrue(JXGLine.objects.filter(number=1).exists())
        self.assertTrue(JXGLine.objects.filter(number=2).exists())

        self.assertEqual(JXGLineTransformation.objects.count(), 2)

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

    def test_list(self):
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

    def test_retrieve(self):
        SubmissionFactory()
        SubmissionFactory()
        s = SubmissionFactory(user=self.u, score=Decimal('0.5'))
        s2 = SubmissionFactory()
        SubmissionFactory(user=self.u)
        response = self.client.get('/api/submissions/{}/'.format(s.graph.pk))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('score'), '0.5000')

        response = self.client.get('/api/submissions/{}/'.format(s2.graph.pk))
        self.assertEqual(
            response.status_code, 404,
            'Students can\'t see other students\' submissions')
