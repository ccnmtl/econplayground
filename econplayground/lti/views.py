from django.conf import settings, LazySettings
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.templatetags.static import static
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic.base import View, TemplateView
from urllib.parse import urljoin, urlparse

from lti_tool.views import LtiLaunchBaseView, OIDCLoginInitView
from lti_dynamic_registration.views import DynamicRegistrationBaseView
from lti_dynamic_registration.types import (
    CanvasLtiToolConfiguration, CanvasLtiRegistration, CanvasLtiMessage
)
from lti_dynamic_registration.constants import CanvasPrivacyLevel

from econplayground.main.models import Cohort


def ensure_https(url: str) -> str:
    if not url.startswith('http://') and not url.startswith('https://'):
        return 'https://' + url
    return url


def is_static_file_remote(path: str) -> bool:
    url = static(path)
    parsed = urlparse(url)
    return bool(parsed.scheme and parsed.netloc)


def get_icon_url(settings: LazySettings, host: str) -> str:
    icon_url = static(settings.LTI_TOOL_CONFIGURATION['embed_icon_url'])

    if not is_static_file_remote(icon_url):
        icon_url = urljoin(f'https://{host}', icon_url)

    return icon_url


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
        icon_url = static(settings.LTI_TOOL_CONFIGURATION['embed_icon_url'])
        target_link_uri = urljoin(
            'https://{}'.format(domain), reverse('lti-launch'))

        uuid_str = kwargs.get('registration_uuid')
        oidc_init_uri = urljoin(
            'https://{}'.format(domain),
            reverse('oidc_init', kwargs={'registration_uuid': uuid_str}))

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
                                'selection_height': 500,
                                'selection_width': 500
                            }
                        ],
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


class DynamicRegistrationView(DynamicRegistrationBaseView):
    tool_friendly_name = 'EconPractice'
    lti_platform = 'columbiasce.test.instructure.com'

    def dispatch(self, *args, **kwargs) -> HttpResponse:
        if hasattr(settings, 'LTI_PLATFORM'):
            self.lti_platform = settings.LTI_PLATFORM

        return super().dispatch(*args, **kwargs)

    def get(self, request, *args, **kwargs) -> HttpResponse:
        context = {
            # Pass in a default lti_platform
            'lti_platform': ensure_https(self.lti_platform),
        }
        return render(request, 'lti/registration.html', context)

    def post(self, request, *args, **kwargs) -> HttpResponse:
        # Perform the registration steps. Typically this would involve:
        # 1. Register the platform in the tool
        issuer = request.POST.get('issuer')
        if issuer:
            issuer = issuer.strip()
            issuer = ensure_https(issuer)

        authorization_endpoint = urljoin(issuer, '/api/lti/authorize_redirect')

        token_endpoint = urljoin(issuer, '/login/oauth2/token')
        jwks_uri = urljoin(issuer, '/api/lti/security/jwks')

        reg = self.register_platform_in_tool(
            issuer, {
                'issuer': issuer,
                'authorization_endpoint': authorization_endpoint,
                'token_endpoint': token_endpoint,
                'jwks_uri': jwks_uri,
            }
        )

        # 2. Register the tool in the platform
        openid_config = self.get_openid_config()
        privacy_level = CanvasPrivacyLevel('public')
        host = request.get_host()
        target_link_uri = f'https://{host}/lti/launch/'
        icon_url = get_icon_url(settings, host)
        oidc_init_uri = urljoin(
            'https://{}'.format(host),
            reverse('oidc_init', kwargs={'registration_uuid': reg.uuid}))

        lti_tool_config = CanvasLtiToolConfiguration(
            domain=self.lti_platform,
            target_link_uri=target_link_uri,
            claims=[
                'sub',
                'iss',
                'name',
                'given_name',
                'family_name',
                'nickname',
                'picture',
                'email',
                'locale'
            ],
            messages=[
                CanvasLtiMessage(
                    label='EconPractice',
                    icon_uri=icon_url,
                    type='LtiResourceLinkRequest',
                    placements=['course_navigation'],
                    target_link_uri=target_link_uri,
                    default_enabled=True
                )
            ],
            description=settings.LTI_TOOL_CONFIGURATION['description'],
            privacy_level=privacy_level,
            tool_id='econpractice',
        )
        tool_platform_registration = CanvasLtiRegistration(
            client_name='EconPractice',
            target_link_uri=target_link_uri,
            initiate_login_uri=oidc_init_uri,
            jwks_uri=jwks_uri,
            scopes=[
                'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem',
            ],
            lti_tool_configuration=lti_tool_config,
        )

        if settings.DEBUG:
            print('registration', tool_platform_registration.to_dict())
        client_id = self.register_tool_in_platform(
            openid_config, tool_platform_registration)

        # 3. Update the platform registration with the client ID
        # returned in step 2
        reg.client_id = client_id
        reg.save()

        # Return a page containing javascript that calls a special
        # platform postMessage endpoint
        return self.success_response()
