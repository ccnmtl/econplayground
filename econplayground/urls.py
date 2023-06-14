import os.path

from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from django.views.static import serve

from econplayground.main import views
from econplayground.assignment import views as assignment_views
from django_cas_ng import views as cas_views


site_media_root = os.path.join(os.path.dirname(__file__), "../media")


# A route for triggering a sentry error.
# https://docs.sentry.io/platforms/python/django/
def trigger_error(request):
    division_by_zero = 1 / 0
    print(division_by_zero)


urlpatterns = [
    path('', views.CohortListView.as_view(), name='cohort_list'),

    path('admin/doc/', include('django.contrib.admindocs.urls')),
    path('admin/', admin.site.urls),

    path('accounts/', include('django.contrib.auth.urls')),
    path('cas/login', cas_views.LoginView.as_view(),
         name='cas_ng_login'),
    path('cas/logout', cas_views.LogoutView.as_view(),
         name='cas_ng_logout'),

    path('api/', include('econplayground.api.urls')),
    path('registration/', include('registration.backends.default.urls')),

    path('add/course/', views.CohortCreateView.as_view(),
         name='cohort_create'),
    path('course/<int:pk>/', views.CohortDetailView.as_view(),
         name='cohort_detail'),
    path('course/<int:pk>/password/', views.CohortPasswordView.as_view(),
         name='cohort_password'),
    path('course/<int:pk>/edit/', views.CohortUpdateView.as_view(),
         name='cohort_edit'),
    path('course/<int:pk>/clone/', views.CohortCloneView.as_view(),
         name='cohort_clone'),
    path('course/<int:pk>/graph/create/',
         views.CohortGraphCreateView.as_view(),
         name='cohort_graph_create'),

    path('course/<int:cohort_pk>/graph/<int:pk>/',
         views.GraphDetailView.as_view(), name='cohort_graph_detail'),
    path('course/<int:cohort_pk>/graph/<int:pk>/edit/',
         views.FeaturedGraphUpdateView.as_view(), name='cohort_graph_edit'),
    path('course/<int:cohort_pk>/graph/<int:pk>/clone/',
         views.GraphCloneView.as_view(), name='cohort_graph_clone'),
    path('course/<int:cohort_pk>/graph/<int:pk>/embed/',
         views.GraphEmbedView.as_view(), name='cohort_graph_embed'),
    path('course/<int:cohort_pk>/graph/<int:pk>/public/',
         views.GraphEmbedPublicView.as_view(),
         name='cohort_graph_embed_public'),
    path('course/<int:cohort_pk>/graph/<int:pk>/public/minimal/',
         views.GraphEmbedPublicMinimalView.as_view(),
         name='cohort_graph_embed_public_minimal'),
    path('course/<int:cohort_pk>/graph/<int:pk>/delete/',
         views.GraphDeleteView.as_view(), name='cohort_graph_delete'),

    path('course/<int:cohort_pk>/topics/',
         views.TopicListView.as_view(), name='topic_list'),
    path('course/<int:cohort_pk>/topic/add/',
         views.TopicCreateView.as_view(), name='topic_create'),
    path('course/<int:cohort_pk>/topic/<int:pk>/edit/',
         views.TopicUpdateView.as_view(), name='topic_edit'),
    path('course/<int:cohort_pk>/topic/<int:pk>/delete/',
         views.TopicDeleteView.as_view(), name='topic_delete'),

    path('course/<int:cohort_pk>/featuredgraphs/',
         views.FeaturedGraphListView.as_view(), name='featuredgraph_list'),

    path('graph/<int:pk>/',
         views.GraphDetailView.as_view(), name='graph_detail'),
    path('graph/<int:pk>/embed/',
         views.GraphEmbedView.as_view(), name='graph_embed'),
    path('graph/<int:pk>/public/',
         views.GraphEmbedPublicView.as_view(), name='graph_embed_public'),
    path('graph/<int:pk>/public/minimal/',
         views.GraphEmbedPublicMinimalView.as_view(),
         name='graph_embed_public_minimal'),
    path('graph/<int:pk>/delete/',
         views.GraphDeleteView.as_view(), name='graph_delete'),

    path('assignment/list/',
         assignment_views.AssignmentListView.as_view(),
         name='assignment_assignment_list'),
    path('assignment/create/',
         assignment_views.AssignmentCreateView.as_view(),
         name='assignment_assignment_create'),
    path('assignment_assignment/<int:pk>/',
         assignment_views.AssignmentDetailView.as_view(),
         name='assignment_assignment_detail'),
    path('assignment_assignment/<int:pk>/edit/',
         assignment_views.AssignmentUpdateView.as_view(),
         name='assignment_assignment_edit'),
    path('tree/<int:pk>/edit/',
         assignment_views.TreeUpdateView.as_view(),
         name='tree_edit'),
    path('assignment_assignment/<int:pk>/delete/',
         assignment_views.AssignmentDeleteView.as_view(),
         name='assignment_assignment_delete'),

    path('assignment/',
         views.AssignmentListView.as_view(), name='assignment_list'),
    path('add/assignment/',
         views.AssignmentCreateView.as_view(), name='assignment_create'),
    path('assignment/<int:pk>/',
         views.AssignmentDetailView.as_view(), name='assignment_detail'),
    path('assignment/<int:pk>/edit/',
         views.AssignmentUpdateView.as_view(), name='assignment_edit'),
    path('assignment/<int:pk>/delete/',
         views.AssignmentDeleteView.as_view(), name='assignment_delete'),
    path('assignment/<int:pk>/clone/',
         views.AssignmentCloneView.as_view(), name='assignment_clone'),
    path('assignment/<int:pk>/success/',
         views.AssignmentSuccessView.as_view(), name='assignment_success'),
    path('assignment/<int:pk>/failure/',
         views.AssignmentFailureView.as_view(), name='assignment_failure'),
    path("user_assignment/<int:pk>/",
         views.AssignmentStudentDisplayView.as_view(),
         name="assignment_student"),
    path("user_assignment/<int:user_assignment_pk>/q/<int:pk>",
         views.QuestionStudentDisplayView.as_view(),
         name="question_student"),


    path('question_bank/',
         views.QuestionBankListView.as_view(), name='question_bank_list'),
    path('add/question_bank/',
         views.QuestionBankCreateView.as_view(), name='question_bank_create'),
    path('question_bank/<int:pk>/',
         views.QuestionBankDetailView.as_view(), name='question_bank_detail'),
    path('question_bank/<int:pk>/edit/',
         views.QuestionBankUpdateView.as_view(), name='question_bank_edit'),
    path('question_bank/<int:pk>/delete/',
         views.QuestionBankDeleteView.as_view(), name='question_bank_delete'),
    path('question_bank/<int:pk>/clone/',
         views.QuestionBankCloneView.as_view(), name='question_bank_clone'),

    path('question/',
         views.QuestionListView.as_view(), name='question_list'),
    path('question/add/',
         views.QuestionCreateView.as_view(), name='question_create'),
    path('question/<int:pk>/',
         views.QuestionDetailView.as_view(), name='question_detail'),
    path('question/<int:pk>/edit/',
         views.QuestionUpdateView.as_view(), name='question_edit'),
    path('question/<int:pk>/delete/',
         views.QuestionDeleteView.as_view(), name='question_delete'),
    path('question/<int:pk>/clone/',
         views.QuestionCloneView.as_view(), name='question_clone'),

    path('stats/', TemplateView.as_view(template_name="stats.html")),
    path('smoketest/', include('smoketest.urls')),
    path('infranil/', include('infranil.urls')),
    path('uploads/<path>',
         serve, {'document_root': settings.MEDIA_ROOT}),
    path('lti/landing/', views.MyLTILandingPage.as_view()),
    path('lti/', include('lti_provider.urls')),

    path('sign_s3/', views.S3SignView.as_view()),

    path('contact/', include('contactus.urls')),

    path('sentry-debug/', trigger_error),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
