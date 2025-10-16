# usuario/views.py
from .models import Medico, Paciente, Enfermeiro, AdministradorSistema, RH, Token
from .serializers import (
    MedicoSerializer, PacienteSerializer, EnfermeiroSerializer, 
    TokenSerializer, AdministradorSistemaSerializer, RHSerializer, 
    MudarSenhaSerializer, LoginSerializer
)
from rest_framework import generics, status, mixins, viewsets
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from notificacao.services import EmailFactory
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .permissions import IsAdministradorSistema, IsRH


""" ************************ Lógica para LOGIN e LOGOUT *********************** """

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token_auth = RefreshToken(refresh_token)
            token_auth.blacklist()
            return Response({"message": "Logout bem-sucedido."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(
                {"error": "Token de refresh inválido ou não fornecido."},
                status=status.HTTP_400_BAD_REQUEST
            )


""" ************************ Lógica para validação dos dados para mudança de senha *********************** """

# views.py
class MudarSenhaView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = MudarSenhaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensagem": "Senha atualizada com sucesso. Faça login novamente."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TokenViewSet(ModelViewSet):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    http_method_names = ['post']


""" ************************ Lógica do CRUD e AUTHENTICATION dos Usuarios *********************** """

class MedicoViewSet(ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

    def perform_create(self, serializer):
        medico = serializer.save()
        
        # Gera e envia token por email
        token_serializer = TokenSerializer(data={'email': medico.email})
        if token_serializer.is_valid():
            token_serializer.save()

    def get_permissions(self):
        if self.action == 'create':
          return [AllowAny()] 
        if self.action == 'destroy':
            return [IsAdministradorSistema()]
        return [IsAuthenticated()]


class PacienteViewSet(ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
        
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]


class EnfermeiroViewSet(viewsets.ModelViewSet):
    queryset = Enfermeiro.objects.all()
    serializer_class = EnfermeiroSerializer
    
    def perform_create(self, serializer):
        enfermeiro = serializer.save()
        
        # Gera e envia token por email
        token_serializer = TokenSerializer(data={'email': enfermeiro.email})
        if token_serializer.is_valid():
            token_serializer.save()

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()] 
        if self.action == 'destroy':
            return [IsAdministradorSistema()]
        return [IsAuthenticated()]


class AdministradorSistemaViewSet(viewsets.ModelViewSet):
    queryset = AdministradorSistema.objects.all()
    serializer_class = AdministradorSistemaSerializer

    def perform_create(self, serializer):
        administrador = serializer.save()
        
        # Gera e envia token por email
        token_serializer = TokenSerializer(data={'email': administrador.email})
        if token_serializer.is_valid():
            token_serializer.save()
           
    def get_permissions(self):
        if self.action == 'create':
             return [AllowAny()] 
        return [IsAuthenticated()]


class RHViewSet(viewsets.ModelViewSet):
    queryset = RH.objects.all()
    serializer_class = RHSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()] 
        return [IsAuthenticated()]
