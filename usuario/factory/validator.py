from abc import ABC, abstractmethod
import re
from usuario.models import Token
from rest_framework import serializers
from django.utils import timezone

class Validator(ABC):
    
    @abstractmethod
    def validate(self, data):
        pass
  
# ******* validações genéricas *********  
class SenhaFactory(Validator):
    
        def validate(self, senha: str) -> bool:
            
            texto_erro =  (
                "Formato de senha incorreto. A senha deve seguir o seguinte formato:"
                " no mínimo um letra maiuscula"
                ", no mínimo 8 caracteres"
                ", no mínimo um número"
                ", no mínimo conter um caractere especial. (ex: !, @, #, $, %, &, *, _, -)."
            )
        
            if (not any(c.isupper() for c in senha) or len(senha) < 8 
                or not re.search(r"\d", senha) or not re.search(r"[!@#$%&*_\-]", senha)):
                
                raise ValueError(texto_erro)
            
            # if not senha[0].isupper():
            #     raise ValueError("A senha deve começar com letra maiúscula.")
            
            # if len(senha) < 8:
            #     raise ValueError("A senha deve ter no mínimo 8 caracteres.")
        
            # if not re.search(r"\d", senha):
            #     raise ValueError("A senha deve conter pelo menos um número.")
            
            # if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", senha):
            #     raise ValueError("A senha deve conter pelo menos um caractere especial.")
            
            return True
        
        
class TelefoneFactory(Validator):
    
    def validate(self, telefone: str) -> bool:
        
        padrao = r'^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$'
        if not re.match(padrao, telefone):
            raise ValueError("Formato de número inválido! Formato correto: (11) 91234-5678")
        return True 
 
  
class CPFFactory(Validator):
    
    def validate(self, cpf: str) -> bool:
        
        if len(cpf) < 11:
            raise ValueError("CPF deve ter 11 dígitos.")

        if cpf == cpf[0] * 11:
            raise ValueError("CPF inválido (números repetidos).")
    
    
    
    
    
    
# ******* validações mais específicas *********
class CNSFactory(Validator):
    
    def validate(self, cns: str) -> bool:
        
        if len(cns) != 15 or not cns.isdigit():
            raise ValueError("Formato de CNS incorreto, o mesmo deve ter 15 dígitos.")
        
        return True


class CRMFactory(Validator):
    
    def validate(self, crm: str) -> bool:
        
        crm = crm.strip().upper()
        padrao = r'^\d{4,6}[A-Z]{2}$'  
        # Exemplo: "123456SP" (6 dígitos + UF em 2 letras maiúsculas)
        
        if not re.match(padrao, crm):
            raise ValueError("Formato de CNS incorreto. Exemplo válido: 123456SP")
        
        return True
        

class CORENFactory(Validator):
    
    def validate(self, coren: str) -> bool:
        coren = coren.strip().upper()
        padrao = r'^\d{4,6}-[A-Z]{2}$'
        
        if not re.match(padrao, coren):
            raise ValueError("Formato de COREN incorreto. Exemplo válido: 12345-SP")
        
        return True
    
    
class TokenFactory(Validator):
    
    def validate(self, token: str) -> Token:
        if not token:
            raise serializers.ValidationError({'token': 'O token é obrigatório.'})

        token_str = token.strip()
        try:
            cadastro_token = Token.objects.get(token__iexact=token_str)
        except Token.DoesNotExist:
            raise serializers.ValidationError({'token': 'O token digitado não existe, verifique se foi digitado corretamente.'})

        # Se no futuro quiser reativar expiração, bastaria aqui:
        # if cadastro_token.expirou():
        #     raise serializers.ValidationError({'token': 'Token expirado, gere outro.'})

        return cadastro_token

        