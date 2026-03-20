from django.contrib import admin
from django.urls import path, include
from usuario.urls import router as router_usuarios
from agendamento.urls import router as router_agendamentos
from consulta.urls import router as router_consulta
from triagem.urls import router as router_triagem
from notificacao.urls import router as router_notificacao
 
urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include(router_usuarios.urls)), 
    path('api/', include(router_agendamentos.urls)),
    path('api/', include(router_triagem.urls)),
    path('api/', include(router_consulta.urls)),
    path('api/', include(router_notificacao.urls)),
    
    
    path('auth/', include('rest_framework.urls')),
]
 