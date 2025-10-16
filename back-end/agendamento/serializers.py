from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import FichaMedicaPaciente, Agendamento
from usuario.models import Paciente, Medico
from triagem.models import TriagemIA
from django.db import transaction
from notificacao.services import EmailFactory


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id', 'nome_completo', 'email']

class FichaMedicaPacienteSerializer(serializers.ModelSerializer):
    
    nome_completo = serializers.CharField(source='paciente.nome_completo', read_only=True)

    class Meta:
        model = FichaMedicaPaciente
        fields = ['id','nome_completo','motivo_consulta','medicacao_para_sintoma','medicamento_diario',
        'alergia_geral','alergia_medicamento','possui_doencas_cronicas','historico_familiar_de_doencas']
        read_only_fields = ['id', 'nome_completo']


class AgendamentoSerializer(serializers.ModelSerializer):
    medico_nome = serializers.CharField(source='medico.nome_completo', read_only=True)
    data_consulta = serializers.SerializerMethodField()
    hora_consulta = serializers.SerializerMethodField()
    ficha_medica = serializers.SerializerMethodField()  # <-- adicionar

    paciente_nome = serializers.CharField(
        source='triagem_IA.ficha_medica_paciente.paciente.nome_completo',
        read_only=True
    )
    medico_nome = serializers.CharField(
        source='medico.nome_completo',
        read_only=True
    )
    data_consulta = serializers.SerializerMethodField()
    hora_consulta = serializers.SerializerMethodField()
    ficha_medica = serializers.SerializerMethodField()  # novo campo

    class Meta:
        model = Agendamento
        fields = [
            'id',
            'paciente_nome',
            'medico_nome',
            'data_consulta',
            'hora_consulta',
            'orientacoes',
            'data_hora_consulta',
            'ficha_medica',  # incluído aqui
        ]
        read_only_fields = [
            'id', 'paciente_nome', 'medico_nome',
            'data_consulta', 'hora_consulta', 'ficha_medica'
        ]

    def get_data_consulta(self, obj):
        if obj.data_hora_consulta:
            return obj.data_hora_consulta.strftime('%d/%m/%Y')
        return None

    def get_hora_consulta(self, obj):
        if obj.data_hora_consulta:
            return obj.data_hora_consulta.strftime('%H:%M')
        return None

    def get_ficha_medica(self, obj):
        ficha = obj.triagem_IA.ficha_medica_paciente
        return {
            "motivo_consulta": ficha.motivo_consulta,
            "medicacao_para_sintoma": ficha.medicacao_para_sintoma,
            "medicamento_diario": ficha.medicamento_diario,
            "alergia_geral": ficha.alergia_geral,
            "alergia_medicamento": ficha.alergia_medicamento,
            "possui_doencas_cronicas": ficha.possui_doencas_cronicas,
            "historico_familiar_de_doencas": ficha.historico_familiar_de_doencas
        }


    def validate(self, attrs):
        data_hora = attrs['data_hora_consulta']
        request = self.context['request']
        
        # pega médico do usuário logado
        if not hasattr(request.user, 'medico'):
            raise serializers.ValidationError("Usuário não é médico.")
        
        medico = request.user.medico

        # verifica se já existe agendamento para o mesmo horário
        if Agendamento.objects.filter(medico=medico, data_hora_consulta=data_hora).exists():
            raise serializers.ValidationError(
                {"data_hora_consulta": "Já existe agendamento neste dia e horário para este médico."}
            )

        attrs['medico'] = medico  # adiciona ao validated_data
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

        # atualiza status da triagem
        triagem.status_agendamento = 'CONFIRMADO'
        triagem.save(update_fields=['status_agendamento'])

        # envia email para paciente
        paciente = triagem.ficha_medica_paciente.paciente
        EmailFactory.email_confirmacao_agendamento(paciente)

        return agendamento
