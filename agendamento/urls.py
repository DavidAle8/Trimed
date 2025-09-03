from rest_framework.routers import DefaultRouter
from .views import FichaMedicaPacienteViewSet, AgendamentoViewSet

router = DefaultRouter()

router.register(r'ficha-medica-paciente', FichaMedicaPacienteViewSet, basename='ficha')
router.register(r'agendamento', AgendamentoViewSet)

urlpatterns = router.urls

# http://127.0.0.1:8000/api/ficha-medica-paciente