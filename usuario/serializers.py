from datetime import timedelta, timezone
import random, string
from rest_framework import serializers
from .models import Usuario, Medico, Paciente, Enfermeiro, AdministradorSistema, RH, Token
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from notificacao.services import EmailFactory
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .helpers import gerar_token
from usuario.facade.validatorfacade import ValidationFacade
from usuario.factory.factoryvalidate import TokenFactory

User = get_user_model()

""" LoginSerializer serve para validar se o email ou a senha estão digitadas corretamentes"""
class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        usuario = self.user 

        if getattr(usuario, "status_registro", None) == "PENDENTE" and usuario.is_active is False:
            raise serializers.ValidationError("Estas credenciais fornecidas não faz parte de um usuario ativo no sistema")

        return data


"""
    Serve para mudar a senha dado o token, senha e confirmar senha. 
    Antes valida se o token, senha e confirmar senha estão digitados corretamente antes de salvar a senha
"""
class MudarSenhaSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    token = serializers.CharField() 
    senha = serializers.CharField(write_only=True, min_length=6)
    confirmar_senha = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):

        if data["senha"] != data["confirmar_senha"]:
            raise serializers.ValidationError({"confirmar_senha": "As senhas digitadas não coincidem."})
        
        token_front = data.get("token")
        
        try:
            cadastro_token = TokenFactory().validate(token=token_front)
        except ValueError as e:
            raise serializers.ValidationError({"token": str(e)})

        self.instance_token = cadastro_token

        return data

    def save(self):
        
        cadastro_token = self.instance_token
        usuario = cadastro_token.usuario
        senha = self.validated_data["senha"]

        with transaction.atomic():
            usuario.set_password(senha)

            if getattr(usuario, "status_registro", None) == "PENDENTE" and usuario.is_active is False:
                usuario.is_active = True
                usuario.status_registro = "AUTORIZADO"

            usuario.save()
            cadastro_token.delete()

        return usuario



""" Gera o token para o usuario alterar a senha. Valida se o email digitado existe, se existir, manda o token por email"""
class TokenSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Token
        fields = ['token', 'email', 'usuario']
        read_only_fields = ['expira_em', 'token', 'usuario'] 

    def create(self, validated_data):
        
        email_front = validated_data['email']

        try:
            usuario = Usuario.objects.get(email=email_front)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Email digitado incorreto ou não registrado.")
        
        token_str = gerar_token()

        token = Token.objects.create(token=token_str, usuario=usuario)

        return token




""" Serialziers voltadas aos usuarios"""
class UsuarioSerializer(serializers.ModelSerializer):
    
    senha = serializers.CharField(write_only=True, required=False)
    confirmar_senha = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Usuario
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'telefone', 'senha']
        #extra_kwargs = {'senha': {'write_only': True}}
       
    def validate(self, data):

        # fachada que valida os dados bases de cada classe.
        erros = ValidationFacade(data).validar()
        
        if erros:  
            raise serializers.ValidationError(erros)

        senha = data.get('senha')
        confirmar_senha = data.get('confirmar_senha')
        
        if senha and confirmar_senha and senha != confirmar_senha:
            raise serializers.ValidationError({"confirmar_senha": "As senhas digitadas não coincidem."})
        
        return data

    def update(self, instance, validated_data):
        
        if 'senha' in validated_data:
            instance.set_password(validated_data['senha']) 
            validated_data.pop('senha')  
        return super().update(instance, validated_data)

    
     
class MedicoSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = Medico
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'telefone', 'senha', 'crm', 'especialidade']
        
    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        usuario_medico = Medico.objects.create_user(password=senha, **validated_data)
        return usuario_medico
        
        
        
class PacienteSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = Paciente
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'telefone', 'senha', 'cns']

    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        usuario_paciente = Paciente.objects.create_user(password=senha, **validated_data)
        return usuario_paciente
        
        
        
        
class EnfermeiroSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = Enfermeiro
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'telefone', 'senha', 'coren', 'setor_atuacao']

    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        useruario_enfermeiro = Enfermeiro.objects.create_user(password=senha, **validated_data)
        return useruario_enfermeiro


    

class AdministradorSistemaSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = AdministradorSistema
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'telefone', 'senha', 'cargo', 'departamento']
    
    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        usuario_administrador = AdministradorSistema.objects.create_user(password=senha, **validated_data)
        return usuario_administrador
   
   
   
         
class RHSerializer(UsuarioSerializer):
    
    class Meta(UsuarioSerializer.Meta):
        model = RH
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 
        'telefone', 'senha', 'cargo', 'setor_responsabilidade']

    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        usuario_RH = RH.objects.create_user(password=senha, **validated_data)
        return usuario_RH