from usuario.factory.factoryvalidate import ValidatorFactory


class ValidationFacade:
    
    def __init__(self, data: dict):
        self.data = data

    def validar(self):
        erros = {}

        for campo, valor in self.data.items():
            validador = ValidatorFactory.get_validator(campo)
            if validador:
                try:
                    validador.validate(valor)
                except ValueError as e:
                    erros[campo] = str(e)
        
        return erros
                
