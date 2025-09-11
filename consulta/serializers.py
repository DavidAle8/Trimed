from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import ConsultaMedica, ReceitaMedica, Medicamento, Exames



class ConsultaMedicaSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = ConsultaMedica
        fields = '__all__'
            
class ReceitaMedicaSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = ReceitaMedica
        fields = '__all__'

class MedicamentoSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = Medicamento
        fields = '__all__'
        

class ExamesSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = Exames
        fields = '__all__'
        
        
        
        
        