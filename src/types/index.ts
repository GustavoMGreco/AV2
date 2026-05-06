// ============================================================
// AEROCODE — Tipos e Enums
// ============================================================

export enum TipoAeronave {
  COMERCIAL = 'COMERCIAL',
  MILITAR = 'MILITAR',
}

export enum NivelPermissao {
  ADMINISTRADOR = 'ADMINISTRADOR',
  ENGENHEIRO = 'ENGENHEIRO',
  OPERADOR = 'OPERADOR',
}

export enum StatusEtapa {
  PENDENTE = 'PENDENTE',
  ANDAMENTO = 'ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
}

export enum StatusPeca {
  EM_PRODUCAO = 'EM_PRODUCAO',
  EM_TRANSPORTE = 'EM_TRANSPORTE',
  PRONTA = 'PRONTA',
}

export enum TipoPeca {
  NACIONAL = 'NACIONAL',
  IMPORTADA = 'IMPORTADA',
}

export enum TipoTeste {
  ELETRICO = 'ELETRICO',
  HIDRAULICO = 'HIDRAULICO',
  AERODINAMICO = 'AERODINAMICO',
}

export enum ResultadoTeste {
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
}

// ============================================================
// Interfaces
// ============================================================

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;
}

export interface Peca {
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;
}

export interface Etapa {
  nome: string;
  prazo: string;
  status: StatusEtapa;
  funcionarios: string[]; // IDs dos funcionários
}

export interface Teste {
  tipo: TipoTeste;
  resultado: ResultadoTeste;
}

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
}

export interface Relatorio {
  cliente: string;
  dataEntrega: string;
  conteudoDocumento: string;
  nomeArquivo: string;
}
