import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faUserMd, faMapMarkerAlt, faUserNurse, faExclamationCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './LoginRH.css';

const LoginRH = () => {
  const [dadosLogin, setDadosLogin] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState({ mensagem: '', tipo: '' });
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const aoAlterar = (e) => {
    const { name, value } = e.target;
    setDadosLogin(prev => ({ ...prev, [name]: value }));
    if (erro.mensagem) setErro({ mensagem: '', tipo: '' });
  };

  const alternarMostrarSenha = () => setMostrarSenha(!mostrarSenha);

  const validarFormulario = () => {
    if (!dadosLogin.email.trim()) {
      setErro({ mensagem: 'Por favor, insira seu e-mail', tipo: 'email' });
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosLogin.email)) {
      setErro({ mensagem: 'Por favor, insira um e-mail válido', tipo: 'email' });
      return false;
    }
    
    if (!dadosLogin.senha) {
      setErro({ mensagem: 'Por favor, insira sua senha', tipo: 'senha' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    setErro({ mensagem: '', tipo: '' });
    setCarregando(true);

    try {
      // 👇 CORREÇÃO: Use /api/login/ em vez de /api/token/
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: dadosLogin.email,    // Seu backend espera 'email'
          password: dadosLogin.senha  // Seu backend espera 'password'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Verifica se é erro de usuário inativo
        if (data.detail && data.detail.includes('usuario ativo')) {
          setErro({ 
            mensagem: 'Usuário pendente de ativação. Verifique seu e-mail para definir a senha.', 
            tipo: 'ativacao' 
          });
        } else {
          setErro({ 
            mensagem: data.detail || 'E-mail ou senha incorretos', 
            tipo: 'credenciais' 
          });
        }
        setCarregando(false);
        return;
      }

      // Login bem-sucedido
      localStorage.setItem('tokenRH', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('userEmail', dadosLogin.email);
      
      navigate('/RH');
      
    } catch (err) {
      setErro({ 
        mensagem: 'Erro de conexão. Verifique se o servidor está rodando.', 
        tipo: 'conexao' 
      });
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navigate('/')}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            <nav className="nav">
              <span className="nav-link" onClick={() => navigate('/')}>Inicio</span>
              <span className="nav-link" onClick={() => navigate('/servicos')}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link active" onClick={() => navigate('/login-rh')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}>
                <FontAwesomeIcon icon={faPhoneAlt} /> Contato
              </span>
              <button className="cta-button" onClick={() => navigate('/login')}>Área do Paciente</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="login-container">
          <div className="login-card">
            <div className="loginrh-header">
              <FontAwesomeIcon icon={faSignInAlt} style={{fontSize: '2.5rem', color: '#100763', marginBottom: '15px'}} />
              <h2 className="login-title">Acesso Restrito - RH</h2>
              <p style={{color: '#7f8c8d', textAlign: 'center', marginBottom: '20px'}}>Área exclusiva para administradores</p>
            </div>

            {erro.mensagem && (
              <div className={`error-message ${erro.tipo === 'ativacao' ? 'warning' : ''}`}>
                <FontAwesomeIcon icon={erro.tipo === 'ativacao' ? faExclamationCircle : faExclamationCircle} />
                <span>{erro.mensagem}</span>
                {erro.tipo === 'ativacao' && (
                  <Link to="/recuperar-senha" className="link recovery-link">
                    Reenviar e-mail de ativação
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">E-mail Institucional</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={dadosLogin.email}
                  onChange={aoAlterar}
                  required
                  disabled={carregando}
                  className={erro.tipo === 'email' || erro.tipo === 'credenciais' ? 'error' : ''}
                  placeholder="seu.email@trimed.com"
                  autoComplete="username"
                />
              </div>

              <div className="form-group password-group">
                <label htmlFor="senha">Senha</label>
                <div className="password-input-container">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="senha"
                    name="senha"
                    value={dadosLogin.senha}
                    onChange={aoAlterar}
                    required
                    disabled={carregando}
                    className={erro.tipo === 'senha' || erro.tipo === 'credenciais' ? 'error' : ''}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={alternarMostrarSenha}
                    disabled={carregando}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={carregando}
                aria-busy={carregando}
              >
                {carregando ? (
                  <span className="button-loader">
                    <span className="spinner"></span>
                    Autenticando...
                  </span>
                ) : (
                  'Acessar Sistema'
                )}
              </button>

              <div className="login-links">
                <Link to="/recuperar-senha" className="link">
                  Esqueci minha senha
                </Link>
                <Link to="/" className="link">
                  ← Voltar para a página inicial
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h4>TRIMED</h4>
            <p>Sua saúde, nossa prioridade desde 2020.</p>
          </div>
          <div className="footer-column">
            <h4>Contato</h4>
            <p><FontAwesomeIcon icon={faPhoneAlt} /> (11) 1234-5678</p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Av. Saúde, 123</p>
          </div>
        </div>
        <div className="copyright">
          <p>© {new Date().getFullYear()} TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginRH;
