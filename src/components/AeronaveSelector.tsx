import { useData } from '../context/DataContext';

interface AeronaveSelectorProps {
  value: string;
  onChange: (codigo: string) => void;
  label?: string;
}

export default function AeronaveSelector({
  value,
  onChange,
  label = 'Selecione a Aeronave',
}: AeronaveSelectorProps) {
  const { aeronaves } = useData();

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Selecione --</option>
        {aeronaves.map((a) => (
          <option key={a.codigo} value={a.codigo}>
            {a.codigo} — {a.modelo} ({a.tipo})
          </option>
        ))}
      </select>
    </div>
  );
}
