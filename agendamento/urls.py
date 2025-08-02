from rest_framework.routers import DefaultRouter
from .views import FichaMedicaPacienteViewSet, AgendamentoViewSet

router = DefaultRouter()

router.register(r'ficha-medica-paciente', FichaMedicaPacienteViewSet)
router.register(r'agendamento-consulta', AgendamentoViewSet)

urlpatterns = router.urls
