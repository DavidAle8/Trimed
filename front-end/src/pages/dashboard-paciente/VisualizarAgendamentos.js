import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VisualizarAgendamentos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faCalendarAlt,
  faClock,
  faInfoCircle,
  faSignOutAlt,
  faUserCircle,
  faStethoscope,
  faIdCard,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";

const VisualizarAgendamentos = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        // Carregar dados do usuário da sessionStorage
        const usuarioSalvo = sessionStorage.getItem('usuario');
        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        }

        console.log('Buscando agendamentos do usuário...');

        // Buscar agendamentos
        const response = await fetch("http://127.0.0.1:8000/api/agendamento/", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error("Erro ao buscar agendamentos");
        }

        const dataAgendamentos = await response.json();
        console.log('Agendamentos recebidos da API:', dataAgendamentos);

        // Buscar todos os médicos para tentar associar
        let medicosData = [];
        try {
          const medicosResponse = await fetch("http://127.0.0.1:8000/api/medico/", {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          if (medicosResponse.ok) {
            medicosData = await medicosResponse.json();
            console.log('Médicos recebidos da API:', medicosData);
          }
        } catch (error) {
          console.error('Erro ao buscar médicos:', error);
        }

        // Processar agendamentos
        const agendamentosCompletos = dataAgendamentos.map((ag) => {
          console.log('Processando agendamento:', ag);
          
          let medicoInfo = {
            nome_completo: "Médico não definido",
            especialidade: "Especialidade não informada",
            crm: "CRM não informado"
          };

          // Verificar se há médico associado ao agendamento
          if (ag.medico) {
            const medicoId = typeof ag.medico === 'object' ? ag.medico.id : ag.medico;
            console.log(`Buscando médico com ID: ${medicoId}`);
            
            // Tentar encontrar o médico na lista
            const medicoEncontrado = medicosData.find(medico => 
              medico.id === medicoId || medico.id === parseInt(medicoId)
            );

            if (medicoEncontrado) {
              medicoInfo = {
                nome_completo: medicoEncontrado.nome_completo || "Médico não definido",
                especialidade: medicoEncontrado.especialidade || "Especialidade não informada",
                crm: medicoEncontrado.crm || "CRM não informado"
              };
              console.log('Médico encontrado:', medicoEncontrado);
            } else {
              console.warn('Médico não encontrado na lista para ID:', medicoId);
            }
          } else {
            console.warn('Agendamento sem médico associado:', ag.id);
            
            // Tentar associar com o primeiro médico disponível como fallback
            if (medicosData.length > 0) {
              medicoInfo = {
                nome_completo: medicosData[0].nome_completo || "Médico não definido",
                especialidade: medicosData[0].especialidade || "Especialidade não informada",
                crm: medicosData[0].crm || "CRM não informado"
              };
            }
          }

          return {
            ...ag,
            medico_nome: medicoInfo.nome_completo,
            medico_especialidade: medicoInfo.especialidade,
            medico_crm: medicoInfo.crm,
            status: ag.status || "CONFIRMADO"
          };
        });

        console.log('Agendamentos completos:', agendamentosCompletos);
        setAgendamentos(agendamentosCompletos);

      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar agendamentos. Verifique o console para detalhes.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [navigate, token]);

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

  const formatarData = (dataString) => {
    if (!dataString) return "Data não definida";
    
    try {
      // Corrigir datas inválidas (como "0004-02-01T10:00:00-03:06:28")
      let dataCorrigida = dataString;
      if (dataString.includes('0004')) {
        // Substituir ano inválido por ano atual
        dataCorrigida = dataString.replace('0004', new Date().getFullYear());
      }
      
      const data = new Date(dataCorrigida);
      
      // Verificar se a data é válida
      if (isNaN(data.getTime())) {
        return "Data inválida";
      }
      
      return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error, dataString);
      return "Data inválida";
    }
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
              <span className="nav-link" onClick={() => navigate("/")}>Início</span>
              <span className="nav-link" onClick={() => navigate("/servicos")}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navigate("/contato")}>
                <FontAwesomeIcon icon={faPhoneAlt}/> Contato
              </span>
              <button 
                className="cta-button logout-button"
                onClick={logout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="main-content">
        <div className="content-container">
          {/* Seção de boas-vindas / cabeçalho */}
          <div className="dashboard-welcome-section">
            <div className="user-greeting">
              <FontAwesomeIcon icon={faUserCircle} size="3x" />
              <div>
                <h2 className="hero-title">Meus Agendamentos</h2>
                <p className="hero-subtitle">
                  {usuario && `Olá, ${usuario.nome_completo || 'Paciente'}! `}
                  Aqui você pode visualizar todas as suas consultas agendadas.
                </p>
              </div>
            </div>

            <div className="page-actions" style={{ marginTop: 10 }}>
              <button
                className="back-button"
                onClick={() => navigate("/dashboard-paciente")}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar para Dashboard
              </button>
            </div>
          </div>

          {/* Listagem de agendamentos */}
          {agendamentos.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon={faCalendarAlt} size="3x" />
              <p>Não há agendamentos confirmados no momento.</p>
              <button 
                className="primary-button"
                onClick={() => navigate("/agendar-consulta")}
              >
                Solicitar Nova Consulta
              </button>
            </div>
          ) : (
            <div className="agendamentos-grid">
              {agendamentos.map((ag) => (
                <div key={ag.id} className="agendamento-card confirmed">
                  <div className="card-header">
                    <h3>
                      <FontAwesomeIcon icon={faCalendarAlt} /> Consulta Agendada
                    </h3>
                    <div className="status-container">
                      <span className="status-badge confirmed">
                        {ag.status || "CONFIRMADO"}
                      </span>
                    </div>
                  </div>

                  <div className="agendamento-info">
                    <div className="info-item highlight">
                      <span className="label">Data e Horário:</span>
                      <span className="value">
                        {formatarData(ag.data_hora_consulta)}
                      </span>
                    </div>

                    {/* Informações do Médico */}
                    <div className="medico-section">
                      <h4>
                        <FontAwesomeIcon icon={faUserMd} /> Médico Responsável
                      </h4>
                      
                      <div className="info-item">
                        <span className="label">
                          <FontAwesomeIcon icon={faStethoscope} /> Nome:
                        </span>
                        <span className="value">{ag.medico_nome}</span>
                      </div>

                      <div className="info-item">
                        <span className="label">
                          <FontAwesomeIcon icon={faUserMd} /> Especialidade:
                        </span>
                        <span className="value">{ag.medico_especialidade}</span>
                      </div>

                      <div className="info-item">
                        <span className="label">
                          <FontAwesomeIcon icon={faIdCard} /> CRM:
                        </span>
                        <span className="value">{ag.medico_crm}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <span className="label">
                        <FontAwesomeIcon icon={faInfoCircle} /> Orientações:
                      </span>
                      <span className="value orientacoes-text">
                        {ag.orientacoes || "Aguardando orientações do médico"}
                      </span>
                    </div>

                    {ag.local && (
                      <div className="info-item">
                        <span className="label">
                          <FontAwesomeIcon icon={faMapMarkerAlt} /> Local:
                        </span>
                        <span className="value">{ag.local}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <p className="info-consulta">
                      <small>
                        Chegue com 15 minutos de antecedência e traga seus documentos.
                      </small>
                    </p>
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
          <p>© {new Date().getFullYear()} TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default VisualizarAgendamentos;
