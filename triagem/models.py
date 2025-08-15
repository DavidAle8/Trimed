from django.db import models
from usuario.models import Medico, Enfermeiro, Paciente
from agendamento.models import Agendamento, FichaMedicaPaciente

class TriagemEnfermeiro(models.Model):
    
    TEXT_DEFAULT = "Procedimento não realizado"
    
    ficha_clinica = models.OneToOneField(FichaMedicaPaciente, on_delete=models.CASCADE, verbose_name="Ficha Médica do Paciente") 
    enfermeiro = models.ForeignKey(Enfermeiro, on_delete=models.SET_NULL, null=True, verbose_name="Enfermeiro Responsável")
    
    pressao_arterial = models.CharField(max_length=10, blank=True, default=TEXT_DEFAULT, verbose_name="Pressão Arterial (mmHg)")
    temperatura  = models.DecimalField(max_digits=4, decimal_places=1, default=0.0, blank=True, null=True, verbose_name="Temperatura (°C)")
    frequencia_cardiaca = models.IntegerField(blank=True, null=True, default=0, verbose_name="Frequência Cardíaca (bpm)")
    frequencia_respiratoria = models.IntegerField(blank=True, null=True, default=0, verbose_name="Frequência Respiratória (rpm)")
    saturacao_oxigenio = models.IntegerField(blank=True, null=True, default=0, verbose_name="Saturação de Oxigênio (%)")
    glicemia_capilar = models.IntegerField(blank=True, null=True, default=0, verbose_name="Glicemia Capilar (mg/dL)") 
    
    class Meta:
        verbose_name = "Triagem do enfermeiro(a)"
        verbose_name_plural = "Triagens do enfermeiros(as)"
        
    def __str__(self):
        paciente_nome = self.ficha_clinica.paciente.nome_completo
        #data_hora = self.data_hora_triagem.strftime('%d/%m/%Y %H:%M')
        return f"Enfermeiro(a): {self.enfermeiro.nome_completo} - Triagem do paciente {paciente_nome}"
    
    
    
class triagemIA(models.Model):
    
    ficha_medica_paciente = models.OneToOneField(FichaMedicaPaciente, on_delete=models.CASCADE, verbose_name="Agendamento do paciente")
    
    data_hora_prevista_consulta = models.DateTimeField(verbose_name="Data e hora prevista da consulta")
    diagnostico_IA = models.TextField(verbose_name="Diagnóstico da IA")
        
    PRIORIDADE_IA_CHOICES = [
        ('EMERGENCIA - VERMELHO', 'EMERGÊNCIA (vermelho)'),
        ('MUITO_URGENTE - LARANJA', 'MUITO URGENTE (laranja)'),
        ('URGENTE - AMARELO', 'URGENTE (amarelo)'),
        ('POUCO_URGENTE - VERDE', 'POUCO URGENTE (verde)'),
        ('NAO_URGENTE - AZUL', 'NÃO URGENTE (azul)'),
    ]

    prioridade_IA = models.CharField(max_length=40, choices=PRIORIDADE_IA_CHOICES, blank=True, null=True,verbose_name="Prioridade Classificada pela IA")

