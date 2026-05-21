# Arquitetura — Univirtus Companion

## Visão geral

App **mobile-first PWA**, **offline-first**, sem backend. Tudo roda no navegador do usuário; dados ficam no IndexedDB. Deploy estático na Vercel apenas para servir os assets via HTTPS (requisito do service worker).

## Estrutura de pastas (alvo)

```
univirtus-companion/
├── PLAN.md
├── ARCHITECTURE.md
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sw.js              (gerado pelo Serwist)
├── src/
│   ├── app/               (App Router)
│   │   ├── layout.tsx     (shell + bottom nav)
│   │   ├── page.tsx       (Hoje)
│   │   ├── disciplinas/
│   │   ├── calendario/
│   │   └── notas/
│   ├── components/
│   │   ├── ui/            (shadcn)
│   │   └── ...
│   ├── lib/
│   │   ├── db/            (Dexie schema + hooks)
│   │   ├── utils.ts
│   │   └── seed.ts
│   └── types/
└── ...
```

## Convenções

- **Componentes:** PascalCase (`DisciplinaCard.tsx`). Hooks: `useNomeDoHook.ts`. Utilitários: kebab-case.
- **Imports:** alias `@/` aponta para `src/`.
- **Estilos:** só Tailwind. Sem CSS solto. Tokens via `tailwind.config.ts`.
- **Datas:** sempre `date-fns` (não Moment, não Day.js). Locale `pt-BR`.
- **IDs:** `crypto.randomUUID()`.
- **Idioma do produto:** português (BR). Código em inglês.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).

## Modelo de dados (resumo — detalhes no Chat 2)

- `Curso` — singleton no MVP (só Tec. Gestão TI).
- `Fase` — singleton no MVP (só fase atual).
- `Disciplina` — pertence à fase.
- `Tema` — pertence à disciplina; tem ordem e status (não-iniciada / em-progresso / concluída).
- `Avaliacao` — pertence à disciplina; tipo (APOL1, APOL2, PROVA, TRABALHO), peso, datas, nota opcional.
- `EventoCalendario` — independente; tipo (avaliativo, serviço, feriado), datas.

## Princípios de UI

- **Mobile-first.** Largura base 360–390px. Desktop é "adapta" mas não é o foco.
- **Bottom nav** com 4 itens: Hoje, Matérias, Calendário, Notas.
- **Sem login.** Os dados são do dispositivo. Backup manual via export JSON (Chat 9).
- **Acessível.** Contraste mínimo AA. Tudo navegável por teclado mesmo sendo mobile-first.
- **Português em tudo que o usuário vê.**

## O que NÃO está no escopo

- Backend, contas, sync entre dispositivos.
- Scraping ou automação do Univirtus.
- Histórico de fases anteriores.
- Notas oficiais da Uninter (o app não puxa nota; o usuário digita).
- Multi-usuário.
- Simulador de notas (removido em 2026-05-20).