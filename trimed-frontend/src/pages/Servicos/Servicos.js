import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Servicos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faStethoscope, 
  faFlask, 
  faHeartbeat, 
  faXRay,
  faCalendarAlt,
  faPhoneAlt,
  faMapMarkerAlt,
  faUserNurse
} from '@fortawesome/free-solid-svg-icons';

const Servicos = () => {
  const navigate = useNavigate();

  return (
    <div className="servicos-page">
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navigate('/')}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            
            <nav className="nav">
              <span className="nav-link" onClick={() => navigate('/')}>Home</span>
              <span className="nav-link active" onClick={() => navigate('/servicos')}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navigate('/rh')}>
                <FontAwesomeIcon icon={faUserNurse}  /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}>
                <FontAwesomeIcon icon={faPhoneAlt} /> Contato
              </span>
              <button 
                className="cta-button"
                onClick={() => navigate('/login')}
              >
                Área do Paciente
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          <h2 className="page-title">Nossos Serviços</h2>
          
          <div className="servicos-grid">
            <div className="servico-card">
              <FontAwesomeIcon icon={faUserMd} size="3x" />
              <h3>Consultas Médicas</h3>
              <p>Atendimento com especialistas em diversas áreas</p>
            </div>
            
            <div className="servico-card">
              <FontAwesomeIcon icon={faStethoscope} size="3x" />
              <h3>Check-up Completo</h3>
              <p>Avaliação completa da sua saúde</p>
            </div>
            
            <div className="servico-card">
              <FontAwesomeIcon icon={faFlask} size="3x" />
              <h3>Exames Laboratoriais</h3>
              <p>Análises clínicas com resultados precisos</p>
            </div>
            
            <div className="servico-card">
              <FontAwesomeIcon icon={faHeartbeat} size="3x" />
              <h3>Cardiologia</h3>
              <p>Cuidados especializados para seu coração</p>
            </div>
            
            <div className="servico-card">
              <FontAwesomeIcon icon={faXRay} size="3x" />
              <h3>Exames de Imagem</h3>
              <p>Raios-X, Ultrassonografia e mais</p>
            </div>
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
          <p>© 2025 TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Servicos;
