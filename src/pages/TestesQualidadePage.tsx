import { useState } from 'react';
import Header from '../components/Header';
import AeronaveSelector from '../components/AeronaveSelector';
import StatusBadge from '../components/StatusBadge';
import { useData } from '../context/DataContext';
import { TipoTeste, ResultadoTeste } from '../types';
import { showToast } from '../components/Toast';

export default function TestesQualidadePage() {
  const { getAeronave, registrarTeste } = useData();

  const [codigoAeronave, setCodigoAeronave] = useState('');
  const [tipoTeste, setTipoTeste] = useState<TipoTeste>(TipoTeste.ELETRICO);
  const [resultado, setResultado] = useState<ResultadoTeste>(ResultadoTeste.APROVADO);

  const aeronave = codigoAeronave ? getAeronave(codigoAeronave) : undefined;

  const handleRegistrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoAeronave) {
      showToast('error', 'Selecione uma aeronave!');
      return;
    }
    const err = registrarTeste(codigoAeronave, {
      tipo: tipoTeste,
      resultado,
    });
    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Teste ${tipoTeste} registrado — ${resultado}!`);
    }
  };

  const tipoTesteOptions = [
    { value: TipoTeste.ELETRICO, label: 'Elétrico', icon: '' },
    { value: TipoTeste.HIDRAULICO, label: 'Hidráulico', icon: '' },
    { value: TipoTeste.AERODINAMICO, label: 'Aerodinâmico', icon: '' },
  ];

  const resultadoOptions = [
    { value: ResultadoTeste.APROVADO, label: 'Aprovado', icon: '' },
    { value: ResultadoTeste.REPROVADO, label: 'Reprovado', icon: '' },
  ];

  return (
    <div className="page">
      <Header title="Testes de Qualidade" subtitle="Registrar e visualizar testes de qualidade" />

      <div className="glass-card">
        <AeronaveSelector value={codigoAeronave} onChange={setCodigoAeronave} />
      </div>

      {codigoAeronave && aeronave && (
        <>
          <div className="glass-card form-card">
            <h3 className="card-title">Registrar Novo Teste</h3>
            <form onSubmit={handleRegistrar}>
              <div className="form-group">
                <label className="form-label">Tipo de Teste</label>
                <div className="type-selector type-selector--3">
                  {tipoTesteOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`type-option ${tipoTeste === opt.value ? 'type-option--active' : ''}`}
                      onClick={() => setTipoTeste(opt.value)}
                    >
                      <span className="type-option-icon">{opt.icon}</span>
                      <span className="type-option-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Resultado</label>
                <div className="type-selector">
                  {resultadoOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`type-option ${resultado === opt.value ? 'type-option--active' : ''} ${
                        opt.value === ResultadoTeste.APROVADO ? 'type-option--green' : 'type-option--red'
                      }`}
                      onClick={() => setResultado(opt.value)}
                    >
                      <span className="type-option-icon">{opt.icon}</span>
                      <span className="type-option-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn--primary btn--full">
                Registrar Teste
              </button>
            </form>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Histórico de Testes — {aeronave.modelo}</h3>
            {aeronave.testes.length === 0 ? (
              <p className="empty-message">Nenhum teste registrado para esta aeronave.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tipo</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aeronave.testes.map((t, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{t.tipo}</td>
                        <td>
                          <StatusBadge status={t.resultado} />
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
