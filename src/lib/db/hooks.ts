"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./index";

export function useFaseAtual() {
  // singleton no MVP, mas usamos filter por segurança caso entre
  // mais de uma fase no banco no futuro.
  return useLiveQuery(
    () => db.fases.filter((f) => f.ativa).first(),
    [],
  );
}

export function useDisciplinas(faseId: string | undefined) {
  return useLiveQuery(
    async () => {
      if (!faseId) return [];
      return db.disciplinas
        .where("faseId").equals(faseId)
        .sortBy("ordem");
    },
    [faseId],
  );
}

export function useDisciplina(id: string | undefined) {
  return useLiveQuery(
    async () => (id ? db.disciplinas.get(id) : undefined),
    [id],
  );
}

export function useTemas(disciplinaId: string | undefined) {
  return useLiveQuery(
    async () => {
      if (!disciplinaId) return [];
      return db.temas
        .where("disciplinaId").equals(disciplinaId)
        .sortBy("ordem");
    },
    [disciplinaId],
  );
}

export function useAvaliacoes(disciplinaId: string | undefined) {
  return useLiveQuery(
    async () => {
      if (!disciplinaId) return [];
      return db.avaliacoes
        .where("disciplinaId").equals(disciplinaId)
        .sortBy("dataLimite");
    },
    [disciplinaId],
  );
}

export function useEventos() {
  return useLiveQuery(
    () => db.eventos.orderBy("inicio").toArray(),
    [],
  );
}

/**
 * Progresso agregado de todas as disciplinas de uma fase.
 * Retorna { [disciplinaId]: { total, concluidos } }.
 *
 * Feito em uma query só (anyOf) pra não disparar N hooks em loop
 * dentro do <DisciplinaCard/>. Reativo via useLiveQuery normalmente.
 */
export function useProgressoTemas(faseId: string | undefined) {
  return useLiveQuery(
    async () => {
      if (!faseId) return {};

      const disciplinas = await db.disciplinas
        .where("faseId").equals(faseId)
        .toArray();

      const ids = disciplinas.map((d) => d.id);
      if (ids.length === 0) return {};

      const temas = await db.temas
        .where("disciplinaId").anyOf(ids)
        .toArray();

      const result: Record<string, { total: number; concluidos: number }> = {};
      for (const id of ids) {
        result[id] = { total: 0, concluidos: 0 };
      }
      for (const tema of temas) {
        const entry = result[tema.disciplinaId];
        if (!entry) continue;
        entry.total += 1;
        if (tema.status === "concluida") entry.concluidos += 1;
      }
      return result;
    },
    [faseId],
  );
}