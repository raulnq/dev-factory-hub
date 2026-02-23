---
name: review-code
description: |
  Review code for adherence to project conventions, common mistakes, and best
  practices in this Hono + React monorepo. Triggers: "review this code,"
  "review the PR," "check my code," "does this follow conventions," "code review,"
  "review the changes," "review feature X."
---

# Review Code

Use this skill to review code (staged changes, a PR, or specific files) against project conventions.

## Workflow

1. Determine the scope: diff (`git diff`), staged (`git diff --cached`), PR (`gh pr diff`), or specific files
2. Read every changed file in full (not just the diff) to understand context
3. Run the checklist below against each file, grouped by category
4. Report findings as a numbered list with file path, line number, severity, and fix
5. End with a summary: total issues by severity, and an overall verdict (PASS / NEEDS FIXES)

## Severities

- **error** -- will cause build failure, runtime bug, or test failure; must fix
- **warning** -- convention violation or code smell; should fix
- **nit** -- style preference or minor improvement; optional

## Checklist

### Imports (most common mistake source)

- [ ] Backend files: every relative and `#/` import ends with `.js`
- [ ] Frontend files: no `.js` extensions on any import
- [ ] Backend uses `#/` alias (not `./src/` or `../`)
- [ ] Frontend uses `@/` for own src, `#/` for backend type imports
- [ ] Type-only imports use `import type` (`verbatimModuleSyntax: true`)
- [ ] No default exports (except framework-required: `App.tsx`, config files)

### TypeScript

- [ ] `strict` compliance: no `any`, no non-null assertions without justification
- [ ] Zod v4 patterns: `z.uuidv7()` not `z.string().uuid()`
- [ ] Zod validation errors typed as `z.core.$ZodIssue[]`

### Backend endpoints

- [ ] Each endpoint is a `new Hono()` sub-app, not a bare handler
- [ ] Validation uses `zValidator` from `#/validator.js`, not raw `@hono/zod-validator`
- [ ] Status codes use `StatusCodes` enum from `http-status-codes`, never raw numbers
- [ ] Error responses use helpers from `#/extensions.js` (`notFoundError`, etc.)
- [ ] Route aggregator in `routes.ts` uses `.basePath()` + `.route('/', ...)`
- [ ] New route registered in `apps/backend/src/app.ts`

### Database / Drizzle

- [ ] Tables use `pgSchema('<feature>_schema').table(...)`, not `pgTable()`
- [ ] Primary keys use `uuid` column + `v7()` from `uuid` package
- [ ] Table re-exported from `apps/backend/src/database/schemas.ts`
- [ ] Zod schemas in `schemas.ts` mirror Drizzle columns
- [ ] Migration generated if table changed (`npm run database:generate`)

### Backend advanced patterns

- [ ] State transition endpoints validate current status before transitioning, use `conflictError`
- [ ] Foreign key references verified before insert (return `notFoundError` if missing)
- [ ] Unique field constraints checked before insert (return `conflictError` for duplicates)
- [ ] Join queries use explicit column selection (not bare `.select()`)
- [ ] State transition endpoints use `POST /:id/<action>` pattern
- [ ] Delete endpoints return `StatusCodes.NO_CONTENT` via `c.body(null, StatusCodes.NO_CONTENT)` — not 200
- [ ] Delete endpoints with S3 files: delete from storage **before** deleting from database
- [ ] File upload endpoints validate MIME type, file size, and filename length via `.refine()` on `z.instanceof(File)`
- [ ] Nested resource endpoints validate parent existence before operating on child

### Frontend components

- [ ] Page owns the Card — form/view components only render fields inside `FormCardContent`/`ViewCardContent`
- [ ] Shared card components used: `FormCardHeader`/`FormCardContent`/`FormCardFooter` for forms, `ViewCardHeader`/`ViewCardContent`/`ViewCardFooter` for views, `ListCardHeader` for lists
- [ ] Search uses `<Entity>SearchBar` wrapping shared `SearchBar` component (not `<Entity>Search`)
- [ ] `FieldGroup` wraps form controllers, `FieldSeparator` divides form sections
- [ ] `<Entity>Skeleton.tsx` is a separate shared file (used by Edit + View pages)
- [ ] Error handling uses shared `ErrorFallback` from `@/components/ErrorFallback` with `message` prop (NOT per-feature error components)
- [ ] Empty table state uses shared `NoMatchingItems` from `@/components/NoMatchingItems`
- [ ] `form id="form"` on `FormCardContent` + `form="form"` on submit button in `FormCardFooter`
- [ ] Page data fetching uses `useSuspenseQuery` — `useQuery` only for combobox search hooks
- [ ] Combobox search hooks use `useQuery` with `enabled` prop and `placeholderData: keepPreviousData`
- [ ] Triple-layer wrapper present: `QueryErrorResetBoundary` > `ErrorBoundary` > `Suspense`
- [ ] Forms use `Controller` + `zodResolver`, never `register()`
- [ ] Form fields use `Field`, `FieldLabel`, `FieldError` from `@/components/ui/field`
- [ ] View cards use `ViewCardContent` with `Field` + `FieldLabel` + disabled `Input`/`Textarea`
- [ ] Number fields use `type="number"` with `onChange={e => field.onChange(Number(e.target.value))}`
- [ ] Boolean fields use `Select` with string conversion (`String(field.value)` / `v === 'true'`)
- [ ] Nullable fields handle `null` → `''` display and `'' || null` on change
- [ ] Pages that fetch by ID use inner component pattern
- [ ] Clerk `getToken()` passed to every API call
- [ ] Pagination via URL search params, not component state
- [ ] `useSearchParams` is read in table/page components, not in React Query hooks (hooks receive `pageNumber` as parameter)
- [ ] Toast notifications via `sonner` (`toast.success`, `toast.error`)
- [ ] Searchable comboboxes have debounce (300ms), loading/error/empty states, clear button
- [ ] Action buttons with dialogs use separate `form id` + `form="..."` pattern
- [ ] Delete dialogs use `variant="destructive"` button, no form — just confirmation with `onDelete` callback
- [ ] Heavy components (maps, charts) use `React.lazy()` with `.then(m => ({ default: m.Name }))` + `Suspense` fallback
- [ ] Routes registered in `routes.tsx`
- [ ] Sidebar entry added in `AppSidebar.tsx`
- [ ] Header title added in `AppHeader.tsx`

### Tests

- [ ] Uses `node:test` (`describe`, `test`, `assert`), not Jest/Vitest/Mocha
- [ ] Uses `testClient(app)` from `hono/testing`, not supertest or raw fetch
- [ ] DSL file has: factory functions, overloaded action functions, fluent assertions
- [ ] Action functions are properly overloaded (success vs ProblemDocument)
- [ ] Validation tests use data-driven `testCases` array pattern
- [ ] All test imports use `.js` extension

### Formatting and style

- [ ] Prettier-compliant: single quotes, trailing commas, CRLF line endings
- [ ] No unused imports or variables
- [ ] Named exports only

### Commit message (if reviewing a commit/PR)

- [ ] Follows Conventional Commits: `<type>(<scope>): <subject>`
- [ ] Valid scope: `backend`, `frontend`, or `repo`
- [ ] Subject in sentence-case or lower-case

## Output format

```
## Code Review: <scope description>

### Errors (N)
1. `path/to/file.ts:42` -- <description and fix>

### Warnings (N)
1. `path/to/file.ts:15` -- <description and fix>

### Nits (N)
1. `path/to/file.ts:8` -- <description>

### Summary
- Errors: N | Warnings: N | Nits: N
- Verdict: **PASS** / **NEEDS FIXES**
```
