import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardEnfermeiro.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faMapMarkerAlt,
  faSignOutAlt,
  faArrowLeft,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";

const FichaMedicaPaciente = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar agendamentos e usuário logado
  useEffect(() => {
    const carregarAgendamentos = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        console.log("Buscando agendamentos confirmados...");

        const response = await fetch("http://127.0.0.1:8000/api/agendamento/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro ao buscar agendamentos:", response.status, errorText);
          throw new Error("Erro ao buscar agendamentos");
        }

        const dados = await response.json();
        console.log("Agendamentos recebidos:", dados);
        setAgendamentos(dados);
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar agendamentos.");
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

    carregarAgendamentos();
  }, [navigate]);

  const handleSelecionarAgendamento = (a) => setAgendamentoSelecionado(a);

  const handleTriagem = (agendamento) => {
    navigate("/sinais-vitais", {
      state: {
        agendamentoId: agendamento.id,
        pacienteNome: agendamento.paciente_nome,
        medicoNome: agendamento.medico_nome,
        dataConsulta: agendamento.data_consulta,
        horaConsulta: agendamento.hora_consulta,
        orientacoes: agendamento.orientacoes,
      },
    });
  };

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
                <h2 className="hero-title">Agendamentos de Pacientes</h2>
                <p className="hero-subtitle">
                  {usuario.email && <span>Enf. {usuario.nome_completo}</span>}
                  {usuario.coren && <span> | COREN: {usuario.coren}</span>}
                </p>
              </div>
            </div>

            {!agendamentoSelecionado && (
              <div className="page-actions" style={{ marginTop: 10 }}>
                <button
                  className="back-button"
                  onClick={() => navigate("/dashboard-enfermeiro")}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                </button>
              </div>
            )}
          </div>

          {/* Lista de agendamentos */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Carregando agendamentos...</p>
            </div>
          ) : !agendamentoSelecionado ? (
            <div className="lista-pacientes">
              {agendamentos.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhum agendamento encontrado.</p>
                </div>
              ) : (
                agendamentos.map((a) => (
                  <div
                    key={a.id}
                    className="paciente-card"
                    onClick={() => handleSelecionarAgendamento(a)}
                  >
                    <h3>{a.paciente_nome}</h3>
                    <p className="paciente-motivo">
                      Consulta com {a.medico_nome} em {a.data_consulta} às {a.hora_consulta}
                    </p>
                    <div className="paciente-card-actions">
                      <button className="secondary-button">Ver detalhes</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Detalhes do agendamento e ficha médica
            <div className="ficha-medica-container">
              <div className="ficha-header">
                <button
                  className="back-button"
                  onClick={() => setAgendamentoSelecionado(null)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                </button>
                <h2 className="paciente-nome">
                  {agendamentoSelecionado.paciente_nome}
                </h2>
                <div style={{ marginTop: "5px" }}>
                  <small style={{ color: "blue" }}>
                    Agendamento ID: {agendamentoSelecionado.id}
                  </small>
                </div>
              </div>

              <div className="ficha-content">
                {/* Detalhes do agendamento */}
                {[
                  ["Médico", agendamentoSelecionado.medico_nome],
                  ["Data da Consulta", agendamentoSelecionado.data_consulta],
                  ["Hora da Consulta", agendamentoSelecionado.hora_consulta],
                  ["Orientações", agendamentoSelecionado.orientacoes],
                ].map(([label, value], i) => (
                  <div key={i} className="ficha-section">
                    <h3>{label}</h3>
                    <p>{value || "Não informado"}</p>
                  </div>
                ))}

                {/* Ficha médica do paciente */}
                {agendamentoSelecionado.ficha_medica && (
                  <div className="ficha-medica-detalhes">
                    <h3>Ficha Médica do Paciente</h3>
                    {Object.entries(agendamentoSelecionado.ficha_medica).map(
                      ([key, value], idx) => (
                        <div key={idx} className="ficha-section">
                          <h4>{key.replace(/_/g, " ")}</h4>
                          <p>{value || "Não informado"}</p>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="ficha-actions">
                  <button
                    className="cta-button"
                    onClick={() => handleTriagem(agendamentoSelecionado)}
                  >
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

export default FichaMedicaPaciente;

