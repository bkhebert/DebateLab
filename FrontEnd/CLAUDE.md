# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This covers the `FrontEnd/` service specifically. For how this fits into the wider DebateLab monorepo (BackEnd, Extension, cross-service contract), see the root `../CLAUDE.md`.

## Commands

- `npm run dev` — Vite dev server on port 5173.
- `npm run build` — `tsc -b && vite build`.
- `npm run lint` — ESLint (`typescript-eslint` recommended + `react-hooks` + `react-refresh` rules, see `eslint.config.js`).
- `npm run preview` — preview the production build on port 4173.
- No test runner is configured (no vitest/jest in `package.json`). There is no single-test command because there are no tests.

## The most important gotcha: API base URL

`src/constants/constant.ts` hardcodes which backend the app talks to via a manually-toggled boolean — **not an environment variable**:

```ts
const isDevelopment = false // toggle this value
```

This switches between `http://localhost:3000` and the deployed Render backend URL. To develop against a local backend, flip this to `true` — and flip it back to `false` before committing/pushing, since there's no build-time guard against shipping it pointed at localhost. If you're touching this repeatedly, consider proposing a `VITE_API_URL` env var instead (flag it as a suggested improvement rather than changing it silently, since it changes the dev workflow).

**Standing rule: `isDevelopment` must be `false` in every commit that reaches `main` / gets pushed.** Before any push, verify this value — a stray `true` here silently points the deployed frontend at `localhost:3000`, which breaks production. Check it as the last step before `git push`, every time, no exceptions.

## Architecture

### Routing and layout
`src/App.tsx` is the single source of truth for routes — all routes are declared flat here, there's no nested router or layout-per-route convention. The layout is fixed: `Header` + a 12-column grid with `LeftSideBar`/`RightSideBar` always mounted around the routed content (`<Routes>`). If you add a new page, add a `<Route>` here; if it needs a different layout (e.g. no sidebars), that's a structural change to `App.tsx`, not something you configure per-route.

### State management
Plain React Context, no Redux/Zustand/React Query:
- `src/contexts/AuthContext.tsx` — user session, login/signup/logout, token verification on mount.
- `src/contexts/DarkModeContext.tsx` — theme toggle.

Local/derived state lives in hooks (`src/hooks/usePosts.ts`, `useAllPosts.ts`) or component state — there's no global store for posts/messages/etc.

### Data fetching — inconsistent, match what's there
Two patterns coexist in this codebase:
- Raw `fetch` (e.g. `AuthContext.tsx` calls `/jwt/auth/*` endpoints directly).
- Axios via the wrapper in `src/utils/apiClient.ts` (`axiosClient` with an auth-header interceptor, plus a `apiClient.get/post/put/delete` helper object).

When adding a new API call, match whichever pattern the surrounding file already uses rather than introducing a third approach. If starting fresh (new feature, no existing convention in that file), prefer `apiClient`/`axiosClient` since it already handles the auth header automatically.

### Auth token storage
JWT is stored in **`sessionStorage`** (not `localStorage`) via `src/utils/tokenManager.ts`, under key `debatelab_jwt_token`. It's attached as `Authorization: Bearer <token>` — both `AuthContext`'s raw `fetch` calls and `apiClient`/`axiosClient` read it from the same `tokenManager`. Because it's `sessionStorage`, a session ends when the tab closes — that's a deliberate-looking choice, not a bug, but worth knowing if you're debugging "why did I get logged out."

### Styling: Tailwind v3 is active, v4 packages are inert
`package.json` has both v3 (`tailwindcss ^3.4.17`, `tailwind.config.ts`, `postcss.config.ts`) and v4 (`@tailwindcss/vite`, `@tailwindcss/postcss`) packages installed. Only v3 is actually wired up — `vite.config.ts` registers only `react()`, no Tailwind Vite plugin. **Don't assume Tailwind v4 syntax or behavior applies.** If you want to actually migrate to v4, that's a deliberate change to `vite.config.ts` (add the plugin, remove the PostCSS config) — flag it rather than assuming the v4 packages are already doing something.

### UI components
`src/components/ui/` follows shadcn/ui conventions — Radix primitives (`@radix-ui/react-label`, `-separator`, `-slot`) + `class-variance-authority` + `tailwind-merge`, configured via `components.json`. Prefer composing from these primitives over writing new one-off styled elements when a suitable one exists (`Button`, `Card`, `Input`, `Label`, `Separator`).

### 3D (niche)
`three`, `@react-three/fiber`, `@react-three/drei`, `@mapbox/tilebelt` are installed and used in `src/components/3DFeed.tsx`. This is a small, specific corner of the app — don't assume 3D tooling conventions apply elsewhere.

## Frontend ↔ backend contract (see root CLAUDE.md for full detail)
No shared types package or generated client. Request/response shapes are hand-duplicated on each side — e.g. the `User` interface in `AuthContext.tsx` mirrors the backend's Sequelize `User` model by hand. If you change a field on the backend, you must manually find and update the corresponding frontend type(s); there's no compiler check tying them together.

## Conventions
- PascalCase for components and views (`src/components/`, `src/views/`).
- Hooks prefixed `use*` in `src/hooks/`.
- Error handling: `console.error` + boolean/null return values from async functions, not thrown errors — match this pattern rather than introducing try/catch-and-throw in existing files.
