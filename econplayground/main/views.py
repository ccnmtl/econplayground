import hashlib
from braces.views import CsrfExemptMixin
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.mixins import (
    LoginRequiredMixin, UserPassesTestMixin
)
from django.db.models import Count, Q
from django.http import HttpResponseForbidden, HttpResponseRedirect, QueryDict
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import ListView, DetailView
from django.views.generic.base import View
from django.views.generic.edit import (
    CreateView, FormView, UpdateView, DeleteView
)
from django.views.generic.detail import SingleObjectMixin
from django.views.generic.base import TemplateView
from lti_provider.mixins import LTIAuthMixin
from lti_provider.views import LTILandingPage
from s3sign.views import SignS3View

from econplayground.main.forms import (
    CohortCloneForm, GraphCloneForm
)
from econplayground.main.mixins import (
    CohortGraphMixin, CohortPasswordMixin,
    CohortInstructorMixin
)
from econplayground.main.models import (
    Assessment, Cohort, Graph, Submission, Topic
)
from econplayground.main.utils import user_is_instructor, get_graph_name


class EnsureCsrfCookieMixin(object):
    """
    Ensures that the CSRF cookie will be passed to the client.
    NOTE:
        This should be the left-most mixin of a view.
    """

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(EnsureCsrfCookieMixin, self).dispatch(*args, **kwargs)


class GraphPickView(EnsureCsrfCookieMixin, CohortInstructorMixin, CreateView):
    model = Graph
    fields = []
    template_name = 'main/graph_picker.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'cohort': self.cohort,
            'graph_list': [
                {
                    'graph_type': 0,
                    'image': 'linear_demand_supply.png',
                },
                {
                    'graph_type': 25,
                    'image': 'linear_demand_supply.png',
                },
                {
                    'graph_type': 8,
                    'image': 'ADAS.png',
                },
                {
                    'graph_type': 9,
                    'image': 'linear_demand_supply.png',
                },
                {
                    'graph_type': 13,
                    'image': 'linear_demand_supply_2.png',
                },
                {
                    'graph_type': 3,
                    'image': 'cobb_douglas.png',
                },
                {
                    'graph_type': 1,
                    'image': 'non-linear_demand_supply.png',
                },
                {
                    'graph_type': 10,
                    'image': 'non-linear_demand_supply_area.png',
                },
                {
                    'graph_type': 14,
                    'image': 'non-linear_demand_supply.png',
                },
                {
                    'graph_type': 12,
                    'image': 'cobb_douglas.png',
                },
                {
                    'graph_type': 5,
                    'image': 'consumption_leisure.png',
                },
                {
                    'graph_type': 15,
                    'image': 'consumption_leisure_optimal.png',
                },
                {
                    'graph_type': 7,
                    'image': 'consumption_saving.png',
                },
                {
                    'graph_type': 11,
                    'image': 'consumption_saving_optimal.png',
                },
                {
                    'graph_type': 16,
                    'image': 'template_graph.png',
                },
                {
                    'graph_type': 17,
                    'image': 'consumption_leisure_optimal.png',
                },
                {
                    'graph_type': 18,
                    'image': 'cost_functions_total.png',
                },
                {
                    'graph_type': 20,
                    'image': 'elasticity_demand_revenue.png',
                },
                {
                    'graph_type': 21,
                    'image': 'graph_types/optimal_choice_cost_minimizing.png',
                },
                {
                    'graph_type': 22,
                    'image': 'tax_revenue.png',
                },
                {
                    'graph_type': 23,
                    'image': 'graph_types/taxation_linear_demand_supply.png',
                },
                {
                    'graph_type': 24,
                    'image': 'tax_revenue.png',
                },

                # Externalities
                {
                    'graph_type': 26,
                    'image': 'graph_types/graph_26.png',
                },
                {
                    'graph_type': 27,
                    'image': 'graph_types/graph_27.png',
                },
                {
                    'graph_type': 28,
                    'image': 'graph_types/graph_28.png',
                },
            ]
        })
        return ctx


class GraphCreateView(
        EnsureCsrfCookieMixin, CohortInstructorMixin, CreateView):
    model = Graph
    fields = ['title', 'summary', 'instructions']
    template_name = 'main/graph_form.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        graph_type = self.kwargs.get('graph_type')
        ctx.update({
            'cohort': self.cohort,
            'graph_type': graph_type,
        })
        return ctx


class GraphCloneDisplay(LoginRequiredMixin, CohortInstructorMixin, DetailView):
    model = Graph
    template_name = 'main/graph_clone_form.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'cohort': self.cohort,
            'form': GraphCloneForm(user=self.request.user),
        })
        return ctx


class GraphCloneFormView(LoginRequiredMixin, CohortInstructorMixin,
                         SingleObjectMixin, FormView):
    template_name = 'main/graph_clone_form.html'
    form_class = GraphCloneForm
    model = Graph

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'cohort': self.cohort,
            'form': GraphCloneForm(user=self.request.user),
        })
        return ctx

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().post(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cohort_detail', kwargs={'pk': self.cohort.pk})

    def form_valid(self, form):
        cohort_pk = int(form.data.get('course'))
        cohort = Cohort.objects.get(pk=cohort_pk)
        g_topic = cohort.get_general_topic()

        cloned = self.object.clone()

        cloned.title = self.object.title
        if cohort == self.object.topic.cohort:
            # If this graph got cloned to the same course,
            # differentiate it in the title.
            cloned.title = cloned.title + ' (clone)'

        cloned.author = self.request.user
        cloned.topic = g_topic
        cloned.is_published = False
        cloned.save()

        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> copied to <strong>{}</strong>.'.format(
                cloned.title, cohort.title),
            extra_tags='safe'
        )

        return super().form_valid(form)


# Following the pattern here:
# https://docs.djangoproject.com/en/2.2/topics/class-based-views/mixins/#an-alternative-better-solution
class GraphCloneView(LoginRequiredMixin, CohortInstructorMixin, View):
    def get(self, request, *args, **kwargs):
        view = GraphCloneDisplay.as_view()
        return view(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        view = GraphCloneFormView.as_view()
        return view(request, *args, **kwargs)


class FeaturedGraphUpdateView(
        LoginRequiredMixin, CohortInstructorMixin, UpdateView):
    model = Graph

    def get(self, request, *args, **kwargs):
        if request.GET.get('move') == 'down' or \
           request.GET.get('move') == 'up' or \
           request.GET.get('remove'):
            graph = self.get_object()
            if request.GET.get('move') == 'down':
                graph.down()
            elif request.GET.get('move') == 'up':
                graph.up()
            else:
                graph.featured = False
                graph.save()
            return HttpResponseRedirect(self.get_success_url())
        return HttpResponseForbidden()

    def get_success_url(self):
        return reverse('featuredgraph_list', kwargs={
            'cohort_pk': self.cohort.pk
        })


class GraphDetailView(CohortGraphMixin, CohortPasswordMixin, DetailView):
    model = Graph

    def embed_url(self, name='graph_embed'):
        path = reverse(name, kwargs={'pk': self.object.pk})
        iframe_url = '{}://{}{}'.format(
            self.request.scheme, self.request.get_host(), path)
        return iframe_url

    @staticmethod
    def embed_code(embed_url):
        return '<iframe width="600" height="600" src="{}"></iframe>'.format(
            embed_url)

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)

        assessment_change_url = None
        if hasattr(self.object, 'assessment') and self.object.assessment and \
           user_is_instructor(self.request.user):
            assessment_change_url = reverse(
                'admin:main_assessment_change',
                kwargs={'object_id': self.object.assessment.pk})

        submission = None
        if self.request.user and not self.request.user.is_anonymous:
            try:
                submission = Submission.objects.get(
                    graph=self.object, user=self.request.user)
            except Submission.DoesNotExist:
                pass

        ctx.update({
            'cohort': self.cohort,
            'embed_url': self.embed_url('graph_embed'),
            'embed_public_code': self.embed_code(
                self.embed_url('graph_embed_public_minimal')),
            'assessment_change_url': assessment_change_url,
            'submission': submission,
        })
        return ctx

    @staticmethod
    def evaluate_action(
            request, assessment: Assessment,
            name: str, value: str) -> bool:
        """
        Evaluate the given action on the Assessment and generate
        feedback alerts as a side effect.

        Returns an is_correct boolean.
        """
        if name is None:
            return None

        is_correct, feedback = assessment.evaluate_action(name, value)
        # Generate feedback alert for this action.
        if is_correct is True:
            messages.success(request, feedback)
        elif is_correct is False:
            messages.error(request, feedback)

        return is_correct

    @staticmethod
    def prepare_post_data(post_data: QueryDict) -> QueryDict:
        post_data = post_data.copy()

        for line_number in range(1, 4):
            if post_data.get(f'gLine{line_number}Label'):
                post_data.update({
                    f'line{line_number} label': post_data.get(
                        f'gLine{line_number}Label')
                })

        for var_number in range(1, 8):
            if post_data.get(f'gA{var_number}'):
                post_data.update({
                    f'a{var_number}': post_data.get(f'gA{var_number}')
                })

        return post_data

    def post(self, request, *args, **kwargs):
        if request.POST.get('unsubmit'):
            if not request.user.is_authenticated:
                return HttpResponseRedirect(reverse('login'))

            # Find submission and delete it.
            try:
                submission = Submission.objects.get(
                    graph=self.get_object(), user=self.request.user)
            except Submission.DoesNotExist:
                pass

            if submission:
                submission.delete()
                messages.success(request, 'Graph un-submitted.')

            return HttpResponseRedirect(request.path)

        self.object = self.get_object()
        assessment = self.object.assessment
        if not assessment:
            messages.info(
                request, 'This graph has no assessment rules defined.')
            return HttpResponseRedirect(request.path)

        # Find actions that the user has made
        rule_options = Graph.get_rule_options(self.object.graph_type)
        action_results = []
        post_data = GraphDetailView.prepare_post_data(request.POST)
        for rule_option in rule_options.keys():
            action_results.append(
                GraphDetailView.evaluate_action(
                    request, assessment, rule_option,
                    post_data.get(rule_option))
            )

        submission = None
        if request.user and not request.user.is_anonymous:
            submission, created = Submission.objects.get_or_create(
                graph=self.object, user=request.user)
            submission.score = action_results.count(True)
            submission.save()

        if submission:
            messages.success(request, 'Graph submitted.')
        else:
            messages.error(request, 'Graph submission failed.')

        return HttpResponseRedirect(request.path)


class GraphHelpView(TemplateView):
    template_name = 'main/graph_help.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        graph_type = kwargs.get('graph_type')
        graph_name = get_graph_name(graph_type)
        ctx.update({
            'rule_options': Graph.get_rule_options(graph_type),
            'graph_name': graph_name,
        })

        return ctx


class GraphEmbedView(CsrfExemptMixin, LTIAuthMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed.html'

    def post(self, request, pk=None):
        url = reverse('graph_embed', kwargs={'pk': pk})
        return HttpResponseRedirect(url)


class GraphEmbedPublicView(CohortGraphMixin, CohortPasswordMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed_public.html'


class GraphEmbedPublicMinimalView(
        CohortGraphMixin, CohortPasswordMixin, DetailView):
    model = Graph
    template_name = 'main/graph_embed_public_minimal.html'


class GraphDeleteView(LoginRequiredMixin, CohortInstructorMixin, DeleteView):
    model = Graph

    def get_context_data(self, **kwargs):
        ctx = super(GraphDeleteView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> has been deleted.'.format(self.object.title),
            extra_tags='safe')

        return reverse('cohort_detail', kwargs={'pk': self.cohort.pk})


class MyLTILandingPage(LTILandingPage):
    def get_context_data(self, *args, **kwargs):
        ctx = super(MyLTILandingPage, self).get_context_data(*args, **kwargs)

        submissions = Submission.objects.filter(
            user=self.request.user).order_by('-created_at')
        ctx.update({
            'submissions': submissions,
        })

        return ctx


class CohortDetailView(CohortPasswordMixin, DetailView):
    model = Cohort

    def get_graph_queryset(self):
        # First, set up graphs based on a users role
        graphs = Graph.objects.filter(
            topic__in=self.object.topic_set.all())

        if not user_is_instructor(self.request.user):
            graphs = graphs.filter(needs_submit=False, is_published=True)

        # Then apply filtering based on query string params
        params = self.request.GET
        if len(params) == 0:
            graphs = graphs.filter(featured=True)
            return graphs.order_by('order')
        elif 'topic' in params:
            tid = None

            try:
                tid = int(params.get('topic', ''))
            except ValueError:
                return graphs.order_by('title')

            if tid:
                graphs = graphs.filter(topic=tid)

        return graphs.order_by('title')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        graph_list = self.get_graph_queryset()

        if user_is_instructor(self.request.user):
            topics = self.object.topic_set.all()
            graphs = Graph.objects.filter(topic__in=topics)
        else:
            topics = self.object.topic_set.annotate(
                num_graphs=Count('graph', filter=Q(
                    graph__is_published=True)
                )).filter(num_graphs__gt=0)
            graphs = Graph.objects.filter(
                topic__in=topics,
                needs_submit=False, is_published=True)

        context['topic_list'] = topics
        context['graph_list'] = graph_list
        context['all_count'] = graphs.count()
        context['featured_count'] = graphs.filter(featured=True).count()

        # If there are no query string params, then set featured to true.
        # Set active_topic guard condition, and assign to an id if present in
        # the query string.
        params = self.request.GET
        context['featured'] = False
        context['active_topic'] = None

        if len(params) == 0:
            context['featured'] = True
        elif 'topic' in params:
            tid = params.get('topic', None)
            try:
                context['active_topic'] = int(tid)
            except ValueError:
                pass

        return context


class CohortPasswordView(DetailView):
    model = Cohort
    template_name = 'main/cohort_password_form.html'

    def post(self, request, pk):
        cohort = self.get_object()
        user_pass = request.POST.get('password')

        if cohort.password.strip() == user_pass.strip():
            hashed_pass = hashlib.sha224(
                cohort.password.strip().encode('utf-8')).hexdigest()
            request.session['cohort_{}'.format(cohort.pk)] = hashed_pass
            url = reverse('cohort_detail', kwargs={'pk': cohort.pk})
        else:
            messages.error(
                self.request, 'Incorrect Password')
            url = reverse('cohort_password', kwargs={'pk': cohort.pk})

        return HttpResponseRedirect(url)


class CohortCreateView(EnsureCsrfCookieMixin, UserPassesTestMixin, CreateView):
    model = Cohort
    fields = ['title', 'description', 'password']

    def test_func(self):
        return user_is_instructor(self.request.user)

    def get_success_url(self):
        return '/'

    def form_valid(self, form):
        title = form.cleaned_data.get('title')
        instructor = self.request.user

        result = CreateView.form_valid(self, form)

        form.instance.instructors.add(instructor)

        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> cohort created.'.format(title),
            extra_tags='safe'
        )

        return result


class CohortUpdateView(LoginRequiredMixin, CohortInstructorMixin, UpdateView):
    model = Cohort
    fields = ['title',  'description', 'password']

    def post(self, request, *args, **kwargs):
        if ('archive' in request.POST):
            self.success_url = reverse('cohort_list')

        r = super().post(request, *args, **kwargs)

        if ('archive' in request.POST):
            self.object.is_archived = True
            self.object.save()

            manage_course_url = '/admin/main/cohort/{}/change/'.format(
                self.object.pk)
            course_link = '<strong><a href="{}">{}</a></strong>'.format(
                manage_course_url, self.object.title)

            messages.add_message(
                request, messages.SUCCESS,
                'Course {} has been archived.'.format(course_link),
                extra_tags='safe')

        return r

    def get_success_url(self):
        if self.success_url:
            return self.success_url

        return reverse('cohort_detail', kwargs={'pk': self.object.pk})


class CohortCloneDisplay(LoginRequiredMixin, CohortInstructorMixin,
                         DetailView):
    model = Cohort
    template_name = 'main/cohort_clone_form.html'

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'form': CohortCloneForm(user=self.request.user),
        })
        return ctx


class CohortCloneFormView(LoginRequiredMixin, CohortInstructorMixin,
                          SingleObjectMixin, FormView):
    template_name = 'main/cohort_clone_form.html'
    form_class = CohortCloneForm
    model = Cohort

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx.update({
            'cohort': self.object,
            'form': CohortCloneForm(user=self.request.user),
        })
        return ctx

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().post(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('cohort_detail', kwargs={'pk': self.object.pk})

    def form_valid(self, form):
        cloned = self.object.clone()

        cloned.title = form.data.get('title')
        cloned.instructors.add(self.request.user)
        cloned.save()

        url = reverse('cohort_detail', kwargs={'pk': cloned.pk})
        messages.add_message(
            self.request, messages.SUCCESS,
            'Course <strong><a href="{}">{}</a></strong> created.'.format(
                url, cloned.title),
            extra_tags='safe'
        )

        return super().form_valid(form)


# Following the pattern here:
# https://docs.djangoproject.com/en/2.2/topics/class-based-views/mixins/#an-alternative-better-solution
class CohortCloneView(LoginRequiredMixin, CohortInstructorMixin,
                      SingleObjectMixin, View):
    model = Cohort

    def get(self, request, *args, **kwargs):
        view = CohortCloneDisplay.as_view()
        return view(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        view = CohortCloneFormView.as_view()
        return view(request, *args, **kwargs)


class CohortListView(LoginRequiredMixin, ListView):
    model = Cohort

    def dispatch(self, request, *args, **kwargs):
        if not user_is_instructor(request.user):
            url = reverse('assignment_list_student')
            return HttpResponseRedirect(url)

        return super(CohortListView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(CohortListView, self).get_context_data(**kwargs)

        # This area should never be reached if this user isn't an instructor,
        # but just in case.
        if not user_is_instructor(self.request.user):
            return context

        # Create a clone of the sample course if this user has no
        # courses.
        if not Cohort.objects.filter(
                instructors__in=(self.request.user,)).exists():
            try:
                sample_course = Cohort.objects.get(is_sample=True)
            except Cohort.DoesNotExist:
                sample_course = None

            if sample_course:
                cloned_sample = sample_course.clone()
                cloned_sample.instructors.clear()
                cloned_sample.instructors.add(self.request.user)

        context['cohorts'] = Cohort.objects.filter(
            is_archived=False,
            instructors__in=(self.request.user,))

        return context


class TopicCreateView(LoginRequiredMixin, CohortInstructorMixin, CreateView):
    model = Topic
    fields = ['cohort', 'name']

    def get_context_data(self, **kwargs):
        ctx = super(TopicCreateView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx

    def form_valid(self, form):
        name = form.cleaned_data.get('name')

        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> created.'.format(name),
            extra_tags='safe')

        return super(TopicCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk})


class TopicListView(LoginRequiredMixin, CohortInstructorMixin, ListView):
    model = Topic

    def get_queryset(self):
        return Topic.objects.filter(cohort=self.cohort).order_by('order')

    def get_context_data(self, **kwargs):
        ctx = super(TopicListView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx


class FeaturedGraphListView(
        LoginRequiredMixin, CohortInstructorMixin, ListView):
    model = Graph
    template_name = 'main/featuredgraph_list.html'

    def get_queryset(self):
        return self.cohort.get_graphs().filter(featured=True).order_by('order')

    def get_context_data(self, **kwargs):
        ctx = super(FeaturedGraphListView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx


class TopicUpdateView(LoginRequiredMixin, CohortInstructorMixin, UpdateView):
    model = Topic
    fields = ['name']

    def get(self, request, *args, **kwargs):
        if request.GET.get('move') == 'down' or \
           request.GET.get('move') == 'up':
            topic = self.get_object()
            if request.GET.get('move') == 'down':
                topic.down()
            else:
                topic.up()

            return HttpResponseRedirect(self.get_success_url())

        return super(TopicUpdateView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super(TopicUpdateView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx

    def get_success_url(self):
        return reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk})


class TopicDeleteView(LoginRequiredMixin, CohortInstructorMixin, DeleteView):
    model = Topic

    def get_context_data(self, **kwargs):
        ctx = super(TopicDeleteView, self).get_context_data(**kwargs)
        ctx.update({
            'cohort': self.cohort,
        })
        return ctx

    def get_success_url(self):
        messages.add_message(
            self.request, messages.SUCCESS,
            '<strong>{}</strong> has been deleted.'.format(self.object.name),
            extra_tags='safe')

        return reverse('topic_list', kwargs={'cohort_pk': self.cohort.pk})


class S3SignView(SignS3View):
    # ACL's are deprecated in s3. Use public bucket policy instead of
    # `public-read` ACL.
    acl = None

    def get_bucket(self):
        return getattr(
            settings,
            'S3_MEDIA_BUCKET_NAME', 'econpractice-media')
