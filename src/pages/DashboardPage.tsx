import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatusEtapa, ResultadoTeste } from '../types';

export default function DashboardPage() {
  const { aeronaves, funcionarios } = useData();
  const { usuario } = useAuth();

  const totalAeronaves = aeronaves.length;
  const totalFuncionarios = funcionarios.length;
  const totalPecas = aeronaves.reduce((sum, a) => sum + a.pecas.length, 0);
  const totalTestes = aeronaves.reduce((sum, a) => sum + a.testes.length, 0);

  const etapasPendentes = aeronaves.reduce(
    (sum, a) => sum + a.etapas.filter((e) => e.status === StatusEtapa.PENDENTE).length,
    0
  );
  const etapasAndamento = aeronaves.reduce(
    (sum, a) => sum + a.etapas.filter((e) => e.status === StatusEtapa.ANDAMENTO).length,
    0
  );
  const etapasConcluidas = aeronaves.reduce(
    (sum, a) => sum + a.etapas.filter((e) => e.status === StatusEtapa.CONCLUIDA).length,
    0
  );

  const testesAprovados = aeronaves.reduce(
    (sum, a) => sum + a.testes.filter((t) => t.resultado === ResultadoTeste.APROVADO).length,
    0
  );
  const testesReprovados = aeronaves.reduce(
    (sum, a) => sum + a.testes.filter((t) => t.resultado === ResultadoTeste.REPROVADO).length,
    0
  );

  return (
    <div className="page">
      <Header
        title={`Olá, ${usuario?.nome || 'Usuário'}`}
        subtitle="Bem-vindo ao painel de controle AEROCODE"
      />

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dash-card dash-card--blue">
          <div className="dash-card-icon"></div>
          <div className="dash-card-info">
            <span className="dash-card-value">{totalAeronaves}</span>
            <span className="dash-card-label">Aeronaves</span>
          </div>
        </div>
        <div className="dash-card dash-card--purple">
          <div className="dash-card-icon"></div>
          <div className="dash-card-info">
            <span className="dash-card-value">{totalFuncionarios}</span>
            <span className="dash-card-label">Funcionários</span>
          </div>
        </div>
        <div className="dash-card dash-card--teal">
          <div className="dash-card-icon"></div>
          <div className="dash-card-info">
            <span className="dash-card-value">{totalPecas}</span>
            <span className="dash-card-label">Peças</span>
          </div>
        </div>
        <div className="dash-card dash-card--orange">
          <div className="dash-card-icon"></div>
          <div className="dash-card-info">
            <span className="dash-card-value">{totalTestes}</span>
            <span className="dash-card-label">Testes</span>
          </div>
        </div>
      </div>

      {/* Stage Summary */}
      <div className="dashboard-grid">
        <div className="glass-card">
          <h3 className="card-title">Progresso de Etapas</h3>
          <div className="progress-summary">
            <div className="progress-row">
              <span>Pendentes</span>
              <div className="progress-bar-container">
                <div
                  className="progress-bar progress-bar--info"
                  style={{
                    width: `${((etapasPendentes / (etapasPendentes + etapasAndamento + etapasConcluidas)) * 100) || 0}%`,
                  }}
                />
              </div>
              <span className="progress-count">{etapasPendentes}</span>
            </div>
            <div className="progress-row">
              <span>Em Andamento</span>
              <div className="progress-bar-container">
                <div
                  className="progress-bar progress-bar--warning"
                  style={{
                    width: `${((etapasAndamento / (etapasPendentes + etapasAndamento + etapasConcluidas)) * 100) || 0}%`,
                  }}
                />
              </div>
              <span className="progress-count">{etapasAndamento}</span>
            </div>
            <div className="progress-row">
              <span>Concluídas</span>
              <div className="progress-bar-container">
                <div
                  className="progress-bar progress-bar--success"
                  style={{
                    width: `${((etapasConcluidas / (etapasPendentes + etapasAndamento + etapasConcluidas)) * 100) || 0}%`,
                  }}
                />
              </div>
              <span className="progress-count">{etapasConcluidas}</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="card-title">Resumo de Testes</h3>
          <div className="test-summary">
            <div className="test-summary-item">
              <span className="test-summary-value test-summary--approved">{testesAprovados}</span>
              <span className="test-summary-label">Aprovados</span>
            </div>
            <div className="test-summary-divider" />
            <div className="test-summary-item">
              <span className="test-summary-value test-summary--failed">{testesReprovados}</span>
              <span className="test-summary-label">Reprovados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aircraft List */}
      <div className="glass-card">
        <h3 className="card-title">Aeronaves Cadastradas</h3>
        {aeronaves.length === 0 ? (
          <p className="empty-message">Nenhuma aeronave cadastrada ainda.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Modelo</th>
                  <th>Tipo</th>
                  <th>Capacidade</th>
                  <th>Alcance (km)</th>
                  <th>Peças</th>
                  <th>Etapas</th>
                  <th>Testes</th>
                </tr>
              </thead>
              <tbody>
                {aeronaves.map((a) => (
                  <tr key={a.codigo}>
                    <td className="td-code">{a.codigo}</td>
                    <td>{a.modelo}</td>
                    <td>
                      <StatusBadge status={a.tipo} />
                    </td>
                    <td>{a.capacidade}</td>
                    <td>{a.alcance.toLocaleString('pt-BR')}</td>
                    <td>{a.pecas.length}</td>
                    <td>
                      {a.etapas.filter((e) => e.status === StatusEtapa.CONCLUIDA).length}/
                      {a.etapas.length}
                    </td>
                    <td>{a.testes.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
