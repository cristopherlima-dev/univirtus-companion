import { db } from "./index";
import type { Curso, Fase, Disciplina } from "@/types";

const uid = () => crypto.randomUUID();

// Curso fixo no MVP. Suporte a múltiplos cursos fica como melhoria futura.
const CURSO_PADRAO = {
  codigo: "6990",
  nome: "Tecnologia em Gestão da Tecnologia da Informação",
} as const;

/**
 * Garante que o curso padrão existe e retorna seu id.
 * Idempotente — chama quando criar a primeira fase.
 */
async function getOrCreateCursoPadrao(): Promise<string> {
  const existing = await db.cursos
    .where("codigo").equals(CURSO_PADRAO.codigo)
    .first();
  if (existing) return existing.id;

  const curso: Curso = {
    id: uid(),
    codigo: CURSO_PADRAO.codigo,
    nome: CURSO_PADRAO.nome,
    criadoEm: new Date(),
  };
  await db.cursos.add(curso);
  return curso.id;
}

// ============ FASE ============

export interface CriarFaseInput {
  nome: string;
  inicio: Date;
  fim: Date;
}

export async function criarFase(input: CriarFaseInput): Promise<string> {
  return db.transaction("rw", [db.cursos, db.fases], async () => {
    const cursoId = await getOrCreateCursoPadrao();

    // Singleton no MVP: só uma fase ativa por vez. Se já existe alguma,
    // desativa antes de criar a nova. Trocar de fase ativa "for free"
    // até a gente fazer a tela dedicada de trocar fase.
    const ativas = await db.fases.filter((f) => f.ativa).toArray();
    for (const f of ativas) {
      await db.fases.update(f.id, { ativa: false });
    }

    const fase: Fase = {
      id: uid(),
      cursoId,
      nome: input.nome,
      inicio: input.inicio,
      fim: input.fim,
      ativa: true,
      criadaEm: new Date(),
    };
    await db.fases.add(fase);
    return fase.id;
  });
}

export interface AtualizarFaseInput {
  nome?: string;
  inicio?: Date;
  fim?: Date;
}

export async function atualizarFase(
  id: string,
  patch: AtualizarFaseInput,
): Promise<void> {
  await db.fases.update(id, patch);
}

// ============ DISCIPLINA ============

export interface CriarDisciplinaInput {
  faseId: string;
  nome: string;
  cor?: string;
}

export async function criarDisciplina(
  input: CriarDisciplinaInput,
): Promise<string> {
  return db.transaction("rw", db.disciplinas, async () => {
    // Próxima ordem = max(ordem) + 1, ou 0 se for a primeira.
    const existentes = await db.disciplinas
      .where("faseId").equals(input.faseId)
      .toArray();
    const proximaOrdem = existentes.reduce(
      (max, d) => Math.max(max, d.ordem),
      -1,
    ) + 1;

    const disciplina: Disciplina = {
      id: uid(),
      faseId: input.faseId,
      nome: input.nome,
      cor: input.cor,
      ordem: proximaOrdem,
      criadaEm: new Date(),
    };
    await db.disciplinas.add(disciplina);
    return disciplina.id;
  });
}

export interface AtualizarDisciplinaInput {
  nome?: string;
  cor?: string;
}

export async function atualizarDisciplina(
  id: string,
  patch: AtualizarDisciplinaInput,
): Promise<void> {
  await db.disciplinas.update(id, patch);
}

/**
 * Apaga disciplina + todos seus temas + todas suas avaliações em cascata,
 * tudo numa transação. Se algo falhar, nada é apagado.
 */
export async function deletarDisciplina(id: string): Promise<void> {
  await db.transaction(
    "rw",
    [db.disciplinas, db.temas, db.avaliacoes],
    async () => {
      await db.temas.where("disciplinaId").equals(id).delete();
      await db.avaliacoes.where("disciplinaId").equals(id).delete();
      await db.disciplinas.delete(id);
    },
  );
}

// ============ RESET ============

/**
 * Apaga TODO o banco. Útil pra dev/testes.
 * Remover ou esconder atrás de um menu de configurações no Chat 9.
 */
export async function resetarBanco(): Promise<void> {
  await db.transaction(
    "rw",
    [db.cursos, db.fases, db.disciplinas, db.temas, db.avaliacoes, db.eventos],
    async () => {
      await Promise.all([
        db.cursos.clear(),
        db.fases.clear(),
        db.disciplinas.clear(),
        db.temas.clear(),
        db.avaliacoes.clear(),
        db.eventos.clear(),
      ]);
    },
  );
}