from django.test import TestCase, RequestFactory
from django.urls import reverse
from econplayground.main.views import MyLTILandingPage, CohortCreateView
from econplayground.main.tests.factories import (
    CohortFactory, GraphFactory, SubmissionFactory, TopicFactory
)
from econplayground.main.tests.mixins import (
    LoggedInTestMixin, LoggedInTestInstructorMixin, LoggedInTestStudentMixin
)
from econplayground.main.models import Cohort, Topic


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


class CohortListInstructorViewTest(LoggedInTestInstructorMixin, TestCase):
    def test_get(self):
        cohort = CohortFactory()
        r = self.client.get(reverse('cohort_list'))

        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'My Courses')

        # Hide cohorts this instructor isn't a part of.
        self.assertNotContains(r, cohort.title)

        # TODO: fix this assertion
        # self.assertContains(r, 'New Course')

        # self.assertContains(r, cohort.title)
        # self.assertContains(r, cohort.description)


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

        self.client.login(username=instructor.username, password='test')
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


class CohortCreateStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def test_create_cohort(self):
        CohortFactory()

        url = reverse('cohort_create')

        self.client.login(username=self.u.username, password='test')
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

        self.client.login(username=instructor.username, password='test')
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


class CohortUpdateStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def setUp(self):
        super(CohortUpdateStudentViewTest, self).setUp()
        self.cohort = CohortFactory()

    def test_edit_cohort(self):
        CohortFactory()

        url = reverse('cohort_edit', kwargs={'pk': self.cohort.pk})

        self.client.login(username=self.u.username, password='test')
        response = self.client.get(url)
        self.assertEqual(
            response.status_code, 403, 'Students can\'t edit cohorts.')

        response = self.client.post(url, {'title': 'Lorem Ipsum'})

        self.assertEqual(self.u.cohort_set.count(), 0)
        self.assertFalse('messages' in response.cookies)


class CohortDeleteViewTest(LoggedInTestInstructorMixin, TestCase):
    def setUp(self):
        super(CohortDeleteViewTest, self).setUp()
        CohortFactory()
        CohortFactory()
        self.cohort = CohortFactory()
        self.cohort.instructors.add(self.u)

    def test_delete_empty_cohort(self):
        url = reverse('cohort_delete', kwargs={'pk': self.cohort.pk})
        title = self.cohort.title
        instructor = self.u

        self.assertEqual(instructor.cohort_set.count(), 1)

        self.client.login(username=instructor.username, password='test')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = self.client.post(url)

        self.assertEqual(instructor.cohort_set.count(), 0)
        self.assertTrue(
            '<strong>{}</strong> has been deleted.'.format(title)
            in response.cookies['messages'].value)

    def test_delete_populated_cohort(self):
        t1 = TopicFactory(cohort=self.cohort)
        t2 = TopicFactory(cohort=self.cohort)
        TopicFactory(cohort=self.cohort)
        GraphFactory(topic=t1)
        GraphFactory(topic=t1)
        GraphFactory(topic=t2)

        url = reverse('cohort_delete', kwargs={'pk': self.cohort.pk})
        title = self.cohort.title
        instructor = self.u

        self.assertEqual(instructor.cohort_set.count(), 1)

        self.client.login(username=instructor.username, password='test')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = self.client.post(url)

        self.assertEqual(instructor.cohort_set.count(), 0)
        self.assertTrue(
            '<strong>{}</strong> has been deleted.'.format(title)
            in response.cookies['messages'].value)

    def test_delete_unassociated_cohort(self):
        cohort = CohortFactory()
        url = reverse('cohort_delete', kwargs={'pk': cohort.pk})
        instructor = self.u

        self.assertEqual(instructor.cohort_set.count(), 1)
        self.assertEqual(Cohort.objects.count(), 5)

        self.client.login(username=instructor.username, password='test')
        response = self.client.get(url)
        self.assertEqual(
            response.status_code, 403,
            'Can\'t delete another instructor\'s cohort.')

        response = self.client.post(url)

        self.assertEqual(instructor.cohort_set.count(), 1)
        self.assertEqual(Cohort.objects.count(), 5)
        self.assertFalse('messages' in response.cookies)


class CohortDeleteStudentViewTest(LoggedInTestStudentMixin, TestCase):
    def setUp(self):
        super(CohortDeleteStudentViewTest, self).setUp()
        self.cohort = CohortFactory()

    def test_delete_cohort(self):
        CohortFactory()

        url = reverse('cohort_delete', kwargs={'pk': self.cohort.pk})
        self.assertEqual(self.u.cohort_set.count(), 0)
        self.assertEqual(Cohort.objects.count(), 3)

        self.client.login(username=self.u.username, password='test')
        response = self.client.get(url)
        self.assertEqual(
            response.status_code, 403, 'Students can\'t delete cohorts.')

        response = self.client.post(url)

        self.assertEqual(self.u.cohort_set.count(), 0)
        self.assertEqual(Cohort.objects.count(), 3)
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
