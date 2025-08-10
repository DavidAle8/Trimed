
from .models import Medico, Paciente, Enfermeiro, AdministradorSistema, RH, CadastroToken
from .serializers import ( MedicoSerializer, PacienteSerializer, EnfermeiroSerializer, 
CadastroTokenSerializer, AdministradorSistemaSerializer, RHSerializer, MudarSenhaSerializer)
from rest_framework import generics, status, mixins, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from notificacao.services import EmailFactory
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .permissions import IsAdministradorSistema, IsRH



""" ************************ Lógica para LOGIN e LOGOUT *********************** """

class LoginView(TokenObtainPairView):
    pass


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response( {"message": "Logout bem-sucedido."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Token de refresh inválido ou não fornecido."},status=status.HTTP_400_BAD_REQUEST)
            




""" ************************ Lógica para validação dos dados para mudança de senha *********************** """

class MudarSenhaSerializerViewSet(APIView):
    permission_classes = []

    def post(self, request):
        serializer = MudarSenhaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensagem": "Senha atualizada com sucesso."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CadastroTokenViewSet(ModelViewSet):
    
    queryset = CadastroToken.objects.all()
    serializer_class = CadastroTokenSerializer
    http_method_names = ['post']  #opcional, se quiser restringir só para criação

         
         
         
""" ************************ Lógica do CRUD e AUTHENTICATION dos Usuarios *********************** """

class MedicoViewSet(viewsets.ModelViewSet):
    
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

    def perform_create(self, serializer):
        # link_mudar_senha = f"https://meusite.com.br/mudar-senha?token={token}"
        medico = serializer.save(is_active=False)
        # EmailFactory.email_redefinicao_senha(medico, link_mudar_senha)
        
    def get_permissions(self):
        if self.action == 'create':
            return [IsRH()]
        if self.action == 'destroy':
            return [IsAdministradorSistema()]
        return [IsAuthenticated()]




class PacienteViewSet(ModelViewSet):
    
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    def perform_create(self, serializer):
        
        # link_mudar_senha = f"https://meusite.com.br/mudar-senha?token={token}"
        paciente = serializer.save()
        # EmailFactory.email_confirmacao_cadastro(medico, link_mudar_senha)
        
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]




class EnfermeiroViewSet(viewsets.ModelViewSet):
    
    queryset = Enfermeiro.objects.all()
    serializer_class = EnfermeiroSerializer
    
    def perform_create(self, serializer):
        # link_mudar_senha = f"https://meusite.com.br/mudar-senha?token={token}"
        Enfermeiro = serializer.save(is_active=False)
        # EmailFactory.email_redefinicao_senha(Enfermeiro, link_mudar_senha)

    def get_permissions(self):
        if self.action == 'create':
            return [IsRH()]
        if self.action == 'destroy':
            return [IsAdministradorSistema()]
        return [IsAuthenticated()]



class AdministradorSistemaViewSet(viewsets.ModelViewSet):
    
    queryset = AdministradorSistema.objects.all()
    serializer_class = AdministradorSistemaSerializer

    def perform_create(self, serializer):
        # link_mudar_senha = f"https://meusite.com.br/mudar-senha?token={token}"
        adm_sistema = serializer.save(is_active=False)
        # EmailFactory.email_redefinicao_senha(adm_sistema, link_mudar_senha)
           
    def get_permissions(self):
        if self.action == 'create':
            return [IsRH()]
        return [IsAuthenticated()]



class RHViewSet(viewsets.ModelViewSet):
    
    queryset = RH.objects.all()
    serializer_class = RHSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()] 
        return [IsAuthenticated()] 