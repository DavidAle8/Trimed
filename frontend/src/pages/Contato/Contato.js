import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contato.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faStethoscope, 
  faFlask, 
  faHeartbeat, 
  faXRay,
  faCalendarAlt,
  faPhoneAlt,
  faMapMarkerAlt ,
  faClock,
  faEnvelope,
  faUserNurse
} from '@fortawesome/free-solid-svg-icons';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o formulário
    setEnviado(true);
  };

  return (
    <div className="contato-page">
      <header className="header">
         <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navigate('/')}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            
            <nav className="nav">
              <span className="nav-link" onClick={() => navigate('/')}>Inicio</span>
              <span className="nav-link active" onClick={() => navigate('/servicos')}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navigate('/rh')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Hunanos
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
          <h2 className="page-title">Entre em Contato</h2>
          
          <div className="contato-container">
            <div className="contato-info">
              <div className="info-item">
                <FontAwesomeIcon icon={faPhoneAlt} />
                <h3>Telefone</h3>
                <p>(11) 1234-5678</p>
              </div>
              
              <div className="info-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <h3>Endereço</h3>
                <p>Av. Saúde, 123 - Centro, São Paulo - SP</p>
              </div>
              
              <div className="info-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <h3>Email</h3>
                <p>contato@trimed.com.br</p>
              </div>
              
              <div className="info-item">
                <FontAwesomeIcon icon={faClock} />
                <h3>Horário de Atendimento</h3>
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 12h</p>
              </div>
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

export default Contato;
