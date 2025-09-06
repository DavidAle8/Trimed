from rest_framework import generics, status
from agendamento.models import Agendamento
from usuario.models import Enfermeiro
from .models import TriagemEnfermeiro, TriagemIA
from .serializers import TriagemEnfermeiroSerializer, TriagemIASerializer
from rest_framework.generics import get_object_or_404
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsMedico
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class TriagemEnfermeiroViewSet(ModelViewSet):
    
    queryset = TriagemEnfermeiro.objects.all()
    serializer_class = TriagemEnfermeiroSerializer
    
    def get_queryset(self):
    
        enfermeiro = Enfermeiro.objects.get(user=self.request.user)
        return TriagemEnfermeiro.objects.filter(enfermeiro=enfermeiro)


    def perform_create(self, serializer):

        agendamento_id = self.request.data.get("agendamento_id")
        if not agendamento_id:
            raise ValidationError({"agendamento_id": "Este campo é obrigatório."})

        agendamento = get_object_or_404(Agendamento, pk=agendamento_id)
        enfermeiro = self.request.user.enfermeiro 

        serializer.save(agendamento=agendamento, enfermeiro=enfermeiro)


class TriagemIAViewSet(ModelViewSet):
    
    queryset = TriagemIA.objects.all()
    serializer_class = TriagemIASerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'list':
            return [IsMedico()]
        if self.action == 'agendar':
            return [IsMedico()]
        return [IsAuthenticated()]

    
    

