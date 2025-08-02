from models import Email

class EmailFactory:

    @staticmethod
    def email_confirmacao_cadastro(usuario):
        assunto = "Confirmação de Cadastro"
        mensagem = f"Olá {usuario.nome_completo}, seu cadastro foi concluído com sucesso!"
        Email.enviar_email(usuario, assunto, mensagem, usuario.email, tipo="cadastro")

    @staticmethod
    def email_redefinicao_senha(usuario, link):
        assunto = "Redefinição de Senha"
        mensagem = f"Olá {usuario.nome_completo}, clique aqui para redefinir sua senha: {link}"
        Email.enviar_email(usuario, assunto, mensagem, usuario.email, tipo="redefinicao_senha")

    @staticmethod
    def email_complementar_profissional(usuario, token):
        assunto = "Primeio Acesso"
        mensagem = (
            f"Olá {usuario.nome_completo},\n\n"
            f"Seu cadastro inicial foi realizado. Para finalizá-lo, acesse o link abaixo e continue preenchendo seus dados:\n"
            f"https://sistematrimed.com/cadastro/complementar?token={token}\n\n"
            f"Atenciosamente,\nEquipe TRIMED"
        )
        Email.enviar_email(usuario, assunto, mensagem, usuario.email, tipo="cadastro_incompleto")
