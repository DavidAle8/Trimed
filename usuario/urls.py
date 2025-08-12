from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (MedicoViewSet, PacienteViewSet, EnfermeiroViewSet, RHViewSet, 
AdministradorSistemaViewSet, MudarSenhaViewSet, CadastroTokenViewSet, LoginView, LogoutView)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()

router.register(r'medico',MedicoViewSet )
router.register(r'paciente', PacienteViewSet)
router.register(r'enfermeiro', EnfermeiroViewSet)
router.register(r'administrador', AdministradorSistemaViewSet)
router.register(r'rh', RHViewSet)
router.register(r'token', CadastroTokenViewSet)

urlpatterns = router.urls


urlpatterns += [
    path('mudar-senha/', MudarSenhaViewSet.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]


# Para o MedicoViewSet, por exemplo, ele geraria URLs como:

# GET /api/medico/: Listar todos os médicos.
# POST /api/medico/: Criar um novo médico.
# GET /api/medico/{id}/: Detalhar um médico específico.
# PUT /api/medico/{id}/: Atualizar completamente um médico.
# PATCH /api/medico/{id}/: Atualizar parcialmente um médico.
# DELETE /api/medico/{id}/: Deletar um médico.
