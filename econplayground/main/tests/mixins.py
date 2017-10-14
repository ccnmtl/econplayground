from django.test import TestCase
from econplayground.main.tests.factories import UserFactory


class LoggedInTestMixin(TestCase):
    def setUp(self):
        self.u = UserFactory(username='testuser')
        self.u.set_password('test')
        self.u.save()
        login = self.client.login(username='testuser', password='test')
        assert(login is True)
