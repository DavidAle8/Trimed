import google.generativeai as genai
from triagem.models import TriagemIA
import re, os
from Trimed import settings

class IAService:

    @staticmethod
    def gerar_diagnostico(ficha):
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemma-3n-e4b-it")

        prompt = f"""
        Dados do paciente:
        Motivo da consulta: {ficha.motivo_consulta}
        Histórico familiar: {ficha.historico_familiar_de_doencas}
        Doenças crônicas: {ficha.possui_doencas_cronicas}
        Alergia a medicamento: {ficha.alergia_medicamento}
        
        Você é um médico de UBS com experiência em triagem.
        Com base nas informações acima, gere:

        1. Um diagnóstico breve.
        2. Uma prioridade no formato EXATO de uma dessas opções:
            - EMERGENCIA - VERMELHO
            - MUITO_URGENTE - LARANJA
            - URGENTE - AMARELO
            - POUCO_URGENTE - VERDE
            - NAO_URGENTE - AZUL
        
        Retorne no formato:
        Diagnóstico: ...
        Prioridade: ...
        """

        # Chama IA
        response = model.generate_content(prompt)
        texto = response.text.strip()

        # Regex para extrair os campos
        diag_match = re.search(r"Diagnóstico:\s*(.*)", texto)
        prioridade_match = re.search(r"Prioridade:\s*(.*)", texto)

        diagnostico = diag_match.group(1).strip() if diag_match else "Não informado"
        prioridade = prioridade_match.group(1).strip().upper() if prioridade_match else None

        TriagemIA.objects.create(ficha_medica_paciente=ficha, diagnostico_IA=diagnostico, prioridade_IA=prioridade)

        return {"diagnostico": diagnostico, "prioridade": prioridade}
    
    