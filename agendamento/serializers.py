from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import FichaMedicaPaciente, Agendamento
from usuario.models import Paciente, Medico
from triagem.models import TriagemIA
from django.db import transaction
from notificacao.services import EmailFactory

class FichaMedicaPacienteSerializer(serializers.ModelSerializer):
	
    
    class Meta():
        model = FichaMedicaPaciente
        fields = ['id', 'motivo_consulta', 'medicacao_para_sintoma', 'medicamento_diario', 'alergia_geral', 
        'alergia_medicamento', 'possui_doencas_cronicas', 'historico_familiar_de_doencas']


class AgendamentoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Agendamento
        fields = ['data_hora_consulta', 'orientacoes']
        # read_only_fields = ['triagem_IA']
     
    def validate(self, attrs):
        
        """Verifica conflito de data/hora para o mesmo médico."""
        medico = self.context['request'].user.medico
        data_hora = attrs['data_hora_consulta']

        if Agendamento.objects.filter(medico=medico, data_hora_consulta=data_hora).exists():
            raise serializers.ValidationError(
                {"data_hora_consulta": "Já existe agendamento neste dia e horário para este médico."}
            )
        return attrs

    def create(self, validated_data):
        
        request = self.context['request']
        medico = request.user.medico
        triagem = self.context['triagem_IA']  # já passado pela view

        with transaction.atomic():
            agendamento = Agendamento.objects.create(
                triagem_IA=triagem,
                medico=medico,
                data_hora_consulta=validated_data['data_hora_consulta'],
                orientacoes=validated_data.get('orientacoes', 'Sem orientações')
            )
            
            triagem.status_agendamento = 'CONFIRMADO'
            triagem.save(update_fields=['status_agendamento'])

            paciente = agendamento.triagem_IA.ficha_medica_paciente.paciente
            EmailFactory.email_confirmacao_agendamento(paciente)
        
        return agendamento
    
    
    
    
