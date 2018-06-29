from django.test import TestCase
from econplayground.main.tests.factories import (
    InstructorFactory, UserFactory, StudentFactory
)


class LoggedInTestMixin(TestCase):
    def setUp(self):
        self.u = UserFactory(username='testuser')
        self.u.set_password('test')
        self.u.save()
        login = self.client.login(username='testuser', password='test')
        assert(login is True)


class LoggedInTestInstructorMixin(TestCase):
    def setUp(self):
        self.u = InstructorFactory()
        self.u.set_password('test')
        self.u.save()
        login = self.client.login(username=self.u.username, password='test')
        assert(login is True)


class LoggedInTestStudentMixin(TestCase):
    def setUp(self):
        self.u = StudentFactory(username='teststudent')
        self.u.set_password('test')
        self.u.save()
        login = self.client.login(username='teststudent', password='test')
        assert(login is True)
