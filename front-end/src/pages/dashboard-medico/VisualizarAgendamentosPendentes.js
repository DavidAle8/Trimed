import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./VisualizarAgendamentosPendentes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserInjured,
  faStethoscope,
  faCalendarAlt,
  faClock,
  faCalendarDay,
  faNotesMedical,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faSignOutAlt,
  faUserCircle,
  faEnvelope,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

const VisualizarAgendamentosPendentes = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [modalConfirmarDiaHora, setModalConfirmarDiaHora] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [orientacoes, setOrientacoes] = useState("");
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(null);

  const token = localStorage.getItem("access_token");
  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  const carregarAgendamentos = useCallback(async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/triagem-IA/", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar triagens");
      const todasTriagens = await response.json();

      const triagensPendentes = todasTriagens.filter(
        ag => !ag.status_agendamento || ag.status_agendamento === "PENDENTE"
      );

      const agendamentosCompleto = await Promise.all(
        triagensPendentes.map(async (ag) => {
          try {
            const respPaciente = await fetch(
              `http://127.0.0.1:8000/api/paciente/${ag.ficha_medica_paciente.paciente}/`,
              { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            const pacienteData = respPaciente.ok ? await respPaciente.json() : null;

            const respFicha = await fetch(
              `http://127.0.0.1:8000/api/ficha-medica-paciente/${ag.ficha_medica_paciente.id}/`,
              { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            const fichaData = respFicha.ok ? await respFicha.json() : null;

            return {
              ...ag,
              paciente_nome: pacienteData?.nome_completo || "Nome não disponível",
              paciente_id: pacienteData?.id || null,
              paciente_email: pacienteData?.email || null,
              ficha_completa: fichaData || null
            };
          } catch {
            return { ...ag, paciente_nome: "Nome não disponível" };
          }
        })
      );

      setAgendamentos(agendamentosCompleto);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setCarregando(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const abrirModal = (ag) => {
    setAgendamentoSelecionado(ag);
    setModalAberto(true);
  };
  const fecharModal = () => {
    setModalAberto(false);
    setAgendamentoSelecionado(null);
  };
  const abrirModalDiaHora = (ag) => {
    setAgendamentoSelecionado(ag);
    setModalConfirmarDiaHora(true);
  };
  const fecharModalDiaHora = () => {
    setModalConfirmarDiaHora(false);
    setAgendamentoSelecionado(null);
    setDataSelecionada("");
    setHorarioSelecionado("");
    setOrientacoes("");
  };
  const fecharModalConfirmacao = () => {
    setModalConfirmacao(false);
    setAgendamentoConfirmado(null);
  };

  const confirmarDiaHora = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      alert("Selecione data e horário para confirmar a consulta.");
      return;
    }

    if (!agendamentoSelecionado) {
      alert("Nenhum agendamento selecionado.");
      return;
    }

    try {
      const dadosAgendamento = {
    triagem_IA: agendamentoSelecionado.id,
    medico: usuario.medico?.id,  // CORREÇÃO AQUI
    paciente: agendamentoSelecionado.paciente_id,  // <-- adicionar aqui
    data_hora_consulta: `${dataSelecionada}T${horarioSelecionado}`,
    orientacoes: orientacoes
};


      const response = await fetch(`http://127.0.0.1:8000/api/agendamento/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAgendamento),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro detalhado:", errorData);
        throw new Error("Erro ao confirmar a consulta");
      }

      // Atualizar status da triagem
      await fetch(`http://127.0.0.1:8000/api/triagem-IA/${agendamentoSelecionado.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status_agendamento: "CONFIRMADO" }),
      });

      const agendamentoCriado = await response.json();
      const dadosConfirmacao = {
        paciente: agendamentoSelecionado.paciente_nome,
        medico: usuario.nome_completo,
        especialidade: usuario.especialidade,
        crm: usuario.crm,
        data: dataSelecionada,
        horario: horarioSelecionado,
        orientacoes: orientacoes
      };

      setAgendamentoConfirmado(dadosConfirmacao);
      setModalConfirmacao(true);

      // Remover da lista local
      setAgendamentos(prev => prev.filter(ag => ag.id !== agendamentoSelecionado.id));

    } catch (error) {
      console.error(error);
      alert("Não foi possível confirmar a consulta.");
    } finally {
      fecharModalDiaHora();
    }
  };

  const corPrioridade = (prioridade) => {
    if (!prioridade) return "";
    if (prioridade.includes("VERMELHO")) return "prioridade-vermelho";
    if (prioridade.includes("LARANJA")) return "prioridade-laranja";
    if (prioridade.includes("AMARELO")) return "prioridade-amarelo";
    if (prioridade.includes("VERDE")) return "prioridade-verde";
    if (prioridade.includes("AZUL")) return "prioridade-azul";
    return "";
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuario');
    navigate('/login');
  };

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando agendamentos...</p>
      </div>
    );
  }

  return (
    <div className="visualizar-agendamentos-page">
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

      <main className="main-content">
        <div className="content-container">
          <div className="dashboard-welcome-section">
            <div className="user-greeting">
              <FontAwesomeIcon icon={faUserCircle} size="3x" />
              <div>
                <h2 className="hero-title">Agendamentos Pendentes</h2>
                <p className="hero-subtitle">
                  {usuario.nome_completo && <span>Dr. {usuario.nome_completo}</span>}
                  {usuario.especialidade && <span> | {usuario.especialidade}</span>}
                  {usuario.crm && <span> | CRM: {usuario.crm}</span>}
                </p>
              </div>
            </div>

            <div className="page-actions" style={{ marginTop: 10 }}>
              <button className="back-button" onClick={() => navigate('/dashboard-medico')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
              </button>
            </div>
          </div>

          {agendamentos.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon={faCalendarDay} size="3x" />
              <p>Não há agendamentos pendentes no momento.</p>
            </div>
          ) : (
            <div className="agendamentos-grid">
              {agendamentos.map((ag) => (
                <div key={ag.id} className="agendamento-card">
                  <div className="card-header">
                    <h3>
                      <FontAwesomeIcon icon={faUserInjured} /> {ag.paciente_nome}
                    </h3>
                    <span className={`priority-badge ${corPrioridade(ag.prioridade_IA)}`}>
                      {ag.prioridade_IA}
                    </span>
                  </div>
                  <div className="agendamento-info">
                    <div className="info-item">
                      <span className="label">Motivo:</span>
                      <span className="value">{ag.ficha_medica_paciente?.motivo_consulta || "Não informado"}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Status:</span>
                      <span className="status-badge">{ag.status_agendamento || "PENDENTE"}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-primary" onClick={() => abrirModalDiaHora(ag)}>
                      <FontAwesomeIcon icon={faClock} /> Confirmar Consulta
                    </button>
                    <button className="btn btn-secondary" onClick={() => abrirModal(ag)}>
                      <FontAwesomeIcon icon={faStethoscope} /> Ver Diagnóstico IA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal visualizar diagnóstico */}
      {modalAberto && agendamentoSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ficha do Paciente: {agendamentoSelecionado.paciente_nome}</h2>
              <button className="close-modal" onClick={fecharModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="patient-details">
                <div className="detail-row">
                  <span className="detail-label">Medicamento para Sintoma:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente?.medicacao_para_sintoma || "Não informado"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Medicamento Diário:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente?.medicamento_diario || "Não informado"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Alergia Geral:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente?.alergia_geral || "Não informado"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Alergia a Medicamentos:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente?.alergia_medicamento || "Não informado"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Doenças Crônicas:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente?.possui_doencas_cronicas || "Não informado"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Histórico Familiar:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente?.historico_familiar_de_doencas || "Não informado"}</span>
                </div>
              </div>
              <div className="diagnosis-section">
                <h3><FontAwesomeIcon icon={faStethoscope} /> Diagnóstico da IA</h3>
                <div className="diagnosis-content">{agendamentoSelecionado.diagnostico_IA || "Nenhum diagnóstico disponível."}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar dia e hora */}
      {modalConfirmarDiaHora && agendamentoSelecionado && (
        <div className="modal-overlay" onClick={fecharModalDiaHora}>
          <div className="modal-content medium-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FontAwesomeIcon icon={faCalendarAlt} /> Confirmar Consulta - {agendamentoSelecionado.paciente_nome}
              </h2>
              <button className="close-modal" onClick={fecharModalDiaHora}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label><FontAwesomeIcon icon={faCalendarDay} /> Data:</label>
                <input
                  type="date"
                  value={dataSelecionada}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faClock} /> Horário:</label>
                <select
                  value={horarioSelecionado}
                  onChange={(e) => setHorarioSelecionado(e.target.value)}
                  className="form-input"
                >
                  <option value="">Selecione horário</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </div>
              <div className="form-group">
                <label><FontAwesomeIcon icon={faNotesMedical} /> Orientações:</label>
                <textarea
                  value={orientacoes}
                  onChange={(e) => setOrientacoes(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={confirmarDiaHora}>
                <FontAwesomeIcon icon={faCheck} /> Confirmar
              </button>
              <button className="btn btn-secondary" onClick={fecharModalDiaHora}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmação final */}
      {modalConfirmacao && agendamentoConfirmado && (
        <div className="modal-overlay" onClick={fecharModalConfirmacao}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Consulta Confirmada!</h2>
              <button className="close-modal" onClick={fecharModalConfirmacao}>×</button>
            </div>
            <div className="modal-body">
              <p>Consulta confirmada para o paciente <strong>{agendamentoConfirmado.paciente}</strong>.</p>
              <p>Data: {agendamentoConfirmado.data}</p>
              <p>Horário: {agendamentoConfirmado.horario}</p>
              <p>Orientações: {agendamentoConfirmado.orientacoes || "Sem orientações"}</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={fecharModalConfirmacao}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarAgendamentosPendentes;

