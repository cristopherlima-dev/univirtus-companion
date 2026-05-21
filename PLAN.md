# Univirtus Companion — Plano do projeto

App PWA mobile-first para acompanhar o calendário acadêmico, matérias da fase, prazos de avaliações (APOL 1, APOL 2, Prova Mista, Trabalhos) e progresso de aulas vistas no Univirtus (Uninter).

**Escopo:** apenas a fase atual. Sem histórico de fases anteriores no MVP.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Dexie.js (IndexedDB) — storage offline-first, sem backend no MVP
- Serwist — service worker / PWA
- Vercel — deploy

## Como trabalhamos

Cada funcionalidade vira **um chat dedicado** no Claude (Project com este repo como conhecimento). Antes de começar um chat novo, atualize a tabela abaixo com o que foi feito. O Claude lê este arquivo e sabe onde paramos.

## Roadmap (uma funcionalidade por chat)

**Funcionalidades-âncora deste projeto:** alertas de prazos (pra não perder APOL/Prova) e checklist de aulas (pra organização diária). Tudo o resto é suporte a essas duas.

| # | Chat | Status | Notas |
|---|------|--------|-------|
| 1 | Setup do projeto + PWA shell | ⏳ próximo | Next.js, Tailwind, shadcn/ui, Serwist, manifest, deploy inicial |
| 2 | Modelagem de dados + storage local | ⏳ | Schema Dexie, hooks de acesso, seed da fase B 2026 |
| 3 | Onboarding + tela de Disciplinas | ⏳ | Cadastro curso → fase → disciplinas → temas |
| 4 | **Checklist de aulas** (âncora) | ⏳ | Detalhe da disciplina, marcar temas como vistos, progresso |
| 5 | Avaliações e prazos | ⏳ | CRUD APOL 1/2, Prova, Trabalhos, urgência calculada |
| 6 | Dashboard "Hoje" | ⏳ | Prazos da semana, continue de onde parou, resumo |
| 7 | Calendário acadêmico | ⏳ | Vista mensal + lista, import de .ics |
| 8 | **Alertas e notificações** (âncora) | ⏳ | Web Push, lembretes configuráveis (3d/1d/no dia), badge de prazos no app |
| 9 | Polimento + backup | ⏳ | Refinos visuais, export/import JSON dos dados |
| 10+ | Iterações | ⏳ | Anotações por aula, tempo de estudo, etc. |

**Legenda:** ✅ feito · 🟡 em andamento · ⏳ próximo · ⏸️ pausado

## Decisões registradas

- **2026-05-20** — Stack escolhida: Next 15 + TS + Tailwind + shadcn + Dexie + Serwist + Vercel.
- **2026-05-20** — Sem backend no MVP. Tudo no IndexedDB do dispositivo. Sync entre dispositivos fica para depois (Supabase).
- **2026-05-20** — Escopo: só fase atual. Sem histórico.
- **2026-05-20** — Sem scraping/automação do Univirtus. Entrada manual + import de .ics no Chat 7.
- **2026-05-20** — Removido Simulador de notas do escopo. Funcionalidades-âncora são alertas de prazos e checklist de aulas.

## Dados reais da fase atual (para seed no Chat 2)

- **Curso:** Tecnologia em Gestão da Tecnologia da Informação (6990)
- **Fase atual:** B Fase I 2026 — Regular
- **Período:** 13/04/2026 a 21/06/2026
- **Disciplinas:**
  - Ferramentas de Desenvolvimento Web
  - Formação Cidadã Contemporânea
  - Produção Textual
  - Formação Inicial em Educação a Distância
- **Estrutura padrão de cada disciplina:** Temas 1–5, "Na Prática", "Finalizando", Videoaula Completa, Slides, Livro da Disciplina, Plano de Ensino.
- **Avaliações padrão:**
  - APOL Objetiva 1 — peso 15%, 3 tentativas
  - APOL Objetiva 2 — peso 15%, 3 tentativas
  - Prova Mista (presencial) — peso 70%
  - Segunda chamada / Substitutiva — Prova Mista, peso 70%