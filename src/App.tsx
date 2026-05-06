import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CadastroAeronavePage from './pages/CadastroAeronavePage';
import CadastroFuncionarioPage from './pages/CadastroFuncionarioPage';
import GerenciamentoPecasPage from './pages/GerenciamentoPecasPage';
import GerenciamentoEtapasPage from './pages/GerenciamentoEtapasPage';
import AlocacaoEquipePage from './pages/AlocacaoEquipePage';
import TestesQualidadePage from './pages/TestesQualidadePage';
import RelatorioPage from './pages/RelatorioPage';
import { NivelPermissao } from './types';

function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/aeronaves/nova" element={
            <ProtectedRoute permissoes={[NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO]}>
              <CadastroAeronavePage />
            </ProtectedRoute>
          } />
          <Route path="/funcionarios/novo" element={
            <ProtectedRoute permissoes={[NivelPermissao.ADMINISTRADOR]}>
              <CadastroFuncionarioPage />
            </ProtectedRoute>
          } />
          <Route path="/etapas" element={
            <ProtectedRoute>
              <GerenciamentoEtapasPage />
            </ProtectedRoute>
          } />
          <Route path="/pecas" element={
            <ProtectedRoute>
              <GerenciamentoPecasPage />
            </ProtectedRoute>
          } />
          <Route path="/alocacao" element={
            <ProtectedRoute permissoes={[NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO]}>
              <AlocacaoEquipePage />
            </ProtectedRoute>
          } />
          <Route path="/testes" element={
            <ProtectedRoute permissoes={[NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO]}>
              <TestesQualidadePage />
            </ProtectedRoute>
          } />
          <Route path="/relatorios" element={
            <ProtectedRoute permissoes={[NivelPermissao.ADMINISTRADOR]}>
              <RelatorioPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <ToastContainer />
          <AppLayout />
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
