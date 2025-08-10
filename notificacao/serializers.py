from rest_framework import serializers
from .models import Email
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Email
        fields = ['assunto', 'mensagem', 'tipo', 'content_type', 'object_id']
        read_only_fields = ['enviado_em']

    def validate(self, data):
        object_id = data.get('object_id')
        
        try:
            destinatario = User.objects.get(pk=object_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuário não encontrado ou e-mail não registrado.")
        
        return data
