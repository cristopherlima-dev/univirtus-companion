"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { criarDisciplina, atualizarDisciplina } from "@/lib/db/mutations";
import { cn } from "@/lib/utils";
import type { Disciplina } from "@/types";

interface DisciplinaFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faseId: string;
  disciplina?: Disciplina;
}

// Paleta fixa pra manter consistência visual. Color picker nativo
// (input type="color") tem UX ruim em mobile.
const CORES_DISPONIVEIS = [
  "#2563eb", // azul
  "#16a34a", // verde
  "#db2777", // rosa
  "#ea580c", // laranja
  "#7c3aed", // roxo
  "#0891b2", // ciano
  "#dc2626", // vermelho
  "#ca8a04", // amarelo
] as const;

export function DisciplinaFormSheet({
  open,
  onOpenChange,
  faseId,
  disciplina,
}: DisciplinaFormSheetProps) {
  const editando = Boolean(disciplina);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState<string>(CORES_DISPONIVEIS[0]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setNome(disciplina?.nome ?? "");
    setCor(disciplina?.cor ?? CORES_DISPONIVEIS[0]);
    setErro(null);
  }, [open, disciplina]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("Informe o nome da disciplina.");
      return;
    }

    setSalvando(true);
    try {
      if (editando && disciplina) {
        await atualizarDisciplina(disciplina.id, {
          nome: nome.trim(),
          cor,
        });
      } else {
        await criarDisciplina({
          faseId,
          nome: nome.trim(),
          cor,
        });
      }
      onOpenChange(false);
    } catch (err) {
      console.error("[criar/atualizar disciplina]", err);
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>
            {editando ? "Editar disciplina" : "Nova disciplina"}
          </SheetTitle>
          <SheetDescription>
            {editando
              ? "Atualize o nome e a cor da disciplina."
              : "Os temas e avaliações serão cadastrados depois, na tela de detalhe da disciplina."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="disc-nome">Nome</Label>
            <Input
              id="disc-nome"
              type="text"
              placeholder="Ex: Ferramentas de Desenvolvimento Web"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {CORES_DISPONIVEIS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCor(c)}
                  className={cn(
                    "relative h-9 w-9 rounded-full transition-transform",
                    cor === c
                      ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                      : "hover:scale-105",
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Cor ${c}`}
                  aria-pressed={cor === c}
                >
                  {cor === c && (
                    <Check
                      className="absolute inset-0 m-auto h-4 w-4 text-white"
                      strokeWidth={3}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <SheetFooter className="flex-row gap-2">
            <Button type="submit" disabled={salvando} className="flex-1">
              {salvando ? "Salvando..." : editando ? "Salvar" : "Criar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={salvando}
              className="flex-1"
            >
              Cancelar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}