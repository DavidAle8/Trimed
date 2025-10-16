import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhoneAlt, 
  faUserMd, 
  faMapMarkerAlt,
  faUserNurse,
  faCheckCircle,
  faLock,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const etapas = [
  {
    titulo: 'Dados Pessoais',
    campos: ['nomeCompleto', 'email', 'cpf', 'dataNascimento', 'sexo', 'telefone']
  },
  {
    titulo: 'Informações Adicionais',
    campos: ['cns', 'endereco']
  },
  {
    titulo: 'Segurança',
    campos: ['senha', 'confirmarSenha']
  }
];

const Cadastro = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    telefone: '',
    cns: '',
    endereco: '',
    senha: '',
    confirmarSenha: ''
  });

  const [erros, setErros] = useState({});
  const [validacoes, setValidacoes] = useState({});
  const [forcaSenha, setForcaSenha] = useState('');
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');

  const navegar = useNavigate();

  // Efeito para validar campos em tempo real
  useEffect(() => {
    const novosValidacoes = {};
    
    // Validação do nome completo
    if (dadosFormulario.nomeCompleto) {
      novosValidacoes.nomeCompleto = dadosFormulario.nomeCompleto.trim().split(' ').length >= 2;
    }

    // Validação do email
    if (dadosFormulario.email) {
      novosValidacoes.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosFormulario.email);
    }

    // Validação do CPF
    if (dadosFormulario.cpf) {
      const cpfLimpo = dadosFormulario.cpf.replace(/\D/g, '');
      novosValidacoes.cpf = cpfLimpo.length === 11 && validarCPF(dadosFormulario.cpf);
    }

    // Validação da data de nascimento
    if (dadosFormulario.dataNascimento) {
      novosValidacoes.dataNascimento = validarDataNascimento(dadosFormulario.dataNascimento) === '';
    }

    // Validação do telefone
    if (dadosFormulario.telefone) {
      novosValidacoes.telefone = dadosFormulario.telefone.replace(/\D/g, '').length >= 11;
    }

    // Validação da senha
    if (dadosFormulario.senha) {
      novosValidacoes.senha = validarSenha(dadosFormulario.senha) === '';
    }

    // Validação da confirmação de senha
    if (dadosFormulario.confirmarSenha) {
      novosValidacoes.confirmarSenha = dadosFormulario.senha === dadosFormulario.confirmarSenha;
    }

    setValidacoes(novosValidacoes);
  }, [dadosFormulario]);

  // Funções de validação
  const validarEmail = (email) => {
    if (!email) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
    return '';
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (!cpf) return 'CPF é obrigatório';
    if (cpf.length !== 11) return 'CPF deve ter 11 dígitos';
    
    // Validação de dígitos do CPF
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;

    return digitoVerificador2 === parseInt(cpf.charAt(10));
  };

  const validarDataNascimento = (data) => {
    if (!data) return 'Data de nascimento é obrigatória';
    
    const nascimento = new Date(data);
    const hoje = new Date();
    const minData = new Date();
    minData.setFullYear(hoje.getFullYear() - 120);
    
    if (nascimento > hoje) return 'Data não pode ser no futuro';
    if (nascimento < minData) return 'Data muito antiga';
    
    // Verificar se tem pelo menos 12 anos
    const idadeMinima = new Date();
    idadeMinima.setFullYear(idadeMinima.getFullYear() - 12);
    if (nascimento > idadeMinima) return 'Você deve ter pelo menos 12 anos';
    
    return '';
  };

  const validarTelefone = (tel) => {
    if (!tel) return 'Telefone é obrigatório';
    const num = tel.replace(/\D/g, '');
    if (num.length < 11) return 'Telefone incompleto (DDD + número)';
    return '';
  };

  const validarSenha = (senha) => {
    if (!senha) return 'Senha é obrigatória';
    if (senha.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(senha)) return 'Pelo menos 1 letra maiúscula';
    if (!/[a-z]/.test(senha)) return 'Pelo menos 1 letra minúscula';
    if (!/\d/.test(senha)) return 'Pelo menos 1 número';
    return '';
  };

  const verificarForcaSenha = (senha) => {
    if (!senha) {
      setForcaSenha('');
      return;
    }
    
    let pontuacao = 0;
    if (senha.length >= 8) pontuacao++;
    if (senha.length >= 12) pontuacao++;
    if (/[A-Z]/.test(senha)) pontuacao++;
    if (/[a-z]/.test(senha)) pontuacao++;
    if (/\d/.test(senha)) pontuacao++;
    if (/[^A-Za-z0-9]/.test(senha)) pontuacao++;

    switch (pontuacao) {
      case 6: setForcaSenha('Muito Forte'); break;
      case 5: setForcaSenha('Forte'); break;
      case 4: setForcaSenha('Média'); break;
      case 3: setForcaSenha('Fraca'); break;
      default: setForcaSenha('Muito Fraca');
    }
  };

  const validarCamposEtapa = () => {
    const novosErros = {};
    const campos = etapas[etapaAtual].campos;

    campos.forEach(campo => {
      switch(campo) {
        case 'nomeCompleto':
          if (!dadosFormulario.nomeCompleto.trim()) {
            novosErros.nomeCompleto = 'Nome completo é obrigatório';
          } else if (dadosFormulario.nomeCompleto.trim().split(' ').length < 2) {
            novosErros.nomeCompleto = 'Digite nome e sobrenome';
          }
          break;
        case 'email':
          novosErros.email = validarEmail(dadosFormulario.email);
          break;
        case 'cpf':
          if (!dadosFormulario.cpf) {
            novosErros.cpf = 'CPF é obrigatório';
          } else if (!validarCPF(dadosFormulario.cpf)) {
            novosErros.cpf = 'CPF inválido';
          }
          break;
        case 'dataNascimento':
          novosErros.dataNascimento = validarDataNascimento(dadosFormulario.dataNascimento);
          break;
        case 'sexo':
          if (!dadosFormulario.sexo) novosErros.sexo = 'Sexo é obrigatório';
          break;
        case 'telefone':
          novosErros.telefone = validarTelefone(dadosFormulario.telefone);
          break;
        case 'senha':
          novosErros.senha = validarSenha(dadosFormulario.senha);
          break;
        case 'confirmarSenha':
          if (dadosFormulario.senha !== dadosFormulario.confirmarSenha) {
            novosErros.confirmarSenha = 'Senhas não coincidem';
          }
          break;
      }
    });

    // Remover campos sem erro
    Object.keys(novosErros).forEach(key => {
      if (!novosErros[key]) delete novosErros[key];
    });

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleAlteracao = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'senha') {
      verificarForcaSenha(value);
    }

    // Limpar erro específico quando o usuário começa a digitar
    if (erros[name]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[name];
        return novosErros;
      });
    }
  };

  const formatarCPF = (valor) => {
    const limpo = valor.replace(/\D/g, '');
    let formatado = limpo.replace(/(\d{3})(\d)/, '$1.$2');
    formatado = formatado.replace(/(\d{3})(\d)/, '$1.$2');
    formatado = formatado.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return formatado.substring(0, 14);
  };

  const formatarTelefone = (valor) => {
    const limpo = valor.replace(/\D/g, '');
    let formatado = limpo.replace(/^(\d{2})(\d)/g, '($1) $2');
    formatado = formatado.replace(/(\d)(\d{4})$/, '$1-$2');
    return formatado.substring(0, 15);
  };

  const handleMudancaCpf = (e) => {
    const valorFormatado = formatarCPF(e.target.value);
    setDadosFormulario(prev => ({
      ...prev,
      cpf: valorFormatado
    }));
  };

  const handleMudancaTelefone = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setDadosFormulario(prev => ({
      ...prev,
      telefone: valorFormatado
    }));
  };

  const avancarEtapa = (e) => {
    e.preventDefault();
    if (validarCamposEtapa()) {
      setEtapaAtual(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const voltarEtapa = () => {
    setEtapaAtual(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleEnvio = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErroCadastro('');

    if (!validarCamposEtapa()) {
      setCarregando(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/paciente/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: dadosFormulario.email,
          nome_completo: dadosFormulario.nomeCompleto,
          cpf: dadosFormulario.cpf.replace(/\D/g, ''),
          data_nascimento: dadosFormulario.dataNascimento,
          sexo: dadosFormulario.sexo,
          telefone: dadosFormulario.telefone.replace(/\D/g, ''),
          cns: dadosFormulario.cns || null,
          endereco: dadosFormulario.endereco || null,
          senha: dadosFormulario.senha
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          // Tratar erros específicos do backend
          const errosBackend = {};
          if (data.email) errosBackend.email = Array.isArray(data.email) ? data.email[0] : data.email;
          if (data.cpf) errosBackend.cpf = Array.isArray(data.cpf) ? data.cpf[0] : data.cpf;
          if (data.telefone) errosBackend.telefone = Array.isArray(data.telefone) ? data.telefone[0] : data.telefone;
          if (data.senha) errosBackend.senha = Array.isArray(data.senha) ? data.senha[0] : data.senha;
          
          setErros(prev => ({ ...prev, ...errosBackend }));
          throw new Error('Corrija os erros no formulário');
        }
        throw new Error(data.detail || 'Erro no servidor ao processar cadastro');
      }

      setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => {
        navegar('/login', {
          state: { 
            mensagem: 'Cadastro realizado com sucesso! Faça login para continuar.',
            email: dadosFormulario.email
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErroCadastro(error.message || 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  const renderizarFeedback = (campo) => {
    if (!dadosFormulario[campo]) return null;
    
    const valido = validacoes[campo];
    if (valido === undefined) return null;

    return (
      <span className={`feedback-real-time ${valido ? 'valido' : 'invalido'}`}>
        {valido ? (
          <>
            <FontAwesomeIcon icon={faCheck} /> Formato válido
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faTimes} /> Formato inválido
          </>
        )}
      </span>
    );
  };

  const renderizarCampos = () => {
    switch (etapaAtual) {
      case 0:
        return (
          <>
            <div className="form-group">
              <label htmlFor="nomeCompleto">Nome completo *</label>
              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                value={dadosFormulario.nomeCompleto}
                onChange={handleAlteracao}
                className={erros.nomeCompleto ? 'error' : ''}
                placeholder="Digite seu nome completo"
              />
              {renderizarFeedback('nomeCompleto')}
              {erros.nomeCompleto && <span className="error-message">{erros.nomeCompleto}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={dadosFormulario.email}
                onChange={handleAlteracao}
                className={erros.email ? 'error' : ''}
                placeholder="seu@email.com"
              />
              {renderizarFeedback('email')}
              {erros.email && <span className="error-message">{erros.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cpf">CPF *</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={dadosFormulario.cpf}
                  onChange={handleMudancaCpf}
                  placeholder="000.000.000-00"
                  className={erros.cpf ? 'error' : ''}
                />
                {renderizarFeedback('cpf')}
                {erros.cpf && <span className="error-message">{erros.cpf}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="dataNascimento">Data de nascimento *</label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={dadosFormulario.dataNascimento}
                  onChange={handleAlteracao}
                  className={erros.dataNascimento ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                />
                {renderizarFeedback('dataNascimento')}
                {erros.dataNascimento && <span className="error-message">{erros.dataNascimento}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sexo">Sexo *</label>
                <select
                  id="sexo"
                  name="sexo"
                  value={dadosFormulario.sexo}
                  onChange={handleAlteracao}
                  className={erros.sexo ? 'error' : ''}
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
                {erros.sexo && <span className="error-message">{erros.sexo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone *</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={dadosFormulario.telefone}
                  onChange={handleMudancaTelefone}
                  placeholder="(00) 00000-0000"
                  className={erros.telefone ? 'error' : ''}
                />
                {renderizarFeedback('telefone')}
                {erros.telefone && <span className="error-message">{erros.telefone}</span>}
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="cns">CNS (Cartão Nacional de Saúde)</label>
              <input
                type="text"
                id="cns"
                name="cns"
                value={dadosFormulario.cns}
                onChange={handleAlteracao}
                className={erros.cns ? 'error' : ''}
                placeholder="Opcional"
              />
              {erros.cns && <span className="error-message">{erros.cns}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endereco">Endereço completo</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={dadosFormulario.endereco}
                onChange={handleAlteracao}
                placeholder="Rua, número, bairro, cidade (Opcional)"
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label htmlFor="senha">Senha *</label>
              <div className="password-input-container">
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={dadosFormulario.senha}
                  onChange={handleAlteracao}
                  className={erros.senha ? 'error' : ''}
                  placeholder="Mínimo 8 caracteres"
                />
                <FontAwesomeIcon icon={faLock} className="input-icon" />
              </div>
              {renderizarFeedback('senha')}
              {erros.senha && <span className="error-message">{erros.senha}</span>}
              
              {dadosFormulario.senha && (
                <div className="password-strength">
                  <span>Força da senha: </span>
                  <span className={`strength-${forcaSenha.replace(' ', '-').toLowerCase()}`}>
                    {forcaSenha}
                  </span>
                </div>
              )}
              
              <div className="password-requirements">
                <p>Sua senha deve conter:</p>
                <ul>
                  <li className={dadosFormulario.senha?.length >= 8 ? 'valid' : ''}>
                    Mínimo 8 caracteres
                  </li>
                  <li className={/[A-Z]/.test(dadosFormulario.senha) ? 'valid' : ''}>
                    Pelo menos 1 letra maiúscula
                  </li>
                  <li className={/[a-z]/.test(dadosFormulario.senha) ? 'valid' : ''}>
                    Pelo menos 1 letra minúscula
                  </li>
                  <li className={/\d/.test(dadosFormulario.senha) ? 'valid' : ''}>
                    Pelo menos 1 número
                  </li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha *</label>
              <div className="password-input-container">
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={dadosFormulario.confirmarSenha}
                  onChange={handleAlteracao}
                  className={erros.confirmarSenha ? 'error' : ''}
                  placeholder="Digite a senha novamente"
                />
                <FontAwesomeIcon icon={faLock} className="input-icon" />
              </div>
              {dadosFormulario.confirmarSenha && renderizarFeedback('confirmarSenha')}
              {erros.confirmarSenha && <span className="error-message">{erros.confirmarSenha}</span>}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const barraProgresso = () => {
    return (
      <div className="barra-progresso">
        {etapas.map((etapa, index) => (
          <div
            key={index}
            className={`etapa ${index === etapaAtual ? 'ativa' : index < etapaAtual ? 'concluida' : ''}`}
            onClick={() => index < etapaAtual && setEtapaAtual(index)}
          >
            <div className="bolinha">
              {index < etapaAtual ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="etapa-titulo">{etapa.titulo}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="cadastro-page">
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container" onClick={() => navegar('/')}>
              <h1 className="logo">TRIMED</h1>
              <p className="slogan">Sua saúde em primeiro lugar</p>
            </div>
            
            <nav className="nav">
              <span className="nav-link" onClick={() => navegar('/')}>Home</span>
              <span className="nav-link" onClick={() => navegar('/servicos')}>
                <FontAwesomeIcon icon={faUserMd} /> Serviços
              </span>
              <span className="nav-link" onClick={() => navegar('/RH')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navegar('/contato')}>
                <FontAwesomeIcon icon={faPhoneAlt} /> Contato
              </span>
              <button 
                className="cta-button"
                onClick={() => navegar('/login')}
              >
                Área do Paciente
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          <div className="cadastro-form-container">
            <h2 className="form-title">Cadastro de Paciente</h2>
            
            {barraProgresso()}

            {mensagemSucesso ? (
              <div className="mensagem-sucesso">
                <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                <p>{mensagemSucesso}</p>
              </div>
            ) : (
              <>
                {erroCadastro && (
                  <div className="mensagem-erro">
                    <p>{erroCadastro}</p>
                  </div>
                )}
                
                <form
                  onSubmit={etapaAtual === etapas.length - 1 ? handleEnvio : avancarEtapa}
                  className="cadastro-form"
                >
                  {renderizarCampos()}

                  <div className="form-actions">
                    {etapaAtual > 0 && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={voltarEtapa}
                        disabled={carregando}
                      >
                        Voltar
                      </button>
                    )}

                    {etapaAtual < etapas.length - 1 ? (
                      <button 
                        type="submit" 
                        className="submit-button"
                        disabled={carregando}
                      >
                        Próximo
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        className="submit-button"
                        disabled={carregando}
                      >
                        {carregando ? 'Finalizando...' : 'Finalizar Cadastro'}
                      </button>
                    )}
                  </div>
                </form>
              </>
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
            <p><FontAwesomeIcon icon={faPhoneAlt} /> (11) 1234-5678</p>
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

export default Cadastro;
