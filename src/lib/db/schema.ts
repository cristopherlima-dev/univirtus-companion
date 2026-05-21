import Dexie, { type Table } from "dexie";
import type {
  Curso,
  Fase,
  Disciplina,
  Tema,
  Avaliacao,
  EventoCalendario,
} from "@/types";

export class UnivirtusDB extends Dexie {
  cursos!: Table<Curso, string>;
  fases!: Table<Fase, string>;
  disciplinas!: Table<Disciplina, string>;
  temas!: Table<Tema, string>;
  avaliacoes!: Table<Avaliacao, string>;
  eventos!: Table<EventoCalendario, string>;

  constructor() {
    super("univirtus-companion");

    // Strings de schema listam apenas chaves indexáveis (PK + índices),
    // não todos os campos do tipo. Outros campos viajam no value.
    this.version(1).stores({
      cursos: "id, codigo",
      fases: "id, cursoId",
      disciplinas: "id, faseId, ordem",
      temas: "id, disciplinaId, kind, status, ordem",
      avaliacoes: "id, disciplinaId, tipo, dataLimite, concluida",
      eventos: "id, tipo, inicio",
    });
  }
}