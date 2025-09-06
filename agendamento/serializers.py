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
     
    def get_queryset(self):
        user = self.request.user 
        return Agendamento.objects.filter(triagem_IA__ficha_medica_paciente__paciente=user,triagem_IA__status_agendamento='CONFIRMADO').order_by('data_hora_consulta')
    
    def validate(self, attrs):
        # Aqui o médico deve vir do dado da request, não do usuário logado
        medico_id = self.context['request'].data.get('medico')
        if not medico_id:
            raise serializers.ValidationError({"medico": "Médico é obrigatório para o agendamento."})
        
        try:
            medico = Medico.objects.get(id=medico_id)
        except Medico.DoesNotExist:
            raise serializers.ValidationError({"medico": "Médico não encontrado."})
        
        data_hora = attrs['data_hora_consulta']
        if Agendamento.objects.filter(medico=medico, data_hora_consulta=data_hora).exists():
            raise serializers.ValidationError(
                {"data_hora_consulta": "Já existe agendamento neste dia e horário para este médico."}
            )
        
        attrs['medico'] = medico  # salva no attrs para usar no create
        return attrs


    def create(self, validated_data):
        triagem = self.context['triagem_IA'] 
        medico = validated_data['medico']
        
        agendamento = Agendamento.objects.create(
            triagem_IA=triagem,
            medico=medico,
            data_hora_consulta=validated_data['data_hora_consulta'],
            orientacoes=validated_data.get('orientacoes', 'Sem orientações')
        )
        
        triagem.status_agendamento = 'CONFIRMADO'
        triagem.save(update_fields=['status_agendamento'])
        
        paciente = triagem.ficha_medica_paciente.paciente
        EmailFactory.email_confirmacao_agendamento(paciente)
        
        return agendamento