# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo shape

DebateLab is a debate/argument platform: users post topics/arguments, get them analyzed for logical fallacies by an LLM, and reply in threads. This is **three independent, unrelated projects in one repo** — there is no root `package.json` and no workspace tooling (no npm/pnpm/yarn workspaces, no Turborepo/Nx). Always `cd` into the relevant folder before running any command.

- `BackEnd/` — Express + TypeScript API, PostgreSQL/Sequelize, Redis. See `BackEnd/CLAUDE.md` for commands and architecture.
- `FrontEnd/` — React 19 + TypeScript + Vite SPA. See `FrontEnd/CLAUDE.md` for commands and architecture.
- `Extension/` — plain-JS Chrome MV3 extension (no build step, no package.json), talks to the backend's `/extension/ai` routes.

There is no CI config in this repo and no `.env.example`. Each service reads its config from a gitignored `.env`.

**Working in `BackEnd/` or `FrontEnd/`?** Read that folder's `CLAUDE.md` first — it has the service-specific commands, architecture, and gotchas. This file covers only what spans both.

## Cross-cutting architecture

### How frontend and backend talk to each other
`FrontEnd/src/constants/constant.ts` hardcodes which backend the app targets via a manually-toggled boolean (`isDevelopment`), **not an environment variable** — see `FrontEnd/CLAUDE.md` for the exact mechanics. This is the single most important thing to know before doing full-stack local dev: you must flip that value to point at `localhost:3000`, and flip it back before committing.

There is no shared types package or generated client between the two services. Request/response shapes are hand-duplicated on each side (e.g. the `User` interface in `FrontEnd/src/contexts/AuthContext.tsx` mirrors the backend's Sequelize `User` model by hand). If you change a field on one side, you must manually find and update the other — there's no compiler check tying them together.

CORS (`BackEnd/src/index.ts`) explicitly allowlists `localhost:5173` in dev and the `chrome-extension://` origins used by `Extension/`, alongside `CLIENT_ORIGIN`/`CLIENT_ORIGIN_WWW` env vars in production.

Auth is JWT-based: the backend issues a token on `/jwt/auth/signin`, the frontend stores it in `sessionStorage` and attaches it as `Authorization: Bearer <token>` on subsequent requests. Full detail on both sides is in the respective service `CLAUDE.md`.

### The Fallacy Checker
The current flagship feature (shown on the frontend home page): users submit text, the backend calls Google Gemini to detect logical fallacies and rewrite the message, and the result is displayed with a fallacy breakdown. Frontend entry: `FrontEnd/src/components/AnalyzerCard.tsx`. Backend endpoint: `POST /api/ai/fact` (`BackEnd/src/routes/ai.ts`). See `BackEnd/CLAUDE.md` for the implementation detail and its known fragility.

### Data model status
The schema currently supports users, messages, and threaded replies — but **not** the argument-ranking, position-tracking, or reputation features described in the product vision. If asked to build those, you're designing new models, not extending existing ones. Full model breakdown is in `BackEnd/CLAUDE.md`.

## Conventions (both services)
- Error handling is `try/catch`/`console.error` + a plain status/JSON response or boolean return — no centralized error handling or thrown-error pattern on either side.
- Logging is plain `console.log`/`console.error` throughout — no structured logger anywhere in the repo.
