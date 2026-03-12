---
name: sync-template
description: |
  Sync template infrastructure files from this GitHub template repo to a child
  project. Triggers: "sync template," "update child project," "push template
  changes," "sync infra to child," "propagate template."
---

# Sync Template to Child Project

Propagate template infrastructure changes to a child project created from this
GitHub template. Uses `template-manifest.json` (co-located in this skill folder) to know which
files are template files (`pure` vs `wiring`).

## Step 0 — Identify the child project

Check Claude memory for a saved child project path. If none exists, ask:

> What is the absolute local path to the child project?

Validate the path exists and contains a `package.json` with workspaces (confirming
it derives from this template). Save the path to Claude memory for future syncs.

## Step 1 — Read the manifest

Read `.claude/skills/sync-template/template-manifest.json`. It has four sections:

- `files.pure` — safe to overwrite directly
- `files.wiring` — contain feature-specific lines, need manual merge
- `skills` — `.claude/` files to sync
- `never_sync` — glob patterns for files that must never be copied

## Step 2 — Detect what changed (optional)

If the user wants an incremental sync, check Claude memory for a last-sync commit
hash and run:

```bash
git diff --name-only <last-sync-commit>..HEAD
```

Cross-reference the output with the manifest to build a smaller sync list. If no
last-sync commit exists, sync everything.

## Step 3 — Sync pure files

For each file in `files.pure`:

1. Read the file from the template repo
2. Write it to the same relative path in the child project (create directories
   as needed)
3. Log each file as synced

**Safety rules — never sync these regardless of manifest:**

- `.env` and `.env.example` files (child projects manage their own env config)
- `package.json` (root and app-level — child projects manage their own dependencies)
- `docker-compose.yml` (child projects customize their own Docker setup)
- `CLAUDE.md` (child projects maintain their own project instructions)
- `apps/backend/src/database/migrations/*`
- `apps/backend/src/features/*`
- `apps/frontend/src/features/*`
- `apps/backend/tests/features/*`
- `node_modules/`, `dist/`, `package-lock.json`

## Step 4 — Handle wiring files

For each file in `files.wiring`:

1. Read the template version
2. Read the child version
3. Present both to the user, highlighting:
   - **Template portion** — infrastructure boilerplate
   - **Child-added lines** — feature imports, route registrations, schema exports,
     nav items the child has added
4. Ask the user to choose:
   - **Skip** — keep child version as-is
   - **Merge** — update template boilerplate, preserve child's feature lines
   - **Overwrite** — replace with template version (child must re-add feature lines)

### Wiring file patterns

Use these to identify template vs child-added lines:

| File                                   | Template portion                                                | Child-added                                                                       |
| -------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `apps/backend/src/app.ts`              | Middleware chain, `/live` endpoint, error handlers, type export | `.route('/api', ...)` calls + their feature imports (beyond `todoRoute`)          |
| `apps/backend/src/database/schemas.ts` | File structure                                                  | `export { ... }` lines beyond template's `todos` export                           |
| `apps/frontend/src/routes.tsx`         | `createBrowserRouter`, `AppLayout` wrapper, index route         | Route objects in `children` beyond template's `todos` routes + their page imports |
| `apps/frontend/src/nav-items.ts`       | `NavItem` type, `Dashboard` entry                               | Array entries beyond `Dashboard` and template's `Todos`                           |

## Step 5 — Sync skills and Claude config

Copy every file listed in `skills` from the template to the child project.
Note: `CLAUDE.md` is NOT synced — child projects maintain their own version.

## Step 6 — Post-sync checklist

Present to the user:

- [ ] Run `npm install` in child project (deps may have changed)
- [ ] Run `npx tsc --noEmit -p apps/backend/tsconfig.app.json` to verify backend
- [ ] Run `npx tsc --noEmit -p apps/frontend/tsconfig.app.json` to verify frontend
- [ ] If `docker-compose.yml` changed, review and restart containers
- [ ] If DB infra changed, run `npm run database:generate` + `database:migrate`
- [ ] Run `npm run lint:format` to fix any formatting differences

## Step 7 — Save sync checkpoint

Save the template repo's current HEAD commit hash to Claude memory so the next
sync can diff incrementally. Print a summary:

- Pure files synced: N
- Wiring files updated/skipped: N
- Skills synced: N
- Files that failed or were skipped
