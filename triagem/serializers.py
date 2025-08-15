from rest_framework import serializers
from .models import TriagemEnfermeiro
# IMPORTANTE: Importamos a versão 'Display'
from usuario.serializers import EnfermeiroDisplaySerializer 
from agendamento.serializers import FichaMedicaPacienteSerializer

class TriagemEnfermeiroSerializer(serializers.ModelSerializer):
    # Usando o serializer de exibição
    enfermeiro = EnfermeiroDisplaySerializer(read_only=True)
    ficha_clinica_paciente = FichaMedicaPacienteSerializer(read_only=True)

    class Meta:
        model = TriagemEnfermeiro
        fields = '__all__'