import { useState } from 'react';
import Header from '../components/Header';
import AeronaveSelector from '../components/AeronaveSelector';
import { useData } from '../context/DataContext';
import { type Relatorio } from '../types';
import { showToast } from '../components/Toast';

export default function RelatorioPage() {
  const { getAeronave, gerarRelatorio } = useData();

  const [codigoAeronave, setCodigoAeronave] = useState('');
  const [cliente, setCliente] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);

  const aeronave = codigoAeronave ? getAeronave(codigoAeronave) : undefined;

  const handleGerar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoAeronave || !cliente || !dataEntrega) {
      showToast('error', 'Preencha todos os campos!');
      return;
    }
    const result = gerarRelatorio(codigoAeronave, cliente.trim(), dataEntrega.trim());
    if (typeof result === 'string') {
      showToast('error', result);
    } else {
      setRelatorio(result);
      showToast('success', 'Relatório gerado com sucesso!');
    }
  };

  const handleDownload = () => {
    if (!relatorio) return;
    const blob = new Blob([relatorio.conteudoDocumento], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = relatorio.nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', `Arquivo "${relatorio.nomeArquivo}" baixado!`);
  };

  return (
    <div className="page">
      <Header title="Relatório Final de Entrega" subtitle="Gerar relatório completo da aeronave (somente Admin)" />

      <div className="glass-card">
        <AeronaveSelector value={codigoAeronave} onChange={(v) => { setCodigoAeronave(v); setRelatorio(null); }} />
      </div>

      {codigoAeronave && aeronave && (
        <>
          <div className="glass-card form-card">
            <h3 className="card-title">Dados do Relatório</h3>

            {/* Status check */}
            <div className="report-status">
              {aeronave.etapas.length === 0 ? (
                <div className="report-status-warning">
                  Esta aeronave não possui etapas cadastradas.
                </div>
              ) : aeronave.etapas.every((e) => e.status === 'CONCLUIDA') ? (
                <div className="report-status-ok">
                  Todas as {aeronave.etapas.length} etapas estão concluídas. Relatório disponível.
                </div>
              ) : (
                <div className="report-status-warning">
                  {aeronave.etapas.filter((e) => e.status !== 'CONCLUIDA').length} etapa(s) ainda
                  não concluída(s). O relatório só pode ser gerado quando todas estiverem concluídas.
                </div>
              )}
            </div>

            <form onSubmit={handleGerar}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome do Cliente / Companhia *</label>
                  <input
                    className="form-input"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Ex: LATAM Airlines"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data de Entrega *</label>
                  <input
                    className="form-input"
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--primary btn--full">
                Gerar Relatório
              </button>
            </form>
          </div>

          {relatorio && (
            <div className="glass-card">
              <div className="report-header">
                <h3 className="card-title">Pré-visualização do Relatório</h3>
                <button className="btn btn--success" onClick={handleDownload}>
                  Baixar .txt
                </button>
              </div>
              <pre className="report-preview">{relatorio.conteudoDocumento}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
