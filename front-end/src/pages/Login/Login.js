import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhoneAlt, 
  faUserMd, 
  faMapMarkerAlt, 
  faUserNurse,
  faExclamationCircle,
  faCheckCircle,faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dadosLogin, setDadosLogin] = useState({
    email: location.state?.email || '',
    senha: ''
  });
  const [erro, setErro] = useState({ mensagem: '', tipo: '' });
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(
    location.state?.mensagem || location.state?.senhaRedefinida
      ? 'Senha redefinida com sucesso! Faça login com sua nova senha.'
      : ''
  );

  // Limpar mensagem de sucesso após 5s
  useEffect(() => {
    if (mensagemSucesso) {
      const timer = setTimeout(() => setMensagemSucesso(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemSucesso]);

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

  // Função para limpar tokens antigos
  const limparTokensAntigos = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('userType');
  };

  // Requisita token JWT ao backend
  const verificarCredenciais = async ({ email, senha }) => {
    const URL_API = 'http://127.0.0.1:8000/api/login/';
    
    try {
      const response = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha })
      });

      if (!response.ok) {
        let data = {};
        try { data = await response.json(); } catch {}
        let errorMessage = 'E-mail ou senha incorretos';
        
        if (response.status === 401 && data.detail === 'Senha expirada') {
          errorMessage = 'Sua senha expirou. Por favor, redefina sua senha.';
          navigate('/recuperar-senha', { state: { email } });
          return null;
        }
        
        if (response.status === 400) {
          errorMessage = data.detail || 'Erro na validação dos dados';
        }
        
        if (response.status === 401) {
          errorMessage = data.detail || 'Credenciais inválidas';
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na verificação de credenciais:', error);
      throw error;
    }
  };

 const buscarDadosUsuario = async (token, email) => {
  try {
    console.log('=== INÍCIO DA BUSCA POR USUÁRIO ===');
    console.log('Email procurado:', email);
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.user_id;
    
    console.log('User ID do token:', userId);

    const endpoints = [
      { tipo: 'paciente', url: `http://127.0.0.1:8000/api/paciente/${userId}/` },
      { tipo: 'medico', url: `http://127.0.0.1:8000/api/medico/${userId}/` },
      { tipo: 'enfermeiro', url: `http://127.0.0.1:8000/api/enfermeiro/${userId}/` },
      { tipo: 'administrador', url: `http://127.0.0.1:8000/api/administrador/${userId}/` },
      { tipo: 'rh', url: `http://127.0.0.1:8000/api/rh/${userId}/` },
    ];

    for (let ep of endpoints) {
      try {
        console.log(`\n🔍 Tentando: ${ep.tipo} - ${ep.url}`);
        const resp = await fetch(ep.url, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`📊 Status: ${resp.status} ${resp.statusText}`);
        
        if (resp.ok) {
          const data = await resp.json();
          console.log(`📦 Dados recebidos:`, data);
          
          if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
            console.log('✅✅✅ USUÁRIO CORRETO ENCONTRADO!');
            return { 
              id: userId,
              nome: data.nome_completo || data.nome || 'Usuário',
              email: data.email,
              tipo: ep.tipo,
              ...data
            };
          } else {
            console.log('❌❌❌ EMAIL NÃO CORRESPONDE!');
            console.log(`Esperado: ${email}`);
            console.log(`Recebido: ${data.email || 'N/A'}`);
          }
        } else {
          console.log('❌ Endpoint não retornou OK');
          // Tentar ler a resposta de erro
          try {
            const errorData = await resp.json();
            console.log('Erro detalhado:', errorData);
          } catch (e) {
            console.log('Não foi possível ler resposta de erro');
          }
        }
      } catch (e) {
        console.warn(`💥 Erro no endpoint ${ep.tipo}:`, e);
      }
    }

    console.log('\n🔎 Nenhum usuário encontrado pelos endpoints específicos, tentando lista...');
    
    const listEndpoints = [
      { tipo: 'paciente', url: 'http://127.0.0.1:8000/api/paciente/' },
      { tipo: 'medico', url: 'http://127.0.0.1:8000/api/medico/' },
      { tipo: 'enfermeiro', url: 'http://127.0.0.1:8000/api/enfermeiro/' },
      { tipo: 'administrador', url: 'http://127.0.0.1:8000/api/administrador/' },
      { tipo: 'rh', url: 'http://127.0.0.1:8000/api/rh/' },
    ];
    
    for (let ep of listEndpoints) {
      try {
        console.log(`\n🔍 Tentando lista: ${ep.tipo}`);
        const resp = await fetch(ep.url, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`📊 Status lista: ${resp.status}`);
        
        if (resp.ok) {
          const data = await resp.json();
          console.log(`📦 Lista recebida (${data.length} itens):`, data);
          
          if (Array.isArray(data)) {
            const usuarioEncontrado = data.find(user => 
              user.email && user.email.toLowerCase() === email.toLowerCase()
            );
            
            if (usuarioEncontrado) {
              console.log('✅✅✅ USUÁRIO ENCONTRADO NA LISTA!');
              return { 
                id: usuarioEncontrado.id || userId,
                nome: usuarioEncontrado.nome_completo || 'Usuário',
                email: usuarioEncontrado.email,
                tipo: ep.tipo,
                ...usuarioEncontrado
              };
            } else {
              console.log('❌ Nenhum usuário com este email na lista');
            }
          }
        }
      } catch (e) {
        console.warn(`💥 Erro na lista de ${ep.tipo}:`, e);
      }
    }
    
    console.log('❌❌❌ NENHUM USUÁRIO ENCONTRADO EM LUGAL NENHUM!');
    return null;
    
  } catch (error) {
    console.error('💥💥💥 ERRO GRAVE AO BUSCAR USUÁRIO:', error);
    return null;
  }
};

  const aoSubmeter = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setErro({ mensagem: '', tipo: '' });
    setCarregando(true);

    try {
      // Limpar tokens antigos antes do novo login
      limparTokensAntigos();

      const tokens = await verificarCredenciais(dadosLogin);
      if (!tokens) return; // caso senha expirada, já redirecionou

      console.log('Tokens recebidos com sucesso');

      // Salvar tokens
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      // Buscar dados do usuário autenticado
      const usuario = await buscarDadosUsuario(tokens.access, dadosLogin.email);

      if (!usuario) {
        throw new Error("Não foi possível identificar o tipo de usuário.");
      }

      console.log('Usuário autenticado:', usuario);

      // Salvar dados do usuário
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
      sessionStorage.setItem('userType', usuario.tipo);

      // Redirecionar de acordo com o tipo
      switch (usuario.tipo) {
        case 'medico':
          navigate('/dashboard-medico');
          break;
        case 'enfermeiro':
          navigate('/dashboard-enfermeiro');
          break;
        case 'rh':
          navigate('/dashboard-rh');
          break;
        case 'administrador':
          navigate('/dashboard-admin');
          break;
        case 'paciente':
          navigate('/dashboard-paciente');
          break;
        default:
          navigate('/dashboard-paciente');
      }
    } catch (erroLogin) {
      console.error('Erro no login:', erroLogin);
      
      // Limpar tokens em caso de erro
      limparTokensAntigos();
      
      setErro({ 
        mensagem: erroLogin.message || 'Erro ao fazer login', 
        tipo: 'credenciais' 
      });
    } finally {
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
              <span className="nav-link" onClick={() => navigate('/rh')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}>
                <FontAwesomeIcon icon={faPhoneAlt} /> Contato
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="login-container">
          <div className="login-card">
            <div className="loginrh-header">
              <FontAwesomeIcon icon={faSignInAlt} style={{fontSize: '2.5rem', color: '#100763', marginBottom: '15px'}} />
              <h2 className="login-title">Acesso a Conta</h2>
              <p style={{color: '#7f8c8d', textAlign: 'center', marginBottom: '20px'}}>Área exclusiva para login dos usuários</p>
            </div>

            {mensagemSucesso && (
              <div className="success-message">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>{mensagemSucesso}</span>
              </div>
            )}

            {erro.mensagem && (
              <div className={`error-message ${erro.tipo}`}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <span>{erro.mensagem}</span>
                {erro.tipo === 'credenciais' && (
                  <div className="error-help">
                    Verifique seu e-mail e senha ou <span onClick={() => navigate('/recuperar-senha', { state: { email: dadosLogin.email } })}>recupere sua senha</span>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={aoSubmeter} className="login-form">
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={dadosLogin.email}
                  onChange={aoAlterar}
                  required
                  disabled={carregando}
                  className={erro.tipo === 'email' || erro.tipo === 'credenciais' ? 'error' : ''}
                  placeholder="Digite seu e-mail"
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
                  'Entrar'
                )}
              </button>

              <div className="login-links">
                <span 
                  className="link" 
                  onClick={() => !carregando && navigate('/recuperar-senha', { state: { email: dadosLogin.email } })}
                  role="button"
                  tabIndex="0"
                >
                  Esqueceu sua senha?
                </span>
                <span 
                  className="link" 
                  onClick={() => !carregando && navigate('/cadastro')}
                  role="button"
                  tabIndex="0"
                >
                  Criar uma conta
                </span>
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

export default Login;
