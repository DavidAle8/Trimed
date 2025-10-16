# teste.py
import os
import django



from agendamentos.models import Agendamento
from agendamentos.views import EmailFactory

# Aqui você poderia pegar um agendamento real do banco
agendamento = Agendamento.objects.first()
print(">>> AGENDAMENTO.PACIENTE:", agendamento.triagem_IA.ficha_medica_paciente.paciente.email)

paciente = agendamento.triagem_IA.ficha_medica_paciente.paciente
EmailFactory.email_confirmacao_agendamento(paciente)

