from django.db import models
from usuario.models import Paciente, Medico


class Agendamento(models.Model):
    
    triagem_IA = models.OneToOneField("triagem.TriagemIA", on_delete=models.CASCADE, verbose_name="Paciente")
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, verbose_name="Médico")    
    
    data_criacao_agendamento = models.DateTimeField(auto_now_add=True, verbose_name="Data da criação do agendamento")
    data_hora_consulta = models.DateTimeField(verbose_name='Data e hora da consulta')
    orientacoes = models.TextField(default="Sem orientações", verbose_name="Orientações")

    class Meta:
        verbose_name = "Agendamento"
        verbose_name_plural = "Agendamentos"
        ordering = ['data_hora_consulta']
        
    # def __str__(self):
    #     return f"Agendamento de {self.triagem_IA.} - Agendamento #{self.pk}"
    
    
    

"""" Ficha é uma ficha que o paciente passará para a gente. A IA recebe, tria, manda pro medico e o medico retorna o seu agendamento """
class FichaMedicaPaciente(models.Model):
    
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, verbose_name="Paciente")
    
    TEXT_DEFAULT = "Não informado"
    
    motivo_consulta = models.TextField(verbose_name="Informe o motivo da consulta")
    medicacao_para_sintoma = models.TextField(blank=True, default=TEXT_DEFAULT, verbose_name="O paciente toma algum medicamento para resolver o problema? se sim, qual(is)")
    medicamento_diario = models.TextField(blank=True, default=TEXT_DEFAULT, verbose_name="O paciente toma algum medicamento no dia a dia? Se sim, qual(is)?")
    alergia_geral = models.TextField(blank=True, default=TEXT_DEFAULT, verbose_name="O paciente possui algum tipo de alergia? Mencione elas")
    alergia_medicamento = models.TextField(blank=True, default=TEXT_DEFAULT, verbose_name='Medicamentos de alergia')
    possui_doencas_cronicas = models.TextField(blank=True, default=TEXT_DEFAULT, verbose_name="O paciente possui alguma doença crônica? Se sim, qual(is)")
    historico_familiar_de_doencas = models.TextField(blank=True, default=TEXT_DEFAULT, verbose_name="Os sintomas possuem algum histórico familiar? Se sim, quem?")
    
    class Meta:
        verbose_name = "Ficha médica do paciente"
        verbose_name_plural = "Fichas médicas dos pacientes"
        
    def __str__(self):
        return f"Ficha médica de {self.paciente.nome_completo} - Ficha #{self.pk}"
