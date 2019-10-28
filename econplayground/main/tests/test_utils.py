from django.test import TestCase
from econplayground.main.utils import user_is_instructor
from econplayground.main.tests.factories import (
    InstructorFactory, StudentFactory
)


class UtilsTest(TestCase):
    def setUp(self):
        self.instructor = InstructorFactory()
        self.student = StudentFactory()

    def test_user_is_instructors(self):
        self.assertTrue(user_is_instructor(self.instructor))
        self.assertFalse(user_is_instructor(self.student))
