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