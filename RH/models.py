from django.db import models
from usuario.models import Medico, Enfermeiro, AdministradorSistema, RH
from notificacao.models import Email
from notificacao.services import EmailFactory


# class ChamadosFuncionarios(models.Model): 
#     resposta_queixa = models.TextField(verbose_name="Motivo da queixa")
    
    # método que enviará a resposta


# class FuncionarioPendentes(models.Model):
#     RH = models.ForeignKey(RH, on_delete=models.CASCADE)   