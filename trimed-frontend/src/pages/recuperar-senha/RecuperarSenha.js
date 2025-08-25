import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarSenha.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faUserNurse, 
  faPhoneAlt, 
  faMapMarkerAlt,
  faEnvelope,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const enviarTokenRedefinicao = async (evento) => {
    evento.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMensagem({ 
        texto: 'Por favor, insira um e-mail válido', 
        tipo: 'erro' 
      });
      return;
    }

    setCarregando(true);
    setMensagem({ texto: '', tipo: '' });
    
    try {
      // Simulação da chamada à API
      const response = await fetch('http://127.0.0.1:8000/api/solicitar-redefinicao/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Erro ao solicitar redefinição');
      }

      setMensagem({ 
        texto: `Enviamos um link de redefinição para ${email}. O link contém um token válido por 24 horas.`,
        tipo: 'sucesso' 
      });

    } catch (erro) {
      console.error('Erro:', erro);
      setMensagem({ 
        texto: 'Se o e-mail estiver cadastrado, você receberá um link com token de redefinição.',
        tipo: 'info' 
      });
    } finally {
      setCarregando(false);
    }
  };

  // Exemplo do link que seria enviado por e-mail
  const exemploLinkRedefinicao = `https://trimed.com.br/redefinir-senha/${encodeURIComponent(email)}?token=688c51e2151e76b7e1a650395c34381dc2990da0a4cae10a69fbba5d5b3c0b53`;

  return (
    <div className="pagina-recuperar-senha">
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
              <span className="nav-link" onClick={() => navigate('/rh')}>
                <FontAwesomeIcon icon={faUserNurse} /> Recursos Humanos
              </span>
              <span className="nav-link" onClick={() => navigate('/contato')}>
                <FontAwesomeIcon icon={faPhoneAlt} /> Contato
              </span>
              <button 
                className="cta-button"
                onClick={() => navigate('/login')}
              >
                Área do Paciente
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="conteudo-principal">
        <div className="container-conteudo">
          <div className="container-formulario">
            <h2 className="titulo-formulario">Redefinir sua senha</h2>
            <p className="subtitulo-formulario">
              Digite seu e-mail para receber um link com token de redefinição válido por 24 horas.
            </p>
            
            <form onSubmit={enviarTokenRedefinicao} className="formulario-recuperacao">
              <div className="grupo-formulario">
                <label htmlFor="email">Endereço de e-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  disabled={carregando}
                  className={mensagem.tipo === 'erro' ? 'erro' : ''}
                />
              </div>

              {mensagem.texto && (
                <div className={`mensagem ${mensagem.tipo}`}>
                  {mensagem.tipo === 'sucesso' ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    <FontAwesomeIcon icon={faExclamationCircle} />
                  )}
                  <span>{mensagem.texto}</span>
                  
                  {mensagem.tipo === 'sucesso' && (
                    <div className="exemplo-link">
                      <p>Exemplo do link que será enviado:</p>
                      <code>{exemploLinkRedefinicao}</code>
                      <p className="aviso-token">
                        O token no link é válido por 24 horas e só pode ser usado uma vez.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="acoes-formulario">
                <button 
                  type="button" 
                  className="botao-cancelar"
                  onClick={() => navigate('/login')}
                  disabled={carregando}
                >
                  Voltar para login
                </button>
                <button 
                  type="submit" 
                  className="botao-enviar"
                  disabled={carregando}
                >
                  {carregando ? (
                    <>
                      <span className="carregando-spinner"></span>
                      Enviando token...
                    </>
                  ) : (
                    'Enviar link com token'
                  )}
                </button>
              </div>
            </form>
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
            <p><FontAwesomeIcon icon={faEnvelope} /> contato@trimed.com.br</p>
          </div>
        </div>
        <div className="copyright">
          <p>© {new Date().getFullYear()} TRIMED - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default RecuperarSenha;
