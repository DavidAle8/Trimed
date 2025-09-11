from .models import Usuario, Medico, Paciente, Enfermeiro, AdministradorSistema, RH, Token
from .serializers import (MedicoSerializer, PacienteSerializer, EnfermeiroSerializer, 
TokenSerializer, AdministradorSistemaSerializer, RHSerializer, MudarSenhaSerializer, LoginSerializer)
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
from usuario.helpers import gerar_token
from rest_framework.generics import GenericAPIView



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
            return Response({"error": "Token de refresh inválido ou não fornecido."},status=status.HTTP_400_BAD_REQUEST)
            




""" ************************ Lógica para validação dos dados para mudança de senha *********************** """

class MudarSenhaView(GenericAPIView):
    serializer_class = MudarSenhaSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer()
        return Response(serializer.data)
    
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensagem": "Senha atualizada com sucesso."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



""" Cria o token e ja manda para o seu email """
class TokenViewSet(ModelViewSet):
    
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    http_method_names = ['get', 'post']

    def perform_create(self, serializer):
        
        token = serializer.save()
        usuario = token.usuario
        EmailFactory.email_token(usuario, token.token)
        

         

""" ************************ Lógica do CRUD e AUTHENTICATION dos Usuarios *********************** """

class MedicoViewSet(ModelViewSet):
    
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

    def perform_create(self, serializer):

        medico = serializer.save(is_active=False)
        medico.set_unusable_password()
        medico.save()
        serializer = TokenSerializer(data={'email': medico.email}) #LEMBRAR DE COLOCAR TD ISSO NOS OUTROS USUARIOS, ENFERMEIRO, ADM...
        serializer.is_valid(raise_exception=True)
        token_obj = serializer.save() 
        EmailFactory.email_primeiro_acesso(medico, token_obj.token)
        
    def get_permissions(self):
        if self.action == 'create':
            return [IsRH()]
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
        Enfermeiro = serializer.save(is_active=False)
        Enfermeiro.set_unusable_password()
        Enfermeiro.save()
        serializer = TokenSerializer(data={'email': Enfermeiro.email}) #LEMBRAR DE COLOCAR TD ISSO NOS OUTROS USUARIOS, ENFERMEIRO, ADM...
        serializer.is_valid(raise_exception=True)
        token_obj = serializer.save()
        EmailFactory.email_primeiro_acesso(Enfermeiro, token_obj.token)

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
        adm_sistema = serializer.save(is_active=False)
        adm_sistema.set_unusable_password()
        adm_sistema.save()
        serializer = TokenSerializer(data={'email': adm_sistema.email}) #LEMBRAR DE COLOCAR TD ISSO NOS OUTROS USUARIOS, ENFERMEIRO, ADM...
        serializer.is_valid(raise_exception=True)
        token_obj = serializer.save()
        EmailFactory.email_primeiro_acesso(Enfermeiro, token_obj.token)
           
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
    
    

class WhoAmI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'nome': request.user.nome_completo, 'email': request.user.email, 'id': request.user.id})