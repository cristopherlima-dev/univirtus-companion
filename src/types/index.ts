// Univirtus Companion — Domain types
// Produto em pt-BR, código em inglês (mas nomes do domínio em pt para
// bater com a UI sem ficar traduzindo no meio do caminho).

export type TemaStatus = "nao_iniciada" | "em_progresso" | "concluida";

export type TemaKind =
  | "conteudo"            // Temas 1..5
  | "na_pratica"
  | "finalizando"
  | "videoaula_completa"
  | "slides"
  | "livro"
  | "plano_ensino";

export type TipoAvaliacao =
  | "apol1"
  | "apol2"
  | "prova_mista"
  | "trabalho"
  | "substitutiva";

export type TipoEvento = "avaliativo" | "servico" | "feriado";

export interface Curso {
  id: string;
  codigo: string;          // ex.: "6990"
  nome: string;
  criadoEm: Date;
}

export interface Fase {
  id: string;
  cursoId: string;
  nome: string;            // ex.: "B Fase I 2026 — Regular"
  inicio: Date;
  fim: Date;
  ativa: boolean;
  criadaEm: Date;
}

export interface Disciplina {
  id: string;
  faseId: string;
  nome: string;
  cor?: string;            // hex opcional pra distinguir nas listas
  ordem: number;
  criadaEm: Date;
}

export interface Tema {
  id: string;
  disciplinaId: string;
  titulo: string;          // "Tema 1", "Na Prática", "Slides", ...
  kind: TemaKind;
  ordem: number;
  status: TemaStatus;
  vistoEm?: Date;          // setado quando vira "concluida"
  observacoes?: string;
}

export interface Avaliacao {
  id: string;
  disciplinaId: string;
  tipo: TipoAvaliacao;
  titulo: string;          // "APOL Objetiva 1", "Prova Mista", ...
  peso: number;            // 0..100
  tentativasMaximas?: number;
  tentativasUsadas?: number;
  dataAbertura?: Date;
  dataLimite: Date;        // o que alimenta o alerta
  nota?: number;           // 0..100
  concluida: boolean;
  observacoes?: string;
}

export interface EventoCalendario {
  id: string;
  titulo: string;
  tipo: TipoEvento;
  inicio: Date;
  fim?: Date;              // undefined = evento de um dia só
  horario?: string;        // "19:00" opcional
  descricao?: string;
  avaliacaoId?: string;    // link opcional pra avaliação
}