from rest_framework import serializers
from .models import Usuario, Medico, Paciente, Enfermeiro, AdministradorSistema
from django.contrib.auth.hashers import make_password, check_password


class UsuarioSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = Usuario 
        fields = '__all__'
        
    """ MÉTODOS """

    def validar_login(self, data):
        cpf = data.get('cpf') 
        senha = data.get('senha')
        
        usuario = Usuario.objects.filter(cpf=cpf).first()
        if not usuario:
            raise serializers.ValidationError({"cpf": "CPF incorreto."})  # Mensagem diferente
        
        if not check_password(senha, usuario.senha):
            raise serializers.ValidationError({"senha": "Senha incorreta."})
        return usuario
    
    
    def validar_senha(self, data): # data irá pegar pra gente os dados do valor e chave do json que o front nos dá
        
        senha = data.get('senha')  # Obtém a senha do json do front (n removo pq esse dado (senha) faz parte dos registros do BD)
        confirmar_senha = data.pop('confirmar_senha', None)  # Obtém o confirmar senha do json do front (remove pq n faz parte dos registros do BD)

        if senha != confirmar_senha:
            raise serializers.ValidationError({"confirmar_senha": "As senhas digitadas não coincidem."})
        
        return data

    
    def update(self, instance, validated_data):
        if 'senha' in validated_data:
            instance.senha = validated_data.pop('senha')

        return super().update(instance, validated_data)
    
    
    
class MedicoSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = Medico
        fields = '__all__'
        #extra_kwargs = {'senha': {'write_only': True}}
        
        
class PacienteSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = Paciente
        fields = '__all__'
        
        
class EnfermeiroSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = Enfermeiro
        fields = '__all__'
        

class AdministradorSistemaSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = AdministradorSistema
        fields = '__all__'