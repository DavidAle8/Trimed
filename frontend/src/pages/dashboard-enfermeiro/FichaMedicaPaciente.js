import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardEnfermeiro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faMapMarkerAlt,
  faSignOutAlt,
  faArrowLeft,
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';

const FichaMedicaPaciente = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarFichas = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        console.log("Buscando fichas médicas...");

        // 1. Buscar todas as fichas médicas
        const response = await fetch("http://127.0.0.1:8000/api/ficha-medica-paciente/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro ao buscar fichas médicas:", response.status, errorText);
          throw new Error("Erro ao buscar fichas médicas");
        }

        const fichasMedicas = await response.json();
        console.log("Fichas médicas recebidas:", fichasMedicas);

        // 2. Buscar TODOS os pacientes para tentar associar
        console.log("Buscando todos os pacientes...");
        const pacientesResponse = await fetch("http://127.0.0.1:8000/api/paciente/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let todosPacientes = [];
        if (pacientesResponse.ok) {
          todosPacientes = await pacientesResponse.json();
          console.log("Pacientes encontrados:", todosPacientes);
        }

        
        const fichasProcessadas = fichasMedicas.map((ficha, index) => {
       
          const pacienteIndex = index % todosPacientes.length;
          const pacienteAssociado = todosPacientes[pacienteIndex];
          
          return {
            ...ficha,
            paciente_nome: pacienteAssociado ? pacienteAssociado.nome_completo : "Nome não disponível",
            paciente_id: pacienteAssociado ? pacienteAssociado.id : null,
            motivo_consulta: ficha.motivo_consulta || 'Não informado',
            medicacao_para_sintoma: ficha.medicacao_para_sintoma || 'Não informado',
            medicamento_diario: ficha.medicamento_diario || 'Não informado',
            alergia_geral: ficha.alergia_geral || 'Não informado',
            alergia_medicamento: ficha.alergia_medicamento || 'Não informado',
            possui_doencas_cronicas: ficha.possui_doencas_cronicas || 'Não informado',
            historico_familiar_de_doencas: ficha.historico_familiar_de_doencas || 'Não informado'
          };
        });

        console.log("Fichas processadas:", fichasProcessadas);

        // 4. Filtrar apenas fichas não atendidas (sem triagem IA)
        try {
          const triagemResponse = await fetch("http://127.0.0.1:8000/api/triagem-IA/", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (triagemResponse.ok) {
            const triagens = await triagemResponse.json();
            console.log("Triagens IA encontradas:", triagens);

            const fichasNaoAtendidas = fichasProcessadas.filter(ficha => {
              return !triagens.some(triagem =>
                triagem.ficha_medica_paciente &&
                (triagem.ficha_medica_paciente.id === ficha.id || 
                 triagem.ficha_medica_paciente === ficha.id)
              );
            });

            console.log("Fichas não atendidas:", fichasNaoAtendidas);
            setPacientes(fichasNaoAtendidas);
          } else {
            console.warn("Erro ao buscar triagens IA, mostrando todas as fichas");
            setPacientes(fichasProcessadas);
          }
        } catch (triagemError) {
          console.error("Erro ao buscar triagens IA:", triagemError);
          setPacientes(fichasProcessadas);
        }

      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar fichas médicas.");
      } finally {
        setLoading(false);
      }
    };

    // Recupera usuário logado
    const usuarioSalvo = sessionStorage.getItem("usuario");
    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }
    setUsuario(JSON.parse(usuarioSalvo));

    carregarFichas();
  }, [navigate]);

  const handleSelecionarPaciente = (p) => setPacienteSelecionado(p);

  const handleTriagem = (paciente) => {
    navigate('/sinais-vitais', { 
      state: { 
        pacienteId: paciente.paciente_id, 
        nome: paciente.paciente_nome,
        fichaId: paciente.id
      } 
    });
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
              <span className="nav-link" onClick={() => navigate('/')}>Inicio</span>
              <span className="nav-link" onClick={() => navigate('/servicos')}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navigate('/RH')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}>
                <FontAwesomeIcon icon={faPhoneAlt}/> Contato
              </span>
              <button className="cta-button logout-button" onClick={logout}>
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
                <h2 className="hero-title">Fichas Médicas dos Pacientes</h2>
                <p className="hero-subtitle">
                  {usuario.email && <span>Enf. {usuario.nome_completo}</span>}
                  {usuario.coren && <span> | COREN: {usuario.coren}</span>}
                </p>
              </div>
            </div>

            {!pacienteSelecionado && (
              <div className="page-actions" style={{ marginTop: 10 }}>
                <button className="back-button" onClick={() => navigate('/dashboard-enfermeiro')}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Carregando fichas médicas...</p>
            </div>
          ) : !pacienteSelecionado ? (
            <div className="lista-pacientes">
              
              
              {pacientes.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhuma ficha médica pendente encontrada.</p>
                  <p>Todos os pacientes já foram atendidos.</p>
                </div>
              ) : (
                pacientes.map(p => (
                  <div key={p.id} className="paciente-card" onClick={() => handleSelecionarPaciente(p)}>
                    <h3>{p.paciente_nome}</h3>
                    <p className="paciente-motivo">{p.motivo_consulta}</p>
                    <div className="paciente-card-actions">
                      <button className="secondary-button">Ver ficha</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="ficha-medica-container">
              <div className="ficha-header">
                <button className="back-button" onClick={() => setPacienteSelecionado(null)}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                </button>
                <h2 className="paciente-nome">{pacienteSelecionado.paciente_nome}</h2>
                <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                  <small style={{color: 'blue', padding: '2px 5px', background: '#f0f0f0', borderRadius: '3px'}}>
                    Ficha ID: {pacienteSelecionado.id}
                  </small>
                  {pacienteSelecionado.paciente_id && (
                    <small style={{color: 'green', padding: '2px 5px', background: '#f0f0f0', borderRadius: '3px'}}>
                      Paciente ID: {pacienteSelecionado.paciente_id}
                    </small>
                  )}
                </div>
              </div>

              <div className="ficha-content">
                {[
                  ["Motivo da Consulta", pacienteSelecionado.motivo_consulta],
                  ["Medicamentos para o sintoma", pacienteSelecionado.medicacao_para_sintoma],
                  ["Medicamentos de uso diário", pacienteSelecionado.medicamento_diario],
                  ["Alergias gerais", pacienteSelecionado.alergia_geral],
                  ["Alergias a medicamentos", pacienteSelecionado.alergia_medicamento],
                  ["Doenças crônicas", pacienteSelecionado.possui_doencas_cronicas],
                  ["Histórico familiar de doenças", pacienteSelecionado.historico_familiar_de_doencas],
                ].map(([label, value], i) => (
                  <div key={i} className="ficha-section">
                    <h3>{label}</h3>
                    <p>{value}</p>
                  </div>
                ))}

                <div className="ficha-actions">
                  <button className="cta-button" onClick={() => handleTriagem(pacienteSelecionado)}>
                    <FontAwesomeIcon icon={faNotesMedical} /> Atender paciente
                  </button>
                </div>
              </div>
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

export default FichaMedicaPaciente;
