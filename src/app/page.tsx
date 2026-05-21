"use client";

import { useFaseAtual, useDisciplinas } from "@/lib/db/hooks";

export default function HojePage() {
  const fase = useFaseAtual();
  const disciplinas = useDisciplinas(fase?.id);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold tracking-tight">Hoje</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Em breve: prazos da semana e continue de onde parou.
      </p>

      {/* SMOKE TEST — remover no Chat 6 quando esta tela for implementada */}
      <div className="mt-6 rounded-md border p-3 text-xs space-y-1">
        <div><span className="font-semibold">fase:</span> {fase?.nome ?? "carregando..."}</div>
        <div><span className="font-semibold">disciplinas:</span> {disciplinas?.length ?? "-"}</div>
        <div><span className="font-semibold">início:</span> {fase?.inicio.toLocaleDateString("pt-BR") ?? "-"}</div>
        <div><span className="font-semibold">fim:</span> {fase?.fim.toLocaleDateString("pt-BR") ?? "-"}</div>
      </div>
    </div>
  );
}