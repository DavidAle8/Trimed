from rest_framework import generics, status
from .models import TriagemEnfermeiro, TriagemIA
from .serializers import TriagemEnfermeiroSerializer, TriagemIASerializer
from rest_framework.generics import get_object_or_404
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsMedico

class TriagemEnfermeiroViewSet(ModelViewSet):
    
    queryset = TriagemEnfermeiro.objects.all()
    serializer_class = TriagemEnfermeiroSerializer


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

    
    

