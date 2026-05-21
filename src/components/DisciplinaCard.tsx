"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Disciplina } from "@/types";

interface DisciplinaCardProps {
  disciplina: Disciplina;
  total: number;
  concluidos: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DisciplinaCard({
  disciplina,
  total,
  concluidos,
  onEdit,
  onDelete,
}: DisciplinaCardProps) {
  const pct = total === 0 ? 0 : Math.round((concluidos / total) * 100);
  const cor = disciplina.cor ?? "var(--foreground)";
  const showActions = Boolean(onEdit || onDelete);

  return (
    // Os botões editar/excluir ficam num overlay absoluto IRMÃO do <Link>,
    // não dentro dele — colocar <button> dentro de <a> é HTML inválido.
    <div className="relative">
      <Link
        href={`/disciplinas/${disciplina.id}`}
        className="block rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50 active:bg-muted"
        aria-label={`${disciplina.nome}, ${concluidos} de ${total} temas concluídos`}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: cor }}
            aria-hidden
          />
          <div className={`min-w-0 flex-1 ${showActions ? "pr-16" : ""}`}>
            <h2 className="font-medium leading-tight text-foreground">
              {disciplina.nome}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {concluidos}/{total} {total === 1 ? "tema" : "temas"}
            </p>
            <div
              className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full transition-[width] duration-300"
                style={{ width: `${pct}%`, backgroundColor: cor }}
              />
            </div>
          </div>
        </div>
      </Link>

      {showActions && (
        <div className="absolute right-2 top-2 flex gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-md bg-background/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Editar ${disciplina.nome}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md bg-background/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Excluir ${disciplina.nome}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}