from .models import FichaMedicaPaciente, Agendamento
from .serializers import FichaMedicaPacienteSerializer, AgendamentoSerializer
from rest_framework.generics import get_object_or_404
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response


class FichaMedicaPacienteViewSet(ModelViewSet):
    
    queryset = FichaMedicaPaciente.objects.all()
    serializer_class = FichaMedicaPacienteSerializer

class AgendamentoViewSet(ModelViewSet):
    
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer
    
    
    # Colocar metodo que pegue a ficha e mande para a IA
    # chamar o método de enviar email do paciente sobre o agendamento será um método 
    # confirmar agendamento será um método  
    # editar o diagnostico da IA se pá seja um método
    
    # metodos com @action get/post será por aqui (se necessário), seja para editar um agendamento (paciente pode fazer isso)
    # cancelar agendamento ou até listar os agendamentos. e lá terá um botao para ver detalhes talvez.
    
    
    
    