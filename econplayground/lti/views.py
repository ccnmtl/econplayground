from django.conf import settings
from django.http import JsonResponse
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic.base import View, TemplateView
from urllib.parse import urljoin

from lti_tool.views import LtiLaunchBaseView, OIDCLoginInitView


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

        json_obj = {
            'title': title,
            'description': settings.LTI_TOOL_CONFIGURATION['description'],
            'oidc_initiation_url': oidc_init_uri,
            'target_link_uri': target_link_uri,
            'scopes': [
                'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem',
                'https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly'
            ],
            'extensions': [
                {
                    'domain': domain,
                    'tool_id': 'econpractice',
                    'platform': 'canvas.ctl.columbia.edu',
                    'privacy_level': 'public',
                    'settings': {
                        'text': 'Launch ' + title,
                        'labels': {
                            'en': 'Launch ' + title,
                        },
                        'icon_url': icon_url,
                        'selection_height': 800,
                        'selection_width': 800,
                        'placements': [
                            {
                                'text': 'EconPractice',
                                'icon_url': icon_url,
                                'placement': 'course_navigation',
                                'message_type': 'LtiResourceLinkRequest',
                                'target_link_uri': target_link_uri,
                                'required_permissions': 'manage_calendar',
                                'selection_height': 500,
                                'selection_width': 500
                            }
                        ]
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
class LTI1p3LaunchView(LtiLaunchBaseView, TemplateView):
    """
    https://github.com/academic-innovation/django-lti/blob/main/README.md#handling-an-lti-launch
    """
    template_name = 'lti_auth/landing_page.html'

    def get_context_data(self, **kwargs):
        domain = self.request.get_host()
        url = settings.LTI_TOOL_CONFIGURATION['landing_url'].format(
            self.request.scheme, domain, kwargs.get('context'))

        return {
            'landing_url': url,
            'title': settings.LTI_TOOL_CONFIGURATION['title']
        }

    def handle_resource_launch(self, request, lti_launch):
        return self.get(request)
