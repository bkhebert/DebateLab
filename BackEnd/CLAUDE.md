# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This covers the `BackEnd/` service specifically. For how this fits into the wider DebateLab monorepo (FrontEnd, Extension, cross-service contract), see the root `../CLAUDE.md`.

## Commands

- `npm run dev` — start with `ts-node-dev --respawn` (hot reload) on `src/index.ts`.
- `npm run build` — `tsc` compile to `dist-server/`, **then automatically runs `npm run seed`** (seeds an anonymous user). This means `build` has a side effect beyond compiling — don't run it expecting a clean, no-op compile.
- `npm start` — run compiled output from `dist-server/index.js`.
- `npm run type-check` — `tsc --noEmit`.
- `npm test` — **not implemented**. The script just echoes an error and exits 1. `src/test/test.ts` exists but is empty. There is no test suite and no single-test command — if you add tests, you're establishing the pattern from scratch.

## Architecture

### Entry point and route groups
`src/index.ts` is the single Express entry point. Three route groups are mounted:
- `/api/*` → `src/routes/index.ts`, which composes per-domain routers (`ai`, `beliefs`, `politicalPhilosophy`, `profile`, `admin`, `school`, `message`, `rate-limit`, `generators`).
- `/jwt/auth/*` → `src/jwtAuth/jwtAuthRoutes.ts` (signup/signin/logout/verify).
- `/extension/ai` → `src/routes/extensionai.ts`, used only by the Chrome extension in `../Extension/` (CORS explicitly allowlists the extension's `chrome-extension://` origins alongside `CLIENT_ORIGIN`/`CLIENT_ORIGIN_WWW`).

When adding a new feature area, add a new router file in `src/routes/` and mount it in `src/routes/index.ts` — that's the established pattern.

### Database: no migrations
On boot, `database.sync({ alter: true })` runs against Postgres (`src/database/db.ts`). **There are no Sequelize migrations in this project.** Schema changes happen by editing a model file and letting `alter: true` reconcile the table on next boot. Be careful with destructive column changes (renames, type changes, drops) — there's no rollback path, and `alter: true` can behave unexpectedly on production data. If you're making a schema change that could lose data, flag it explicitly before running it against anything but a throwaway local DB.

### Data model
Defined per-file in `src/database/models/`, but **associations are wired centrally in `src/database/models/index.ts`** — read that file, not the individual model files, to understand relationships between models.

Key models:
- `User` — has `googleId` column but no OAuth flow is implemented anywhere; treat as reserved for future use, not a working feature.
- `Message` — belongsTo `User` as `author`; has a free-text `topic` string field, **not** a foreign key to the `Topic` model.
- `Reply` — belongsTo `Message`; self-referential `parent`/`children` for threaded replies.
- `PoliticalView` — 1:1 with `User` via email (not the `id` FK).
- `UserPhilosophy`, `Fallacy`, `Download` — the latter two are counters backing the Fallacy Checker's stats display.
- `Topic` — defined but **not associated to anything** in `models/index.ts`. Treat as unfinished/dead unless you're the one wiring it up properly (e.g. giving `Message` a real `topicId` FK).

There is currently no Argument/Vote/Position model — argument ranking and position-tracking (mentioned in the product vision) are not yet implemented in the schema. If asked to build these, you're designing new models, not extending existing ones.

### Auth
Custom JWT auth (`bcrypt` + `jsonwebtoken`), not session-based, not OAuth. Access tokens carry `{ userId, tokenVersion }` (`src/jwtAuth/jwtAuth.ts`). `src/jwtAuth/isAuthenticated.ts` middleware:
1. Verifies signature + expiry.
2. Loads the user from DB.
3. Rejects if `user.tokenVersion` no longer matches the token's `tokenVersion` — this is the mechanism for server-side token invalidation (e.g. logout-everywhere, password change), not just standard signature/expiry checking.

If you need to invalidate all outstanding tokens for a user, increment `tokenVersion` on that `User` row.

### The Fallacy Checker (`POST /api/ai/fact`, `src/routes/ai.ts`)
Current flagship feature, shown on the frontend home page. Calls Google's Gemini (`@google/genai`, model `gemini-2.0-flash`) with a prompt asking for fact-checking + fallacy detection. Rate-limited via Redis to 5 requests/day/IP (`src/middleware/rateLimit.ts`, `src/utils/redis.ts`).

The model's response is expected as fenced JSON and parsed with `text.slice(7, -3)` to strip the markdown fence before `JSON.parse`. This is brittle — it assumes a fixed fence format (` ```json\n...\n``` `-style wrapping of a specific length). If you touch the prompt or upgrade the Gemini model, verify this slicing still produces valid JSON; consider replacing it with a proper fence-stripping regex if you're in this code anyway.

Set `TEST_AI=true` to bypass the real Gemini call and get a canned response — use this for local dev to avoid burning API quota or hitting the rate limiter during iteration.

### Environment variables
No `.env.example` exists (`.env` is gitignored). Variables referenced in source: `CLIENT_ORIGIN`, `CLIENT_ORIGIN_WWW`, `DATABASE_URL`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, `DB_SKIP`, `DB_USER`, `GOOGLE_GEN_AI_KEY`, `JWT_EXPIRES_IN`, `JWT_SECRET`, `NODE_DEV`, `NODE_ENV`, `PORT`, `REDIS_URL`, `SKIP_DB`, `TEST_AI`.

## Conventions
- PascalCase for Sequelize model files and table names.
- One route file per domain, composed in `src/routes/index.ts`.
- Error handling: try/catch → `console.error` → generic `res.status(...).json({ error })`. No centralized error middleware.
- Logging is plain `console.log`/`console.error` — no structured logger. `routes/ai.ts` in particular has verbose debug logging left in; follow that density if extending it, or clean it up if it's in your way.
