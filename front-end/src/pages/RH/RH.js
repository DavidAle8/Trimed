import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RH.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faUserNurse, faIdCard, faEnvelope, faPhone, faMapMarkerAlt, faSignOutAlt, faEnvelopeOpenText, faIdCardClip } from '@fortawesome/free-solid-svg-icons';

const RH = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    tipo: 'medico',
    crm: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    sexo: '',
    endereco: '',
    especialidade: '',
    departamento: ''
  });
  
  const [erros, setErros] = useState({});
  const [cadastrado, setCadastrado] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const navigate = useNavigate();

  const especialidades = [
    'Clínico Geral',
    'Cardiologia',
    'Dermatologia',
    'Ortopedia',
    'Pediatria',
    'Ginecologia',
    'Enfermagem Geral'
  ];

  const departamentos = [
    'Ambulatório',
    'Pronto Socorro',
    'UTI',
    'Centro Cirúrgico',
    'Enfermaria',
    'Pediatria'
  ];

  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem('tokenRH');
    
    if (!token) {
      navigate('/login-rh');
    } else {
      setAutenticado(true);
      setCarregando(false);
    }
  }, [navigate]);

  // Função para validar CPF
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf === '') return false;
    
    // Elimina CPFs inválidos conhecidos
    if (cpf.length !== 11 ||
      cpf === "00000000000" ||
      cpf === "11111111111" ||
      cpf === "22222222222" ||
      cpf === "33333333333" ||
      cpf === "44444444444" ||
      cpf === "55555555555" ||
      cpf === "66666666666" ||
      cpf === "77777777777" ||
      cpf === "88888888888" ||
      cpf === "99999999999")
      return false;
    
    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  // Função para formatar CPF
  const formatarCPF = (cpf) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Função para validar formulário
  const validarFormulario = () => {
    const novosErros = {};

    // Validar nome completo
    if (!formData.nome_completo.trim()) {
      novosErros.nome_completo = 'Nome completo é obrigatório';
    }

    // Validar CPF
    if (!formData.cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(formData.cpf)) {
      novosErros.cpf = 'CPF inválido';
    }

    // Validar CRM/COREN
    if (!formData.crm.trim()) {
      novosErros.crm = formData.tipo === 'medico' ? 'CRM é obrigatório' : 'COREN é obrigatório';
    }

    // Validar email
    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    // Validar telefone
    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    }

    // Validar data de nascimento
    if (!formData.data_nascimento) {
      novosErros.data_nascimento = 'Data de nascimento é obrigatória';
    }

    // Validar sexo
    if (!formData.sexo) {
      novosErros.sexo = 'Sexo é obrigatório';
    }

    // Validar endereço
    if (!formData.endereco.trim()) {
      novosErros.endereco = 'Endereço é obrigatório';
    }

    // Validar especialidade
    if (!formData.especialidade) {
      novosErros.especialidade = 'Especialidade é obrigatória';
    }

    // Validar departamento
    if (!formData.departamento) {
      novosErros.departamento = 'Departamento é obrigatório';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatar CPF enquanto digita
    if (name === 'cpf') {
      const cpfFormatado = formatarCPF(value);
      setFormData(prev => ({ ...prev, [name]: cpfFormatado }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo quando usuário começar a digitar
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validarFormulario()) {
    return;
  }
  
  try {
    const token = localStorage.getItem('tokenRH');
    
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/login-rh');
      return;
    }

    setEnviandoEmail(true);

    // Preparar dados para o backend - AJUSTADO para campos corretos
    const usuarioData = {
      nome_completo: formData.nome_completo,
      cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação do CPF
      email: formData.email,
      telefone: formData.telefone,
      data_nascimento: formData.data_nascimento,
      sexo: formData.sexo,
      endereco: formData.endereco,
      especialidade: formData.especialidade,
      // departamento: formData.departamento // REMOVIDO se não existir no serializer
    };

    // Adicionar campos específicos conforme o tipo
    if (formData.tipo === 'medico') {
      usuarioData.crm = formData.crm;
    } else if (formData.tipo === 'enfermeiro') {
      usuarioData.coren = formData.crm;
      usuarioData.setor_atuacao = formData.departamento; // Ajuste conforme serializer
    }

    // Determinar a URL correta baseada no tipo
    const url = formData.tipo === 'medico' 
      ? 'http://localhost:8000/api/medico/' 
      : 'http://localhost:8000/api/enfermeiro/';

    // Fazer a requisição para o backend
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuarioData)
    });

    const data = await response.json();

    if (response.ok) {
      setCadastrado(true);
      setDadosUsuario({
        ...usuarioData,
        tipo: formData.tipo,
        crm: formData.crm
      });
      
      console.log('Profissional cadastrado com sucesso! Email enviado automaticamente.');
    } else {
      // Tratar erros do backend
      console.error('Erro do backend:', data);
      if (data.email) {
        setErros({ email: 'Este email já está cadastrado' });
      } else if (data.cpf) {
        setErros({ cpf: 'Este CPF já está cadastrado' });
      } else if (data.crm || data.coren) {
        setErros({ crm: 'CRM/COREN já cadastrado' });
      } else {
        alert('Erro ao cadastrar profissional: ' + (data.detail || JSON.stringify(data)));
      }
    }

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro de conexão. Verifique se o servidor está rodando.');
  } finally {
    setEnviandoEmail(false);
  }
};

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="loading">Verificando autenticação...</div>
      </div>
    );
  }

  if (!autenticado) {
    return null;
  }

  return (
    <div className="rh-page">
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
              <span className="nav-link active" onClick={() => navigate('/rh')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}>
                <FontAwesomeIcon icon={faPhone} /> Contato
              </span>
              
              <button 
                className="cta-button logout-button"
                onClick={() => {
                  localStorage.removeItem('tokenRH');
                  navigate('/login-rh');
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          <h2 className="page-title">Cadastro de Profissionais</h2>
          <p className="page-subtitle">Área exclusiva para administradores</p>
          
          <div className="rh-container">
            {cadastrado && dadosUsuario ? (
              <div className="success-message">
                <FontAwesomeIcon icon={faEnvelopeOpenText} size="3x" style={{color: '#28a745'}} />
                <h3>Profissional cadastrado com sucesso!</h3>
                <p>Um email com as credenciais foi enviado para <strong>{dadosUsuario.email}</strong></p>
                
                <div className="credenciais-info">
                  <h4>Dados do Profissional:</h4>
                  <div className="credencial-item">
                    <strong>Nome:</strong> {dadosUsuario.nome_completo}
                  </div>
                  <div className="credencial-item">
                    <strong>CPF:</strong> {formData.cpf}
                  </div>
                  <div className="credencial-item">
                    <strong>Email:</strong> {dadosUsuario.email}
                  </div>
                  <div className="credencial-item">
                    <strong>Tipo:</strong> {dadosUsuario.tipo === 'medico' ? 'Médico' : 'Enfermeiro'}
                  </div>
                  <div className="credencial-item">
                    <strong>{dadosUsuario.tipo === 'medico' ? 'CRM' : 'COREN'}:</strong> {formData.crm}
                  </div>
                </div>
                
                <div className="alert alert-info">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>O usuário recebeu um email com instruções para o primeiro acesso.</span>
                </div>
                
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setCadastrado(false);
                    setDadosUsuario(null);
                    setFormData({
                      nome_completo: '',
                      cpf: '',
                      tipo: 'medico',
                      crm: '',
                      email: '',
                      telefone: '',
                      data_nascimento: '',
                      sexo: '',
                      endereco: '',
                      especialidade: '',
                      departamento: ''
                    });
                    setErros({});
                  }}
                >
                  Novo Cadastro
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rh-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome_completo">Nome Completo *</label>
                    <input
                      type="text"
                      id="nome_completo"
                      name="nome_completo"
                      value={formData.nome_completo}
                      onChange={handleChange}
                      className={erros.nome_completo ? 'error' : ''}
                      placeholder="Digite o nome completo"
                    />
                    {erros.nome_completo && <span className="error-message">{erros.nome_completo}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cpf">
                      <FontAwesomeIcon icon={faIdCardClip} /> CPF *
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      className={erros.cpf ? 'error' : ''}
                      placeholder="000.000.000-00"
                      maxLength="14"
                    />
                    {erros.cpf && <span className="error-message">{erros.cpf}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tipo">Tipo de Profissional *</label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                    >
                      <option value="medico">Médico</option>
                      <option value="enfermeiro">Enfermeiro</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="crm">
                      <FontAwesomeIcon icon={faIdCard} /> 
                      {formData.tipo === 'medico' ? 'CRM *' : 'COREN *'}
                    </label>
                    <input
                      type="text"
                      id="crm"
                      name="crm"
                      value={formData.crm}
                      onChange={handleChange}
                      className={erros.crm ? 'error' : ''}
                      placeholder={formData.tipo === 'medico' ? 'Número do CRM' : 'Número do COREN'}
                    />
                    {erros.crm && <span className="error-message">{erros.crm}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="especialidade">
                      <FontAwesomeIcon icon={faUserMd} /> Especialidade *
                    </label>
                    <select
                      id="especialidade"
                      name="especialidade"
                      value={formData.especialidade}
                      onChange={handleChange}
                      className={erros.especialidade ? 'error' : ''}
                    >
                      <option value="">Selecione</option>
                      {especialidades.map((esp, index) => (
                        <option key={index} value={esp}>{esp}</option>
                      ))}
                    </select>
                    {erros.especialidade && <span className="error-message">{erros.especialidade}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="departamento">Departamento *</label>
                    <select
                      id="departamento"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      className={erros.departamento ? 'error' : ''}
                    >
                      <option value="">Selecione</option>
                      {departamentos.map((depto, index) => (
                        <option key={index} value={depto}>{depto}</option>
                      ))}
                    </select>
                    {erros.departamento && <span className="error-message">{erros.departamento}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      <FontAwesomeIcon icon={faEnvelope} /> Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={erros.email ? 'error' : ''}
                      placeholder="email@exemplo.com"
                    />
                    {erros.email && <span className="error-message">{erros.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="telefone">
                      <FontAwesomeIcon icon={faPhone} /> Telefone *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className={erros.telefone ? 'error' : ''}
                      placeholder="(11) 99999-9999"
                    />
                    {erros.telefone && <span className="error-message">{erros.telefone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="data_nascimento">Data de Nascimento *</label>
                    <input
                      type="date"
                      id="data_nascimento"
                      name="data_nascimento"
                      value={formData.data_nascimento}
                      onChange={handleChange}
                      className={erros.data_nascimento ? 'error' : ''}
                    />
                    {erros.data_nascimento && <span className="error-message">{erros.data_nascimento}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="sexo">Sexo *</label>
                    <select
                      id="sexo"
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      className={erros.sexo ? 'error' : ''}
                    >
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="O">Outro</option>
                    </select>
                    {erros.sexo && <span className="error-message">{erros.sexo}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="endereco">Endereço *</label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className={erros.endereco ? 'error' : ''}
                    placeholder="Endereço completo"
                  />
                  {erros.endereco && <span className="error-message">{erros.endereco}</span>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={enviandoEmail}
                >
                  {enviandoEmail ? 'Cadastrando...' : 'Cadastrar Profissional'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h4>TRIMED</h4>
            <p>Sua saúde, nossa prioridade desde 2020.</p>
          </div>
          <div className="footer-column">
            <h4>Contato</h4>
            <p><FontAwesomeIcon icon={faPhone} /> (11) 1234-5678</p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Av. Saúde, 123</p>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default RH;
