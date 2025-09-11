from django.contrib import admin
from .models import Usuario, Medico, Paciente, Enfermeiro, AdministradorSistema, RH, Token

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'is_active', 'is_staff']
    search_fields = ['email', 'nome_completo', 'cpf']
    list_filter = ['is_active', 'is_staff']

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ['nome_completo', 'crm', 'especialidade', 'email', 'status_registro']
    search_fields = ['nome_completo', 'crm', 'email']
    list_filter = ['especialidade', 'status_registro']

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ['nome_completo', 'cns', 'email']
    search_fields = ['nome_completo', 'cns', 'email']

@admin.register(Enfermeiro)
class EnfermeiroAdmin(admin.ModelAdmin):
    list_display = ['nome_completo', 'coren', 'setor_atuacao', 'email', 'status_registro']
    search_fields = ['nome_completo', 'coren', 'email']
    list_filter = ['setor_atuacao', 'status_registro']

@admin.register(AdministradorSistema)
class AdministradorSistemaAdmin(admin.ModelAdmin):
    list_display = ['nome_completo', 'cargo', 'departamento', 'email', 'status_registro']
    search_fields = ['nome_completo', 'cargo', 'email']
    list_filter = ['cargo', 'departamento', 'status_registro']

@admin.register(RH)
class RHAdmin(admin.ModelAdmin):
    list_display = ['nome_completo', 'cargo', 'setor_responsabilidade', 'email']
    search_fields = ['nome_completo', 'email']
    list_filter = ['cargo', 'setor_responsabilidade']

@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'token']
    search_fields = ['usuario__nome_completo', 'token']

