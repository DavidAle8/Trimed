from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import TriagemEnfermeiro, triagemIA

class TriagemEnfermeiroSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = TriagemEnfermeiro
        fields = '__all__'
        
class triagemIASerializer(serializers.ModelSerializer):
    
    class Meta():
        model = triagemIA
        fields = '__all__'
        
        
