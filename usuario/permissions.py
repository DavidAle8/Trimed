from rest_framework.permissions import BasePermission

""" Servem para aplicar as permissões de RH e Adm """
class IsRH(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'rh'))

class IsAdministradorSistema(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'administradorsistema'))
