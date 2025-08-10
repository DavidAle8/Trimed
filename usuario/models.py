from datetime import timedelta
from django.utils import timezone
import random, string, uuid
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User, AbstractUser, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey



class UsuarioManager(BaseUserManager):

    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O campo email é obrigatório.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) 
        user.save(using=self._db)

        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_active", True)

        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superusuário precisa ter is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superusuário precisa ter is_superuser=True.")

        return self._create_user(email, password, **extra_fields)





class Usuario(AbstractBaseUser, PermissionsMixin):
    
    nome_completo = models.CharField(max_length=100, verbose_name="Nome completo")
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF")
    data_nascimento = models.DateField(verbose_name="Data de nascimento")
    endereco = models.CharField(max_length=50, verbose_name="Endereço")
    email = models.EmailField(unique=True, max_length=254)
    data_criacao = models.DateField(auto_now_add=True)

    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Feminino'),
    ]
    sexo = models.CharField(max_length=10, choices=SEXO_CHOICES, verbose_name="Sexo")

    telefone = models.CharField(max_length=15, validators=[
        RegexValidator(
            regex=r'^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$',
            message="Formato de número inválido! formato correto: (11) 91234-5678"
        )
    ], verbose_name="Telefone")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
          
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios" 
        
    def __str__(self):
        return self.email
       
       
      
      
class Paciente(Usuario):
    
    cns = models.CharField(max_length=15, unique=True, verbose_name='Carteira Nacional de Saúde (CNS)')

    class Meta:
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"
    
    def __str__(self):
        return f"{self.nome_completo} - CPF: {self.cpf}"
    
      
       
       
class Medico(Usuario):
    
    crm = models.CharField(max_length=20, unique=True, verbose_name="CRM")
    especialidade = models.CharField(max_length=50, verbose_name="Especialidade")
    STATUS_REGISTRO_CHOICE = [
        ('PENDENTE', 'Pendente'),
        ('AUTORIZADO', 'Autorizar'),
        ('REJEITADO', 'Rejeitar'),
    ]
    
    status_registro = models.CharField(max_length=10, choices=STATUS_REGISTRO_CHOICE, default='PENDENTE', verbose_name="Status de cadastramento")
    
    class Meta:
        verbose_name = "Medico"
        verbose_name_plural = "Medicos"
    
    def __str__(self):
        return f"{self.nome_completo} - CRM: {self.crm}"
    
    
       
class Enfermeiro(Usuario):
    
    coren = models.CharField(max_length=20, unique=True, verbose_name="Registro COREN")
    setor_atuacao = models.CharField(max_length=50, verbose_name="Setor de atuação")
    STATUS_REGISTRO_CHOICE = [
        ('PENDENTE', 'Pendente'),
        ('AUTORIZADO', 'Autorizar'),
        ('REJEITADO', 'Rejeitar'),
    ]
    
    status_registro = models.CharField(max_length=10, choices=STATUS_REGISTRO_CHOICE, default='PENDENTE', verbose_name="Status de cadastramento")

    class Meta:
        verbose_name = "Enfermeiro"
        verbose_name_plural = "Enfermeiros"

    def __str__(self):
        return f"{self.nome_completo} - COREN: {self.coren}"
    
    
    
    
    
class AdministradorSistema(Usuario):
    cargo = models.TextField(max_length=3, verbose_name="Cargo administrativo")
    departamento = models.TextField(max_length=30, verbose_name="Departamento")

    STATUS_REGISTRO_CHOICE = [
        ('PENDENTE', 'Pendente'),
        ('AUTORIZADO', 'Autorizar'),
        ('REJEITADO', 'Rejeitar'),
    ]
    
    status_registro = models.CharField(max_length=10, choices=STATUS_REGISTRO_CHOICE, default='PENDENTE', verbose_name="Status de cadastramento")

    class Meta:
        verbose_name = "Administrador do Sistema"
        verbose_name_plural = "Administradores do Sistema"

    
    def __str__(self):
        return f"{self.nome_completo} - Cargo:{self.cargo}"
    
    


class RH(Usuario):
    cargo = models.CharField(max_length=50, verbose_name="Cargo do RH")
    departamento = models.CharField(max_length=50, verbose_name="Departamento do RH")

    def __str__(self):
        return f"{self.nome_completo} - RH: {self.cargo}"
    


class CadastroToken(models.Model):
    
    token = models.CharField(max_length=6, unique=True, editable=False)
    expira_em = models.DateTimeField(default=(timezone.now() + timedelta(minutes=15)))

    def expirou(self):
        return timezone.now() > self.expira_em

    class Meta:
        verbose_name = "Token"
        verbose_name_plural = "Tokens"

    def __str__(self):
        return f"{self.token} - vaidade: {self.expira_em}"