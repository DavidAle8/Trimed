# notificacao/services.py
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Email
# notificacao/services.py
from django.core.mail import send_mail
from django.conf import settings

class EmailFactory:
    """
    Classe para enviar emails do sistema TRIMED
    ✅ CORREÇÃO: Remove todas as tentativas de salvar no modelo Email
    """

    @staticmethod
    def email_token(usuario, token_str):
        """Envia email com token para definição de senha"""
        subject = 'Seu Token de Acesso - TRIMED'
        
        # Link para o frontend React
        link_definir_senha = f"http://localhost:3002/definir-senha?token={token_str}&email={usuario.email}"
        
        # Mensagem em texto simples
        message = f"""
        Olá {usuario.nome_completo},
        
        Use este token para definir sua senha no sistema:
        
        Token: {token_str}
        
        Ou acesse diretamente: {link_definir_senha}
        
        Este token expira em 24 horas.
        
        Atenciosamente,
        Equipe TRIMED
        """
        
        # Mensagem HTML
        html_message = f"""
        <h2>Defina sua Senha - TRIMED</h2>
        <p>Olá {usuario.nome_completo},</p>
        <p>Use este token para definir sua senha:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff;">{token_str}</p>
        <p><a href="{link_definir_senha}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Clique aqui para definir sua senha
        </a></p>
        <p><strong>Este token expira em 24 horas.</strong></p>
        <br>
        <p>Atenciosamente,<br>Equipe TRIMED</p>
        """
        
        # ✅ APENAS enviar email, SEM salvar no banco
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            html_message=html_message,
            fail_silently=False
        )

    @staticmethod
    def email_primeiro_acesso(usuario, token_str):
        """Envia email de primeiro acesso com token"""
        subject = 'Finalize seu Cadastro - TRIMED'
        
        # Link para o frontend React
        link_definir_senha = f"http://localhost:3002/definir-senha?token={token_str}&email={usuario.email}"
        
        # Mensagem em texto simples
        message = f"""
        Olá {usuario.nome_completo},
        
        Seu cadastro inicial foi realizado. Para finalizá-lo, acesse o link abaixo para definir sua senha:
        
        {link_definir_senha}
        
        Token necessário: {token_str}
        
        Este link expira em 24 horas.
        
        Atenciosamente,
        Equipe TRIMED
        """
        
        # Mensagem HTML
        html_message = f"""
        <h2>Finalize seu Cadastro - TRIMED</h2>
        <p>Olá {usuario.nome_completo},</p>
        <p>Seu cadastro inicial foi realizado. Para finalizá-lo, defina sua senha:</p>
        <p><a href="{link_definir_senha}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Definir Minha Senha
        </a></p>
        <p><strong>Token:</strong> {token_str}</p>
        <p>Este link expira em 24 horas.</p>
        <br>
        <p>Atenciosamente,<br>Equipe TRIMED</p>
        """
        
        # ✅ APENAS enviar email, SEM salvar no banco
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            html_message=html_message,
            fail_silently=False
        )

    # ✅ REMOVER todos os outros métodos que usam Email.objects.create()
    # Ou corrigi-los para não usar o modelo Email

    @staticmethod
    def email_confirmacao_cadastro(usuario):
        """Envia email de confirmação de cadastro"""
        subject = "Confirmação de Cadastro - TRIMED"
        message = f"Olá {usuario.nome_completo}, seu cadastro foi concluído com sucesso!"
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            fail_silently=False
        )

    @staticmethod
    def email_redefinicao_senha(usuario, link_mudar_senha):
        """Envia email para redefinição de senha"""
        subject = "Redefinição de Senha - TRIMED"
        message = f"Olá {usuario.nome_completo}, clique aqui para redefinir sua senha: {link_mudar_senha}"
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            fail_silently=False
        )

    @staticmethod
    def email_confirmacao_agendamento(usuario):
        """Envia email de confirmação de agendamento"""
        subject = "Confirmação de Agendamento - TRIMED"
        message = f"Olá {usuario.nome_completo}, seu agendamento foi concluído com sucesso!"
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            fail_silently=False
        )
