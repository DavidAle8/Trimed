from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import TriagemEnfermeiro, TriagemIA

class TriagemEnfermeiroSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TriagemEnfermeiro
        fields = [
            'agendamento',  
            'enfermeiro',  
            'pressao_arterial',
            'temperatura',
            'frequencia_cardiaca',
            'frequencia_respiratoria',
            'saturacao_oxigenio',
            'glicemia_capilar',
        ]
        read_only_fields = ['agendamento', 'enfermeiro'] 
        depth = 1
        
class TriagemIASerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TriagemIA
        fields = ['id', 'ficha_medica_paciente', 'diagnostico_IA', 'prioridade_IA', 'status_agendamento']
        depth = 1

        
        
