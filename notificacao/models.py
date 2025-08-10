from django.db import models
from Trimed import settings
from usuario.models import Usuario
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core.mail import send_mail

class Email(models.Model):

    assunto = models.CharField(max_length=255)
    mensagem = models.TextField()
    tipo_email = models.CharField(max_length=50)
    enviado_em = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"E-mail de {self.assunto}"
    
    @staticmethod
    def enviar_email(usuario: Usuario, assunto, mensagem, tipo_email):

        send_mail(subject=assunto, message=mensagem, from_email=settings.DEFAULT_FROM_EMAIL, 
        recipient_list=[usuario.email], fail_silently=False)
        
        Email.objects.create(assunto=assunto, mensagem=mensagem, tipo_email=tipo_email)