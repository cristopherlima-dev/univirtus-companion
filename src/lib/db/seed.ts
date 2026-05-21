import type { UnivirtusDB } from "./schema";
import type {
  Curso,
  Fase,
  Disciplina,
  Tema,
  Avaliacao,
  TemaKind,
  TipoAvaliacao,
} from "@/types";

const uid = () => crypto.randomUUID();

// Estrutura padrão de cada disciplina no Univirtus (B Fase I 2026).
const TEMAS_PADRAO: Array<{ titulo: string; kind: TemaKind }> = [
  { titulo: "Tema 1", kind: "conteudo" },
  { titulo: "Tema 2", kind: "conteudo" },
  { titulo: "Tema 3", kind: "conteudo" },
  { titulo: "Tema 4", kind: "conteudo" },
  { titulo: "Tema 5", kind: "conteudo" },
  { titulo: "Na Prática", kind: "na_pratica" },
  { titulo: "Finalizando", kind: "finalizando" },
  { titulo: "Videoaula Completa", kind: "videoaula_completa" },
  { titulo: "Slides", kind: "slides" },
  { titulo: "Livro da Disciplina", kind: "livro" },
  { titulo: "Plano de Ensino", kind: "plano_ensino" },
];

const DISCIPLINAS_FASE: Array<{ nome: string; cor: string }> = [
  { nome: "Ferramentas de Desenvolvimento Web", cor: "#2563eb" },
  { nome: "Formação Cidadã Contemporânea", cor: "#16a34a" },
  { nome: "Produção Textual", cor: "#db2777" },
  { nome: "Formação Inicial em Educação a Distância", cor: "#ea580c" },
];

/**
 * Placeholders de datas. Ajustar no Chat 5 quando sair o cronograma real
 * da Uninter para cada APOL/Prova. Fase vai de 13/04/2026 a 21/06/2026.
 */
function avaliacoesPadrao(faseFim: Date): Array<{
  tipo: TipoAvaliacao;
  titulo: string;
  peso: number;
  tentativasMaximas?: number;
  dataLimite: Date;
}> {
  return [
    {
      tipo: "apol1",
      titulo: "APOL Objetiva 1",
      peso: 15,
      tentativasMaximas: 3,
      dataLimite: new Date(2026, 4, 10), // 10/05/2026 — placeholder
    },
    {
      tipo: "apol2",
      titulo: "APOL Objetiva 2",
      peso: 15,
      tentativasMaximas: 3,
      dataLimite: new Date(2026, 5, 7), // 07/06/2026 — placeholder
    },
    {
      tipo: "prova_mista",
      titulo: "Prova Mista (presencial)",
      peso: 70,
      dataLimite: faseFim, // 21/06/2026
    },
  ];
}

export async function seedFaseAtual(db: UnivirtusDB): Promise<void> {
  const agora = new Date();

  const curso: Curso = {
    id: uid(),
    codigo: "6990",
    nome: "Tecnologia em Gestão da Tecnologia da Informação",
    criadoEm: agora,
  };

  const fase: Fase = {
    id: uid(),
    cursoId: curso.id,
    nome: "B Fase I 2026 — Regular",
    inicio: new Date(2026, 3, 13), // 13/04/2026 (mês 0-indexado)
    fim: new Date(2026, 5, 21),    // 21/06/2026
    ativa: true,
    criadaEm: agora,
  };

  const disciplinas: Disciplina[] = DISCIPLINAS_FASE.map((d, i) => ({
    id: uid(),
    faseId: fase.id,
    nome: d.nome,
    cor: d.cor,
    ordem: i,
    criadaEm: agora,
  }));

  const temas: Tema[] = disciplinas.flatMap((disc) =>
    TEMAS_PADRAO.map((t, i) => ({
      id: uid(),
      disciplinaId: disc.id,
      titulo: t.titulo,
      kind: t.kind,
      ordem: i,
      status: "nao_iniciada" as const,
    })),
  );

  const avaliacoes: Avaliacao[] = disciplinas.flatMap((disc) =>
    avaliacoesPadrao(fase.fim).map((a) => ({
      id: uid(),
      disciplinaId: disc.id,
      tipo: a.tipo,
      titulo: a.titulo,
      peso: a.peso,
      tentativasMaximas: a.tentativasMaximas,
      tentativasUsadas: 0,
      dataLimite: a.dataLimite,
      concluida: false,
    })),
  );

  await db.transaction(
    "rw",
    [db.cursos, db.fases, db.disciplinas, db.temas, db.avaliacoes],
    async () => {
      await db.cursos.add(curso);
      await db.fases.add(fase);
      await db.disciplinas.bulkAdd(disciplinas);
      await db.temas.bulkAdd(temas);
      await db.avaliacoes.bulkAdd(avaliacoes);
    },
  );
}