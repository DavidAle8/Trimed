from rest_framework import generics, status
from .models import TriagemEnfermeiro, triagemIA
from .serializers import TriagemEnfermeiroSerializer, triagemIASerializer
from rest_framework.generics import get_object_or_404
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
    
class TriagemEnfermeiroViewSet(ModelViewSet):
    queryset = TriagemEnfermeiro.objects.all()
    serializer_class = TriagemEnfermeiroSerializer


class triagemIAViewSet(ModelViewSet):
    queryset = triagemIA.objects.all()
    serializer_class = triagemIASerializer
    
    # Vai ter um método que vai pegar as coisas do agendamento e jogar pro médico.
    

