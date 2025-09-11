from django.utils import timezone
from django.shortcuts import get_object_or_404
from jsonschema import ValidationError
from triagem.models import TriagemIA
from .models import FichaMedicaPaciente, Agendamento
from .serializers import FichaMedicaPacienteSerializer, AgendamentoSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .services import IAService
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from notificacao.services import EmailFactory
from agendamento import serializers


class FichaMedicaPacienteViewSet(ModelViewSet):
    
    queryset = FichaMedicaPaciente.objects.all()
    serializer_class = FichaMedicaPacienteSerializer
    
    def perform_create(self, serializer):
        paciente = self.request.user.paciente
        ficha_medica_paciente = serializer.save(paciente=paciente)
        IAService.gerar_diagnostico(ficha_medica_paciente)
        

class AgendamentoViewSet(ModelViewSet):
    
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        triagem_id = self.request.data.get('triagem_IA')
        if triagem_id:
            try:
                context['triagem_IA'] = TriagemIA.objects.get(id=triagem_id)
            except TriagemIA.DoesNotExist:
                raise serializers.ValidationError("Triagem não encontrada")
        return context
    
    def get_queryset(self):
            user = self.request.user

            if hasattr(user, 'enfermeiro'):
                hoje = timezone.now().date()
                return Agendamento.objects.filter(data_hora_consulta__date=hoje).order_by('data_hora_consulta')
            
            elif hasattr(user, 'paciente'):
                return Agendamento.objects.filter(triagem_IA__ficha_medica_paciente__paciente=user.paciente).order_by('data_hora_consulta')
            
            else:
                return Agendamento.objects.none()

    def perform_create(self, serializer):
        
        agendamento = serializer.save()
        paciente = agendamento.triagem_IA.ficha_medica_paciente.paciente
        EmailFactory.email_confirmacao_agendamento(paciente)  
        

            

    