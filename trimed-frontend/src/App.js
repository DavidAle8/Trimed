import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import RecuperarSenha from './pages/recuperar-senha/RecuperarSenha';
import Servicos from './pages/Servicos/Servicos';
import RH from './pages/RH/RH';
import LoginRH from '../src/pages/RH/LoginRH/LoginRH';
import Contato from './pages/Contato/Contato';
import DashboardPaciente from './pages/dashboard-paciente/DashboardPaciente';
import AgendarConsulta from './pages/dashboard-paciente/AgendarConsulta';
import VisualizarAgendamentos from './pages/dashboard-paciente/VisualizarAgendamentos';
import HistoricoAgendamentos from './pages/dashboard-paciente/HistoricoAgendamentos';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-rh" element={<LoginRH />} /> {/* Rota do Login RH */}
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/rh" element={<RH />} /> {/* Esta rota será protegida */}
        <Route path="/contato" element={<Contato />} />
        
        {/* Rotas protegidas do painel do paciente */}
        <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
        <Route path="/agendar-consulta" element={<AgendarConsulta />} />
        <Route path="/visualizar-agendamentos" element={<VisualizarAgendamentos />} />
        <Route path="/historico" element={<HistoricoAgendamentos />} />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
