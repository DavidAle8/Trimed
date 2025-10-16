import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPaciente.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faCalendarCheck, 
  faHistory,
  faBell,
  faUserCircle,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faMapMarkerAlt,
  faSignOutAlt,faArrowLeft,faEdit,faTrashAlt,faClock,faFileMedical,faStar
} from '@fortawesome/free-solid-svg-icons';


const HistoricoAgendamentos = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Simulando busca do histórico
    const fetchHistorico = async () => {
      try {
        // Na prática, você faria uma chamada para sua API
        const mockConsultas = [
          {
            id: 1,
            data: '2023-10-10',
            medico: 'Dra. Ana Silva',
            especialidade: 'Cardiologia',
            local: 'Unidade Central - Sala 201',
            diagnostico: 'Pressão arterial elevada',
            medicamentos: 'Losartana 50mg 1x ao dia',
            avaliacao: 5
          },
          {
            id: 2,
            data: '2023-09-15',
            medico: 'Dr. Roberto Souza',
            especialidade: 'Dermatologia',
            local: 'Unidade Norte - Sala 105',
            diagnostico: 'Dermatite atópica',
            medicamentos: 'Hidratante específico 2x ao dia',
            avaliacao: 4
          }
        ];
        
        setConsultas(mockConsultas);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchHistorico();
  }, []);

  const renderAvaliacao = (nota) => {
    return (
      <div className="avaliacao-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon 
            key={star}
            icon={faStar}
            className={star <= nota ? 'filled' : ''}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
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
                className="cta-button"
                onClick={() => navigate('/dashboard-paciente')}
              >
                Área do Paciente
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="main-content">
        <div className="content-container">
          <div className="dashboard-header">
            <button 
              className="back-button"
              onClick={() => navigate('/dashboard-paciente')}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar
            </button>
            <h1 className="page-title">
              <FontAwesomeIcon icon={faHistory} /> Histórico de Consultas
            </h1>
          </div>

          {carregando ? (
            <div className="loading-message">Carregando seu histórico...</div>
          ) : consultas.length === 0 ? (
            <div className="empty-message">
              <p>Você ainda não possui consultas realizadas.</p>
            </div>
          ) : (
            <div className="historico-list">
              {consultas.map(consulta => (
                <div key={consulta.id} className="consulta-card">
                  <div className="consulta-header">
                    <div className="consulta-data">
                      {new Date(consulta.data).toLocaleDateString('pt-BR')}
                    </div>
                    {consulta.avaliacao && renderAvaliacao(consulta.avaliacao)}
                  </div>
                  
                  <div className="consulta-info">
                    <div className="info-item">
                      <FontAwesomeIcon icon={faUserMd} />
                      <span>{consulta.medico} ({consulta.especialidade})</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{consulta.local}</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faFileMedical} />
                      <span><strong>Diagnóstico:</strong> {consulta.diagnostico}</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faFileMedical} />
                      <span><strong>Medicamentos:</strong> {consulta.medicamentos}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default HistoricoAgendamentos;
