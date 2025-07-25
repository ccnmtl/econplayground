from django.test import TestCase
from django.urls import reverse


class DynamicRegistrationViewTest(TestCase):
    def test_get(self):
        r = self.client.get(reverse('dynamic_registration'))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'EconPractice: LTI 1.3 Dynamic Registration')
