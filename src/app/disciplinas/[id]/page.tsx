"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useDisciplina } from "@/lib/db/hooks";

export default function DisciplinaDetalhePage() {
  const params = useParams<{ id: string }>();
  const disciplina = useDisciplina(params.id);

  return (
    <div className="p-4">
      <Link
        href="/disciplinas"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {disciplina === undefined ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : disciplina === null || !disciplina ? (
        <p className="text-sm text-muted-foreground">
          Disciplina não encontrada.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {disciplina.cor && (
              <div
                className="h-4 w-1.5 rounded-full"
                style={{ backgroundColor: disciplina.cor }}
                aria-hidden
              />
            )}
            <h1 className="text-2xl font-bold tracking-tight">
              {disciplina.nome}
            </h1>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Em breve: checklist de aulas (Chat 4).
          </p>
        </>
      )}
    </div>
  );
}