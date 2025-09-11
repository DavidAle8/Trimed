
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPaciente.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faArrowLeft, 
  faPhoneAlt, 
  faMapMarkerAlt, 
  faUserMd, 
  faUserNurse,
  faArrowRight,
  faArrowLeftLong
} from '@fortawesome/free-solid-svg-icons';

const AgendarConsulta = ({ usuario }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    motivo_consulta: '',
    medicacao_para_sintoma: 'não',
    medicamento_diario: 'não',
    alergia_geral: 'não',
    alergia_medicamento: 'não',
    possui_doencas_cronicas: 'não',
    historico_familiar_de_doencas: 'não',
    detalhes_medicacao_para_sintoma: '',
    detalhes_medicamento_diario: '',
    detalhes_alergia_geral: '',
    detalhes_alergia_medicamento: '',
    detalhes_possui_doencas_cronicas: '',
    detalhes_historico_familiar_de_doencas: ''
  });

  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setMensagem({ texto: 'Usuário não autenticado.', tipo: 'erro' });
      setIsSubmitting(false);
      return;
    }

    const usuarioLogado = usuario || JSON.parse(sessionStorage.getItem('usuario'));

    const dadosParaEnvio = {
      paciente: usuarioLogado.id, // 🔥 Adicionado ID do paciente
      nome_paciente: usuarioLogado.nome_completo, // 🔥 Nome do paciente
      motivo_consulta: formData.motivo_consulta,
      medicacao_para_sintoma: formData.medicacao_para_sintoma === 'sim' ? formData.detalhes_medicacao_para_sintoma : 'não informado',
      medicamento_diario: formData.medicamento_diario === 'sim' ? formData.detalhes_medicamento_diario : 'não informado',
      alergia_geral: formData.alergia_geral === 'sim' ? formData.detalhes_alergia_geral : 'não informado',
      alergia_medicamento: formData.alergia_medicamento === 'sim' ? formData.detalhes_alergia_medicamento : 'não informado',
      possui_doencas_cronicas: formData.possui_doencas_cronicas === 'sim' ? formData.detalhes_possui_doencas_cronicas : 'não informado',
      historico_familiar_de_doencas: formData.historico_familiar_de_doencas === 'sim' ? formData.detalhes_historico_familiar_de_doencas : 'não informado'
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ficha-medica-paciente/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ texto: 'Sua solicitação de agendamento foi enviada com sucesso!', tipo: 'sucesso' });
        setShowConfirmacao(true);
        setTimeout(() => {
          setShowConfirmacao(false);
          navigate('/visualizar-agendamentos');
        }, 3000);
      } else {
        setMensagem({ texto: data.mensagem || 'Erro ao enviar solicitação', tipo: 'erro' });
      }
    } catch (err) {
      console.error(err);
      setMensagem({ texto: 'Erro ao conectar com a API', tipo: 'erro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.motivo_consulta.trim()) {
      setMensagem({ texto: 'Por favor, informe o motivo da consulta.', tipo: 'erro' });
      return;
    }
    setCurrentStep(prev => prev + 1);
    setMensagem({ texto: '', tipo: '' });
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setMensagem({ texto: '', tipo: '' });
  };

  const submitForm = () => handleSubmit({ preventDefault: () => {} });

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2 className="section-title">Motivo da Consulta</h2>
            <div className="form-group">
              <label htmlFor="motivo_consulta">MOTIVO DA CONSULTA</label>
              <textarea
                id="motivo_consulta"
                name="motivo_consulta"
                value={formData.motivo_consulta}
                onChange={handleChange}
                placeholder="Descreva o motivo da sua consulta"
                rows="5"
                required
              />
            </div>
            <div className="step-actions">
              <button type="button" className="secondary-button" onClick={() => navigate('/dashboard-paciente')}>
                Cancelar
              </button>
              <button type="button" className="primary-button" onClick={nextStep}>
                Próximo <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2 className="section-title">Medicações em Uso</h2>
            {/* Medicação para sintomas */}
            <div className="form-group radio-group">
              <label>Está tomando alguma medicação para os sintomas atuais?</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="medicacao_para_sintoma"
                    value="sim"
                    checked={formData.medicacao_para_sintoma === 'sim'}
                    onChange={() => handleRadioChange('medicacao_para_sintoma', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="medicacao_para_sintoma"
                    value="não"
                    checked={formData.medicacao_para_sintoma === 'não'}
                    onChange={() => handleRadioChange('medicacao_para_sintoma', 'não')}
                  />
                  Não
                </label>
              </div>
            </div>
            {formData.medicacao_para_sintoma === 'sim' && (
              <div className="form-group">
                <label htmlFor="detalhes_medicacao_para_sintoma">Quais medicações?</label>
                <textarea
                  id="detalhes_medicacao_para_sintoma"
                  name="detalhes_medicacao_para_sintoma"
                  value={formData.detalhes_medicacao_para_sintoma}
                  onChange={handleChange}
                  placeholder="Informe as medicações que está tomando para os sintomas atuais"
                  rows="3"
                />
              </div>
            )}
            {/* Medicamento diário */}
            <div className="form-group radio-group">
              <label>Faz uso de algum medicamento diário?</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="medicamento_diario"
                    value="sim"
                    checked={formData.medicamento_diario === 'sim'}
                    onChange={() => handleRadioChange('medicamento_diario', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="medicamento_diario"
                    value="não"
                    checked={formData.medicamento_diario === 'não'}
                    onChange={() => handleRadioChange('medicamento_diario', 'não')}
                  />
                  Não
                </label>
              </div>
            </div>
            {formData.medicamento_diario === 'sim' && (
              <div className="form-group">
                <label htmlFor="detalhes_medicamento_diario">Quais medicamentos?</label>
                <textarea
                  id="detalhes_medicamento_diario"
                  name="detalhes_medicamento_diario"
                  value={formData.detalhes_medicamento_diario}
                  onChange={handleChange}
                  placeholder="Informe os medicamentos de uso diário"
                  rows="3"
                />
              </div>
            )}
            <div className="step-actions">
              <button type="button" className="secondary-button" onClick={prevStep}>
                <FontAwesomeIcon icon={faArrowLeftLong} /> Anterior
              </button>
              <button type="button" className="primary-button" onClick={nextStep}>
                Próximo <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2 className="section-title">Alergias</h2>
            {/* Alergia geral */}
            <div className="form-group radio-group">
              <label>Possui alguma alergia geral (alimentos, poeira, etc.)?</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="alergia_geral"
                    value="sim"
                    checked={formData.alergia_geral === 'sim'}
                    onChange={() => handleRadioChange('alergia_geral', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="alergia_geral"
                    value="não"
                    checked={formData.alergia_geral === 'não'}
                    onChange={() => handleRadioChange('alergia_geral', 'não')}
                  />
                  Não
                </label>
              </div>
            </div>
            {formData.alergia_geral === 'sim' && (
              <div className="form-group">
                <label htmlFor="detalhes_alergia_geral">Quais alergias?</label>
                <textarea
                  id="detalhes_alergia_geral"
                  name="detalhes_alergia_geral"
                  value={formData.detalhes_alergia_geral}
                  onChange={handleChange}
                  placeholder="Informe suas alergias"
                  rows="3"
                />
              </div>
            )}
            {/* Alergia medicamento */}
            <div className="form-group radio-group">
              <label>Possui alergia a algum medicamento?</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="alergia_medicamento"
                    value="sim"
                    checked={formData.alergia_medicamento === 'sim'}
                    onChange={() => handleRadioChange('alergia_medicamento', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="alergia_medicamento"
                    value="não"
                    checked={formData.alergia_medicamento === 'não'}
                    onChange={() => handleRadioChange('alergia_medicamento', 'não')}
                  />
                  Não
                </label>
              </div>
            </div>
            {formData.alergia_medicamento === 'sim' && (
              <div className="form-group">
                <label htmlFor="detalhes_alergia_medicamento">A quais medicamentos?</label>
                <textarea
                  id="detalhes_alergia_medicamento"
                  name="detalhes_alergia_medicamento"
                  value={formData.detalhes_alergia_medicamento}
                  onChange={handleChange}
                  placeholder="Informe os medicamentos aos quais é alérgico"
                  rows="3"
                />
              </div>
            )}
            <div className="step-actions">
              <button type="button" className="secondary-button" onClick={prevStep}>
                <FontAwesomeIcon icon={faArrowLeftLong} /> Anterior
              </button>
              <button type="button" className="primary-button" onClick={nextStep}>
                Próximo <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h2 className="section-title">Histórico de Saúde</h2>
            <div className="form-group radio-group">
              <label>Possui doenças crônicas?</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="possui_doencas_cronicas"
                    value="sim"
                    checked={formData.possui_doencas_cronicas === 'sim'}
                    onChange={() => handleRadioChange('possui_doencas_cronicas', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="possui_doencas_cronicas"
                    value="não"
                    checked={formData.possui_doencas_cronicas === 'não'}
                    onChange={() => handleRadioChange('possui_doencas_cronicas', 'não')}
                  />
                  Não
                </label>
              </div>
            </div>
            {formData.possui_doencas_cronicas === 'sim' && (
              <div className="form-group">
                <label htmlFor="detalhes_possui_doencas_cronicas">Quais doenças?</label>
                <textarea
                  id="detalhes_possui_doencas_cronicas"
                  name="detalhes_possui_doencas_cronicas"
                  value={formData.detalhes_possui_doencas_cronicas}
                  onChange={handleChange}
                  placeholder="Informe suas doenças crônicas"
                  rows="3"
                />
              </div>
            )}
            <div className="form-group radio-group">
              <label>Possui histórico familiar de doenças?</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="historico_familiar_de_doencas"
                    value="sim"
                    checked={formData.historico_familiar_de_doencas === 'sim'}
                    onChange={() => handleRadioChange('historico_familiar_de_doencas', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="historico_familiar_de_doencas"
                    value="não"
                    checked={formData.historico_familiar_de_doencas === 'não'}
                    onChange={() => handleRadioChange('historico_familiar_de_doencas', 'não')}
                  />
                  Não
                </label>
              </div>
            </div>
            {formData.historico_familiar_de_doencas === 'sim' && (
              <div className="form-group">
                <label htmlFor="detalhes_historico_familiar_de_doencas">Qual histórico?</label>
                <textarea
                  id="detalhes_historico_familiar_de_doencas"
                  name="detalhes_historico_familiar_de_doencas"
                  value={formData.detalhes_historico_familiar_de_doencas}
                  onChange={handleChange}
                  placeholder="Informe o histórico familiar de doenças"
                  rows="3"
                />
              </div>
            )}
            <div className="step-actions">
              <button type="button" className="secondary-button" onClick={prevStep}>
                <FontAwesomeIcon icon={faArrowLeftLong} /> Anterior
              </button>
              <button 
                type="button" 
                className="primary-button" 
                onClick={submitForm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </div>
          </div>
        );

      default:
        return <div>Passo não reconhecido</div>;
    }
  };

  const usuarioLogado = usuario || JSON.parse(sessionStorage.getItem('usuario'));

  return (
    <div className="dashboard-container">
      {/* HEADER */}
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
              <button className="cta-button" onClick={() => navigate('/dashboard-paciente')}>
                Área do Paciente
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-content">
        <div className="content-container">
          <div className="dashboard-header">
            <button className="back-button" onClick={() => navigate('/dashboard-paciente')}>
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar
            </button>
            <h1 className="page-title">
              <FontAwesomeIcon icon={faCalendarPlus} /> Solicitar Consulta
            </h1>

            {/* Nome e ID do paciente */}
            {usuarioLogado && (
              <div className="paciente-info">
                <p><strong>Nome:</strong> {usuarioLogado.nome_completo}</p>
                <p><strong>ID do Paciente:</strong> {usuarioLogado.id}</p>
              </div>
            )}

            <div className="step-indicator">
              Passo {currentStep} de 4
            </div>
          </div>

          {mensagem.texto && (
            <div className={`mensagem ${mensagem.tipo}`}>
              <p>{mensagem.texto}</p>
            </div>
          )}

          {showConfirmacao && (
            <div className="confirmacao-popup">
              <p>Sua solicitação foi enviada! 🤖</p>
              <small>Estamos analisando suas informações para auxiliar no diagnóstico.</small>
            </div>
          )}

          <form className="consulta-form wizard-form">
            {renderStep()}
          </form>
        </div>
      </main>

      {/* FOOTER */}
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
