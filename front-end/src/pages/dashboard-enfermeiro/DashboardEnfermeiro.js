import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardEnfermeiro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserInjured,
  faInfoCircle,
  faUserCircle,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faMapMarkerAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const DashboardEnfermeiro = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        // 🔥 DECODIFICAR TOKEN PARA PEGAR USER_ID
        let userId = null;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.user_id;
          console.log('User ID do token (Enfermeiro):', userId);
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          throw new Error('Token inválido');
        }

        // 🔥 BUSCAR ENFERMEIRO ESPECÍFICO PELO ID (NÃO LISTA COMPLETA)
        const response = await fetch(`http://127.0.0.1:8000/api/enfermeiro/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Status da resposta (Enfermeiro):', response.status);

        if (!response.ok) {
          // Se não encontrar pelo ID específico, tentar buscar na lista
          console.log('Não encontrou enfermeiro por ID, tentando lista completa...');
          const listaResponse = await fetch('http://127.0.0.1:8000/api/enfermeiro/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!listaResponse.ok) throw new Error('Erro ao carregar dados do enfermeiro');

          const listaData = await listaResponse.json();
          console.log('Dados da lista completa de enfermeiros:', listaData);

          if (Array.isArray(listaData) && listaData.length > 0) {
            // 🔥 FILTRAR POR EMAIL DO USUÁRIO LOGADO
            const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario'));
            const emailUsuarioLogado = usuarioLogado?.email;
            
            const enfermeiroEncontrado = listaData.find(enfermeiro => 
              enfermeiro.email === emailUsuarioLogado
            );

            if (enfermeiroEncontrado) {
              const usuarioData = {
                nome_completo: enfermeiroEncontrado.nome_completo || enfermeiroEncontrado.nome || 'Enfermeiro',
                email: enfermeiroEncontrado.email,
                coren: enfermeiroEncontrado.coren,
                telefone: enfermeiroEncontrado.telefone,
                ...enfermeiroEncontrado
              };
              
              sessionStorage.setItem('usuario', JSON.stringify(usuarioData));
              setUsuario(usuarioData);
            } else {
              throw new Error('Enfermeiro não encontrado na lista');
            }
          } else {
            throw new Error('Nenhum enfermeiro encontrado');
          }
        } else {
          // Se encontrou pelo ID específico
          const dados = await response.json();
          console.log('Dados recebidos da API (Enfermeiro por ID):', dados);

          const usuarioData = {
            nome_completo: dados.nome_completo || dados.nome || 'Enfermeiro',
            email: dados.email,
            coren: dados.coren,
            telefone: dados.telefone,
            ...dados
          };

          sessionStorage.setItem('usuario', JSON.stringify(usuarioData));
          setUsuario(usuarioData);
        }

      } catch (error) {
        console.error('Erro ao carregar dados do enfermeiro:', error);
        // Tentar recuperar dados da sessionStorage em caso de erro
        const usuarioSalvo = sessionStorage.getItem('usuario');
        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        } else {
          logout();
        }
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [navigate]);

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    await fetch('http://127.0.0.1:8000/api/logout/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    // Limpar tokens e usuário localmente
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuario');
    
    navigate('/login');
  };

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando seus dados...</p>
      </div>
    );
  }

  if (!usuario) {
    navigate('/login');
    return null;
  }

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navigate('/')}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            
            <nav className="nav">
              <span className="nav-link" onClick={() => navigate('/')}>Home</span>
              <span className="nav-link" onClick={() => navigate('/servicos')}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navigate('/RH')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}>
                <FontAwesomeIcon icon={faPhoneAlt}/> Contato
              </span>
              <button 
                className="cta-button logout-button"
                onClick={logout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="main-content">
        <div className="content-container">
          <div className="dashboard-welcome-section">
            <div className="user-greeting">
              <FontAwesomeIcon icon={faUserCircle} size="3x" />
              <div>
                <h2 className="hero-title">Bem-vinda, Enf. {usuario.nome_completo}!</h2>
                <p className="hero-subtitle">
                  {usuario.email && <span>Email: {usuario.email}</span>}
                  {usuario.coren && <span> | COREN: {usuario.coren}</span>}
                  {usuario.telefone && <span> | Tel: {usuario.telefone}</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="welcome-message">
            <h2>TRIMED, Sua saúde, nossa prioridade.</h2>
            <p>Agende sua consulta de forma rápida e tenha um atendimento de qualidade.</p>
          </div>

          <div className="dashboard-cards enfermeiro-cards">
            <div 
              className="highlight-card dashboard-card enfermeiro-card" 
              onClick={() => navigate('/ficha-medica')}
            >
              <div className="card-icon">
                <FontAwesomeIcon icon={faUserInjured} size="2x" />
              </div>
              <h3>Atender Paciente</h3>
              <button className="secondary-button">Acessar</button>
            </div>
            
            <div 
              className="highlight-card dashboard-card enfermeiro-card" 
              onClick={() => navigate('/detalhes')}
            >
              <div className="card-icon">
                <FontAwesomeIcon icon={faInfoCircle} size="2x" />
              </div>
              <h3>Detalhes</h3>
              <button className="secondary-button">Acessar</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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

export default DashboardEnfermeiro;
