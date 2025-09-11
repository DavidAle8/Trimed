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
  faMapMarkerAlt,
  faEnvelope,faCheck
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

      console.log("Médico logado:", usuario);

      // Buscar TODAS as triagens
      const response = await fetch("http://127.0.0.1:8000/api/triagem-IA/", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar triagens");

      const todasTriagens = await response.json();
      console.log("Todas as triagens:", todasTriagens);

      // Filtrar apenas triagens PENDENTES
      const triagensPendentes = todasTriagens.filter(ag => 
        (ag.status_agendamento === "PENDENTE" || !ag.status_agendamento)
      );

      console.log("Triagens pendentes:", triagensPendentes);

      // Para cada triagem pendente, buscar detalhes do paciente
      const agendamentosCompleto = await Promise.all(
        triagensPendentes.map(async (ag) => {
          try {
            // Buscar dados do paciente
            const respPaciente = await fetch(
              `http://127.0.0.1:8000/api/paciente/${ag.ficha_medica_paciente.paciente}/`,
              { 
                headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                } 
              }
            );
            
            if (respPaciente.ok) {
              const pacienteData = await respPaciente.json();
              
              // Buscar dados da ficha médica
              const respFicha = await fetch(
                `http://127.0.0.1:8000/api/ficha-medica-paciente/${ag.ficha_medica_paciente.id}/`,
                { 
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  } 
                }
              );

              if (respFicha.ok) {
                const fichaData = await respFicha.json();
                
                return { 
                  ...ag, 
                  paciente_nome: pacienteData.nome_completo,
                  paciente_id: pacienteData.id,
                  paciente_email: pacienteData.email,
                  ficha_completa: fichaData
                };
              }
            }
            return { ...ag, paciente_nome: "Nome não disponível" };
          } catch (err) {
            console.error("Erro ao buscar dados:", err);
            return { ...ag, paciente_nome: "Nome não disponível" };
          }
        })
      );

      // FILTRAR APENAS OS AGENDAMENTOS DA ESPECIALIDADE DO MÉDICO
      const agendamentosFiltrados = agendamentosCompleto.filter(ag => {
        // Implementar lógica de filtro por especialidade
        // Exemplo: if (usuario.especialidade === "Cardiologia") { ... }
        // Por enquanto, mostrar todos os pendentes
        return true;
      });

      console.log("Agendamentos filtrados:", agendamentosFiltrados);
      setAgendamentos(agendamentosFiltrados);

    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setCarregando(false);
    }
  }, [navigate, token, usuario]);

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

    try {
      const token = localStorage.getItem("access_token");
      
      // DADOS COMPLETOS PARA O AGENDAMENTO
      const dadosAgendamento = {
        triagem_IA: agendamentoSelecionado.id,
        paciente: agendamentoSelecionado.paciente_id,
        medico: usuario.id,
        data_hora_consulta: `${dataSelecionada}T${horarioSelecionado}`,
        orientacoes: orientacoes,
        status: "CONFIRMADO"
      };

      console.log("Criando agendamento:", dadosAgendamento);

      const response = await fetch(`http://127.0.0.1:8000/api/agendamento/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAgendamento),
      });

      if (response.ok) {
        // ATUALIZAR STATUS DA TRIAGEM PARA CONFIRMADO
        const updateResponse = await fetch(
          `http://127.0.0.1:8000/api/triagem-IA/${agendamentoSelecionado.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              status_agendamento: "CONFIRMADO"
            }),
          }
        );

        if (updateResponse.ok) {
          // Preparar dados para a confirmação
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
          setAgendamentos((prev) =>
            prev.filter((ag) => ag.id !== agendamentoSelecionado.id)
          );

        } else {
          throw new Error("Erro ao atualizar status da triagem");
        }
      } else {
        const errorData = await response.json();
        console.error("Erro detalhado:", errorData);
        throw new Error("Erro ao confirmar a consulta");
      }
    } catch (error) {
      console.error(error);
      alert("Não foi possível confirmar a consulta. Verifique o console para detalhes.");
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
                    <button
                      className="btn btn-primary"
                      onClick={() => abrirModalDiaHora(ag)}
                    >
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

      {/* Modal da Triagem */}
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
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente.medicacao_para_sintoma || "Não informado"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Medicamento Diário:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente.medicamento_diario || "Não informado"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Alergia Geral:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente.alergia_geral || "Não informado"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Alergia a Medicamentos:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente.alergia_medicamento || "Não informado"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Doenças Crônicas:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente.possui_doencas_cronicas || "Não informado"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Histórico Familiar:</span>
                  <span className="detail-value">{agendamentoSelecionado.ficha_medica_paciente.historico_familiar_de_doencas || "Não informado"}</span>
                </div>
              </div>
              
              <div className="diagnosis-section">
                <h3>
                  <FontAwesomeIcon icon={faStethoscope} /> Diagnóstico da IA
                </h3>
                <div className="diagnosis-content">
                  {agendamentoSelecionado.diagnostico_IA || "Nenhum diagnóstico disponível."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Confirmar Dia e Horário */}
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
                <label>
                  <FontAwesomeIcon icon={faCalendarDay} /> Data:
                </label>
                <input
                  type="date"
                  value={dataSelecionada}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faClock} /> Horário:
                </label>
                <select
                  value={horarioSelecionado}
                  onChange={(e) => setHorarioSelecionado(e.target.value)}
                  className="form-input"
                >
                  <option value="">Selecione um horário</option>
                  <option value="08:00:00">08:00</option>
                  <option value="09:00:00">09:00</option>
                  <option value="10:00:00">10:00</option>
                  <option value="11:00:00">11:00</option>
                  <option value="14:00:00">14:00</option>
                  <option value="15:00:00">15:00</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faNotesMedical} /> Orientações:
                </label>
                <textarea
                  value={orientacoes}
                  onChange={(e) => setOrientacoes(e.target.value)}
                  placeholder="Digite orientações para o paciente"
                  className="form-input"
                  rows="4"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={fecharModalDiaHora}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={confirmarDiaHora}>
                Confirmar Consulta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação do Agendamento */}
      {modalConfirmacao && agendamentoConfirmado && (
        <div className="modal-overlay" onClick={fecharModalConfirmacao}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FontAwesomeIcon icon={faEnvelope} /> Consulta Confirmada!
              </h2>
              <button className="close-modal" onClick={fecharModalConfirmacao}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="confirmation-success">
                <FontAwesomeIcon icon={faEnvelope} size="4x" className="success-icon" />
                <h3>Consulta agendada com sucesso!</h3>
                
                <div className="confirmation-details">
                  <div className="detail-item">
                    <strong>Paciente:</strong> {agendamentoConfirmado.paciente}
                  </div>
                  <div className="detail-item">
                    <strong>Médico:</strong> Dr. {agendamentoConfirmado.medico}
                  </div>
                  <div className="detail-item">
                    <strong>Especialidade:</strong> {agendamentoConfirmado.especialidade}
                  </div>
                  <div className="detail-item">
                    <strong>CRM:</strong> {agendamentoConfirmado.crm}
                  </div>
                  <div className="detail-item">
                    <strong>Data:</strong> {agendamentoConfirmado.data}
                  </div>
                  <div className="detail-item">
                    <strong>Horário:</strong> {agendamentoConfirmado.horario}
                  </div>
                  {agendamentoConfirmado.orientacoes && (
                    <div className="detail-item">
                      <strong>Orientações:</strong> {agendamentoConfirmado.orientacoes}
                    </div>
                  )}
                </div>

                <p className="confirmation-message">
                  Um e-mail de confirmação foi enviado para o paciente com todos os detalhes da consulta.
                </p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={fecharModalConfirmacao}>
                <FontAwesomeIcon icon={faCheck} /> Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarAgendamentosPendentes;
