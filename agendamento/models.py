from django.db import models
from usuario.models import Paciente, Medico, Enfermeiro, Usuario
from django.contrib.auth.models import User, AbstractUser
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password


class Agendamento(models.Model):
    data_criacao_agendamento = models.DateTimeField(auto_now_add=True, verbose_name="Data da criação do agendamento")
    triagem_IA_pendente = models.BooleanField(default=True)
    data_hora_consulta = models.DateTimeField(verbose_name='Data e hora da consulta')
    medico = models.ForeignKey(Medico, on_delete=models.PROTECT, verbose_name="Médico")    
    paciente = models.ForeignKey(Paciente, on_delete=models.PROTECT, verbose_name="Paciente")
    
    STATUS_AGENDAMENTO_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('CONFIRMADO', 'Confirmado'),
        ('CANCELADO', 'Cancelado'),
        ('CONCLUIDO', 'Concluído'),
        ('REAGENDADO', 'Reagendado'),
    ]

    status_agendamento = models.CharField(max_length=20, choices=STATUS_AGENDAMENTO_CHOICES, default='PENDENTE',verbose_name="Status do Agendamento")

    class Meta:
        verbose_name = "Agendamento"
        verbose_name_plural = "Agendamentos"

    def __str__(self):
        return f"Agendamento de {self.paciente.nome_completo} - com o médico {self.medico.nome_completo}"


""" Agendamento fica em ficha pois pra cada agendamento, temos uma nova ficha relacionado a aquele agendamento"""
class FichaMedicaPaciente(models.Model):
    
    text_default = "Não informado"
    text_lenght = 255
    agendamento = models.OneToOneField(Agendamento, on_delete=models.CASCADE, verbose_name="Agendamento")
    
    motivo_consulta = models.TextField(max_length=text_lenght, verbose_name="Informe o motivo da consulta")
    medicacao_para_sintoma = models.TextField(max_length=text_lenght, blank=True, default=text_default, verbose_name="O paciente toma algum medicamento para resolver o problema? se sim, qual(is)")
    medicamento_diario = models.TextField(max_length=text_lenght, blank=True, default=text_default, verbose_name="O paciente toma algum medicamento no dia a dia? Se sim, qual(is)?")
    alergia_geral = models.TextField(max_length=text_lenght, blank=True, default=text_default, verbose_name="O paciente possui algum tipo de alergia? Mencione elas")
    alergia_medicamento = models.TextField(max_length=text_lenght, blank=True, default=text_default, verbose_name='Medicamentos de alergia')
    possui_doencas_cronicas = models.TextField(max_length=text_lenght, blank=True, default=text_default, verbose_name="O paciente possui alguma doença crônica? Se sim, qual(is)")
    historico_familiar_de_doencas = models.TextField(max_length=text_lenght, blank=True, default=text_default, verbose_name="Os sintomas possuem algum histórico familiar? Se sim, quem?")

    class Meta:
        verbose_name = "Ficha médica do paciente"
        verbose_name_plural = "Fichas médicas dos pacientes"
        
    def __str__(self):
        paciente_nome = getattr(self.agendamento.paciente, 'nome_completo', 'Paciente desconhecido')
        return f"Ficha médica de {paciente_nome} - Agendamento #{self.agendamento.pk}"
    