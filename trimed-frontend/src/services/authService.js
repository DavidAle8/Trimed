// src/services/authService.js

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const authService = {
  // Função para registrar um novo paciente
  async register(pacienteData) {
    try {
      const response = await fetch(`${API_BASE_URL}/paciente/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pacienteData.email,
          nome_completo: pacienteData.nomeCompleto,
          cpf: pacienteData.cpf.replace(/\D/g, ''),
          data_nascimento: pacienteData.dataNascimento,
          sexo: pacienteData.sexo,
          endereco: pacienteData.endereco,
          telefone: pacienteData.telefone,
          senha: pacienteData.senha,
          cns: pacienteData.cns,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro no cadastro');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  // Função para login
  async login(email, senha) {
    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Credenciais inválidas');
      }

      const data = await response.json();
      
      // Armazena o token e informações do usuário no localStorage
      localStorage.setItem('token', data.access);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Função para logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verifica se o usuário está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtém o token do usuário atual
  getToken() {
    return localStorage.getItem('token');
  },

  // Obtém os dados do usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
