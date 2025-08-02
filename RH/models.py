from django.db import models
from usuario.models import Medico, Enfermeiro, AdministradorSistema


class ChamadosFuncionarios(models.Model): 
    resposta_queixa = models.TextField(verbose_name="Motivo da queixa")
    
    # método que enviará a resposta
     