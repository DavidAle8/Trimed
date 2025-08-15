from rest_framework.routers import DefaultRouter
from .views import FichaMedicaPacienteViewSet, AgendamentoViewSet

router = DefaultRouter()

router.register(r'ficha-medica-paciente', FichaMedicaPacienteViewSet, basename='ficha')
router.register(r'agendamento-consulta', AgendamentoViewSet, basename='agendamento')

urlpatterns = router.urls
