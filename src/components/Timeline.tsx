import { type Etapa, StatusEtapa } from '../types';
import StatusBadge from './StatusBadge';

interface TimelineProps {
  etapas: Etapa[];
  onIniciar?: (index: number) => void;
  onConcluir?: (index: number) => void;
  funcionariosMap?: Record<string, string>; // id -> nome
}

export default function Timeline({ etapas, onIniciar, onConcluir, funcionariosMap }: TimelineProps) {
  if (etapas.length === 0) {
    return <p className="empty-message">Nenhuma etapa cadastrada.</p>;
  }

  return (
    <div className="timeline">
      {etapas.map((etapa, idx) => {
        const isActive = etapa.status === StatusEtapa.ANDAMENTO;
        const isDone = etapa.status === StatusEtapa.CONCLUIDA;

        return (
          <div
            key={idx}
            className={`timeline-item ${isActive ? 'timeline-item--active' : ''} ${isDone ? 'timeline-item--done' : ''}`}
          >
            <div className="timeline-marker">
              <div className="timeline-dot">
                {isDone ? '✓' : isActive ? '▶' : idx + 1}
              </div>
              {idx < etapas.length - 1 && <div className="timeline-line" />}
            </div>

            <div className="timeline-content">
              <div className="timeline-header">
                <h4 className="timeline-title">{etapa.nome}</h4>
                <StatusBadge status={etapa.status} />
              </div>
              <p className="timeline-prazo">Prazo: {etapa.prazo}</p>

              {etapa.funcionarios.length > 0 && funcionariosMap && (
                <div className="timeline-team">
                  <span className="timeline-team-label">Equipe:</span>
                  {etapa.funcionarios.map((fId) => (
                    <span key={fId} className="timeline-team-member">
                      {funcionariosMap[fId] || fId}
                    </span>
                  ))}
                </div>
              )}

              <div className="timeline-actions">
                {etapa.status === StatusEtapa.PENDENTE && onIniciar && (
                  <button
                    className="btn btn--small btn--primary"
                    onClick={() => onIniciar(idx)}
                  >
                    ▶ Iniciar
                  </button>
                )}
                {etapa.status === StatusEtapa.ANDAMENTO && onConcluir && (
                  <button
                    className="btn btn--small btn--success"
                    onClick={() => onConcluir(idx)}
                  >
                    ✓ Concluir
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
