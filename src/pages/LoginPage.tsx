import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { NivelPermissao } from '../types';
import { showToast } from '../components/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { funcionarios, gerarIdFuncionario, cadastrarFuncionario } = useData();
  const navigate = useNavigate();

  const isFirstRun = funcionarios.length === 0;

  // Login state
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  // Setup state
  const [setupNome, setSetupNome] = useState('');
  const [setupTelefone, setSetupTelefone] = useState('');
  const [setupEndereco, setSetupEndereco] = useState('');
  const [setupUsuario, setSetupUsuario] = useState('');
  const [setupSenha, setSetupSenha] = useState('');
  const [setupDone, setSetupDone] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, senha, funcionarios);
    if (ok) {
      showToast('success', 'Login realizado com sucesso!');
      navigate('/');
    } else {
      showToast('error', 'Usuário ou senha inválidos!');
    }
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupNome || !setupUsuario || !setupSenha) {
      showToast('error', 'Preencha todos os campos obrigatórios!');
      return;
    }
    const novoId = gerarIdFuncionario(NivelPermissao.ADMINISTRADOR);
    const err = cadastrarFuncionario({
      id: novoId,
      nome: setupNome,
      telefone: setupTelefone,
      endereco: setupEndereco,
      usuario: setupUsuario,
      senha: setupSenha,
      nivelPermissao: NivelPermissao.ADMINISTRADOR,
    });
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Administrador criado com matrícula ${novoId}! Faça login.`);
      setSetupDone(true);
    }
  };

  const showSetupForm = isFirstRun && !setupDone;

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-grid" />
      </div>

      <div className="login-container">
        <div className="login-brand">
          <div className="login-logo-icon"></div>
          <h1 className="login-logo-text">AEROCODE</h1>
          <p className="login-logo-subtitle">Aircraft Manufacturing Management</p>
        </div>

        <div className="login-card">
          {showSetupForm ? (
            <>
              <div className="login-card-header">
                <h2>Configuração Inicial</h2>
                <p>Nenhum funcionário encontrado. Crie o administrador do sistema.</p>
              </div>
              <form onSubmit={handleSetup} className="login-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Matrícula (automática)</label>
                    <input
                      className="form-input"
                      value={gerarIdFuncionario(NivelPermissao.ADMINISTRADOR)}
                      disabled
                      style={{ fontFamily: 'monospace', fontWeight: 700 }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input
                      className="form-input"
                      value={setupNome}
                      onChange={(e) => setSetupNome(e.target.value)}
                      placeholder="Nome do administrador"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input
                      className="form-input"
                      value={setupTelefone}
                      onChange={(e) => setSetupTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Endereço</label>
                    <input
                      className="form-input"
                      value={setupEndereco}
                      onChange={(e) => setSetupEndereco(e.target.value)}
                      placeholder="Endereço completo"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Usuário (Login) *</label>
                    <input
                      className="form-input"
                      value={setupUsuario}
                      onChange={(e) => setSetupUsuario(e.target.value)}
                      placeholder="Nome de usuário"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Senha *</label>
                    <input
                      className="form-input"
                      type="password"
                      value={setupSenha}
                      onChange={(e) => setSetupSenha(e.target.value)}
                      placeholder="Senha segura"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Nível de Permissão</label>
                  <input
                    className="form-input"
                    value="ADMINISTRADOR"
                    disabled
                  />
                </div>
                <button type="submit" className="btn btn--primary btn--full">
                  Criar Administrador
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="login-card-header">
                <h2>Bem-vindo de volta</h2>
                <p>Faça login para acessar o sistema</p>
              </div>
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label className="form-label">Usuário</label>
                  <input
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu usuário"
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Senha</label>
                  <input
                    className="form-input"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <button type="submit" className="btn btn--primary btn--full">
                  Entrar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
