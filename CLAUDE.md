# CLAUDE.md — Hono + React Monorepo Conventions

## Monorepo layout

- `apps/backend/` — Hono API (`@node-monorepo/backend`), ESM, `module: "NodeNext"`
- `apps/frontend/` — React 19 (`@node-monorepo/frontend`), ESM, `moduleResolution: "bundler"`
- npm workspaces, `"type": "module"` everywhere

## Skills

When asked to add features, tests, or schema changes, read the relevant skill first:

- `.claude/skills/add-backend-feature/` — new API feature with CRUD endpoints
- `.claude/skills/add-frontend-feature/` — new frontend pages, components, stores (also read its `stores-templates.md`, `components-templates.md`, `pages-templates.md`)
- `.claude/skills/add-backend-tests/` — integration tests with DSL pattern
- `.claude/skills/add-db-schema/` — database table changes and migrations
- `.claude/skills/review-code/` — code review against project conventions

## Import rules (most common mistake)

| Context  | Alias | Resolves to       | `.js` extension? |
| -------- | ----- | ----------------- | ---------------- |
| Backend  | `#/`  | `./src/`          | **YES, always**  |
| Frontend | `@/`  | `./src/`          | No               |
| Frontend | `#/`  | `../backend/src/` | No               |

Backend uses NodeNext — every import MUST end with `.js`. Frontend uses bundler — never add `.js`.

## TypeScript

- `verbatimModuleSyntax: true` — use `import type` for type-only imports (both apps). Backend will fail to compile if you forget `type` on type-only imports
- Named exports only (no default exports except framework-required like `App.tsx`)
- `strict: true` in base config
- **Zod v4** — use `z.uuidv7()`, not `z.string().uuid()`. Validation errors use `z.core.$ZodIssue[]`

## Formatting & linting

- Prettier: `singleQuote: true`, `trailingComma: 'es5'`, `arrowParens: 'avoid'`, `endOfLine: 'crlf'` (Windows line endings)
- ESLint: flat config, TS recommended + Prettier
- Run: `npm run lint:format`

## Commits

Conventional Commits: `<type>(<scope>): <subject>`

- Scopes: `backend`, `frontend`, `repo`
- Subject: sentence-case or lower-case
- **Do NOT include** `Co-Authored-By` lines in commit messages

## Feature file structure

Backend features: `apps/backend/src/features/<entities>/` — one file per endpoint (`add-*.ts`, `get-*.ts`, `edit-*.ts`, `list-*.ts`) + `routes.ts` aggregator + `<entity>.ts` table + `schemas.ts`

Frontend features: `apps/frontend/src/features/<entities>/` — three subdirs: `components/`, `pages/`, `stores/`

## Backend key patterns

- Each endpoint = `new Hono()` sub-app (not handler functions)
- `zValidator` from `#/validator.js` (custom wrapper, not raw `@hono/zod-validator`)
- `StatusCodes` enum from `http-status-codes` (never raw numbers)
- Errors: RFC 9457 Problem Details via helpers in `#/extensions.js`
- DB: Drizzle ORM, `pgSchema('..._schema')` tables (not `pgTable()`), UUIDv7 via `v7()` from `uuid`
- Pagination: `createPage()` + `paginationSchema` from `#/pagination.js`

## Frontend key patterns

- `useSuspenseQuery` (never `useQuery`) for data fetching
- Triple-layer: `QueryErrorResetBoundary` > `ErrorBoundary` > `Suspense`
- Forms: React Hook Form `Controller` + `zodResolver` (never `register()`)
- Fields: `Field`, `FieldLabel`, `FieldError` from `@/components/ui/field`
- Auth: Clerk `getToken()` passed to every API call
- Pagination via URL search params (`?page=N`)
- shadcn/ui New York style, Tailwind CSS v4, Lucide icons

## Testing

- **`node:test`** module (not Jest, Vitest, or Mocha) — `describe()`, `test()`, `assert`
- **`testClient(app)`** from `hono/testing` (not supertest or raw fetch)
- DSL pattern per feature: factory functions, overloaded action functions, fluent assertion builders
- Test files: `apps/backend/tests/features/<entities>/`

## DB schema change workflow

1. Edit table in `apps/backend/src/features/<entities>/<entity>.ts`
2. Re-export from `apps/backend/src/database/schemas.ts` (required for Drizzle Kit discovery)
3. Update Zod schemas in `schemas.ts` to stay in sync
4. Generate: `npm run database:generate -w @node-monorepo/backend`
5. Migrate: `npm run database:migrate -w @node-monorepo/backend`

## Common commands

```bash
npm run dev                  # Start both apps
npm test -w @node-monorepo/backend  # Run backend tests (node:test)
npm run database:generate -w @node-monorepo/backend  # Generate migrations
npm run database:migrate -w @node-monorepo/backend   # Apply migrations
npm run lint:format          # Fix lint + format
```

## Docker

- `docker-compose.yml` defines: `database` (PostgreSQL), `migrator`, `api`, `seq` (logging)
- Database connection: `postgresql://myuser:mypassword@localhost:5432/mydb`
- Backend `.env.example` has all required environment variables
