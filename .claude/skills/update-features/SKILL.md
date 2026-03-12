---
name: update-features
description: |
  Audit and update existing feature code to match current template patterns and
  skills after a template sync. Triggers: "update features," "audit features,"
  "align features with template," "apply new patterns," "refresh feature code,"
  "check features against skills."
---

# Update Features After Template Sync

After running `sync-template`, the child project has updated infrastructure files
and skills but its feature code may still follow old patterns. This skill audits
all feature directories and updates them to match the current conventions.

## Step 0 — Discover features

Scan for feature directories:

- `apps/backend/src/features/*/` — backend features
- `apps/frontend/src/features/*/` — frontend features
- `apps/backend/tests/features/*/` — backend tests

List all discovered features and confirm with the user which ones to audit/update
(default: all).

## Step 1 — Load current patterns

Read these skill files to understand the current conventions:

1. `.claude/skills/add-backend-feature/SKILL.md`
2. `.claude/skills/add-frontend-feature/SKILL.md` + its three template files:
   - `stores-templates.md`
   - `components-templates.md`
   - `pages-templates.md`
3. `.claude/skills/add-backend-tests/SKILL.md`
4. `.claude/skills/add-db-schema/SKILL.md`
5. `.claude/skills/review-code/SKILL.md`

These define the "expected" patterns for all feature code.

## Step 2 — Audit each feature

For each feature, read every file and check against the patterns from Step 1.
Organize findings into these categories:

### Backend endpoints

- File structure: one file per endpoint, correct naming (`add-*.ts`, `get-*.ts`, etc.)
- Each endpoint is a `new Hono()` sub-app (not a handler function)
- Uses `zValidator` from `#/validator.js` (not raw `@hono/zod-validator`)
- Uses `StatusCodes` enum (no raw numbers)
- Error responses use helpers from `#/extensions.js`
- All imports end with `.js`
- Type-only imports use `import type`
- Route aggregator uses `.basePath()` + `.route('/', ...)`

### Database tables

- Uses `pgSchema('<entities>_schema').table()` (not `pgTable()`)
- UUID PK without `.defaultRandom()`
- `varchar` has explicit length
- Re-exported from `database/schemas.ts`
- Zod schemas in sync with Drizzle table columns

### Frontend stores

- Client functions take `token?: string | null`
- Uses `import { client } from '@/client'` (not relative)
- Checks `response.ok` and throws on error
- Hooks use `useSuspenseQuery` for page data
- Mutations invalidate queries + `setQueryData`

### Frontend components

- Naming: `<Entity>AddForm.tsx` not `Add<Entity>Form.tsx`
- Forms render `FormCard` directly (pages don't wrap in Card)
- Forms use `Controller` + `zodResolver` (never `register()`)
- Fields use `Field`, `FieldLabel`, `FieldError` from `@/components/ui/field`
- Tables use shared cell components (`TextTableCell`, etc.)
- Uses shared `ErrorFallback` and `NoMatchingItems`
- Skeletons use `FormSkeleton` from `@/components/FormCard`

### Frontend pages

- List page: `Card` + `ListCardHeader` with `renderAction={<AddButton>}`
- Triple-layer: `QueryErrorResetBoundary` > `ErrorBoundary` > `Suspense`
- Edit/View pages use inner component pattern
- Add page renders form directly (no Card wrapping)
- Imports use `@/` alias, no `.js` extensions

### Wiring

- Feature route registered in `apps/backend/src/app.ts`
- Schema re-exported from `apps/backend/src/database/schemas.ts`
- Frontend routes in `apps/frontend/src/routes.tsx`
- Nav entry in `apps/frontend/src/nav-items.ts`

### Tests (if present)

- Uses `node:test` + `testClient(app)`
- DSL file with factories, overloaded actions, assertion builder
- Data-driven validation tests
- Imports end with `.js`

## Step 3 — Report findings

Present a summary grouped by severity:

| Severity    | Meaning                               |
| ----------- | ------------------------------------- |
| **Error**   | Breaking or incorrect — must fix      |
| **Warning** | Deviates from convention — should fix |
| **Info**    | Minor style deviation — optional fix  |

Format:

```
[ERROR] apps/backend/src/features/projects/add-project.ts:5
  Uses raw @hono/zod-validator instead of #/validator.js

[WARNING] apps/frontend/src/features/projects/components/AddProjectForm.tsx
  File should be named ProjectAddForm.tsx per naming convention

[INFO] apps/frontend/src/features/projects/stores/projectsClient.ts:12
  Missing response.ok check after API call
```

Ask the user: **"Should I fix all findings, or let you choose which to fix?"**

## Step 4 — Apply fixes

For each finding the user approves:

1. Read the file
2. Apply the fix following the current skill patterns
3. If a file needs renaming, update all imports that reference it
4. If a shared component changed its API (props, exports), update all usages

**Order of operations** (to avoid cascading errors):

1. Database tables and schemas first
2. Backend endpoints
3. Frontend stores (they depend on backend types)
4. Frontend components
5. Frontend pages (they depend on components)
6. Wiring files (routes, nav-items, app.ts, schemas.ts)
7. Tests last

## Step 5 — Verify

After applying fixes:

1. Run `npx tsc --noEmit -p apps/backend/tsconfig.app.json`
2. Run `npx tsc --noEmit -p apps/frontend/tsconfig.app.json`
3. Run `npm run lint:format`
4. If tests exist: `npm test -w @node-monorepo/backend`

Report any remaining errors and iterate.

## Step 6 — Summary

Print a final report:

- Features audited: N
- Files checked: N
- Issues found: N (X errors, Y warnings, Z info)
- Issues fixed: N
- Issues skipped: N
- Verification: pass/fail
