from django.db import models
from usuario.models import Medico, Enfermeiro, Paciente
from agendamento.models import FichaMedicaPaciente
from agendamento.models import Agendamento

""" Enfermeiro recebe uma ficha triada e agendada para averiguar e colocar seus dados de triagen."""
class TriagemEnfermeiro(models.Model):
    
    TEXT_DEFAULT = "Procedimento não realizado"

    agendamento = models.OneToOneField(Agendamento, null=False, on_delete=models.CASCADE, verbose_name="Agendamento do Paciente") 
    enfermeiro = models.ForeignKey(Enfermeiro, on_delete=models.SET_NULL, null=True, verbose_name="Enfermeiro Responsável")
    
    pressao_arterial = models.CharField(max_length=10, blank=True, default=TEXT_DEFAULT, verbose_name="Pressão Arterial (mmHg)")
    temperatura  = models.DecimalField(max_digits=4, decimal_places=1, default=0.0, blank=True, null=True, verbose_name="Temperatura (°C)")
    frequencia_cardiaca = models.IntegerField(blank=True, null=True, default=0, verbose_name="Frequência Cardíaca (bpm)")
    frequencia_respiratoria = models.IntegerField(blank=True, null=True, default=0, verbose_name="Frequência Respiratória (rpm)")
    saturacao_oxigenio = models.IntegerField(blank=True, null=True, default=0, verbose_name="Saturação de Oxigênio (%)")
    glicemia_capilar = models.IntegerField(blank=True, null=True, default=0, verbose_name="Glicemia Capilar (mg/dL)") 
    observacoes_medicas = models.TextField(blank=True ,verbose_name="Informe algumas observações médicas se necessário")
    
    class Meta:
        verbose_name = "Triagem do enfermeiro(a)"
        verbose_name_plural = "Triagens do enfermeiros(as)"
        
    def __str__(self):
        return f"Enfermeiro(a): {self.enfermeiro.nome_completo} - Data/hora da consulta: {self.agendamento.data_hora_consulta}"
    
    
""" Triagem IA recebe uma ficha para poder dar seu diagnóstico e a prioridade"""
class TriagemIA(models.Model):
    
    ficha_medica_paciente = models.OneToOneField(FichaMedicaPaciente, on_delete=models.CASCADE, verbose_name="Agendamento do paciente")
   
    diagnostico_IA = models.TextField(verbose_name="Diagnóstico da IA")
    PRIORIDADE_IA_CHOICES = [
        ('EMERGENCIA - VERMELHO', 'EMERGÊNCIA (vermelho)'),
        ('MUITO URGENTE - LARANJA', 'MUITO URGENTE (laranja)'),
        ('URGENTE - AMARELO', 'URGENTE (amarelo)'),
        ('POUCO URGENTE - VERDE', 'POUCO URGENTE (verde)'),
        ('NAO URGENTE - AZUL', 'NÃO URGENTE (azul)'),
        ('INDEFINIDO', 'INDEFINIDO'),
    ]
    prioridade_IA = models.CharField(max_length=40, choices=PRIORIDADE_IA_CHOICES, blank=True, null=True,verbose_name="Prioridade Classificada pela IA")
        
    STATUS_AGENDAMENTO_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('CONFIRMADO', 'Confirmado'),
    ]
    status_agendamento = models.CharField(max_length=20, choices=STATUS_AGENDAMENTO_CHOICES, default='PENDENTE',verbose_name="Status do Agendamento")

