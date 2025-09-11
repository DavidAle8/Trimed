// src/components/DefinirSenha.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DefinirSenha.css';

const DefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    senha: '',
    confirmar_senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Pega token e email da URL
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Link inválido. Token ou email não encontrados na URL.');
    } else {
      setFormData(prev => ({
        ...prev,
        token: token.trim(),
        email: email.trim()
      }));
    }
  }, [token, email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const fazerLoginAutomatico = async (email, senha) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email: email.trim(),
        password: senha
      });

      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('userEmail', email.trim());
        return true;
      }
    } catch (err) {
      console.error('Erro no login automático:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!formData.email || !formData.token) {
      setError('Dados incompletos. Verifique o link.');
      setLoading(false);
      return;
    }

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
        email: formData.email.trim(),
        token: formData.token.trim(),
        senha: formData.senha,
        confirmar_senha: formData.confirmar_senha
      });

      setMessage('Senha definida com sucesso! Fazendo login automático...');

      const loginSucesso = await fazerLoginAutomatico(formData.email, formData.senha);

      if (loginSucesso) {
        setMessage('Login realizado com sucesso! Redirecionando...');
        setTimeout(() => {
          if (formData.email.includes('rh') || formData.email.includes('admin')) navigate('/rh/dashboard');
          else if (formData.email.includes('medico') || formData.email.includes('doctor')) navigate('/medico/dashboard');
          else if (formData.email.includes('enfermeiro') || formData.email.includes('nurse')) navigate('/enfermeiro/dashboard');
          else navigate('/dashboard');
        }, 2000);
      } else {
        setMessage('Senha definida! Redirecionando para login...');
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (err) {
      console.error('Erro ao definir senha:', err);
      const errors = err.response?.data;

      if (errors?.token) setError(`Token: ${errors.token}`);
      else if (errors?.email) setError(`Email: ${errors.email}`);
      else if (errors?.confirmar_senha) setError(`Confirmação de senha: ${errors.confirmar_senha}`);
      else if (errors?.non_field_errors) setError(errors.non_field_errors[0]);
      else setError('Erro ao definir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="definir-senha-container">
        <div className="definir-senha-card">
          <h2>Link Inválido</h2>
          <p>O link de definição de senha está incompleto ou expirado.</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            URL esperada: http://localhost:3000/definir-senha?token=SEU_TOKEN&email=seu@email.com
          </p>
          <button onClick={() => navigate('/login')} className="back-button">Voltar para Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="definir-senha-container">
      <div className="definir-senha-card">
        <div className="header">
          <h2>Finalizar Cadastro</h2>
          <p>Digite sua nova senha para: {email}</p>
        </div>
        <form onSubmit={handleSubmit} className="senha-form">
          <div className="info-fields">
            <div className="info-field"><label>Email:</label><span>{email}</span></div>
            <div className="info-field"><label>Token:</label><span>{token}</span></div>
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

          {error && <div className="message error-message"><span>⚠️</span>{error}</div>}
          {message && <div className="message success-message"><span>✅</span>{message}</div>}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Processando...' : 'Definir Senha e Fazer Login'}
          </button>

          <button type="button" onClick={() => navigate('/login')} className="cancel-button" disabled={loading}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default DefinirSenha;

