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
import DefinirSenha from './components/DefinirSenha'; // 👈 Importe o componente

// Importe os componentes dos dashboards
import DashboardMedico from './pages/dashboard-medico/DashboardMedico';
// 👇 Importar o componente
import VisualizarAgendamentosPendentes from './pages/dashboard-medico/VisualizarAgendamentosPendentes';

import DashboardEnfermeiro from './pages/dashboard-enfermeiro/DashboardEnfermeiro';
import FichaMedicaPaciente from './pages/dashboard-enfermeiro/FichaMedicaPaciente';
import SinaisVitais from './pages/dashboard-enfermeiro/SinaisVitais';
// Importe o componente do Perfil do Paciente
import PerfilPaciente from './pages/dashboard-paciente/PerfilPaciente';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-rh" element={<LoginRH />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/rh" element={<RH />} />
        <Route path="/contato" element={<Contato />} />
        
        {/* Nova rota para definição de senha */}
       <Route path="/definir-senha" element={<DefinirSenha />} /> {/* 👈 Nova rota */}
        
        {/* Rotas protegidas - PACIENTE */}
        <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
        <Route path="/agendar-consulta" element={<AgendarConsulta />} />
        <Route path="/visualizar-agendamentos" element={<VisualizarAgendamentos />} />
        <Route path="/historico" element={<HistoricoAgendamentos />} />
        {/* 👇 NOVA ROTA DO PERFIL DO PACIENTE */}
        <Route path="/perfil" element={<PerfilPaciente />} />
        
        {/* Rotas protegidas - MÉDICO */}
        <Route path="/dashboard-medico" element={<DashboardMedico />} />
        {/* Rotas protegidas - MÉDICO */}
	<Route path="/dashboard-medico" element={<DashboardMedico />} />
	<Route path="/agendamentos-pendentes" element={<VisualizarAgendamentosPendentes />} />

	{/* Rotas protegidas - ENFERMEIRO */}
        <Route path="/dashboard-enfermeiro" element={<DashboardEnfermeiro />} />
        <Route path="/ficha-medica" element={<FichaMedicaPaciente />} />
	<Route path="/sinais-vitais" element={<SinaisVitais />} />
        {/* Rota para página não encontrada */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
