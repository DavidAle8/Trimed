from django.db import models
from triagem.models import TriagemEnfermeiro
from usuario.models import Medico, Paciente


class ConsultaMedica(models.Model):
    
    triagem_enfermeiro = models.OneToOneField(TriagemEnfermeiro, on_delete=models.CASCADE)
    medico = models.ForeignKey(Medico, on_delete=models.PROTECT, verbose_name="Médico Responsável")
    
    exame_fisico_detalhado = models.TextField(blank=True, verbose_name="Exame Físico Detalhado (Inspeção, Palpação, Percussão, Ausculta por sistemas)")
    possiveis_diagnosticas = models.TextField(blank=True, verbose_name="Hipóteses Diagnósticas (possíveis diagnósticos)")
    diagnostico_final = models.TextField(blank=True, verbose_name="Diagnóstico(s) Final(is) (incluir CID-10 se aplicável)")
    exames_solicitados = models.TextField(blank=True, verbose_name="Exames Complementares Solicitados (Laboratoriais, Imagem, etc.)")
    orientacoes = models.TextField(blank=True, verbose_name="Orientações (ex: dieta, repouso, fisioterapia)")
    
    class Meta:
        verbose_name = "Consulta médica"
        verbose_name_plural = "Consultas médicas"
        
    def __str__(self):
        paciente_nome = self.triagem_enfermeiro.ficha_clinica_paciente.paciente.nome_completo
        # data_hora = self.data_hora_triagem.strftime('%d/%m/%Y %H:%M')
        return f"Médico Responsável: {self.medico.nome_completo} - Avaliação Médica de {paciente_nome}"    
    
    
        
    
class ReceitaMedica(models.Model):

    consulta = models.OneToOneField(ConsultaMedica, on_delete=models.CASCADE, verbose_name="Consulta") 
    data_hora_prescricao = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Receita de {self.consulta.triagem_enfermeiro.ficha_clinica_paciente.paciente.nome_completo}"
    
    class Meta:
        verbose_name = "Prescrição Médica"
        verbose_name_plural = "Prescrições Médicas"
    
  
    
class Medicamento(models.Model):
    
    TARJA_CHOICE = [
        ('Tarja Preta', 'Tarja preta'),
        ('Tarja Vermelha', 'Tarja vermelha'),
        ('Tarja Amarela', 'Tarja amarela'),
        ('Sem Tarja', 'Sem tarja'),
    ]
    
    nome_medicamento = models.CharField(max_length=150, verbose_name="Medicamento")
    tarja_medicamento = models.CharField(max_length=150, choices=TARJA_CHOICE, verbose_name="Tarjad do medicamento")

    def __str__(self):
        return f"{self.nome_medicamento} - {self.tarja_medicamento}"
    
    class Meta:
        verbose_name = "Medicamento"
        verbose_name_plural = "Medicamentos"
        


class ReceitaItem(models.Model):
    
    VIAS_MEDICAMENTO_CHOICES = [
        
        ('Oral', 'Via Oral'),
        ('Intramuscular', 'Via Intramuscular'),
        ('Subcutanea', 'Via Subcutânea'),
        ('Sublingual', 'Via Sublingual'),
        ('Endovenosa', 'Via Endovenosa'),
        ('Intradermica', 'Via Intradérmica'),
        ('Intratecal', 'Via Intratecal'),
        ('Intra_auricular', 'Via Intra-auricular'),
        ('Inalatoria', 'Via Inalatória'),
        ('Topica', 'Via Tópica'),
        ('Vaginal', 'Via Vaginal'),
        ('Retal', 'Via Retal'),
        ('Intraocular', 'Via Intraocular'),
        ('Intra_arterial', 'Via Intra-arterial'),
        ('Epidural', 'Via Epidural'),
        ('Intranasal', 'Via Intranasal'),
        ('Intraperitoneal', 'Via Intraperitoneal'),
        # ('outra', 'Outra (Especificar)')
    ]
    
    receita = models.ForeignKey(ReceitaMedica, on_delete=models.CASCADE)
    medicamento = models.ForeignKey(Medicamento, on_delete=models.PROTECT)

    dosagem = models.CharField(max_length=100, verbose_name="Dosagem do medicamento")
    quantidade = models.IntegerField(verbose_name="Quantidade")
    recomendacoes = models.TextField(blank=True, verbose_name="Recomendações")  
    via_medicamento = models.CharField(max_length=100, choices=VIAS_MEDICAMENTO_CHOICES)

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Itens"
    
    def __str__(self):
        return f"{self.medicamento.nome_medicamento} na Receita {self.receita.id}"

    
    
class Exames(models.Model):
    
    PRIORIDADE_EXAME_CHOICES = [
        ('Normal', 'Normal'),
        ('Urgente', 'Urgente'),
        ('Eletivo', 'Eletivo'),
    ]
    
    TIPO_EXAME_CHOICES = [
        ("Laboratorial", "Laboratorial"),
        ("Imagem", "Imagem"),
        ("Cardiológico", "Cardiológico"),
        ("Neurológico", "Neurológico"),
        ("Gastrointestinal", "Gastrointestinal"),
        ("Pulmonar", "Pulmonar"),
        ("Endocrinológico", "Endocrinológico"),
        ("Reumatológico", "Reumatológico"),
        ("Nenhum", "Nenhum"),
    ]
     
    STATUS_EXAME_CHOICES = [
        ("Solicitado", "Solicitado"), 
        ("Em andamento", "Em andamento"), 
        ("Concluído", "Concluído"), 
        ("Cancelado", "Cancelado")
    ]
    
    consulta = models.ForeignKey(ConsultaMedica, on_delete=models.CASCADE, related_name="exames")
    
    exame_solicitado = models.TextField(default="Não foi solicitado", verbose_name="Solicite o exame do paciete")
    tipo_exame = models.CharField(default="Nenhum", max_length=50, choices=TIPO_EXAME_CHOICES, verbose_name="Tipo do exame solicitado")
    justificativa_exame = models.TextField(verbose_name="Justificativa do exame solicitado")
    prioridade_exame = models.TextField(default="Normal", choices=PRIORIDADE_EXAME_CHOICES, verbose_name="Prioridade do exame")
    status_exame = models.CharField(max_length=50, default="Solicitado", choices=STATUS_EXAME_CHOICES, verbose_name="Status do exame")
    data_solicitacao_exame = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Exame"
        verbose_name_plural = "Exames"
        
    def __str__(self):
        return f"({self.consulta.triagem_enfermeiro.agendamento.triagem_IA.ficha_medica_paciente.paciente.nome_completo})"
