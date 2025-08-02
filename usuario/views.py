from rest_framework import generics, status
from .models import Usuario, Medico, Paciente, Enfermeiro, AdministradorSistema
from .serializers import UsuarioSerializer, MedicoSerializer, PacienteSerializer, EnfermeiroSerializer, AdministradorSistemaSerializer
from rest_framework.generics import get_object_or_404
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response


class MedicoViewSet(ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

    # def perform_create(self, serializer):
    #     medico = serializer.save()
    #     # Aqui você envia o e-mail
    #     EmailFactory.enviar_email_confirmacao_medico(medico)
    
    
    # def perform_update(self, serializer):
    #     medico = serializer.save()
    #     EmailFactory.enviar_email_atualizacao_dados(medico)
    
class PacienteViewSet(ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    
    # def perform_create(self, serializer):
    #     paciente = serializer.save()
    #     EmailFactory.enviar_email_cadastro(paciente)


class EnfermeiroViewSet(ModelViewSet):
    queryset = Enfermeiro.objects.all()
    serializer_class = EnfermeiroSerializer


class AdministradorSistemaViewSet(ModelViewSet):
    queryset = AdministradorSistema.objects.all()
    serializer_class = AdministradorSistemaSerializer

