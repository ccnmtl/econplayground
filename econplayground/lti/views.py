from django.conf import settings
from django.http import JsonResponse
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic.base import View, TemplateView
from urllib.parse import urljoin

from lti_tool.views import LtiLaunchBaseView, OIDCLoginInitView

from econplayground.main.models import Cohort


class JSONConfigView(View):
    """
    JSON configuration endpoint for LTI 1.3.

    In Canvas LMS, an LTI Developer Key can be created via Manual
    Entry, or by URL. This view provides the JSON necessary for URL
    configuration in Canvas.

    https://canvas.instructure.com/doc/api/file.lti_dev_key_config.html
    """
    def get(self, request, *args, **kwargs):
        domain = request.get_host()
        title = settings.LTI_TOOL_CONFIGURATION['title']
        icon_url = urljoin(
            settings.STATIC_URL,
            settings.LTI_TOOL_CONFIGURATION['embed_icon_url'])
        target_link_uri = urljoin(
            'https://{}'.format(domain), reverse('lti-launch'))

        uuid = kwargs.get('registration_uuid')
        oidc_init_uri = urljoin(
            'https://{}'.format(domain),
            reverse('oidc_init', kwargs={'registration_uuid': uuid}))

        lti_platform = 'columbiasce.test.instructure.com'
        if hasattr(settings, 'LTI_PLATFORM'):
            lti_platform = settings.LTI_PLATFORM

        json_obj = {
            'title': title,
            'description': settings.LTI_TOOL_CONFIGURATION['description'],
            'oidc_initiation_url': oidc_init_uri,
            'target_link_uri': target_link_uri,
            'scopes': [
                'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem',

                'https://purl.imsglobal.org/'
                'spec/lti-ags/scope/result.readonly',

                'https://purl.imsglobal.org/'
                'spec/lti-nrps/scope/contextmembership.readonly',
            ],
            'extensions': [
                {
                    'domain': domain,
                    'tool_id': 'econpractice',
                    'platform': lti_platform,
                    'privacy_level': 'public',
                    'placements': [
                        {
                            'text': 'EconPractice',
                            'icon_url': icon_url,
                            'placement': 'course_navigation',
                            'message_type': 'LtiResourceLinkRequest',
                            'target_link_uri': target_link_uri,
                            'selection_height': 500,
                            'selection_width': 500
                        }
                    ],
                    'settings': {
                        'text': 'Launch ' + title,
                        'labels': {
                            'en': 'Launch ' + title,
                        },
                        'icon_url': icon_url,
                        'selection_height': 800,
                        'selection_width': 800,
                    }
                }
            ],
            'public_jwk_url': urljoin(
                'https://{}'.format(domain), reverse('jwks'))
        }
        return JsonResponse(json_obj)


@method_decorator(xframe_options_exempt, name='dispatch')
class MyOIDCLoginInitView(OIDCLoginInitView):
    pass


@method_decorator(xframe_options_exempt, name='dispatch')
class LtiLaunchView(LtiLaunchBaseView, TemplateView):
    """
    https://github.com/academic-innovation/django-lti/blob/main/README.md#handling-an-lti-launch
    """
    template_name = 'lti/landing_page.html'
    lti_tool_name = None
    course = None

    def handle_resource_launch(self, request, lti_launch):
        if settings.DEBUG:
            print('All lti_launch data:', lti_launch.get_launch_data())
            print('User:', lti_launch.user.__dict__)
            print('NRPS claim:', lti_launch.nrps_claim)
            print('Roles claim:', lti_launch.roles_claim)

        self.lti_tool_name = lti_launch.platform_instance_claim.get(
            'product_family_code')
        if self.lti_tool_name:
            self.lti_tool_name = self.lti_tool_name.capitalize()

        self.deployment_id = lti_launch.deployment.deployment_id
        self.course_id = lti_launch.context_claim.get('id')
        self.course_name = lti_launch.context_claim.get('title')

        # Search for course by context_id in EconPractice database
        try:
            self.course = Cohort.objects.get(
                context_id=self.course_id, deployment_id=self.deployment_id)
        except Cohort.DoesNotExist:
            pass

        return self.get(request)

    def get_context_data(self, **kwargs):
        domain = self.request.get_host()
        url = settings.LTI_TOOL_CONFIGURATION['landing_url'].format(
            self.request.scheme, domain, kwargs.get('context'))

        lti_tool_name = 'LTI'
        if self.lti_tool_name:
            lti_tool_name = self.lti_tool_name

        return {
            'DEBUG': settings.DEBUG,
            'landing_url': url,
            'title': settings.LTI_TOOL_CONFIGURATION['title'],
            'lti_tool_name': lti_tool_name,
            'course': self.course,
            'deployment_id': self.deployment_id,
            'course_id': self.course_id,
            'course_name': self.course_name,
        }
