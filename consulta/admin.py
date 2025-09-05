from django.contrib import admin
from .models import ConsultaMedica, ReceitaMedica, Medicamento, ReceitaItem, Exames

@admin.register(ConsultaMedica)
class ConsultaMedicaAdmin(admin.ModelAdmin):
    list_display = ['medico', 'triagem_enfermeiro', 'diagnostico_final']
    search_fields = ['medico__nome_completo', 'triagem_enfermeiro__enfermeiro__nome_completo']
    raw_id_fields = ['triagem_enfermeiro', 'medico']


@admin.register(ReceitaMedica)
class ReceitaMedicaAdmin(admin.ModelAdmin):
    list_display = ['consulta', 'data_hora_prescricao']
    search_fields = ['consulta__medico__nome_completo', 'consulta__triagem_enfermeiro__agendamento__triagem_IA__ficha_medica_paciente__paciente__nome_completo']
    raw_id_fields = ['consulta']
    
    
@admin.register(Medicamento)
class MedicamentoAdmin(admin.ModelAdmin):
    list_display = ['nome_medicamento', 'tarja_medicamento']
    search_fields = ['nome_medicamento']
    list_filter = ['tarja_medicamento']



@admin.register(ReceitaItem)
class ReceitaItemAdmin(admin.ModelAdmin):
    list_display = ['receita', 'medicamento', 'dosagem', 'quantidade', 'via_medicamento']
    search_fields = ['receita__id', 'medicamento__nome_medicamento']
    list_filter = ['via_medicamento']
    raw_id_fields = ['receita', 'medicamento']


@admin.register(Exames)
class ExamesAdmin(admin.ModelAdmin):
    list_display = ['consulta', 'tipo_exame', 'status_exame', 'data_solicitacao_exame']
    search_fields = ['consulta__medico__nome_completo', 'exame_solicitado']
    list_filter = ['tipo_exame', 'prioridade_exame', 'status_exame']
    raw_id_fields = ['consulta']
