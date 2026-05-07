import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  type Aeronave,
  type Funcionario,
  type Peca,
  type Etapa,
  type Teste,
  type Relatorio,
  StatusPeca,
  StatusEtapa,
  NivelPermissao,
} from '../types';
import { MOCK_AERONAVES, MOCK_FUNCIONARIOS } from '../data/mockData';

interface DataContextType {
  aeronaves: Aeronave[];
  funcionarios: Funcionario[];

  // Aeronave
  cadastrarAeronave: (aeronave: Aeronave) => string | null;
  getAeronave: (codigo: string) => Aeronave | undefined;

  // Funcionário
  cadastrarFuncionario: (func: Funcionario) => string | null;
  editarFuncionario: (id: string, dados: Partial<Funcionario>) => string | null;
  excluirFuncionario: (id: string) => string | null;

  // Peças
  adicionarPeca: (codigoAeronave: string, peca: Peca) => string | null;
  atualizarStatusPeca: (codigoAeronave: string, pecaIndex: number, novoStatus: StatusPeca) => string | null;

  // Etapas
  adicionarEtapa: (codigoAeronave: string, etapa: Etapa) => string | null;
  iniciarEtapa: (codigoAeronave: string, etapaIndex: number) => string | null;
  concluirEtapa: (codigoAeronave: string, etapaIndex: number) => string | null;

  // Alocação
  alocarFuncionario: (codigoAeronave: string, etapaIndex: number, funcId: string) => string | null;

  // Testes
  registrarTeste: (codigoAeronave: string, teste: Teste) => string | null;

  // Relatórios
  gerarRelatorio: (codigoAeronave: string, cliente: string, dataEntrega: string) => Relatorio | string;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([...MOCK_AERONAVES]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([...MOCK_FUNCIONARIOS]);

  // ---- AERONAVE ----
  const cadastrarAeronave = useCallback((aeronave: Aeronave): string | null => {
    // Validação de unicidade síncrona
    if (aeronaves.some((a) => a.codigo === aeronave.codigo)) {
      return 'Código de aeronave já existe!';
    }
    setAeronaves((prev) => [...prev, aeronave]);
    return null;
  }, [aeronaves]);

  const getAeronave = useCallback(
    (codigo: string) => aeronaves.find((a) => a.codigo === codigo),
    [aeronaves]
  );

  // ---- FUNCIONÁRIO ----
  const cadastrarFuncionario = useCallback((func: Funcionario): string | null => {
    if (funcionarios.some((f) => f.id === func.id)) {
      return 'ID de funcionário já existe!';
    }
    if (funcionarios.some((f) => f.usuario === func.usuario)) {
      return 'Nome de usuário já existe!';
    }
    setFuncionarios((prev) => [...prev, func]);
    return null;
  }, [funcionarios]);

  const editarFuncionario = useCallback((id: string, dados: Partial<Funcionario>): string | null => {
    const func = funcionarios.find((f) => f.id === id);
    if (!func) return 'Funcionário não encontrado!';

    // Validar unicidade de novo ID se alterado
    if (dados.id && dados.id !== id && funcionarios.some((f) => f.id === dados.id)) {
      return 'ID de funcionário já existe!';
    }
    // Validar unicidade de novo login se alterado
    if (dados.usuario && dados.usuario !== func.usuario && funcionarios.some((f) => f.usuario === dados.usuario)) {
      return 'Nome de usuário já existe!';
    }

    setFuncionarios((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...dados } : f))
    );
    return null;
  }, [funcionarios]);

  const excluirFuncionario = useCallback((id: string): string | null => {
    if (!funcionarios.some((f) => f.id === id)) {
      return 'Funcionário não encontrado!';
    }
    // Remover funcionário das etapas de aeronaves em que está alocado
    setAeronaves((prev) =>
      prev.map((a) => ({
        ...a,
        etapas: a.etapas.map((et) => ({
          ...et,
          funcionarios: et.funcionarios.filter((fId) => fId !== id),
        })),
      }))
    );
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    return null;
  }, [funcionarios]);

  // ---- PEÇAS ----
  const adicionarPeca = useCallback((codigoAeronave: string, peca: Peca): string | null => {
    setAeronaves((prev) =>
      prev.map((a) =>
        a.codigo === codigoAeronave
          ? { ...a, pecas: [...a.pecas, peca] }
          : a
      )
    );
    return null;
  }, []);

  const atualizarStatusPeca = useCallback(
    (codigoAeronave: string, pecaIndex: number, novoStatus: StatusPeca): string | null => {
      setAeronaves((prev) =>
        prev.map((a) => {
          if (a.codigo !== codigoAeronave) return a;
          const novasPecas = [...a.pecas];
          if (pecaIndex < 0 || pecaIndex >= novasPecas.length) return a;
          novasPecas[pecaIndex] = { ...novasPecas[pecaIndex], status: novoStatus };
          return { ...a, pecas: novasPecas };
        })
      );
      return null;
    },
    []
  );

  // ---- ETAPAS ----
  const adicionarEtapa = useCallback((codigoAeronave: string, etapa: Etapa): string | null => {
    setAeronaves((prev) =>
      prev.map((a) =>
        a.codigo === codigoAeronave
          ? { ...a, etapas: [...a.etapas, etapa] }
          : a
      )
    );
    return null;
  }, []);

  const iniciarEtapa = useCallback((codigoAeronave: string, etapaIndex: number): string | null => {
    const aeronave = aeronaves.find((a) => a.codigo === codigoAeronave);
    if (!aeronave) return 'Aeronave não encontrada!';

    const etapas = aeronave.etapas;
    if (etapaIndex < 0 || etapaIndex >= etapas.length) return 'Etapa inválida!';
    if (etapas[etapaIndex].status !== StatusEtapa.PENDENTE) return 'Etapa não está pendente!';

    // Validar sequencial: todas as anteriores devem estar concluídas
    for (let i = 0; i < etapaIndex; i++) {
      if (etapas[i].status !== StatusEtapa.CONCLUIDA) {
        return `A etapa "${etapas[i].nome}" deve ser concluída antes!`;
      }
    }

    setAeronaves((prev) =>
      prev.map((a) => {
        if (a.codigo !== codigoAeronave) return a;
        const novasEtapas = [...a.etapas];
        novasEtapas[etapaIndex] = { ...novasEtapas[etapaIndex], status: StatusEtapa.ANDAMENTO };
        return { ...a, etapas: novasEtapas };
      })
    );
    return null;
  }, [aeronaves]);

  const concluirEtapa = useCallback((codigoAeronave: string, etapaIndex: number): string | null => {
    const aeronave = aeronaves.find((a) => a.codigo === codigoAeronave);
    if (!aeronave) return 'Aeronave não encontrada!';

    const etapas = aeronave.etapas;
    if (etapaIndex < 0 || etapaIndex >= etapas.length) return 'Etapa inválida!';
    if (etapas[etapaIndex].status !== StatusEtapa.ANDAMENTO) return 'Etapa não está em andamento!';

    setAeronaves((prev) =>
      prev.map((a) => {
        if (a.codigo !== codigoAeronave) return a;
        const novasEtapas = [...a.etapas];
        novasEtapas[etapaIndex] = { ...novasEtapas[etapaIndex], status: StatusEtapa.CONCLUIDA };
        return { ...a, etapas: novasEtapas };
      })
    );
    return null;
  }, [aeronaves]);

  // ---- ALOCAÇÃO ----
  const alocarFuncionario = useCallback(
    (codigoAeronave: string, etapaIndex: number, funcId: string): string | null => {
      const aeronave = aeronaves.find((a) => a.codigo === codigoAeronave);
      if (!aeronave) return 'Aeronave não encontrada!';
      if (etapaIndex < 0 || etapaIndex >= aeronave.etapas.length) return 'Etapa inválida!';

      const func = funcionarios.find((f) => f.id === funcId);
      if (!func) {
        return 'Funcionário não encontrado!';
      }

      // Bloquear administradores de serem alocados a tarefas/equipes
      if (func.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
        return 'Administradores não podem ser alocados a tarefas ou equipes!';
      }

      if (aeronave.etapas[etapaIndex].funcionarios.includes(funcId)) {
        return 'Funcionário já alocado nesta etapa!';
      }

      setAeronaves((prev) =>
        prev.map((a) => {
          if (a.codigo !== codigoAeronave) return a;
          const novasEtapas = [...a.etapas];
          novasEtapas[etapaIndex] = {
            ...novasEtapas[etapaIndex],
            funcionarios: [...novasEtapas[etapaIndex].funcionarios, funcId],
          };
          return { ...a, etapas: novasEtapas };
        })
      );
      return null;
    },
    [aeronaves, funcionarios]
  );

  // ---- TESTES ----
  const registrarTeste = useCallback((codigoAeronave: string, teste: Teste): string | null => {
    setAeronaves((prev) =>
      prev.map((a) =>
        a.codigo === codigoAeronave
          ? { ...a, testes: [...a.testes, teste] }
          : a
      )
    );
    return null;
  }, []);

  // ---- RELATÓRIOS ----
  const gerarRelatorio = useCallback(
    (codigoAeronave: string, cliente: string, dataEntrega: string): Relatorio | string => {
      const aeronave = aeronaves.find((a) => a.codigo === codigoAeronave);
      if (!aeronave) return 'Aeronave não encontrada!';

      const todasConcluidas = aeronave.etapas.length > 0 && aeronave.etapas.every(
        (e) => e.status === StatusEtapa.CONCLUIDA
      );
      if (!todasConcluidas) return 'Todas as etapas devem estar concluídas para emitir o relatório!';

      const linhas = [
        '═══════════════════════════════════════════════════════════════',
        '             RELATÓRIO FINAL DE ENTREGA - AEROCODE',
        '═══════════════════════════════════════════════════════════════',
        '',
        'DADOS COMERCIAIS',
        '----------------------------------------',
        `   Cliente: ${cliente}`,
        `   Data de Entrega: ${dataEntrega}`,
        `Código:     ${aeronave.codigo}`,
        `Modelo:     ${aeronave.modelo}`,
        `Tipo:       ${aeronave.tipo}`,
        '',
        'ESPECIFICAÇÕES DA AERONAVE',
        '----------------------------------------',
        `Capacidade: ${aeronave.capacidade} passageiros`,
        `Alcance:    ${aeronave.alcance} km`,
        '',
        'PEÇAS UTILIZADAS',
        '----------------------------------------',
        ...aeronave.pecas.map(
          (p, i) => `   ${i + 1}. ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}`
        ),
        '',
        'TESTES DE QUALIDADE',
        '----------------------------------------',
        ...aeronave.testes.map(
          (t, i) => `   ${i + 1}. ${t.tipo} → ${t.resultado}`
        ),
        '',
        'CRONOGRAMA DE MANUFATURA',
        ...aeronave.etapas.map(
          (e, i) => `   ${i + 1}. ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status}`
        ),
        '',
        '═══════════════════════════════════════════════════════════════',
        `   Documento gerado automaticamente pelo sistema AEROCODE`,
        `   Data de geração: ${new Date().toLocaleDateString('pt-BR')}`,
        '═══════════════════════════════════════════════════════════════',
      ];

      const conteudo = linhas.join('\n');

      const relatorio: Relatorio = {
        cliente,
        dataEntrega,
        conteudoDocumento: conteudo,
        nomeArquivo: `Relatorio_Aeronave_${aeronave.codigo}.txt`,
      };

      return relatorio;
    },
    [aeronaves]
  );

  return (
    <DataContext.Provider
      value={{
        aeronaves,
        funcionarios,
        cadastrarAeronave,
        getAeronave,
        cadastrarFuncionario,
        editarFuncionario,
        excluirFuncionario,
        adicionarPeca,
        atualizarStatusPeca,
        adicionarEtapa,
        iniciarEtapa,
        concluirEtapa,
        alocarFuncionario,
        registrarTeste,
        gerarRelatorio,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
