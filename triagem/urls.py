from rest_framework.routers import DefaultRouter
from triagem.views import TriagemEnfermeiroViewSet, TriagemIAViewSet

router = DefaultRouter()

router.register(r'triagem-enfermeiro', TriagemEnfermeiroViewSet)
router.register(r'triagem-IA', TriagemIAViewSet)


urlpatterns = router.urls


