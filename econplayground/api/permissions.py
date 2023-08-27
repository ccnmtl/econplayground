from rest_framework.permissions import BasePermission
from econplayground.main.utils import user_is_instructor


class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return user_is_instructor(request.user)
