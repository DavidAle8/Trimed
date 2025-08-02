from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import FichaMedicaPaciente, Agendamento

class FichaMedicaPacienteSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = FichaMedicaPaciente
        fields = '__all__'


class AgendamentoSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = Agendamento
        fields = '__all__'
        