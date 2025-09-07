from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import TriagemEnfermeiro, TriagemIA

class TriagemEnfermeiroSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TriagemEnfermeiro
        fields = ['id', 'pressao_arterial','temperatura','frequencia_cardiaca',
        'frequencia_respiratoria','saturacao_oxigenio','glicemia_capilar','observacoes_medicas','daca_criacao_triagem']
        read_only_fields = ['id'] 
        depth = 1
        
class TriagemIASerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(source='ficha_medica_paciente.paciente.nome_completo', read_only=True)

    class Meta:
        model = TriagemIA
        fields = ['id','paciente_nome', 'ficha_medica_paciente','diagnostico_IA','prioridade_IA','status_agendamento']
        read_only_fields = ['id']
        depth = 1


        
        
