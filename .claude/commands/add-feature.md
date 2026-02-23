# Add Feature: $ARGUMENTS

You are adding functionality for the entity **$ARGUMENTS**. This command supports two modes:

- **New feature** — the entity does not exist yet; create everything from scratch.
- **Extend feature** — the entity already exists; add new endpoints, fields, or UI pages to it.

Follow the 7 phases below **in order**. Some phases may be skipped depending on the mode — each phase documents when to skip it. Do not proceed to the next phase until the gate condition is met.

---

## Phase 0: Discovery

**Goal:** Determine the mode and understand what needs to be built.

First, check if the feature already exists by looking for `apps/backend/src/features/` directories and files matching `$ARGUMENTS`. Then ask the user:

### If the feature is NEW:

1. **Fields** — What fields does `$ARGUMENTS` have? For each field: name, type (text, integer, boolean, timestamp, UUID reference, etc.), and constraints (required, unique, max length, default value).
2. **Relationships** — Does `$ARGUMENTS` belong to another entity (foreign key)? Does anything belong to it?
3. **CRUD operations** — Which endpoints are needed? Default: Add, Get, Edit, List, Delete. Confirm with the user.
4. **Business rules** — Any special validation, authorization, or behavioral rules?
5. **Naming** — Confirm the plural form used for the route and directory (e.g., `project` -> `projects`).

### If the feature ALREADY EXISTS:

1. **Show current state** — List the existing table columns, endpoints, and frontend pages so the user sees what is already built.
2. **What to add** — Ask: new endpoints, new fields/columns, new frontend pages, or a combination?
3. **For new fields** — name, type, constraints, nullable or required, default value.
4. **For new endpoints** — HTTP method, purpose, request/response shape, business rules.
5. **For new pages** — which pages or components to add or modify.

**Gate:** The user explicitly confirms the scope of work before you continue.

---

## Phase 1: DB Schema

**Skip if:** No schema changes are needed (e.g., adding an endpoint that uses existing columns only).

**Goal:** Create or modify the database table and run migrations.

1. **Ensure the database is running.** Run `docker compose up -d database` and wait for the health check to pass (`docker compose ps` should show the `database` service as "healthy"). If it is not running, wait a few seconds and check again.
2. Read `.claude/skills/add-db-schema/SKILL.md` in full and follow its instructions.
3. For a **new feature**: create the table file, update `schemas.ts`, create Zod schemas.
4. For an **existing feature**: modify the table file, update Zod schemas to match.
5. Run: `npm run database:generate -w @node-monorepo/backend`
6. Run: `npm run database:migrate -w @node-monorepo/backend`

**Gate:** The database container is healthy and both the generate and migrate commands complete successfully.

---

## Phase 2: Backend API

**Goal:** Create the Hono API endpoints.

1. Read `.claude/skills/add-backend-feature/SKILL.md` in full and follow its instructions.
2. For a **new feature**: create one file per endpoint, a `routes.ts` aggregator, and wire it into the app router.
3. For an **existing feature**: create only the new endpoint files, update the existing `routes.ts` to include them, and update `schemas.ts` if new request/response schemas are needed.
4. **If file storage is needed**: create an `s3-client.ts` in the feature directory (see S3 client pattern in the backend skill). Also create file upload and/or download URL endpoints.
5. Run: `npx tsc --noEmit -p apps/backend/tsconfig.app.json`

**Gate:** TypeScript compilation passes with zero errors. If it fails, fix the errors and re-run until it passes.

---

## Phase 3: Test Design

**Goal:** Align on test coverage before writing tests.

Present the user with a list of planned test scenarios **for the new/modified endpoints only**. For each endpoint, include:

- **Happy path** scenarios (valid input, expected output)
- **Validation** scenarios (missing fields, wrong types, invalid values)
- **Not-found** scenarios (non-existent IDs)
- **Edge cases** specific to this entity's business rules

**Gate:** The user confirms or adjusts the test scenarios before you continue.

---

## Phase 4: Backend Tests

**Goal:** Write and pass integration tests.

1. Read `.claude/skills/add-backend-tests/SKILL.md` in full and follow its instructions.
2. For a **new feature**: create the test DSL (factory, actions, assertions) and test files for each endpoint.
3. For an **existing feature**: extend the existing DSL if needed and add test files for the new endpoints only.
4. Run: `npm test -w @node-monorepo/backend`

**Gate:** All tests pass (including pre-existing ones). If any test fails, diagnose the failure, fix the code or test, and re-run. Loop until all tests pass.

---

## Phase 5: Frontend UI

**Skip if:** The user explicitly said no frontend changes are needed.

**Goal:** Create or extend the React pages and components.

1. Read `.claude/skills/add-frontend-feature/SKILL.md` in full and follow its instructions (including `stores-templates.md`, `components-templates.md`, and `pages-templates.md`).
2. For a **new feature**: create stores, components (form, columns, dialogs), and pages (list + add/edit). Wire pages into `routes.tsx` and add navigation.
3. For an **existing feature**: add only the new stores/components/pages needed. Update existing files (e.g., add columns, form fields, or navigation links) as required.
4. Run: `npx tsc --noEmit -p apps/frontend/tsconfig.app.json`

**Gate:** TypeScript compilation passes with zero errors. If it fails, fix the errors and re-run until it passes.

---

## Phase 6: Code Review

**Goal:** Verify all created/modified files follow project conventions.

1. Read `.claude/skills/review-code/SKILL.md` in full and follow its instructions.
2. Run the review against **every file created or modified** during this workflow.
3. Fix any violations found.
4. Re-run the review until the verdict is **PASS**.

**Gate:** Code review verdict is PASS.

---

## Completion

When all phases are complete, present a summary to the user:

- **Mode**: new feature or extension
- List of all files created/modified
- Endpoints available (method + path) — highlight which are new
- Test count and status
- Any notes or follow-up items
