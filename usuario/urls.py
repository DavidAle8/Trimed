from rest_framework.routers import DefaultRouter
from .views import MedicoViewSet, PacienteViewSet, EnfermeiroViewSet, AdministradorSistemaViewSet

router = DefaultRouter()

router.register(r'medico', MedicoViewSet)
router.register(r'paciente', PacienteViewSet)
router.register(r'enfermeiro', EnfermeiroViewSet)
router.register(r'administrador', AdministradorSistemaViewSet)

urlpatterns = router.urls



