import random, string

def gerar_token(tamanho=6):
    caracteres = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return ''.join(random.choices(caracteres, k=tamanho))
