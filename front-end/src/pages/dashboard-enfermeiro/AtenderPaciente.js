import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faMapMarkerAlt,
  faSignOutAlt,
  faArrowLeft,
  faHeartbeat,
  faThermometerHalf,
  faTachometerAlt,
  faLungs,
  faSyringe,
  faNotesMedical,
  faAllergies,
  faHistory,
  faPills,
  faStethoscope
} from "@fortawesome/free-solid-svg-icons";
import "./AtenderPaciente.css";

const AtenderPaciente = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [triagemData, setTriagemData] = useState([]);
  const [fichaData, setFichaData] = useState([]);
  const [pacientesCompletos, setPacientesCompletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados da triagem e ficha médica
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        console.log("Buscando dados dos pacientes...");

        // Buscar dados de ambos os endpoints simultaneamente
        const [triagemResponse, fichaResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/triagem-enfermeiro/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/ficha-medica-paciente/", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (!triagemResponse.ok) {
          throw new Error("Erro ao buscar dados da triagem");
        }

        if (!fichaResponse.ok) {
          throw new Error("Erro ao buscar dados da ficha médica");
        }

        const triagemDados = await triagemResponse.json();
        const fichaDados = await fichaResponse.json();

        console.log("Dados da triagem recebidos:", triagemDados);
        console.log("Dados da ficha recebidos:", fichaDados);

        setTriagemData(triagemDados);
        setFichaData(fichaDados);

        // Combinar dados com base no ID
        const pacientesCombinados = fichaDados.map(ficha => {
          const triagem = triagemDados.find(t => t.id === ficha.id) || {};
          return {
            ...ficha,
            ...triagem
          };
        });

        setPacientesCompletos(pacientesCombinados);
      } catch (error) {
        console.error("Erro:", error);
        setError("Erro ao carregar dados dos pacientes.");
      } finally {
        setLoading(false);
      }
    };

    const usuarioSalvo = sessionStorage.getItem("usuario");
    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }
    setUsuario(JSON.parse(usuarioSalvo));

    carregarDados();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("usuario");
    navigate("/login");
  };

  if (!usuario) return null;

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navigate("/")}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            <nav className="nav">
              <span className="nav-link" onClick={() => navigate("/")}>
                Inicio
              </span>
              <span className="nav-link" onClick={() => navigate("/servicos")}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navigate("/RH")}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate("/contato")}>
                <FontAwesomeIcon icon={faPhoneAlt} /> Contato
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
                <h2 className="hero-title">Atendimento ao Paciente</h2>
                <p className="hero-subtitle">
                  {usuario.email && <span>Dr. {usuario.nome_completo}</span>}
                  {usuario.coren && <span> | COREN: {usuario.coren}</span>}
                </p>
              </div>
            </div>

            <div className="page-actions" style={{ marginTop: 10 }}>
              <button
                className="back-button"
                onClick={() => navigate("/dashboard-medico")}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
              </button>
            </div>
          </div>

          {/* Conteúdo dos pacientes */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Carregando dados dos pacientes...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Tentar Novamente
              </button>
            </div>
          ) : pacientesCompletos.length > 0 ? (
            <div className="pacientes-container">
              {pacientesCompletos.map(paciente => (
                <div key={paciente.id} className="ficha-medica-container">
                  <div className="ficha-header">
                    <h2 className="paciente-nome">
                      {paciente.nome_completo || "Nome não disponível"}
                    </h2>
                    <div style={{ marginTop: "5px" }}>
                      <small style={{ color: "blue" }}>
                        ID: {paciente.id}
                      </small>
                    </div>
                  </div>

                  <div className="ficha-content">
                    {/* Informações da Consulta */}
                    <div className="ficha-section">
                      <h3>
                        <FontAwesomeIcon icon={faStethoscope} /> Informações da Consulta
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <h4>Motivo da Consulta</h4>
                          <p>{paciente.motivo_consulta || "Não informado"}</p>
                        </div>
                        <div className="info-item">
                          <h4>Medicação para Sintoma</h4>
                          <p>{paciente.medicacao_para_sintoma || "Não informado"}</p>
                        </div>
                        <div className="info-item">
                          <h4>Medicação Diária</h4>
                          <p>{paciente.medicamento_diario || "Não informado"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Histórico Médico */}
                    <div className="ficha-section">
                      <h3>
                        <FontAwesomeIcon icon={faHistory} /> Histórico Médico
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <h4>Doenças Crônicas</h4>
                          <p>{paciente.possui_doencas_cronicas || "Não informado"}</p>
                        </div>
                        <div className="info-item">
                          <h4>Histórico Familiar</h4>
                          <p>{paciente.historico_familiar_de_doencas || "Não informado"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Alergias */}
                    <div className="ficha-section">
                      <h3>
                        <FontAwesomeIcon icon={faAllergies} /> Alergias
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <h4>Alergias Gerais</h4>
                          <p>{paciente.alergia_geral || "Não informado"}</p>
                        </div>
                        <div className="info-item">
                          <h4>Alergias a Medicamentos</h4>
                          <p>{paciente.alergia_medicamento || "Não informado"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Seção de Sinais Vitais */}
                    {paciente.pressao_arterial && (
                      <div className="ficha-section">
                        <h3>
                          <FontAwesomeIcon icon={faHeartbeat} /> Sinais Vitais
                        </h3>
                        <div className="sinais-vitais-grid">
                          <div className="sinal-vital-card">
                            <div className="sinal-vital-icon">
                              <FontAwesomeIcon icon={faTachometerAlt} />
                            </div>
                            <div className="sinal-vital-info">
                              <h4>Pressão Arterial</h4>
                              <p>{paciente.pressao_arterial || "N/A"} mmHg</p>
                            </div>
                          </div>

                          <div className="sinal-vital-card">
                            <div className="sinal-vital-icon">
                              <FontAwesomeIcon icon={faThermometerHalf} />
                            </div>
                            <div className="sinal-vital-info">
                              <h4>Temperatura</h4>
                              <p>{paciente.temperatura || "N/A"} °C</p>
                            </div>
                          </div>

                          <div className="sinal-vital-card">
                            <div className="sinal-vital-icon">
                              <FontAwesomeIcon icon={faHeartbeat} />
                            </div>
                            <div className="sinal-vital-info">
                              <h4>Frequência Cardíaca</h4>
                              <p>{paciente.frequencia_cardiaca || "N/A"} bpm</p>
                            </div>
                          </div>

                          <div className="sinal-vital-card">
                            <div className="sinal-vital-icon">
                              <FontAwesomeIcon icon={faLungs} />
                            </div>
                            <div className="sinal-vital-info">
                              <h4>Frequência Respiratória</h4>
                              <p>{paciente.frequencia_respiratoria || "N/A"} rpm</p>
                            </div>
                          </div>

                          <div className="sinal-vital-card">
                            <div className="sinal-vital-icon">
                              <FontAwesomeIcon icon={faLungs} />
                            </div>
                            <div className="sinal-vital-info">
                              <h4>Saturação de Oxigênio</h4>
                              <p>{paciente.saturacao_oxigenio || "N/A"} %</p>
                            </div>
                          </div>

                          <div className="sinal-vital-card">
                            <div className="sinal-vital-icon">
                              <FontAwesomeIcon icon={faSyringe} />
                            </div>
                            <div className="sinal-vital-info">
                              <h4>Glicemia Capilar</h4>
                              <p>{paciente.glicemia_capilar || "N/A"} mg/dL</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Observações Médicas */}
                    {paciente.observacoes_medicas && (
                      <div className="ficha-section">
                        <h3>
                          <FontAwesomeIcon icon={faNotesMedical} /> Observações Médicas
                        </h3>
                        <p>{paciente.observacoes_medicas}</p>
                      </div>
                    )}

                    {/* Data da Triagem */}
                    {paciente.data_criacao_triagem && (
                      <div className="ficha-section">
                        <h3>Data da Triagem</h3>
                        <p>{new Date(paciente.data_criacao_triagem).toLocaleString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhum paciente disponível para atendimento.</p>
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
            <p>
              <FontAwesomeIcon icon={faPhoneAlt} /> (11) 1234-5678
            </p>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Av. Saúde, 123
            </p>
          </div>
        </div>
        <div className="copyright">
          <p>© {new Date().getFullYear()} TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default AtenderPaciente;
