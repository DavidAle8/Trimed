from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password



# 📄 Sobre o que pode entrar no prontuario:
# Aqui estão ideias do que o ProntuarioPaciente pode conter:

# FK para Paciente

# Lista de fichas preenchidas (FichaMedicaPaciente)

# Lista de triagens feitas

# Diagnósticos anteriores (com CID)

# Prescrições médicas históricas

# Consultas anteriores (datas, médicos)

# Encaminhamentos e interconsultas

# Anotações do médico ou do enfermeiro

# Exames laboratoriais e de imagem com resultado

# Histórico de alergias e doenças crônicas (se não estiver na ficha)