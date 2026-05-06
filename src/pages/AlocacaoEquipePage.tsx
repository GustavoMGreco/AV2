import { useState } from 'react';
import Header from '../components/Header';
import AeronaveSelector from '../components/AeronaveSelector';
import { useData } from '../context/DataContext';
import { showToast } from '../components/Toast';

export default function AlocacaoEquipePage() {
  const { getAeronave, funcionarios, alocarFuncionario } = useData();

  const [codigoAeronave, setCodigoAeronave] = useState('');
  const [etapaIndex, setEtapaIndex] = useState<number>(-1);
  const [funcId, setFuncId] = useState('');

  const aeronave = codigoAeronave ? getAeronave(codigoAeronave) : undefined;

  const handleAlocar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoAeronave || etapaIndex < 0 || !funcId) {
      showToast('error', 'Selecione aeronave, etapa e funcionário!');
      return;
    }
    const err = alocarFuncionario(codigoAeronave, etapaIndex, funcId);
    if (err) {
      showToast('error', err);
    } else {
      const funcNome = funcionarios.find((f) => f.id === funcId)?.nome || funcId;
      showToast('success', `${funcNome} alocado com sucesso!`);
      setFuncId('');
    }
  };

  const etapaSelecionada = aeronave && etapaIndex >= 0 ? aeronave.etapas[etapaIndex] : null;

  return (
    <div className="page">
      <Header title="Alocação de Equipe" subtitle="Vincular funcionários às etapas de produção" />

      <div className="glass-card">
        <AeronaveSelector value={codigoAeronave} onChange={(v) => { setCodigoAeronave(v); setEtapaIndex(-1); }} />
      </div>

      {codigoAeronave && aeronave && (
        <div className="glass-card form-card">
          <form onSubmit={handleAlocar}>
            <div className="form-group">
              <label className="form-label">Selecione a Etapa</label>
              <select
                className="form-select"
                value={etapaIndex}
                onChange={(e) => setEtapaIndex(Number(e.target.value))}
              >
                <option value={-1}>-- Selecione --</option>
                {aeronave.etapas.map((et, idx) => (
                  <option key={idx} value={idx}>
                    {et.nome} ({et.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Selecione o Funcionário</label>
              <select
                className="form-select"
                value={funcId}
                onChange={(e) => setFuncId(e.target.value)}
              >
                <option value="">-- Selecione --</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} — {f.nome} ({f.nivelPermissao})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn--primary btn--full">
              Alocar Funcionário
            </button>
          </form>

          {etapaSelecionada && (
            <div className="allocated-team">
              <h4 className="card-subtitle">
                Equipe alocada em "{etapaSelecionada.nome}"
              </h4>
              {etapaSelecionada.funcionarios.length === 0 ? (
                <p className="empty-message">Nenhum funcionário alocado nesta etapa.</p>
              ) : (
                <div className="team-chips">
                  {etapaSelecionada.funcionarios.map((fId) => {
                    const f = funcionarios.find((x) => x.id === fId);
                    return (
                      <div key={fId} className="team-chip">
                        <span className="team-chip-avatar">
                          {f?.nome?.charAt(0).toUpperCase() || '?'}
                        </span>
                        <div className="team-chip-info">
                          <span className="team-chip-name">{f?.nome || fId}</span>
                          <span className="team-chip-role">{f?.nivelPermissao || ''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
