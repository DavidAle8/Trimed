from django.contrib import admin
from .models import TriagemEnfermeiro, TriagemIA


@admin.register(TriagemEnfermeiro)
class TriagemEnfermeiroAdmin(admin.ModelAdmin):
    list_display = ['agendamento', 'enfermeiro', 'pressao_arterial', 'temperatura', 'frequencia_cardiaca']
    search_fields = ['enfermeiro__nome_completo', 'agendamento__id']
    list_filter = ['enfermeiro']
    raw_id_fields = ['agendamento', 'enfermeiro']


@admin.register(TriagemIA)
class TriagemIAAdmin(admin.ModelAdmin):
    list_display = ['ficha_medica_paciente', 'prioridade_IA', 'status_agendamento']
    search_fields = ['ficha_medica_paciente__paciente__nome_completo', 'diagnostico_IA']
    list_filter = ['prioridade_IA', 'status_agendamento']
    raw_id_fields = ['ficha_medica_paciente']
