import { useState } from 'react';
import Header from '../components/Header';
import AeronaveSelector from '../components/AeronaveSelector';
import Timeline from '../components/Timeline';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatusEtapa, NivelPermissao } from '../types';
import { showToast } from '../components/Toast';

export default function GerenciamentoEtapasPage() {
  const { getAeronave, adicionarEtapa, iniciarEtapa, concluirEtapa, funcionarios } = useData();
  const { temPermissao } = useAuth();

  const [codigoAeronave, setCodigoAeronave] = useState('');
  const [nomeEtapa, setNomeEtapa] = useState('');
  const [prazo, setPrazo] = useState('');

  const aeronave = codigoAeronave ? getAeronave(codigoAeronave) : undefined;
  const podeCriar = temPermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO]);

  const funcionariosMap: Record<string, string> = {};
  funcionarios.forEach((f) => {
    funcionariosMap[f.id] = f.nome;
  });

  const handleAddEtapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoAeronave || !nomeEtapa || !prazo) {
      showToast('error', 'Preencha todos os campos!');
      return;
    }
    const err = adicionarEtapa(codigoAeronave, {
      nome: nomeEtapa.trim(),
      prazo: prazo.trim(),
      status: StatusEtapa.PENDENTE,
      funcionarios: [],
    });
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Etapa "${nomeEtapa}" adicionada!`);
      setNomeEtapa('');
      setPrazo('');
    }
  };

  const handleIniciar = (index: number) => {
    const err = iniciarEtapa(codigoAeronave, index);
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', 'Etapa iniciada!');
    }
  };

  const handleConcluir = (index: number) => {
    const err = concluirEtapa(codigoAeronave, index);
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', 'Etapa concluída!');
    }
  };

  return (
    <div className="page">
      <Header title="Gerenciamento de Etapas" subtitle="Criar e gerenciar etapas de produção" />

      <div className="glass-card">
        <AeronaveSelector value={codigoAeronave} onChange={setCodigoAeronave} />
      </div>

      {codigoAeronave && aeronave && (
        <>
          {podeCriar && (
            <div className="glass-card form-card">
              <h3 className="card-title">Adicionar Nova Etapa</h3>
              <form onSubmit={handleAddEtapa}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome da Etapa *</label>
                    <input
                      className="form-input"
                      value={nomeEtapa}
                      onChange={(e) => setNomeEtapa(e.target.value)}
                      placeholder="Ex: Montagem da Fuselagem"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prazo Estimado *</label>
                    <input
                      className="form-input"
                      value={prazo}
                      onChange={(e) => setPrazo(e.target.value)}
                      placeholder="Ex: 30 dias"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary btn--full">
                  Adicionar Etapa
                </button>
              </form>
            </div>
          )}

          <div className="glass-card">
            <h3 className="card-title">Cronograma — {aeronave.modelo} ({aeronave.codigo})</h3>
            <Timeline
              etapas={aeronave.etapas}
              onIniciar={handleIniciar}
              onConcluir={handleConcluir}
              funcionariosMap={funcionariosMap}
            />
          </div>
        </>
      )}
    </div>
  );
}
