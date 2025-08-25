import React, { useState } from 'react';
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
  faSignOutAlt,faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
const AgendarConsulta = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    especialidade: '',
    medico: '',
    data: '',
    horario: '',
    motivo: '',
    medicamentos: '',
    alergias: '',
    doencasCronicas: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do agendamento:', formData);
    // Aqui você faria a chamada para a API
    navigate('/visualizar-agendamentos');
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
              <FontAwesomeIcon icon={faCalendarPlus} /> Agendar Consulta
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="consulta-form">
            <div className="form-section">
              <h2 className="section-title">Agendamento de Consultas</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="especialidade">Especialidade *</label>
                  <select
                    id="especialidade"
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma especialidade</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Dermatologia">Dermatologia</option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Ortopedia">Ortopedia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="medico">Médico *</label>
                  <select
                    id="medico"
                    name="medico"
                    value={formData.medico}
                    onChange={handleChange}
                    required
                    disabled={!formData.especialidade}
                  >
                    <option value="">Selecione um médico</option>
                    {formData.especialidade === "Cardiologia" && (
                      <>
                        <option value="Dra. Ana Silva">Dra. Ana Silva</option>
                        <option value="Dr. Carlos Mendes">Dr. Carlos Mendes</option>
                      </>
                    )}
                    {formData.especialidade === "Dermatologia" && (
                      <>
                        <option value="Dra. Patrícia Oliveira">Dra. Patrícia Oliveira</option>
                        <option value="Dr. Roberto Souza">Dr. Roberto Souza</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="data">Data *</label>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="horario">Horário *</label>
                  <select
                    id="horario"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    required
                    disabled={!formData.data}
                  >
                    <option value="">Selecione um horário</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="motivo">Motivo da Consulta *</label>
                <textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                  placeholder="Descreva o motivo da consulta"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Informações de Saúde</h2>
              
              <div className="form-group">
                <label htmlFor="medicamentos">Medicamentos em uso</label>
                <textarea
                  id="medicamentos"
                  name="medicamentos"
                  value={formData.medicamentos}
                  onChange={handleChange}
                  placeholder="Liste os medicamentos que você está usando atualmente"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="alergias">Alergias conhecidas</label>
                <textarea
                  id="alergias"
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  placeholder="Informe suas alergias conhecidas"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="doencasCronicas">Doenças crônicas</label>
                <textarea
                  id="doencasCronicas"
                  name="doencasCronicas"
                  value={formData.doencasCronicas}
                  onChange={handleChange}
                  placeholder="Informe doenças crônicas que você possui"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => navigate('/dashboard-paciente')}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="primary-button"
              >
                Confirmar Agendamento
              </button>
            </div>
          </form>
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

export default AgendarConsulta;
