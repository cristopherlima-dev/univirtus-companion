"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useFaseAtual,
  useDisciplinas,
  useProgressoTemas,
} from "@/lib/db/hooks";
import { deletarDisciplina, resetarBanco } from "@/lib/db/mutations";
import { DisciplinaCard } from "@/components/DisciplinaCard";
import { FaseFormSheet } from "@/components/FaseFormSheet";
import { DisciplinaFormSheet } from "@/components/DisciplinaFormSheet";
import type { Disciplina } from "@/types";

export default function DisciplinasPage() {
  const fase = useFaseAtual();
  const disciplinas = useDisciplinas(fase?.id);
  const progresso = useProgressoTemas(fase?.id);

  const [faseSheetOpen, setFaseSheetOpen] = useState(false);
  const [discSheetOpen, setDiscSheetOpen] = useState(false);
  const [discEditando, setDiscEditando] = useState<Disciplina | undefined>(
    undefined,
  );

  const carregando =
    fase === undefined ||
    disciplinas === undefined ||
    progresso === undefined;

  async function handleDeletarDisciplina(d: Disciplina) {
    const ok = window.confirm(
      `Excluir "${d.nome}"?\n\nIsso também vai apagar todos os temas e avaliações dessa disciplina. A ação não pode ser desfeita.`,
    );
    if (!ok) return;
    try {
      await deletarDisciplina(d.id);
    } catch (err) {
      console.error("[deletar disciplina]", err);
      window.alert("Erro ao excluir. Tente novamente.");
    }
  }

  async function handleResetar() {
    const ok = window.confirm(
      "Apagar TODOS os dados do app?\n\nIsso remove a fase, disciplinas, temas, avaliações e eventos. A ação não pode ser desfeita.",
    );
    if (!ok) return;
    try {
      await resetarBanco();
    } catch (err) {
      console.error("[resetar]", err);
      window.alert("Erro ao resetar. Tente novamente.");
    }
  }

  function abrirNovaDisciplina() {
    setDiscEditando(undefined);
    setDiscSheetOpen(true);
  }

  function abrirEditarDisciplina(d: Disciplina) {
    setDiscEditando(d);
    setDiscSheetOpen(true);
  }

  return (
    <div className="p-4 pb-24">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Matérias</h1>
          {fase && (
            <p className="mt-1 text-sm text-muted-foreground">
              {fase.nome}
              <br />
              {format(fase.inicio, "dd/MM", { locale: ptBR })} →{" "}
              {format(fase.fim, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          )}
        </div>
        {fase && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFaseSheetOpen(true)}
              aria-label="Editar fase"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={abrirNovaDisciplina}
              aria-label="Adicionar disciplina"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </header>

      {carregando ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : !fase ? (
        <EmptyStateNenhumaFase onCriarFase={() => setFaseSheetOpen(true)} />
      ) : disciplinas.length === 0 ? (
        <EmptyStateNenhumaDisciplina onAdicionar={abrirNovaDisciplina} />
      ) : (
        <ul className="space-y-3">
          {disciplinas.map((d) => {
            const p = progresso[d.id] ?? { total: 0, concluidos: 0 };
            return (
              <li key={d.id}>
                <DisciplinaCard
                  disciplina={d}
                  total={p.total}
                  concluidos={p.concluidos}
                  onEdit={() => abrirEditarDisciplina(d)}
                  onDelete={() => handleDeletarDisciplina(d)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {/*
        Botão de reset pra facilitar testes. Move pra tela de configurações
        no Chat 9 (polimento + backup) ou esconde atrás de gesto/atalho.
      */}
      <div className="mt-12 border-t pt-4">
        <button
          type="button"
          onClick={handleResetar}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
        >
          Resetar dados (dev)
        </button>
      </div>

      <FaseFormSheet
        open={faseSheetOpen}
        onOpenChange={setFaseSheetOpen}
        fase={fase}
      />
      {fase && (
        <DisciplinaFormSheet
          open={discSheetOpen}
          onOpenChange={setDiscSheetOpen}
          faseId={fase.id}
          disciplina={discEditando}
        />
      )}
    </div>
  );
}

function EmptyStateNenhumaFase({
  onCriarFase,
}: {
  onCriarFase: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Você ainda não tem uma fase cadastrada.
      </p>
      <Button className="mt-4" onClick={onCriarFase}>
        Criar fase
      </Button>
    </div>
  );
}

function EmptyStateNenhumaDisciplina({
  onAdicionar,
}: {
  onAdicionar: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Sua fase ainda não tem disciplinas.
      </p>
      <Button className="mt-4" onClick={onAdicionar}>
        Adicionar disciplina
      </Button>
    </div>
  );
}