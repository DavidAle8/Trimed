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
  faSignOutAlt,faArrowLeft,faEdit,faTrashAlt,faClock
} from '@fortawesome/free-solid-svg-icons';

const VisualizarAgendamentos = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Simulando busca de agendamentos
    const fetchAgendamentos = async () => {
      try {
        // Na prática, você faria uma chamada para sua API
        const mockAgendamentos = [
          {
            id: 1,
            data: '2023-11-15',
            horario: '10:00',
            especialidade: 'Cardiologia',
            medico: 'Dra. Ana Silva',
            local: 'Unidade Central - Sala 201',
            status: 'confirmado'
          },
          {
            id: 2,
            data: '2023-11-20',
            horario: '14:00',
            especialidade: 'Dermatologia',
            medico: 'Dr. Roberto Souza',
            local: 'Unidade Norte - Sala 105',
            status: 'pendente'
          }
        ];
        
        setAgendamentos(mockAgendamentos);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchAgendamentos();
  }, []);

  const cancelarAgendamento = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setAgendamentos(prev => prev.filter(ag => ag.id !== id));
      // Aqui você faria a chamada para a API para cancelar
    }
  };

  const editarAgendamento = (id) => {
    navigate(`/editar-agendamento/${id}`);
    // Ou redirecionar para a página de agendamento com os dados
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
              <FontAwesomeIcon icon={faCalendarCheck} /> Meus Agendamentos
            </h1>
          </div>

          {carregando ? (
            <div className="loading-message">Carregando seus agendamentos...</div>
          ) : agendamentos.length === 0 ? (
            <div className="empty-message">
              <p>Você não possui agendamentos marcados.</p>
              <button 
                className="primary-button"
                onClick={() => navigate('/agendar-consulta')}
              >
                Agendar Consulta
              </button>
            </div>
          ) : (
            <div className="agendamentos-list">
              {agendamentos.map(agendamento => (
                <div key={agendamento.id} className="agendamento-card">
                  <div className="agendamento-header">
                    <span className={`status-badge ${agendamento.status}`}>
                      {agendamento.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </span>
                    <div className="agendamento-actions">
                      <button 
                        className="icon-button"
                        onClick={() => editarAgendamento(agendamento.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="icon-button danger"
                        onClick={() => cancelarAgendamento(agendamento.id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="agendamento-info">
                    <div className="info-item">
                      <FontAwesomeIcon icon={faUserMd} />
                      <span>{agendamento.medico}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Especialidade:</span>
                      <span>{agendamento.especialidade}</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{new Date(agendamento.data).toLocaleDateString('pt-BR')} às {agendamento.horario}</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{agendamento.local}</span>
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

export default VisualizarAgendamentos;
