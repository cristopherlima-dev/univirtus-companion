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
import { criarFase, atualizarFase } from "@/lib/db/mutations";
import type { Fase } from "@/types";

interface FaseFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fase?: Fase;
}

// Conversões manuais Date <-> "YYYY-MM-DD" pra evitar o pulo de timezone
// que rola ao usar toISOString() em UTC-3 (Date local pode virar dia anterior).
function dateToInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function inputValueToDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function FaseFormSheet({ open, onOpenChange, fase }: FaseFormSheetProps) {
  const editando = Boolean(fase);
  const [nome, setNome] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Repopula o form sempre que abre (cobre tanto criar quanto editar)
  useEffect(() => {
    if (!open) return;
    setNome(fase?.nome ?? "");
    setInicio(fase ? dateToInputValue(fase.inicio) : "");
    setFim(fase ? dateToInputValue(fase.fim) : "");
    setErro(null);
  }, [open, fase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("Informe o nome da fase.");
      return;
    }
    if (!inicio || !fim) {
      setErro("Informe as datas de início e fim.");
      return;
    }

    const inicioDate = inputValueToDate(inicio);
    const fimDate = inputValueToDate(fim);

    if (fimDate < inicioDate) {
      setErro("A data de fim precisa ser depois da data de início.");
      return;
    }

    setSalvando(true);
    try {
      if (editando && fase) {
        await atualizarFase(fase.id, {
          nome: nome.trim(),
          inicio: inicioDate,
          fim: fimDate,
        });
      } else {
        await criarFase({
          nome: nome.trim(),
          inicio: inicioDate,
          fim: fimDate,
        });
      }
      onOpenChange(false);
    } catch (err) {
      console.error("[criar/atualizar fase]", err);
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>{editando ? "Editar fase" : "Criar fase"}</SheetTitle>
          <SheetDescription>
            {editando
              ? "Atualize os dados da fase em curso."
              : "Cadastre a fase em que você está estudando agora."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="fase-nome">Nome</Label>
            <Input
              id="fase-nome"
              type="text"
              placeholder="Ex: B Fase I 2026 — Regular"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fase-inicio">Início</Label>
              <Input
                id="fase-inicio"
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fase-fim">Fim</Label>
              <Input
                id="fase-fim"
                type="date"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
              />
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