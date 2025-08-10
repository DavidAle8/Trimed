from datetime import timedelta, timezone
import random, string
from rest_framework import serializers
from .models import Usuario, Medico, Paciente, Enfermeiro, AdministradorSistema, RH, CadastroToken
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from notificacao.services import EmailFactory
User = get_user_model()


# class LoginSerializer():
    # Colocar a lógica de, antes de darem os tokens pra eles, verificar se o status_registro é pendente e is_active é false.

class MudarSenhaSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    token = serializers.CharField() 
    senha = serializers.CharField(write_only=True, min_length=6)
    confirmar_senha = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        
        if data["senha"] != data["confirmar_senha"]:
            raise serializers.ValidationError({"confirmar_senha": "As senhas digitadas não coincidem."})
        
        token_value = data.get("token")
        
        if not token_value:
            raise serializers.ValidationError({"token": "O token é obrigatório."})

        try:
            cadastro_token = CadastroToken.objects.get(token=token_value)
            if cadastro_token.expirou():
                raise serializers.ValidationError({"token": "Token digitado foi expirado, por favor gere outro token."})
        except CadastroToken.DoesNotExist:
            raise serializers.ValidationError({"token": "O token digitado não existe, verifique se foi digitado corretamente."})
        
        self.instance_token = cadastro_token

        return data

    def save(self):
        usuario = self.instance_token.content_object
        senha = self.validated_data["senha"]
        
        usuario.set_password(senha)
        usuario.is_active = True 
        usuario.status_registro = "AUTORIZADO"
        usuario.save()

        self.instance_token.delete()
        return usuario



class CadastroTokenSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = CadastroToken
        fields = ['token', 'expira_em', 'email']  # expõe o token se quiser, ou não

    def create(self, validated_data):
        
        email = validated_data['email']

        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Email digitado incorreto ou não registrado.")
        
        caracteres = (string.ascii_uppercase + string.ascii_lowercase + string.digits +string.punctuation)     
        token_str = ''.join(random.choices(caracteres, k=6))

        token = CadastroToken.objects.create(
            token=token_str,
            expira_em=timezone.now() + timedelta(hours=24)
        )

        EmailFactory.email_token(usuario, token_str)

        return token




class UsuarioSerializer(serializers.ModelSerializer):
    
    senha = serializers.CharField(write_only=True, required=False)
    confirmar_senha = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Usuario
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'telefone', 'senha']
        #extra_kwargs = {'senha': {'write_only': True}}
       
    def validate(self, data):
        
        senha = data.get('senha')
        confirmar_senha = data.get('confirmar_senha')

        if senha and confirmar_senha and senha != confirmar_senha:
            raise serializers.ValidationError({"confirmar_senha": "As senhas digitadas não coincidem."})
        return data
    
    def create(self, validated_data):
        
        senha = validated_data.pop('senha', None)
        user = Usuario.objects.create_user(password=senha, **validated_data)
        return user

    def update(self, instance, validated_data):
        
        if 'senha' in validated_data:
            instance.set_password(validated_data['senha'])  # <- Criptografa corretamente
            validated_data.pop('senha')  # <- Evita salvar senha em texto puro
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
        fields = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'telefone', 'senha', 'cargo', 'departamento']

    def create(self, validated_data):
        senha = validated_data.pop('senha', None)
        usuario_RH = RH.objects.create_user(password=senha, **validated_data)
        return usuario_RH