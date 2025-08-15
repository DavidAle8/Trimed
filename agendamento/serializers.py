from rest_framework import serializers
from .models import FichaMedicaPaciente
# IMPORTANTE: Importamos a versão 'Display'
from usuario.serializers import PacienteDisplaySerializer 

class FichaMedicaPacienteSerializer(serializers.ModelSerializer):
    # Usando o serializer de exibição
    paciente = PacienteDisplaySerializer(read_only=True)
    
    class Meta:
        model = FichaMedicaPaciente
        fields = '__all__'