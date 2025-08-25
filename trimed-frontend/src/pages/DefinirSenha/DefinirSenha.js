import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DefinirSenha.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle, faUserMd, faUserNurse } from '@fortawesome/free-solid-svg-icons';

const DefinirSenhaProfissional = () => {
  const { token } = useParams();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [dadosProfissional, setDadosProfissional] = useState(null);
  const navigate = useNavigate();

  // Buscar dados do profissional ao carregar o componente
  React.useEffect(() => {
    const buscarDadosProfissional = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/profissional/dados-por-token/${token}/`);
        
        if (response.ok) {
          const data = await response.json();
          setDadosProfissional(data);
        } else {
          console.error('Token inválido ou expirado');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do profissional:', error);
      }
    };
    
    if (token) {
      buscarDadosProfissional();
    }
  }, [token]);

  const validarSenha = () => {
    const novosErros = {};
    
    if (!senha) novosErros.senha = 'Senha é obrigatória';
    else if (senha.length < 8) novosErros.senha = 'Mínimo 8 caracteres';
    else if (!/[A-Z]/.test(senha)) novosErros.senha = 'Requer letra maiúscula';
    else if (!/[a-z]/.test(senha)) novosErros.senha = 'Requer letra minúscula';
    else if (!/\d/.test(senha)) novosErros.senha = 'Requer número';
    
    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'Senhas não coincidem';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarSenha()) return;
    
    setCarregando(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/profissional/definir-senha/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao definir senha');
      }
      
      setSucesso(true);
      setTimeout(() => {
        navigate('/login', {
          state: { 
            mensagem: 'Senha definida com sucesso! Faça login para continuar.',
            email: dadosProfissional?.email 
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Erro:', error);
      alert(error.message);
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="definir-senha-container">
        <div className="definir-senha-card sucesso">
          <FontAwesomeIcon icon={faCheckCircle} className="icone-sucesso" />
          <h2>Senha definida com sucesso!</h2>
          <p>Você será redirecionado para a página de login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="definir-senha-container">
      <div className="definir-senha-card">
        {dadosProfissional && (
          <div className="cabecalho-profissional">
            <FontAwesomeIcon 
              icon={dadosProfissional.tipo === 'medico' ? faUserMd : faUserNurse} 
              className="icone-profissional" 
            />
            <h2>Olá, {dadosProfissional.nome}</h2>
            <p>Complete seu cadastro definindo uma senha</p>
            <div className="info-profissional">
              <span>{dadosProfissional.tipo === 'medico' ? 'Médico' : 'Enfermeiro'}</span>
              {dadosProfissional.especialidade && <span>• {dadosProfissional.especialidade}</span>}
            </div>
          </div>
        )}
        
        <div className="cabecalho">
          <FontAwesomeIcon icon={faLock} className="icone-senha" />
          <h2>Defina sua senha</h2>
          <p>Crie uma senha segura para sua conta</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nova Senha *</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={erros.senha ? 'error' : ''}
              placeholder="Mínimo 8 caracteres"
            />
            {erros.senha && <span className="error-message">{erros.senha}</span>}
            <div className="dicas-senha">
              <p>Sua senha deve conter:</p>
              <ul>
                <li className={senha.length >= 8 ? 'valido' : ''}>Mínimo 8 caracteres</li>
                <li className={/[A-Z]/.test(senha) ? 'valido' : ''}>1 letra maiúscula</li>
                <li className={/[a-z]/.test(senha) ? 'valido' : ''}>1 letra minúscula</li>
                <li className={/\d/.test(senha) ? 'valido' : ''}>1 número</li>
              </ul>
            </div>
          </div>
          
          <div className="form-group">
            <label>Confirmar Senha *</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className={erros.confirmarSenha ? 'error' : ''}
              placeholder="Digite a senha novamente"
            />
            {erros.confirmarSenha && <span className="error-message">{erros.confirmarSenha}</span>}
          </div>
          
          <button 
            type="submit" 
            className="botao-principal"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DefinirSenhaProfissional;
