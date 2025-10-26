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
