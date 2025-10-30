Absolutely—here’s a drop-in replacement for **`.github/copilot-instructions.md`** that reflects the new **Next.js (App Router) mono-repo + Supabase** structure and our golf-games feature set.

---

# Golf Game Guru — Copilot Instructions (Mono-repo + Next.js + Supabase)

> **You are Copilot in VS Code.** Act as the front-end designer and full-stack assistant for a **TypeScript** mono-repo that powers a **mobile-first golf scoring app**. Propose and write high-quality code (with tests where logic is added). Follow these conventions without asking for confirmation unless absolutely necessary.

## What we’re building

* **App name:** Golf Game Guru
* **Platforms:** Web (mobile-first). Later: iOS/Android wrappers.
* **Core value:** Keep score and track side games (Snake, Nassau, Wolf, 6’s, Bingo-Bango-Bongo, Match Play) with gross/net and live standings.

## Tech stack

* **Mono-repo:** `pnpm` workspaces (`apps/*`, `packages/*`)
* **Frontend:** Next.js (App Router) + React + TypeScript, Tailwind CSS, shadcn/ui
* **Auth & Data:** Supabase (Postgres, Auth, RLS, Storage, optional Edge Functions)
* **Data fetching/state:** TanStack Query (React Query) + server actions where suitable
* **Validation:** Zod for all external inputs and server payloads
* **Testing:** Vitest + React Testing Library (components) + Playwright (e2e on core flows)
* **Lint/format:** ESLint, Prettier
* **CI:** GitHub Actions (lint, typecheck, test, build)

> **GHIN:** Optional text field for now. If an official API becomes available, implement behind a feature flag and mock in tests.

---

## Repository layout (target)

```
/
  apps/
    web/                 # Next.js app (App Router)
      src/
        app/             # routes (RSC)
          (auth)/sign-in/page.tsx
          dashboard/page.tsx
          round/new/page.tsx
          round/[id]/play/page.tsx
          round/[id]/results/page.tsx
          layout.tsx
          page.tsx
        components/
          ui/            # shadcn/ui components
          _domain/       # ScorePad, HoleHeader, GameBadges, etc.
        lib/
          supabaseClient.ts
          supabaseServer.ts
          queries/       # React Query hooks
          validation/    # Zod schemas
      public/
  packages/
    ui/                  # shared UI wrappers (optional)
    lib/                 # domain logic (handicap, game engines), pure functions
    supabase-types/      # generated TS types from Supabase
  supabase/
    migrations/          # SQL migrations + RLS
    seed/                # seed scripts (optional)
    functions/           # Edge Functions (TypeScript, optional)
  .github/
    copilot-instructions.md  # THIS FILE
    workflows/
  .vscode/
    settings.json
  pnpm-workspace.yaml
  package.json
  README.md
  .env.example
```

---

## Primary user flows (build in this order)

1. **Auth**

   * Sign in/up via **email** or **phone (OTP/magic link)** using Supabase Auth.
   * Basic profile capture (name, optional GHIN).

2. **Dashboard**

   * Logo, CTA **“Start a Round”**
   * Recent rounds list with status (In Progress / Completed).

3. **Create Round (host)**

   * Course selection (API later; manual entry allowed).
   * Tee Box (slope, rating).
   * Players (name, optional GHIN, handicap index).
   * Game selection: Snake, Nassau (2/4), Wolf, 6’s (4p), Bingo-Bango-Bongo, Match Play (indiv/teams).
   * Confirm → **Create Round**.

4. **Play / Score Entry (per hole)**

   * Sticky header: Hole #, Par, Yards, Stroke Index.
   * Per-player inputs: strokes, putts, GIR, fairway hit.
   * Game prompts per hole (e.g., Wolf call, BBB order, Snake 3-putt).
   * Live gross/net and game standings.
   * Fast keypad, swipe/Next/Prev.

5. **Results**

   * Leaderboards (gross/net), game outcomes, optional payouts.
   * Share/export (CSV/PDF later), duplicate round setup.

---

## Supabase model (high-level)

> Create SQL migrations with **RLS** scoped to `auth.uid()`. Generate TS types into `packages/supabase-types`.
### Golf Game Guru — Copilot instructions

Short goal: help contributors quickly make safe, small changes to this Vite + React + TypeScript app (shadcn-ui + Tailwind) and follow the app's conventions.

What this app is
- Single-page React app (Vite) that models golf rounds, players, and mini-games. Routing is in `src/App.tsx` and pages live in `src/pages/` (`Index`, `Setup`, `Round`, `Results`).
- Global state is implemented with a React context/reducer in `src/contexts/GameContext.tsx`. Prefer adding actions to that reducer for state changes that affect multiple components.

Key files you will cite in changes
- `src/contexts/GameContext.tsx` — central reducer, actions: CREATE_ROUND, UPDATE_ROUND, RECORD_SCORE, RESET_ROUND. Use provided helper functions (`setupNewRound`, `recordScore`, etc.) instead of mutating state directly.
- `src/pages/Setup.tsx` — multi-step UI that composes `CourseSetup`, `PlayerSetup`, and `GameSetup` components and calls `setupNewRound(...)` to start a round.
- `src/App.tsx` and `src/main.tsx` — app wiring: `QueryClientProvider`, `BrowserRouter`, `GameProvider`. Changes to providers or routes must keep the same wrapper order.
- `src/components/*` — UI components follow shadcn patterns and Tailwind classes; look for `ui/` primitives under `src/components/ui/`.
- `tsconfig.json` — path alias `@/*` -> `src/*`. Use `@/` imports where existing files do.

> Build / run / debug
- Install: use your usual package manager (repo originally scaffolded with npm/yarn). `npm i` is sufficient.
- Dev server: `npm run dev` (runs `vite`).
- Build: `npm run build` (`vite build`).
- Preview production build: `npm run preview`.

Project-specific patterns and rules
- State changes: favor the reducer actions in `GameContext` rather than ad-hoc useState across pages when change affects round or players. Look for `dispatch` uses in the file to mirror action shapes.
- ID generation: rounds use `id: `round-${Date.now()}` in `setupNewRound`. Keep IDs simple and consistent when adding tests or fixtures.
- Pages use React Router v6 (`Routes` + `Route element={...}`) — update routes in `src/App.tsx` if adding pages.
- UI components follow a small-primitive pattern (see `src/components/ui/*`). Reuse those primitives rather than adding raw Tailwind markup.

Examples to copy or edit
- To record a score from anywhere, call `const { recordScore } = useGame(); recordScore(playerId, hole, gross, net, gamePoints);` (see `GameContext.recordScore`).
- To start a round programmatically: `setupNewRound(courseId, players, games)` (see `src/pages/Setup.tsx`).

Tests and linting
- There are no tests in the repo by default. Keep changes small and add unit tests under a `__tests__` directory if you add logic in `utils/` or `contexts/`.
- Lint: `npm run lint` runs `eslint .`.

When to open a PR vs commit directly
- Small docs, copy fixes, or single-line UI tweaks: direct commits are fine for personal forks. For anything that changes app behavior (round logic, reducer actions, routing), open a PR with a short description and link to the files changed.

If you get stuck
- Check `src/contexts/GameContext.tsx` first for state flows.
- Check `tsconfig.json` for import aliases (`@/`).
- Ask the repo owner for preferred test strategy before adding large test suites.

If anything here is unclear or missing, tell me which area to expand (build, routing, state, UI primitives, or tests) and I will update this file.
* `profiles` — `id uuid pk`, `email`, `phone`, `name`, `ghin?`
* `courses` — `id`, `name`, `address?`
* `tee_boxes` — `id`, `course_id`, `name`, `slope int`, `rating numeric(4,1)`
* `holes` — `id`, `course_id`, `number int`, `par int`, `stroke_index int`
* `tee_yardages` — `id`, `hole_id`, `tee_box_id`, `yards int`
* `players` — `id`, `profile_id?`, `name`, `handicap_index numeric(4,1)`
* `rounds` — `id`, `course_id`, `tee_box_id`, `host_profile_id`, `started_at`, `status enum('in_progress','completed')`
* `round_players` — `id`, `round_id`, `player_id`, `playing_hcp numeric(4,1)`
* `scores` — `id`, `round_id`, `player_id`, `hole_id`, `strokes int`, `putts int`, `gir bool`, `fairway_hit bool`
* `games` — `id`, `round_id`, `type enum('snake','nassau','wolf','sixes','bbb','match_play')`, `config jsonb`
* `game_events` — `id`, `game_id`, `hole_id`, `payload jsonb`
* `payouts` — `id`, `round_id`, `player_id`, `amount_cents int`

**Policies**

* `select` limited to rounds where user is host or participant (`round_players` membership).
* `insert/update/delete` limited to host for round-scoped tables (players may update their own scores if host enables it).

---

## Local development options (pick one)

* **Supabase Local (recommended if using Auth/Storage/RLS/Edge)**

  * Use Supabase CLI to run the full stack locally.
  * Keep migrations in `supabase/migrations` and generate **types** into `packages/supabase-types`.

* **Plain Postgres via Docker (minimal DB only)**

  * Use if you do not need Supabase features locally (Auth/Storage).
  * Provide `DATABASE_URL` and keep SQL aligned with Supabase schema.

Copilot: when adding DB changes, create a migration and update types. Do **not** hardcode SQL in UI components.

---

## Coding conventions

* **TypeScript strict**; avoid `any`.
* **Zod** for all external payloads (forms, server actions, edge inputs).
* Prefer **server actions** for simple mutations; use **Edge Functions** for multi-step or service-role work.
* Domain logic (handicap, game engines) must be **pure** and live in `packages/lib` with **Vitest** unit tests.
* React components: small, composable, with a11y (labels, roles, focus).
* Data fetching with **React Query**; co-locate hooks in `apps/web/src/lib/queries/`.
* Keep UI fast: optimistic updates for score entry; debounce writes.

---

## Pages & components Copilot should (and may) generate

**Routes** (`apps/web/src/app/...`)

* `(auth)/sign-in/page.tsx` — email/phone OTP sign-in (Supabase)
* `dashboard/page.tsx` — recent rounds + CTA
* `round/new/page.tsx` — stepper: Course → Tee → Players → Games → Review
* `round/[id]/play/page.tsx` — hole header + ScorePad + game prompts
* `round/[id]/results/page.tsx` — leaderboards + game outcomes

**UI**

* `ScorePad`, `Keypad`, `HoleHeader`, `PlayerRow`, `GameBadge`, `StickyBar`, `Stepper`
* shadcn/ui wrappers (Button, Card, Tabs, Dialog, Sheet, Select, Badge, Input, Label)

**Domain (packages/lib)**

* Handicap: course handicap, playing handicap by tee slope/rating
* Net scoring per hole/round
* Game engines:

  * Nassau (front/back/overall; presses later)
  * Wolf (rotation, calls, points)
  * 6’s (team rotation every 6)
  * BBB (event order: first on / closest / first in)
  * Snake (3-putt transfer)
  * Match Play (indiv/teams; W/L/H)

Each engine must include **typed inputs/outputs** and **unit tests** with example scenarios.

---

## Env & config

* **Root** `.env.example`:

  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  NEXT_PUBLIC_APP_NAME="Golf Game Guru"
  ```
* **Supabase types** generation:

  ```
  supabase gen types typescript --project-id <ID> --schema public > packages/supabase-types/index.ts
  ```

---

## Commands (reference)

```bash
# Workspace
pnpm i
pnpm -r build
pnpm -r lint
pnpm -r typecheck
pnpm -r test

# Dev web
pnpm --filter @app/web dev

# Supabase local (if used)
supabase start
supabase db reset

# Types
supabase gen types typescript --project-id $SUPABASE_PROJECT_ID --schema public > packages/supabase-types/index.ts
```

---

## Testing (must-haves when adding logic)

* **Vitest**: pure domain functions (handicap, engines)
* **RTL**: ScorePad, Stepper, New Round flow UI states
* **Playwright**: Sign-in → Create Round → Enter scores → Results
* Run in CI; keep tests deterministic (seeded scenarios).

---

## Performance & offline

* Cache round state with React Query; consider persistence (IndexedDB) for spotty course connectivity.
* Prefetch next hole data; keep navigation instant.
* Batch/coalesce writes; debounce network calls.

---

## PR guidelines

* If code affects **round logic, scoring, DB schema, or routes**, open a PR with:

  * Description of change and user story
  * Screenshots for UI changes
  * Tests added/updated
  * Migration notes (if DB changed)

* Small docs/copy/style nits may be committed directly on a working branch.

---

## Copy & UX snippets (use in UI)

* **Tagline:** “Keep score. Track side games. Settle up—without math.”
* **CTA:** “Start a Round”
* **Empty dashboard:** “No rounds yet. Tap ‘Start a Round’ to set your course, players, and games.”
* **Players helper:** “Add your foursome. GHIN optional—enter handicaps manually if needed.”

---

## Nice-to-haves (post-MVP)

* Presses in Nassau, skins, stableford, quarters
* Team presets, payouts editor, exports
* Course search via 3rd-party API (feature flag)
* Real-time sync for group scoring

---

**End of Copilot instructions.**
Copilot: treat this file as the source of truth when generating code, tests, migrations, and docs for Golf Game Guru.

