from .models import Email

class EmailFactory:

    @staticmethod
    def email_confirmacao_cadastro(usuario):
        assunto = "Confirmação de Cadastro"
        mensagem = f"Olá {usuario.nome_completo}, seu cadastro foi concluído com sucesso!"
        Email.enviar_email(usuario, assunto, mensagem, usuario.email, titipo_email="cadastro")

    @staticmethod
    def email_redefinicao_senha(usuario, link_mudar_senha):
        assunto = "Redefinição de Senha"
        mensagem = f"Olá {usuario.nome_completo}, clique aqui para redefinir sua senha: {link_mudar_senha}"
        Email.enviar_email(usuario, assunto, mensagem, usuario.email, tipo_email="redefinicao_senha")

    @staticmethod
    def email_token(usuario, token):
        assunto = "Token"
        mensagem = f"Token necessário para a mudança de senha: {token}"
        Email.enviar_email(usuario, assunto, mensagem, usuario.email, tipo_email="primeiro_acesso")
        
        
        
        
        
# @staticmethod
# def email_primeiro_acesso(usuario, link_mudar_senha):
#     assunto = "Finalização de Cadastro"
#     mensagem = (
#         f"Olá {usuario.nome_completo},\n\n"
#         f"Seu cadastro inicial foi realizado. Para finalizá-lo, acesse o link abaixo para redefinir a senha:\n"
#         f"{link_mudar_senha}\n\n"
#         f"Atenciosamente,\nEquipe TRIMED"
#     )
#     Email.enviar_email(usuario, assunto, mensagem, usuario.email, tipo_email="primeiro_acesso")