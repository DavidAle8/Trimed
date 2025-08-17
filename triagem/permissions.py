# permissions.py
from rest_framework.permissions import BasePermission

class IsMedico(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'medico', None) is not None
        )

    def has_object_permission(self, request, view, obj):
        # para ações que precisem checar um objeto específico, opcional.
        return self.has_permission(request, view)
