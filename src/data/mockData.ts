import {
  type Aeronave,
  type Funcionario,
  TipoAeronave,
  NivelPermissao,
  StatusEtapa,
  StatusPeca,
  TipoPeca,
  TipoTeste,
  ResultadoTeste,
} from '../types';

// ============================================================
// Dados mock iniciais
// ============================================================

export const MOCK_FUNCIONARIOS: Funcionario[] = [];

export const MOCK_AERONAVES: Aeronave[] = [
  {
    codigo: 'AC-001',
    modelo: 'AeroJet 500',
    tipo: TipoAeronave.COMERCIAL,
    capacidade: 180,
    alcance: 5500,
    pecas: [
      { nome: 'Turbina Principal', tipo: TipoPeca.IMPORTADA, fornecedor: 'Rolls-Royce', status: StatusPeca.PRONTA },
      { nome: 'Fuselagem Frontal', tipo: TipoPeca.NACIONAL, fornecedor: 'Embraer Parts', status: StatusPeca.PRONTA },
      { nome: 'Sistema de Navegação', tipo: TipoPeca.IMPORTADA, fornecedor: 'Honeywell', status: StatusPeca.EM_TRANSPORTE },
    ],
    etapas: [
      { nome: 'Montagem da Fuselagem', prazo: '30 dias', status: StatusEtapa.CONCLUIDA, funcionarios: [] },
      { nome: 'Instalação de Motores', prazo: '15 dias', status: StatusEtapa.ANDAMENTO, funcionarios: [] },
      { nome: 'Acabamento Interno', prazo: '20 dias', status: StatusEtapa.PENDENTE, funcionarios: [] },
    ],
    testes: [
      { tipo: TipoTeste.ELETRICO, resultado: ResultadoTeste.APROVADO },
    ],
  },
  {
    codigo: 'MIL-002',
    modelo: 'Falcon X-20',
    tipo: TipoAeronave.MILITAR,
    capacidade: 4,
    alcance: 8200,
    pecas: [
      { nome: 'Radar Avançado', tipo: TipoPeca.IMPORTADA, fornecedor: 'Northrop Grumman', status: StatusPeca.EM_PRODUCAO },
      { nome: 'Blindagem Tática', tipo: TipoPeca.NACIONAL, fornecedor: 'DefensaTech BR', status: StatusPeca.EM_PRODUCAO },
    ],
    etapas: [
      { nome: 'Estrutura Base', prazo: '45 dias', status: StatusEtapa.CONCLUIDA, funcionarios: [] },
      { nome: 'Sistemas de Armas', prazo: '30 dias', status: StatusEtapa.PENDENTE, funcionarios: [] },
    ],
    testes: [],
  },
];
