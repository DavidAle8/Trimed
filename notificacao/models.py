from django.db import models
from Trimed import settings
from usuario.models import Usuario
from django.core.mail import send_mail

class Email(models.Model):
    
    #usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    assunto = models.CharField(max_length=255)
    mensagem = models.TextField()
    tipo = models.CharField(max_length=50)
    destinatario_email = models.EmailField()
    destinatario_nome = models.CharField(max_length=100, blank=True, null=True)
    enviado_em = models.DateTimeField(auto_now_add=True)
    
    @staticmethod
    def enviar_email(usuario:Usuario, assunto, mensagem, email_destino):
        
        send_mail(assunto, mensagem, settings.DEFAULT_FROM_EMAIL, [email_destino])
        Email.objects.create(assunto=assunto, mensagem=mensagem, tipo='cadastro', 
        destinatario_email=email_destino, destinatario_nome = usuario.nome_completo)



