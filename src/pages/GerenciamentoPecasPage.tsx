import { useState } from 'react';
import Header from '../components/Header';
import AeronaveSelector from '../components/AeronaveSelector';
import StatusBadge from '../components/StatusBadge';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TipoPeca, StatusPeca, NivelPermissao } from '../types';
import { showToast } from '../components/Toast';

export default function GerenciamentoPecasPage() {
  const { getAeronave, adicionarPeca, atualizarStatusPeca } = useData();
  const { temPermissao } = useAuth();

  const [codigoAeronave, setCodigoAeronave] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoPeca>(TipoPeca.NACIONAL);
  const [fornecedor, setFornecedor] = useState('');

  const aeronave = codigoAeronave ? getAeronave(codigoAeronave) : undefined;
  const podeCriar = temPermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO]);

  const handleAddPeca = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoAeronave || !nome || !fornecedor) {
      showToast('error', 'Preencha todos os campos!');
      return;
    }
    const err = adicionarPeca(codigoAeronave, {
      nome: nome.trim(),
      tipo,
      fornecedor: fornecedor.trim(),
      status: StatusPeca.EM_PRODUCAO,
    });
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Peça "${nome}" adicionada!`);
      setNome('');
      setFornecedor('');
    }
  };

  const handleStatusChange = (index: number, novoStatus: StatusPeca) => {
    const err = atualizarStatusPeca(codigoAeronave, index, novoStatus);
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', 'Status atualizado!');
    }
  };

  return (
    <div className="page">
      <Header title="Gerenciamento de Peças" subtitle="Adicionar e gerenciar peças das aeronaves" />

      <div className="glass-card">
        <AeronaveSelector value={codigoAeronave} onChange={setCodigoAeronave} />
      </div>

      {codigoAeronave && aeronave && (
        <>
          {podeCriar && (
            <div className="glass-card form-card">
              <h3 className="card-title">Adicionar Nova Peça</h3>
              <form onSubmit={handleAddPeca}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome da Peça *</label>
                    <input
                      className="form-input"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Turbina, Radar, Asa"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fornecedor *</label>
                    <input
                      className="form-input"
                      value={fornecedor}
                      onChange={(e) => setFornecedor(e.target.value)}
                      placeholder="Ex: Rolls-Royce"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      className={`type-option ${tipo === TipoPeca.NACIONAL ? 'type-option--active' : ''}`}
                      onClick={() => setTipo(TipoPeca.NACIONAL)}
                    >
                      <span className="type-option-icon"></span>
                      <span className="type-option-label">Nacional</span>
                    </button>
                    <button
                      type="button"
                      className={`type-option ${tipo === TipoPeca.IMPORTADA ? 'type-option--active' : ''}`}
                      onClick={() => setTipo(TipoPeca.IMPORTADA)}
                    >
                      <span className="type-option-icon"></span>
                      <span className="type-option-label">Importada</span>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn--primary btn--full">
                  Cadastrar Peça
                </button>
              </form>
            </div>
          )}

          <div className="glass-card">
            <h3 className="card-title">Peças de {aeronave.modelo} ({aeronave.codigo})</h3>
            {aeronave.pecas.length === 0 ? (
              <p className="empty-message">Nenhuma peça cadastrada para esta aeronave.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Fornecedor</th>
                      <th>Status</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aeronave.pecas.map((p, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="td-bold">{p.nome}</td>
                        <td>
                          <StatusBadge status={p.tipo} />
                        </td>
                        <td>{p.fornecedor}</td>
                        <td>
                          <StatusBadge status={p.status} />
                        </td>
                        <td>
                          <select
                            className="form-select form-select--small"
                            value={p.status}
                            onChange={(e) =>
                              handleStatusChange(idx, e.target.value as StatusPeca)
                            }
                          >
                            <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                            <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                            <option value={StatusPeca.PRONTA}>Pronta</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
