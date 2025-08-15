from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import ConsultaMedica, ReceitaMedica, Medicamento, Exames, ReceitaItem
from rest_framework import serializers
from .models import ConsultaMedica 

# IMPORTANTE: Importamos as versões 'Display' e o da triagem
from triagem.serializers import TriagemEnfermeiroSerializer
from usuario.serializers import MedicoDisplaySerializer

class ConsultaMedicaSerializer(serializers.ModelSerializer):
    # Usando o serializer de exibição
    medico = MedicoDisplaySerializer(read_only=True)
    triagem_enfermeiro = TriagemEnfermeiroSerializer(read_only=True)

    class Meta:
        model = ConsultaMedica
        fields = [
            'id',
            'exame_fisico_detalhado',
            'possiveis_diagnosticas',
            'diagnostico_final',
            'medico',
            'triagem_enfermeiro'
        ]


class ConsultaMedicaSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = ConsultaMedica
        fields = '__all__'
            
class ReceitaMedicaSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = ReceitaMedica
        fields = '__all__'

class MedicamentoSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = Medicamento
        fields = '__all__'
        

class ExamesSerializer(serializers.ModelSerializer):
    
    class Meta():
        model = Exames
        fields = '__all__'
        
        
class ReceitaItemSerializer(serializers.ModelSerializer):
    class Meta:
         model = ReceitaItem
         fields = ['id', 'medicamento', 'dosagem', 'quantidade', 'recomendacoes', 'via_medicamento']

def create(self, validated_data):
        """
        Este método é chamado quando uma nova ReceitaMedica precisa ser criada (via POST).
        Nós o sobrescrevemos para adicionar a lógica de criar os 'ReceitaItem' aninhados
        junto com a receita principal em uma única transação.
        """
        
        # 'validated_data' é um dicionário com os dados já validados pelo serializer.
        # Ex: {'consulta': <ConsultaMedica object>, 'itens': [{'medicamento': <Medicamento object>, ...}]}
        
        # 1. Removemos os dados dos itens do dicionário principal. O que sobra em 'validated_data'
        #    são apenas os dados da própria 'ReceitaMedica' (como o campo 'consulta').
        itens_data = validated_data.pop('itens')
        
        # 2. Criamos o objeto 'ReceitaMedica' principal no banco de dados com os dados restantes.
        receita = ReceitaMedica.objects.create(**validated_data)
        
        # 3. Agora, iteramos sobre a lista de dicionários de itens que separamos.
        for item_data in itens_data:
            # Para cada dicionário de item, criamos o objeto 'ReceitaItem' no banco.
            # Crucialmente, passamos 'receita=receita' para associar este item
            # à 'ReceitaMedica' que acabamos de criar no passo 2.
            ReceitaItem.objects.create(receita=receita, **item_data)
            
        # 4. Finalmente, retornamos a instância da receita recém-criada, que agora
        #    contém todos os seus itens associados.
        return receita      

        