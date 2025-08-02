from rest_framework.routers import DefaultRouter
from triagem.views import TriagemEnfermeiroViewSet, triagemIAViewSet

router = DefaultRouter()

router.register(r'triagem-enfermeiro', TriagemEnfermeiroViewSet)
router.register(r'triagem-IA', triagemIAViewSet)

urlpatterns = router.urls


