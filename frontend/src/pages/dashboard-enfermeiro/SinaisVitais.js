import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardEnfermeiro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle,
  faArrowLeft,
  faHeartbeat,
  faThermometerHalf,
  faLungs,
  faTint,
  faSyringe,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const SinaisVitais = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pacienteState = location.state?.paciente || null;

  const [usuario, setUsuario] = useState(null); // Enfermeiro logado
  const [paciente, setPaciente] = useState({
    nome: pacienteState?.nome || 'Paciente',
    agendamentoId: pacienteState?.agendamentoId || null
  });

  const [sinaisVitais, setSinaisVitais] = useState({
    pressao_arterial: '',
    temperatura: '',
    frequencia_cardiaca: '',
    frequencia_respiratoria: '',
    saturacao_oxigenio: '',
    glicemia_capilar: ''
  });

  // Verifica login
  useEffect(() => {
    const usuarioSalvo = sessionStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSinaisVitais(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmarTriagem = async () => {
    if (!usuario || !usuario.id) {
      alert('Erro: usuário não encontrado!');
      return;
    }

    if (!paciente.agendamentoId) {
      alert('Erro: agendamento do paciente não encontrado!');
      return;
    }

    // Converte valores para número onde necessário
    const payload = {
      pressao_arterial: sinaisVitais.pressao_arterial || '',
      temperatura: parseFloat(sinaisVitais.temperatura) || 0.0,
      frequencia_cardiaca: parseInt(sinaisVitais.frequencia_cardiaca) || 0,
      frequencia_respiratoria: parseInt(sinaisVitais.frequencia_respiratoria) || 0,
      saturacao_oxigenio: parseInt(sinaisVitais.saturacao_oxigenio) || 0,
      glicemia_capilar: parseInt(sinaisVitais.glicemia_capilar) || 0,
      agendamento_id: paciente.agendamentoId
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/triagem-enfermeiro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Triagem concluída com sucesso!');
        navigate('/dashboard-enfermeiro');
      } else {
        const data = await response.json();
        console.error('Erro ao salvar sinais vitais:', data);
        alert('Erro ao salvar sinais vitais. Verifique o console.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com a API.');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuario');
    navigate('/login');
  };

  if (!usuario) return null;

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
              <button 
                className="cta-button logout-button"
                onClick={logout}
              >
                Sair
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
                <h2 className="hero-title">Registro de Sinais Vitais</h2>
                <p className="hero-subtitle">
                  {usuario.nome_completo && <span>Enf. {usuario.nome_completo}</span>}
                  {usuario.coren && <span> | COREN: {usuario.coren}</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="sinais-vitais-container">
            <div className="sinais-header">
              <button className="back-button" onClick={() => navigate('/ficha-medica')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
              </button>
              <h2 className="paciente-nome">{paciente.nome}</h2>
            </div>

            <div className="sinais-content">
              <div className="sinais-form">
                <div className="sinal-item">
                  <label><FontAwesomeIcon icon={faHeartbeat} /> Pressão Arterial (mmHg):</label>
                  <input
                    type="text"
                    name="pressao_arterial"
                    value={sinaisVitais.pressao_arterial}
                    onChange={handleInputChange}
                    placeholder="Ex: 120/80"
                  />
                </div>

                <div className="sinal-item">
                  <label><FontAwesomeIcon icon={faThermometerHalf} /> Temperatura (°C):</label>
                  <input
                    type="number"
                    name="temperatura"
                    value={sinaisVitais.temperatura}
                    onChange={handleInputChange}
                    placeholder="Ex: 36.5"
                    step="0.1"
                  />
                </div>

                <div className="sinal-item">
                  <label><FontAwesomeIcon icon={faHeartbeat} /> Frequência Cardíaca (bpm):</label>
                  <input
                    type="number"
                    name="frequencia_cardiaca"
                    value={sinaisVitais.frequencia_cardiaca}
                    onChange={handleInputChange}
                    placeholder="Ex: 75"
                  />
                </div>

                <div className="sinal-item">
                  <label><FontAwesomeIcon icon={faLungs} /> Frequência Respiratória (rpm):</label>
                  <input
                    type="number"
                    name="frequencia_respiratoria"
                    value={sinaisVitais.frequencia_respiratoria}
                    onChange={handleInputChange}
                    placeholder="Ex: 16"
                  />
                </div>

                <div className="sinal-item">
                  <label><FontAwesomeIcon icon={faTint} /> Saturação de Oxigênio (%):</label>
                  <input
                    type="number"
                    name="saturacao_oxigenio"
                    value={sinaisVitais.saturacao_oxigenio}
                    onChange={handleInputChange}
                    placeholder="Ex: 98"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="sinal-item">
                  <label><FontAwesomeIcon icon={faSyringe} /> Glicemia Capilar (mg/dL):</label>
                  <input
                    type="number"
                    name="glicemia_capilar"
                    value={sinaisVitais.glicemia_capilar}
                    onChange={handleInputChange}
                    placeholder="Ex: 100"
                  />
                </div>

                <div className="sinais-actions">
                  <button className="cta-button" onClick={handleConfirmarTriagem}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Confirmar Triagem
                  </button>
                </div>
              </div>
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
        </div>
        <div className="copyright">
          <p>© {new Date().getFullYear()} TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default SinaisVitais;
