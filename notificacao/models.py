from django.db import models
from Trimed import settings
from usuario.models import Usuario
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core.mail import send_mail

class Email(models.Model):

    assunto = models.CharField(max_length=100)
    mensagem = models.TextField()
    tipo_email = models.CharField(max_length=50)
    enviado_em = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"E-mail de {self.assunto}"
    
    @staticmethod
    def enviar_email(usuario: Usuario, assunto, mensagem, tipo_email="", html_message=None):
        send_mail(subject=assunto, message=mensagem, from_email=settings.EMAIL_HOST_USER, 
        recipient_list=[usuario.email], fail_silently=False, html_message=html_message)
        