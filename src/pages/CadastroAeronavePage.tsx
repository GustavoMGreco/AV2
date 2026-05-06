import { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { TipoAeronave } from '../types';
import { showToast } from '../components/Toast';

export default function CadastroAeronavePage() {
  const { cadastrarAeronave } = useData();

  const [codigo, setCodigo] = useState('');
  const [modelo, setModelo] = useState('');
  const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL);
  const [capacidade, setCapacidade] = useState('');
  const [alcance, setAlcance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !modelo || !capacidade || !alcance) {
      showToast('error', 'Preencha todos os campos!');
      return;
    }

    const err = cadastrarAeronave({
      codigo: codigo.trim(),
      modelo: modelo.trim(),
      tipo,
      capacidade: Number(capacidade),
      alcance: Number(alcance),
      pecas: [],
      etapas: [],
      testes: [],
    });

    if (err) {
      showToast('error', err);
    } else {
      showToast('success', `Aeronave ${codigo} cadastrada com sucesso!`);
      setCodigo('');
      setModelo('');
      setTipo(TipoAeronave.COMERCIAL);
      setCapacidade('');
      setAlcance('');
    }
  };

  return (
    <div className="page">
      <Header title="Cadastrar Aeronave" subtitle="Registrar nova aeronave no sistema" />

      <div className="glass-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Código *</label>
              <input
                className="form-input"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: AC-003"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Modelo *</label>
              <input
                className="form-input"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: AeroJet 700"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Aeronave *</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-option ${tipo === TipoAeronave.COMERCIAL ? 'type-option--active' : ''}`}
                onClick={() => setTipo(TipoAeronave.COMERCIAL)}
              >
                <span className="type-option-icon"></span>
                <span className="type-option-label">Comercial</span>
              </button>
              <button
                type="button"
                className={`type-option ${tipo === TipoAeronave.MILITAR ? 'type-option--active' : ''}`}
                onClick={() => setTipo(TipoAeronave.MILITAR)}
              >
                <span className="type-option-icon"></span>
                <span className="type-option-label">Militar</span>
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Capacidade (passageiros) *</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                placeholder="Ex: 180"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alcance (km) *</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={alcance}
                onChange={(e) => setAlcance(e.target.value)}
                placeholder="Ex: 5500"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Cadastrar Aeronave
          </button>
        </form>
      </div>
    </div>
  );
}
