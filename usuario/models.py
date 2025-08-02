import uuid
from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password



class Usuario(models.Model):
    
    nome_completo = models.CharField(max_length=100, verbose_name="Nome completo")
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF")
    data_nascimento = models.DateField(verbose_name="Data de nascimento")
    endereco = models.CharField(max_length=50, verbose_name="Endereço")
    email = models.EmailField("E-mail", unique=True, max_length=254)
    senha = models.CharField(max_length=128, verbose_name="Senha")
    data_criacao = models.DateField(auto_now_add=True)
    
    
    STATUS_ATIVO_CHOICE = [ # Se o usuario está ativo no sistema, se ainda mexe no sistema. Ex: medico de férias, coloca pra inativo...
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
        ('DESLIGADO', 'Desligado'),
    ]
    
    status_ativo = models.BooleanField(default=True, choices=STATUS_ATIVO_CHOICE) # usuario n interage
    
    
    STATUS_REGISTRO_CHOICE = [
        ('PENDENTE', 'Pendente'),
        ('AUTORIZADO', 'Autorizar'),
        ('REJEITADO', 'Rejeitar'),
    ]
    
    status_registro = models.CharField(max_length=10, choices=STATUS_REGISTRO_CHOICE, default='PENDENTE', verbose_name="Status de cadastramento")
    
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
    
    class Meta:
        abstract = True
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

        
    
    """ MÉTODOS USUARIO """ 
    def save(self, *args, **kwargs):
        # Verifica se a senha já não foi criptografada.
        if not self.senha.startswith('pbkdf2_'):
            self.senha = make_password(self.senha)
        super().save(*args, **kwargs)
    
       
class Medico(Usuario):
    crm = models.CharField(max_length=20, unique=True, verbose_name="CRM")
    especialidade = models.CharField(max_length=50, verbose_name="Especialidade")
    
    class Meta:
        verbose_name = "Medico"
        verbose_name_plural = "Medicos"
    
    def __str__(self):
        return f"{self.nome_completo} - CRM: {self.crm}"
    
    
       
class Enfermeiro(Usuario):
    coren = models.CharField(max_length=20, unique=True, verbose_name="Registro COREN")
    setor_atuacao = models.CharField(max_length=50, verbose_name="Setor de atuação")

    class Meta:
        verbose_name = "Enfermeiro"
        verbose_name_plural = "Enfermeiros"

    def __str__(self):
        return f"{self.nome_completo} - COREN: {self.coren}"
    
    
    
class Paciente(Usuario):
    cns = models.CharField(max_length=15, unique=True, verbose_name='Carteira Nacional de Saúde (CNS)')
    nome_pai = models.CharField(max_length=100, verbose_name="Nome completo do pai")
    nome_mae = models.CharField(max_length=100, verbose_name="Nome completo da mãe")

    class Meta:
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"
    
    def __str__(self):
        return f"{self.nome_completo} - CPF: {self.cpf}"
    
    
    
class AdministradorSistema(Usuario):
    cargo = models.TextField(max_length=3, verbose_name="Cargo administrativo")
    departamento = models.TextField(max_length=30, verbose_name="Departamento")
    NIVEL_CHOICES = [
        ('N1', 'Nivel basico'),
        ('N2', 'Nivel intermediario'),
        ('N3', 'Nivel avançado'),
    ]
    nivel_acesso = models.TextField(max_length=30, choices=NIVEL_CHOICES, verbose_name="Nivel de acesso")
    
    class Meta:
        verbose_name = "Administrador do Sistema"
        verbose_name_plural = "Administradores do Sistema"

    
    def __str__(self):
        return f"{self.nome_completo}- {self.get_nivel_acesso_display()}"
    
    
# class TokkenPrimeiroAcesso(models.Model):
#     tokken = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, verbose_name="Token de Convite")