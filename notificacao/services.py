from .models import Email

class EmailFactory:


    @staticmethod
    def email_redefinicao_senha(usuario, link_mudar_senha):
        assunto = "Redefinição de Senha"
        mensagem = f"Olá {usuario.nome_completo}, clique aqui para redefinir sua senha: {link_mudar_senha}"
        Email.enviar_email(usuario, assunto, mensagem,"redefinicao_senha")


    @staticmethod
    def email_token(usuario, token):
        
        assunto = 'Token de Acesso - TRIMED'
        
        link_definir_senha = f"http://localhost:3002/definir-senha?token={token}&email={usuario.email}"
        
        mensagem = f"""
        Olá {usuario.nome_completo},
        
        Use este token para definir sua senha no sistema:
        
        Token: {token}
        
        Ou acesse diretamente: {link_definir_senha}
        
        Este token expira em 24 horas.
        
        Atenciosamente,
        Equipe TRIMED
        """
        html_message = f"""
        <h2>Defina sua Senha - TRIMED</h2>
        <p>Olá {usuario.nome_completo},</p>
        <p>Use este token para definir sua senha:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff;">{token}</p>
        <p><a href="{link_definir_senha}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Clique aqui para definir sua senha
        </a></p>
        <p><strong>Este token expira em 24 horas.</strong></p>
        <br>
        <p>Atenciosamente,<br>Equipe TRIMED</p>
        """
        
        Email.enviar_email(usuario, assunto, mensagem, "token", html_message)
        
        
    @staticmethod
    def email_primeiro_acesso(usuario, token):
        
        assunto = 'Finalização seu Cadastro - TRIMED'
        link_definir_senha = f"http://localhost:3002/definir-senha?token={token}&email={usuario.email}"
        
        mensagem = f"""
        Olá {usuario.nome_completo},
        
        Seu cadastro inicial foi realizado. Para finalizá-lo, acesse o link abaixo para definir sua senha:
        
        {link_definir_senha}
        
        Token necessário: {token}   
        
        Este link expira em 24 horas.
        
        Atenciosamente,
        Equipe TRIMED
        """
        
        html_message = f"""
        <h2>Finalize seu Cadastro - TRIMED</h2>
        <p>Olá {usuario.nome_completo},</p>
        <p>Seu cadastro inicial foi realizado. Para finalizá-lo, defina sua senha:</p>
        <p><a href="{link_definir_senha}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Definir Minha Senha
        </a></p>
        <p><strong>Token:</strong> {token}</p>
        <p>Este link expira em 24 horas.</p>
        <br>
        <p>Atenciosamente,<br>Equipe TRIMED</p>
        """
        
        Email.enviar_email(usuario, assunto, mensagem, "primeiro_acesso", html_message)
        
        
    @staticmethod
    def email_confirmacao_agendamento(usuario):
        assunto = "Confirmação de Agendamento"
        mensagem = f"Olá {usuario.nome_completo}, sua consulta foi marcada com sucesso!"
        Email.enviar_email(usuario, assunto, mensagem,"agendamento")
                            