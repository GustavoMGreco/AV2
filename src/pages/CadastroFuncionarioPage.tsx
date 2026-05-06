import { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { NivelPermissao } from '../types';
import { showToast } from '../components/Toast';

const PERMISSOES = [
  { value: NivelPermissao.ADMINISTRADOR, label: 'Administrador', icon: '', desc: 'Acesso total ao sistema' },
  { value: NivelPermissao.ENGENHEIRO, label: 'Engenheiro', icon: '', desc: 'Criação e testes (sem RH)' },
  { value: NivelPermissao.OPERADOR, label: 'Operador', icon: '', desc: 'Atualização de status' },
];

export default function CadastroFuncionarioPage() {
  const { cadastrarFuncionario } = useData();

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nivel, setNivel] = useState<NivelPermissao>(NivelPermissao.OPERADOR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !nome || !usuario || !senha) {
      showToast('error', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const err = cadastrarFuncionario({
      id: id.trim(),
      nome: nome.trim(),
      telefone: telefone.trim(),
      endereco: endereco.trim(),
      usuario: usuario.trim(),
      senha,
      nivelPermissao: nivel,
    });

    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Funcionário "${nome}" cadastrado com sucesso!`);
      setId('');
      setNome('');
      setTelefone('');
      setEndereco('');
      setUsuario('');
      setSenha('');
      setNivel(NivelPermissao.OPERADOR);
    }
  };

  return (
    <div className="page">
      <Header title="Cadastrar Funcionário" subtitle="Adicionar novo colaborador ao sistema (somente Admin)" />

      <div className="glass-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Matrícula (ID) *</label>
              <input
                className="form-input"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Ex: ENG002"
                required
              />
            </div>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                className="form-input"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input
                className="form-input"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Usuário (Login) *</label>
              <input
                className="form-input"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Nome de usuário"
                required
              />
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
          </div>

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

          <button type="submit" className="btn btn--primary btn--full">
            Cadastrar Funcionário
          </button>
        </form>
      </div>
    </div>
  );
}
