from rest_framework.routers import DefaultRouter
from .views import ConsultaMedicaViewSet, ReceitaMedicaViewSet, MedicamentoViewSet, ExamesViewSet
router = DefaultRouter()

router.register(r'consulta-medica', ConsultaMedicaViewSet)
router.register(r'prescricao-medica', ReceitaMedicaViewSet)
router.register(r'medicamento', MedicamentoViewSet)
router.register(r'solicitar-exames', ExamesViewSet)

urlpatterns = router.urls







