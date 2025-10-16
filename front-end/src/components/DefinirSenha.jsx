// src/components/DefinirSenha.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DefinirSenha.css';

const DefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState('confirmarToken'); // 'confirmarToken' ou 'definirSenha'
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    tokenConfirmacao: '',
    senha: '',
    confirmar_senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Obtém token e email da URL
  const tokenUrl = searchParams.get('token');
  const emailUrl = searchParams.get('email');

  useEffect(() => {
    if (!tokenUrl || !emailUrl) {
      setError('Link inválido. Token ou email não encontrados na URL.');
    } else {
      setFormData(prev => ({
        ...prev,
        token: tokenUrl,
        email: emailUrl
      }));
    }
  }, [tokenUrl, emailUrl]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // Verifica se o token digitado confere com o token da URL
  const verificarToken = () => {
    if (formData.tokenConfirmacao !== formData.token) {
      setError('Token de confirmação não coincide com o token enviado por email.');
      return false;
    }
    return true;
  };

  const handleVerificarToken = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.tokenConfirmacao) {
      setError('Por favor, digite o token recebido por email.');
      return;
    }

    if (verificarToken()) {
      setEtapa('definirSenha');
      setMessage('Token confirmado com sucesso! Agora defina sua senha.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações
    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmar_senha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/mudar-senha/', {
        email: formData.email,
        token: formData.token,
        senha: formData.senha,
        confirmar_senha: formData.confirmar_senha
      });

      setMessage('Senha definida com sucesso! Redirecionando para login...');
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            email: formData.email,
            mensagem: 'Senha definida com sucesso! Faça login com sua nova senha.',
            senhaRedefinida: true
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Erro ao definir senha:', error);
      
      if (error.response?.data) {
        const errors = error.response.data;
        
        if (errors.token) {
          setError(`Token: ${errors.token}`);
        } else if (errors.email) {
          setError(`Email: ${errors.email}`);
        } else if (errors.confirmar_senha) {
          setError(`Confirmação de senha: ${errors.confirmar_senha}`);
        } else if (errors.non_field_errors) {
          setError(errors.non_field_errors[0]);
        } else {
          setError('Erro ao definir senha. Tente novamente.');
        }
      } else {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenUrl || !emailUrl) {
    return (
      <div className="definir-senha-container">
        <div className="definir-senha-card">
          <h2>Link Inválido</h2>
          <p>O link de definição de senha está incompleto ou expirado.</p>
          <button 
            onClick={() => navigate('/login')}
            className="back-button"
          >
            Voltar para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="definir-senha-container">
      <div className="definir-senha-card">
        <div className="header">
          <h2>Finalizar Cadastro</h2>
          <p>Complete seu cadastro para: {formData.email}</p>
        </div>

        {message && (
          <div className="message success-message">
            <span>✅</span>
            {message}
          </div>
        )}

        {error && (
          <div className="message error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {etapa === 'confirmarToken' ? (
          // ETAPA 1: Confirmação do Token
          <form onSubmit={handleVerificarToken} className="senha-form">
            <div className="info-field">
              <label>Email:</label>
              <span>{formData.email}</span>
            </div>

            <div className="form-group">
              <label htmlFor="tokenConfirmacao">Token de Confirmação *</label>
              <input
                type="text"
                id="tokenConfirmacao"
                name="tokenConfirmacao"
                value={formData.tokenConfirmacao}
                onChange={handleChange}
                required
                placeholder="Digite o token recebido por email"
                disabled={loading}
                autoComplete="off"
              />
              <small>Verifique seu email e digite o token recebido</small>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Verificando...' : 'Verificar Token'}
            </button>
          </form>
        ) : (
          // ETAPA 2: Definição da Senha
          <form onSubmit={handleSubmit} className="senha-form">
            <div className="info-field">
              <label>Token confirmado:</label>
              <span>{formData.token}</span>
            </div>

            <div className="form-group">
              <label htmlFor="senha">Nova Senha *</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmar_senha">Confirmar Senha *</label>
              <input
                type="password"
                id="confirmar_senha"
                name="confirmar_senha"
                value={formData.confirmar_senha}
                onChange={handleChange}
                required
                placeholder="Digite a senha novamente"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Processando...' : 'Definir Senha'}
            </button>

            <button 
              type="button"
              onClick={() => setEtapa('confirmarToken')}
              className="cancel-button"
              disabled={loading}
            >
              Voltar para Confirmação
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DefinirSenha;
