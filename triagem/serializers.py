from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import TriagemEnfermeiro, TriagemIA

class TriagemEnfermeiroSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = TriagemEnfermeiro
        fields = '__all__'
        
class TriagemIASerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TriagemIA
        fields = ['id', 'ficha_medica_paciente', 'diagnostico_IA', 'prioridade_IA', 'status_agendamento']
        depth = 1

        
        
