from django.contrib import admin
from .models import Agendamento, FichaMedicaPaciente

@admin.register(Agendamento)
class AgendamentoAdmin(admin.ModelAdmin):
    list_display = ['triagem_IA', 'medico', 'data_criacao_agendamento', 'data_hora_consulta']
    search_fields = ['medico__nome_completo', 'triagem_IA__id']
    list_filter = ['data_hora_consulta', 'medico']
    raw_id_fields = ['triagem_IA', 'medico']

@admin.register(FichaMedicaPaciente)
class FichaMedicaPacienteAdmin(admin.ModelAdmin):
    list_display = ['paciente', 'motivo_consulta']
    search_fields = ['paciente__nome_completo', 'motivo_consulta']
    raw_id_fields = ['paciente']
