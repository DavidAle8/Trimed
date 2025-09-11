import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PerfilPaciente.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle,
  faUserMd,
  faUserNurse,
  faPhoneAlt,
  faMapMarkerAlt,
  faSignOutAlt,
  faEdit,
  faSave,
  faTimes,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const PerfilPaciente = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [pacienteId, setPacienteId] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Buscar dados do paciente
        const response = await fetch('http://127.0.0.1:8000/api/paciente/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados do usuário');

        const dados = await response.json();
        console.log('Dados recebidos da API:', dados);

        // Verificar diferentes formatos de resposta da API
        let nomeCompleto;
        let email;
        let cpf;
        let telefone;
        let dataNascimento;
        let sexo;
        let endereco;
        let cns;
        let id;
        
        // Se a API retornar um array, pegar o primeiro item
        if (Array.isArray(dados) && dados.length > 0) {
          const primeiroItem = dados[0];
          id = primeiroItem.id;
          nomeCompleto = primeiroItem.nome_completo || 
                         primeiroItem.nome || 
                         `${primeiroItem.first_name || ''} ${primeiroItem.last_name || ''}`.trim();
          email = primeiroItem.email;
          cpf = primeiroItem.cpf;
          telefone = primeiroItem.telefone;
          dataNascimento = primeiroItem.data_nascimento;
          sexo = primeiroItem.sexo;
          endereco = primeiroItem.endereco;
          cns = primeiroItem.cns;
        } 
        // Se a API retornar um objeto direto
        else if (typeof dados === 'object' && dados !== null) {
          id = dados.id;
          nomeCompleto = dados.nome_completo || 
                         dados.nome || 
                         `${dados.first_name || ''} ${dados.last_name || ''}`.trim();
          email = dados.email;
          cpf = dados.cpf;
          telefone = dados.telefone;
          dataNascimento = dados.data_nascimento;
          sexo = dados.sexo;
          endereco = dados.endereco;
          cns = dados.cns;
        } 
        // Formato inesperado
        else {
          nomeCompleto = 'Paciente';
        }

        // Mapear os campos conforme retornado pela API
        const usuarioData = {
          id: id,
          nome_completo: nomeCompleto,
          email: email,
          cpf: cpf,
          telefone: telefone,
          data_nascimento: dataNascimento,
          sexo: sexo,
          endereco: endereco,
          cns: cns,
          ...dados
        };

        sessionStorage.setItem('usuario', JSON.stringify(usuarioData));
        setUsuario(usuarioData);
        setDadosEditados(usuarioData);
        setPacienteId(id);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Tentar recuperar dados da sessionStorage em caso de erro
        const usuarioSalvo = sessionStorage.getItem('usuario');
        if (usuarioSalvo) {
          const usuarioData = JSON.parse(usuarioSalvo);
          setUsuario(usuarioData);
          setDadosEditados(usuarioData);
          setPacienteId(usuarioData.id);
        } else {
          logout();
        }
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosEditados(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatarCPF = (cpf) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e) => {
    const cpfFormatado = formatarCPF(e.target.value);
    setDadosEditados(prev => ({
      ...prev,
      cpf: cpfFormatado
    }));
  };

  const salvarAlteracoes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (!pacienteId) {
        throw new Error('ID do paciente não encontrado');
      }

      // Preparar dados para envio (remover formatação do CPF)
      const dadosParaEnviar = {
        ...dadosEditados,
        cpf: dadosEditados.cpf ? dadosEditados.cpf.replace(/\D/g, '') : ''
      };

      // Remover campos que não devem ser enviados ou que são read-only
      delete dadosParaEnviar.id;
      delete dadosParaEnviar.user; // se existir

      console.log('Dados a serem enviados:', dadosParaEnviar);

      // TENTATIVA 1: Usar endpoint específico com ID e método PATCH
      let url = `http://127.0.0.1:8000/api/paciente/${pacienteId}/`;
      
      console.log('Tentando PATCH para:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      console.log('Resposta do servidor:', response.status, response.statusText);

      if (response.ok) {
        const dadosAtualizados = await response.json();
        console.log('Dados atualizados:', dadosAtualizados);
        
        // Preservar o ID nos dados atualizados
        const dadosCompletos = {
          ...dadosAtualizados,
          id: pacienteId
        };
        
        setUsuario(dadosCompletos);
        sessionStorage.setItem('usuario', JSON.stringify(dadosCompletos));
        setEditando(false);
        setMensagem('Dados atualizados com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
      } else {
        // Tentar entender o erro
        const errorText = await response.text();
        console.error('Erro detalhado:', errorText);
        
        // Se PATCH também não funcionar, tentar PUT como último recurso
        if (response.status === 405) {
          console.log('PATCH não permitido, tentando PUT...');
          const putResponse = await fetch(url, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosParaEnviar)
          });
          
          if (putResponse.ok) {
            const dadosAtualizados = await putResponse.json();
            console.log('Dados atualizados com PUT:', dadosAtualizados);
            
            const dadosCompletos = {
              ...dadosAtualizados,
              id: pacienteId
            };
            
            setUsuario(dadosCompletos);
            sessionStorage.setItem('usuario', JSON.stringify(dadosCompletos));
            setEditando(false);
            setMensagem('Dados atualizados com sucesso!');
            setTimeout(() => setMensagem(''), 3000);
          } else {
            const putErrorText = await putResponse.text();
            console.error('Erro PUT:', putErrorText);
            throw new Error(`Erro ${putResponse.status}: ${putResponse.statusText}`);
          }
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      }

    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      setMensagem('Erro ao atualizar dados. Verifique o console para mais detalhes.');
      setTimeout(() => setMensagem(''), 5000);
    }
  };

  const cancelarEdicao = () => {
    setDadosEditados(usuario);
    setEditando(false);
  };

  const voltarParaDashboard = () => {
    navigate('/dashboard-paciente');
  };

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando seus dados...</p>
      </div>
    );
  }

  if (!usuario) {
    navigate('/login');
    return null;
  }

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
          <div className="perfil-header">
            <div className="perfil-header-top">
              <button className="btn-voltar" onClick={voltarParaDashboard}>
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
              </button>
              <div className="perfil-titulo">
                <FontAwesomeIcon icon={faUserCircle} size="4x" />
                <h1>Meu Perfil</h1>
              </div>
              <div className="perfil-header-spacer"></div> {/* Espaçador para alinhamento */}
            </div>
            {mensagem && (
              <div className={`mensagem-flutuante ${mensagem.includes('Erro') ? 'erro' : 'sucesso'}`}>
                {mensagem}
              </div>
            )}
          </div>

          <div className="perfil-container">
            <div className="perfil-section">
              <h2>Dados Básicos</h2>
              
              <div className="dados-grid">
                <div className="dado-item">
                  <label>Nome</label>
                  {editando ? (
                    <input
                      type="text"
                      name="nome_completo"
                      value={dadosEditados.nome_completo || ''}
                      onChange={handleInputChange}
                      className="input-editar"
                    />
                  ) : (
                    <p>{usuario.nome_completo || 'Não informado'}</p>
                  )}
                </div>

                <div className="dado-item">
                  <label>CPF</label>
                  {editando ? (
                    <input
                      type="text"
                      name="cpf"
                      value={dadosEditados.cpf || ''}
                      onChange={handleCpfChange}
                      className="input-editar"
                      maxLength="14"
                      placeholder="000.000.000-00"
                    />
                  ) : (
                    <p>{usuario.cpf || 'Não informado'}</p>
                  )}
                </div>

                <div className="dado-item">
                  <label>Data de Nascimento</label>
                  {editando ? (
                    <input
                      type="date"
                      name="data_nascimento"
                      value={dadosEditados.data_nascimento || ''}
                      onChange={handleInputChange}
                      className="input-editar"
                    />
                  ) : (
                    <p>{usuario.data_nascimento ? new Date(usuario.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                  )}
                </div>

                <div className="dado-item">
                  <label>Sexo</label>
                  {editando ? (
                    <select
                      name="sexo"
                      value={dadosEditados.sexo || ''}
                      onChange={handleInputChange}
                      className="input-editar"
                    >
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="O">Outro</option>
                    </select>
                  ) : (
                    <p>
                      {usuario.sexo === 'M' ? 'Masculino' : 
                       usuario.sexo === 'F' ? 'Feminino' : 
                       usuario.sexo === 'O' ? 'Outro' : 'Não informado'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="separador"></div>

            <div className="perfil-section">
              <div className="dados-grid">
                <div className="dado-item">
                  <label>Telefone</label>
                  {editando ? (
                    <input
                      type="tel"
                      name="telefone"
                      value={dadosEditados.telefone || ''}
                      onChange={handleInputChange}
                      className="input-editar"
                      placeholder="(00) 00000-0000"
                    />
                  ) : (
                    <p>{usuario.telefone || 'Não informado'}</p>
                  )}
                </div>

                <div className="dado-item">
                  <label>Email</label>
                  {editando ? (
                    <input
                      type="email"
                      name="email"
                      value={dadosEditados.email || ''}
                      onChange={handleInputChange}
                      className="input-editar"
                    />
                  ) : (
                    <p>{usuario.email || 'Não informado'}</p>
                  )}
                </div>

                <div className="dado-item">
                  <label>Endereço</label>
                  {editando ? (
                    <input
                      type="text"
                      name="endereco"
                      value={dadosEditados.endereco || ''}
                      onChange={handleInputChange}
                      className="input-editar"
                    />
                  ) : (
                    <p>{usuario.endereco || 'Não informado'}</p>
                  )}
                </div>

                <div className="dado-item">
                  <label>CNS</label>
                  {editando ? (
                    <input
                      type="text"
                      name="cns"
                      value={dadosEditados.cns || ''}
                      onChange={handleInputChange}
                      className="input-editar"
                    />
                  ) : (
                    <p>{usuario.cns || 'Não informado'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="acoes-perfil">
              {editando ? (
                <div className="botoes-edicao">
                  <button className="btn-salvar" onClick={salvarAlteracoes}>
                    <FontAwesomeIcon icon={faSave} /> Salvar
                  </button>
                  <button className="btn-cancelar" onClick={cancelarEdicao}>
                    <FontAwesomeIcon icon={faTimes} /> Cancelar
                  </button>
                </div>
              ) : (
                <button className="btn-editar" onClick={() => setEditando(true)}>
                  <FontAwesomeIcon icon={faEdit} /> Alterar dados
                </button>
              )}
            </div>
          </div>
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

export default PerfilPaciente;
