from .models import FichaMedicaPaciente, Agendamento
from .serializers import FichaMedicaPacienteSerializer, AgendamentoSerializer
from rest_framework.generics import get_object_or_404
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import google.generativeai as genai
import os

#client = genai.Client(api_key=os.getenv("AIzaSyBms56-kweNlM6_PUFdcnGK91hHN3dMt8E"))
genai.configure(api_key="AIzaSyBms56-kweNlM6_PUFdcnGK91hHN3dMt8E")

model = genai.GenerativeModel("gemma-3n-e4b-it")

class FichaMedicaPacienteViewSet(ModelViewSet):
    
    queryset = FichaMedicaPaciente.objects.all()
    serializer_class = FichaMedicaPacienteSerializer


class AgendamentoViewSet(ModelViewSet):
    
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer
    
    def perform_create(self, serializer):
        agendamento = serializer.save()

        return agendamento
    
    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        agendamento = self.get_object()
        agendamento.confirmado = True
        agendamento.save()
        return Response({'status': 'Agendamento confirmado'})
    

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        agendamento = self.get_object()
        agendamento.confirmado = False
        agendamento.save()
        return Response({'status': 'Agendamento cancelado'})
    

    @action(detail = True, methods=['put'])
    def atualizar(self,request, pk=None):
        serializer = self.get_serializer(data = request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


    @action(detail=True, methods=['get'])
    def detalhes(self, request, pk=None):
        agendamento = self.get_object()
        serializer = self.get_serializer(agendamento)
        return Response(serializer.data)
    

    @action(detail=True, methods=['get'])
    def gerar_diagnostico(self, request, pk=None):
        agendamento = self.get_object()
        try:
            ficha = FichaMedicaPaciente.objects.get(agendamento=agendamento)
        except FichaMedicaPaciente.DoesNotExist:
            return Response(
                {"error": "Ficha médica não encontrada para este agendamento"},
                status=status.HTTP_404_NOT_FOUND
            )

        prompt = f"""
        Dados do paciente:
        Motivo da consulta: {ficha.motivo_consulta}
        Historico: {ficha.historico_familiar_de_doencas}
        Doenças Cronicas: {ficha.possui_doencas_cronicas}
        Alergia a medicamento: {ficha.alergia_medicamento}
        
        Você é um super médico da UBS que sabe muito 
        sobre doenças no geral. Crie uma triagem com os 
        dados passados, tendo as classificações sendo 
        Grave, Médio ou Leve. Não desconsidere a ideia que um médico
        verificará sua resposta.
        """

        response = model.generate_content(prompt)
        return Response({"diagnostico": response.text})
    

    # Colocar metodo que pegue a ficha e mande para a IA
    # chamar o método de enviar email do paciente sobre o agendamento será um método 
    # confirmar agendamento será um método  
    # editar o diagnostico da IA se pá seja um método
    
    # metodos com @action get/post será por aqui (se necessário), seja para editar um agendamento (paciente pode fazer isso)
    # cancelar agendamento ou até listar os agendamentos. e lá terá um botao para ver detalhes talvez.





#@api_view(['POST'])
#def FichaMedicaPacienteViewSet(request):

    

#@api_view(['GET', 'PUT', 'DELETE'])
#def FichasMedicasPacienteViewSet(request, pk):

#    try:

#        fichaMedica = FichaMedicaPaciente.objects.get(pk=pk)

#    except FichaMedicaPaciente.DoesNotExist:
#        return Response(status = status.HTTP_404_NOT_FOUND)
    
#    if request.method == 'GET':
#        serializer_class = FichaMedicaPacienteSerializer(fichaMedica)
#        return Response(serializer_class.data)
    
#    elif request.method == 'PUT':
#        serializer_class = FichaMedicaPacienteSerializer(fichaMedica, data = request.data)

#        if serializer_class.is_valid:
#            serializer_class.save()
#            return Response(serializer_class.data)
        
#        return Response(serializer_class.errors, status = status.HTTP_400_BAD_REQUEST)
    
#    elif request.method == 'DELETE':
#        fichaMedica.delete()
#        return Response(status = status.HTTP_200_OK)

    
    
    
    