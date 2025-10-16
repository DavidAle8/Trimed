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
  const pacienteState = location.state || {};

  const [usuario, setUsuario] = useState(null);
  const [paciente, setPaciente] = useState({
    nome: pacienteState?.pacienteNome || 'Paciente',
    agendamentoId: pacienteState?.agendamentoId || null,
    agendamento: null
  });

  const [sinaisVitais, setSinaisVitais] = useState({
    pressao_arterial: '',
    temperatura: '',
    frequencia_cardiaca: '',
    frequencia_respiratoria: '',
    saturacao_oxigenio: '',
    glicemia_capilar: ''
  });

  // Verifica login do usuário
  useEffect(() => {
    const usuarioSalvo = sessionStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Buscar informações completas do agendamento
  useEffect(() => {
    const fetchAgendamento = async () => {
      if (!paciente.agendamentoId) return;
      try {
        const resp = await fetch(
          `http://127.0.0.1:8000/api/agendamento/${paciente.agendamentoId}/`,
          {
            headers: { 
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          setPaciente(prev => ({ ...prev, agendamento: data }));
        } else {
          console.error('Erro ao buscar agendamento');
        }
      } catch (err) {
        console.error('Erro na requisição do agendamento:', err);
      }
    };

    fetchAgendamento();
  }, [paciente.agendamentoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSinaisVitais(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmarTriagem = async () => {
    if (!usuario?.id) {
      alert('Erro: usuário não encontrado!');
      return;
    }
    if (!paciente.agendamentoId || !paciente.agendamento) {
      alert('Erro: agendamento do paciente não encontrado!');
      return;
    }

    const payload = {
      agendamento_id: paciente.agendamentoId,
      enfermeiro_id: usuario.id,
      pressao_arterial: sinaisVitais.pressao_arterial || '',
      temperatura: parseFloat(sinaisVitais.temperatura) || 0.0,
      frequencia_cardiaca: parseInt(sinaisVitais.frequencia_cardiaca) || 0,
      frequencia_respiratoria: parseInt(sinaisVitais.frequencia_respiratoria) || 0,
      saturacao_oxigenio: parseInt(sinaisVitais.saturacao_oxigenio) || 0,
      glicemia_capilar: parseInt(sinaisVitais.glicemia_capilar) || 0,
      agendamento_info: paciente.agendamento // envia todas as infos do agendamento
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
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navigate('/')}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            <nav className="nav">
              <button className="cta-button logout-button" onClick={logout}>Sair</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          <div className="dashboard-welcome-section">
            <div className="user-greeting">
              <FontAwesomeIcon icon={faUserCircle} size="3x" />
              <div>
                <h2 className="hero-title">Registro de Sinais Vitais</h2>
                <p className="hero-subtitle">
                  Enf. {usuario.nome_completo} | COREN: {usuario.coren}
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
                {[
                  ['pressao_arterial', 'Pressão Arterial (mmHg)', faHeartbeat],
                  ['temperatura', 'Temperatura (°C)', faThermometerHalf],
                  ['frequencia_cardiaca', 'Frequência Cardíaca (bpm)', faHeartbeat],
                  ['frequencia_respiratoria', 'Frequência Respiratória (rpm)', faLungs],
                  ['saturacao_oxigenio', 'Saturação de Oxigênio (%)', faTint],
                  ['glicemia_capilar', 'Glicemia Capilar (mg/dL)', faSyringe],
                ].map(([name, label, icon], idx) => (
                  <div className="sinal-item" key={idx}>
                    <label><FontAwesomeIcon icon={icon} /> {label}:</label>
                    <input
                      type={name === 'pressao_arterial' ? 'text' : 'number'}
                      name={name}
                      value={sinaisVitais[name]}
                      onChange={handleInputChange}
                      placeholder={label}
                    />
                  </div>
                ))}

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

