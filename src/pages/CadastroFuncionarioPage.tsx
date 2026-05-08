import { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { type Funcionario, NivelPermissao } from '../types';
import { showToast } from '../components/Toast';

const PERMISSOES = [
  { value: NivelPermissao.ADMINISTRADOR, label: 'Administrador', icon: '', desc: 'Acesso total ao sistema' },
  { value: NivelPermissao.ENGENHEIRO, label: 'Engenheiro', icon: '', desc: 'Criação e testes (sem RH)' },
  { value: NivelPermissao.OPERADOR, label: 'Operador', icon: '', desc: 'Atualização de status' },
];

type Tab = 'cadastrar' | 'listar';

export default function CadastroFuncionarioPage() {
  const { funcionarios, gerarIdFuncionario, cadastrarFuncionario, editarFuncionario, excluirFuncionario } = useData();
  const { usuario } = useAuth();

  const [tab, setTab] = useState<Tab>('listar');

  // Form state (cadastro) — sem campo de ID manual
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [usuario_input, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [nivel, setNivel] = useState<NivelPermissao>(NivelPermissao.OPERADOR);

  // Edit modal state
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editEndereco, setEditEndereco] = useState('');
  const [editUsuario, setEditUsuario] = useState('');
  const [editSenha, setEditSenha] = useState('');
  const [editNivel, setEditNivel] = useState<NivelPermissao>(NivelPermissao.OPERADOR);

  // Delete confirmation
  const [excluindo, setExcluindo] = useState<Funcionario | null>(null);

  // Gera preview do próximo ID para o nível selecionado
  const proximoId = gerarIdFuncionario(nivel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !usuario_input || !senha) {
      showToast('error', 'Preencha todos os campos obrigatórios!');
      return;
    }

    // Gerar ID automático no momento do cadastro
    const novoId = gerarIdFuncionario(nivel);

    const err = cadastrarFuncionario({
      id: novoId,
      nome: nome.trim(),
      telefone: telefone.trim(),
      endereco: endereco.trim(),
      usuario: usuario_input.trim(),
      senha,
      nivelPermissao: nivel,
    });

    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Funcionário "${nome}" cadastrado com matrícula ${novoId}!`);
      setNome('');
      setTelefone('');
      setEndereco('');
      setUsuarioInput('');
      setSenha('');
      setNivel(NivelPermissao.OPERADOR);
      setTab('listar');
    }
  };

  const abrirEdicao = (func: Funcionario) => {
    setEditando(func);
    setEditNome(func.nome);
    setEditTelefone(func.telefone);
    setEditEndereco(func.endereco);
    setEditUsuario(func.usuario);
    setEditSenha(func.senha);
    setEditNivel(func.nivelPermissao);
  };

  const handleEditar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    if (!editNome || !editUsuario || !editSenha) {
      showToast('error', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const err = editarFuncionario(editando.id, {
      nome: editNome.trim(),
      telefone: editTelefone.trim(),
      endereco: editEndereco.trim(),
      usuario: editUsuario.trim(),
      senha: editSenha,
      nivelPermissao: editNivel,
    });

    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Funcionário "${editNome}" atualizado com sucesso!`);
      setEditando(null);
    }
  };

  const handleExcluir = () => {
    if (!excluindo || !usuario) return;
    const err = excluirFuncionario(excluindo.id, usuario.id);
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Funcionário "${excluindo.nome}" excluído com sucesso!`);
    }
    setExcluindo(null);
  };

  const nivelLabel = (n: NivelPermissao) => {
    switch (n) {
      case NivelPermissao.ADMINISTRADOR: return 'Admin';
      case NivelPermissao.ENGENHEIRO: return 'Engenheiro';
      case NivelPermissao.OPERADOR: return 'Operador';
    }
  };

  return (
    <div className="page">
      <Header title="Gerenciar Funcionários" subtitle="Cadastrar, editar e excluir colaboradores do sistema" />

      {/* Tab switcher */}
      <div className="glass-card" style={{ display: 'flex', gap: '8px', padding: '8px' }}>
        <button
          type="button"
          className={`btn ${tab === 'listar' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setTab('listar')}
          style={{ flex: 1 }}
        >
          Lista de Funcionários
        </button>
        <button
          type="button"
          className={`btn ${tab === 'cadastrar' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setTab('cadastrar')}
          style={{ flex: 1 }}
        >
          Cadastrar Novo
        </button>
      </div>

      {/* ============ TAB: LISTAR ============ */}
      {tab === 'listar' && (
        <div className="glass-card">
          {funcionarios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <p className="empty-message" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
                Nenhum funcionário cadastrado ainda.
              </p>
              <button className="btn btn--primary" onClick={() => setTab('cadastrar')}>
                Cadastrar Primeiro Funcionário
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>Usuário</th>
                    <th style={thStyle}>Telefone</th>
                    <th style={thStyle}>Permissão</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((f) => (
                    <tr key={f.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{f.id}</span>
                      </td>
                      <td style={tdStyle}>{f.nome}</td>
                      <td style={tdStyle}>
                        <span style={{ fontFamily: 'monospace' }}>{f.usuario}</span>
                      </td>
                      <td style={tdStyle}>{f.telefone || '—'}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background:
                              f.nivelPermissao === NivelPermissao.ADMINISTRADOR
                                ? 'var(--danger)'
                                : f.nivelPermissao === NivelPermissao.ENGENHEIRO
                                ? 'var(--primary)'
                                : 'var(--success)',
                            color: '#fff',
                          }}
                        >
                          {nivelLabel(f.nivelPermissao)}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          className="btn btn--ghost"
                          style={{ padding: '4px 12px', fontSize: '0.85rem', marginRight: '4px' }}
                          onClick={() => abrirEdicao(f)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn--ghost"
                          style={{ padding: '4px 12px', fontSize: '0.85rem', color: 'var(--danger)' }}
                          onClick={() => setExcluindo(f)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: CADASTRAR ============ */}
      {tab === 'cadastrar' && (
        <div className="glass-card form-card">
          <form onSubmit={handleSubmit}>
            {/* Nível de permissão PRIMEIRO — porque o ID depende dele */}
            <div className="form-group">
              <label className="form-label">Nível de Permissão *</label>
              <div className="permission-selector">
                {PERMISSOES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`permission-card ${nivel === p.value ? 'permission-card--active' : ''}`}
                    onClick={() => setNivel(p.value)}
                  >
                    <span className="permission-card-icon">{p.icon}</span>
                    <span className="permission-card-label">{p.label}</span>
                    <span className="permission-card-desc">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview da matrícula gerada automaticamente */}
            <div className="form-group">
              <label className="form-label">Matrícula (gerada automaticamente)</label>
              <input
                className="form-input"
                value={proximoId}
                disabled
                style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '1px' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  className="form-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do funcionário"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input
                  className="form-input"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Endereço</label>
                <input
                  className="form-input"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Usuário (Login) *</label>
                <input
                  className="form-input"
                  value={usuario_input}
                  onChange={(e) => setUsuarioInput(e.target.value)}
                  placeholder="Nome de usuário"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha *</label>
              <input
                className="form-input"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha segura"
                required
              />
            </div>

            <button type="submit" className="btn btn--primary btn--full">
              Cadastrar Funcionário
            </button>
          </form>
        </div>
      )}

      {/* ============ MODAL: EDIÇÃO ============ */}
      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Funcionário — {editando.id}</h3>
              <button className="modal-close" onClick={() => setEditando(null)}>×</button>
            </div>
            <form onSubmit={handleEditar}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input
                      className="form-input"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Usuário (Login) *</label>
                    <input
                      className="form-input"
                      value={editUsuario}
                      onChange={(e) => setEditUsuario(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input
                      className="form-input"
                      value={editTelefone}
                      onChange={(e) => setEditTelefone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Endereço</label>
                    <input
                      className="form-input"
                      value={editEndereco}
                      onChange={(e) => setEditEndereco(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Senha *</label>
                    <input
                      className="form-input"
                      type="password"
                      value={editSenha}
                      onChange={(e) => setEditSenha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Permissão</label>
                    <select
                      className="form-select"
                      value={editNivel}
                      onChange={(e) => setEditNivel(e.target.value as NivelPermissao)}
                    >
                      {PERMISSOES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn--ghost" onClick={() => setEditando(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ MODAL: EXCLUSÃO ============ */}
      {excluindo && (
        <div className="modal-overlay" onClick={() => setExcluindo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Confirmar Exclusão</h3>
              <button className="modal-close" onClick={() => setExcluindo(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ lineHeight: 1.6 }}>
                Tem certeza que deseja excluir o funcionário <strong>{excluindo.nome}</strong> ({excluindo.id})?
                <br />
                <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>
                  Esta ação não pode ser desfeita. O funcionário será removido de todas as equipes alocadas.
                </span>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn--ghost" onClick={() => setExcluindo(null)}>
                Cancelar
              </button>
              <button
                className="btn btn--danger"
                onClick={handleExcluir}
              >
                Excluir Funcionário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline styles for table cells
const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '0.8rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '0.95rem',
};
