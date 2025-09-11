import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import backgrounds from '../../assets/backgrounds/home-background.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faCalendarAlt, faUserMd, faMapMarkerAlt ,faUserNurse} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ backgroundImage: `url(${backgrounds})` }}>
     

      {/* Header com navegação principal */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navigate('/')}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            
            <nav className="nav">
              <span className="nav-link" onClick={() => navigate('/')}>Início</span>
              <span className="nav-link" onClick={() => navigate('/servicos')}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navigate('/RH')}>
                <FontAwesomeIcon icon={faUserNurse}  /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}><FontAwesomeIcon icon={faPhoneAlt}/>Contato</span>
              <button 
                className="cta-button"
                onClick={() => navigate('/login')}
              >
                Entrar
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="main-content">
        <div className="content-container">
          <div className="hero-section">
            <h2 className="hero-title">
              TRIMED, Sua saúde,<br />
              nossa prioridade.
            </h2>
            <p className="hero-subtitle">
              Agende sua consulta de forma rápida e tenha um atendimento de qualidade.
            </p>
            <div className="hero-buttons">
              <button 
                className="secondary-button"
                onClick={() => navigate('/login')}
              >
                Agendar Consulta
              </button>
              <button 
                className="secondary-button"
                onClick={() => navigate('/servicos')}
              >
                Nossos Serviços
              </button>
            </div>
          </div>

          {/* Seção de destaques */}
          <div className="highlights-section">
            <div className="highlight-card">
              <FontAwesomeIcon icon={faUserMd} size="2x" />
              <h3>+50 Especialistas</h3>
              <p>Profissionais qualificados em diversas áreas</p>
            </div>
            <div className="highlight-card">
              <FontAwesomeIcon icon={faCalendarAlt} size="2x" />
              <h3>Agendamento Online</h3>
              <p>Rápido e sem complicação</p>
            </div>
            <div className="highlight-card">
              <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
              <h3>3 Unidades</h3>
              <p>Atendimento em vários locais</p>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
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
        
          <p>© 2025 TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
