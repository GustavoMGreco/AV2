import { StatusEtapa, StatusPeca, ResultadoTeste } from '../types';

type BadgeStatus = StatusEtapa | StatusPeca | ResultadoTeste | string;

interface StatusBadgeProps {
  status: BadgeStatus;
}

function getVariant(status: BadgeStatus): string {
  switch (status) {
    case StatusEtapa.CONCLUIDA:
    case StatusPeca.PRONTA:
    case ResultadoTeste.APROVADO:
      return 'success';
    case StatusEtapa.ANDAMENTO:
    case StatusPeca.EM_TRANSPORTE:
      return 'warning';
    case StatusEtapa.PENDENTE:
    case StatusPeca.EM_PRODUCAO:
      return 'info';
    case ResultadoTeste.REPROVADO:
      return 'danger';
    default:
      return 'info';
  }
}

function formatLabel(status: BadgeStatus): string {
  return String(status).replace(/_/g, ' ');
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${getVariant(status)}`}>
      {formatLabel(status)}
    </span>
  );
}
