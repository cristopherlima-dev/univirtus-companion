import { UnivirtusDB } from "./schema";
import { seedFaseAtual } from "./seed";

export const db = new UnivirtusDB();

/**
 * Idempotente: se já existe curso no banco, não faz nada.
 * Chamar no boot do app (uma vez, client-side).
 */
export async function ensureSeed(): Promise<void> {
  const cursoCount = await db.cursos.count();
  if (cursoCount > 0) return;
  await seedFaseAtual(db);
}

export { UnivirtusDB };