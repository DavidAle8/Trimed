from rest_framework.routers import DefaultRouter
from .views import FichaMedicaPacienteViewSet, AgendamentoViewSet

router = DefaultRouter()

router.register(r'ficha-medica-paciente', FichaMedicaPacienteViewSet, basename='ficha')
router.register(r'agendamento', AgendamentoViewSet)

urlpatterns = router.urls

