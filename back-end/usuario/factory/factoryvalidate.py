from .validator import CNSFactory, CRMFactory, CORENFactory, SenhaFactory, TelefoneFactory, CPFFactory, TokenFactory


class ValidatorFactory:
    
    @staticmethod
    def get_validator(field_name: str):
        
        field_name = field_name.lower()
        
        if field_name == "senha":
            return SenhaFactory()
        
        elif field_name == "telefone":
            return TelefoneFactory()
        
        elif field_name == "cpf":
            return CPFFactory()
        
        elif field_name == "cns":
            return CNSFactory()
        
        elif field_name == "crm":
            return CRMFactory()
        
        elif field_name == "coren":
            return CORENFactory()
        
    #    elif field_name == "token":
     #       return TokenFactory()
        else:
            return None 
        
        
