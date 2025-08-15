from rest_framework.routers import DefaultRouter
from .views import ConsultaMedicaViewSet, ReceitaMedicaViewSet, MedicamentoViewSet, ExamesViewSet
router = DefaultRouter()

router.register(r'consulta-medica', ConsultaMedicaViewSet, basename='consulta')
router.register(r'prescricao-medica', ReceitaMedicaViewSet)
router.register(r'medicamento', MedicamentoViewSet)
router.register(r'solicitar-exames', ExamesViewSet, basename='exames')

urlpatterns = router.urls







