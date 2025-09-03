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
                context['triagem'] = TriagemIA.objects.get(id=triagem_id)
            except TriagemIA.DoesNotExist:
                raise serializers.ValidationError("Triagem não encontrada")
        return context

    def perform_create(self, serializer):
        agendamento = serializer.save()
        paciente = agendamento.triagem_IA.ficha_medica_paciente.paciente
        EmailFactory.email_confirmacao_agendamento(paciente)
        

    