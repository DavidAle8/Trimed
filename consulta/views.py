from rest_framework import generics, status
from .models import ConsultaMedica, ReceitaMedica, Medicamento, Exames 
from .serializers import ConsultaMedicaSerializer, ReceitaMedicaSerializer, MedicamentoSerializer, ExamesSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import mixins, viewsets

class ConsultaMedicaViewSet(ModelViewSet):
    queryset = ConsultaMedica.objects.all()
    serializer_class = ConsultaMedicaSerializer
    
class ReceitaMedicaViewSet(ModelViewSet):
    queryset = ReceitaMedica.objects.all()
    serializer_class = ReceitaMedicaSerializer 
    
class MedicamentoViewSet(ModelViewSet):
    queryset = Medicamento.objects.all()
    serializer_class = MedicamentoSerializer    
    
class ExamesViewSet(ModelViewSet):
    queryset = Exames.objects.all()
    serializer_class = ExamesSerializer    
    
    
    
    
    
    
     