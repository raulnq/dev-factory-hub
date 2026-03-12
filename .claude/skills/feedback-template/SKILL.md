---
name: feedback-template
description: |
  Pull improvements from a child project back into this template repo. Detects
  modified template files, new reusable components, and updated skills in child
  projects. Triggers: "feedback template," "pull from child," "upstream changes,"
  "update template from child," "promote to template," "backport to template."
---

# Feedback Template from Child Project

Pull improvements made in a child project back into this template repo. This is
the reverse of `sync-template` — it detects what the child changed or added and
lets you selectively adopt those changes into the template.

## Step 0 — Identify the child project

Check Claude memory for a saved child project path. If none exists, ask:

> What is the absolute local path to the child project?

Validate the path exists and is a monorepo derived from this template.

## Step 1 — Read the manifest

Read `.claude/skills/sync-template/template-manifest.json` to get the list of
`pure`, `wiring`, and `skills` files.

## Step 2 — Diff pure template files

For each file in `files.pure`, compare the template version against the child
version. Categorize results:

- **Identical** — no changes, skip
- **Modified in child** — child improved or fixed the template file
- **Missing in child** — child deleted it (flag as warning)
- **Missing in template** — should not happen for pure files

For each modified file, show the diff and ask the user:

- **Accept** — copy child version into template (overwrite)
- **Review** — show full diff, then decide
- **Skip** — keep template version

## Step 3 — Diff wiring files

For each file in `files.wiring`, compare versions. These are tricky because the
child has feature-specific additions. Focus only on changes to the **template
portion** (infrastructure boilerplate), not the feature-specific lines.

Use the wiring patterns from `sync-template/SKILL.md` Step 4 to identify which
lines are template vs feature-specific. Only propose accepting changes to the
template portion.

## Step 4 — Detect new reusable files in child

Scan these directories in the child project for files that do NOT exist in the
template and are NOT feature-specific:

### Frontend components

```
apps/frontend/src/components/*.tsx     (not in features/)
apps/frontend/src/components/ui/*.tsx
apps/frontend/src/components/layout/*.tsx
apps/frontend/src/hooks/*.ts
apps/frontend/src/lib/*.ts
apps/frontend/src/stores/*.ts          (not in features/)
```

### Backend infrastructure

```
apps/backend/src/*.ts                  (not in features/)
apps/backend/src/middlewares/*.ts
apps/backend/src/database/*.ts         (not migrations/)
apps/backend/tests/*.ts                (not in features/)
```

For each new file found:

1. Read it to determine if it's truly reusable (not feature-specific)
2. Present it to the user with a summary
3. Ask: **Promote to template?** (yes/no)
4. If yes: copy to template and add to the manifest's `pure` list

## Step 5 — Detect skill changes in child

Compare `.claude/skills/` files between child and template. Report:

- **Modified skills** — child improved a skill's instructions or templates
- **New skills** — child created a skill that could benefit the template

For each, ask whether to accept into the template.

## Step 6 — Update the manifest

If any new files were promoted to template in Steps 4–5:

1. Add their paths to `files.pure` or `skills` in `template-manifest.json`
2. Keep the arrays sorted by path for readability

## Step 7 — Verify

After applying changes:

1. Run `npx tsc --noEmit -p apps/backend/tsconfig.app.json`
2. Run `npx tsc --noEmit -p apps/frontend/tsconfig.app.json`
3. Run `npm run lint:format`
4. Build frontend: `npm run build:ci -w @node-monorepo/frontend`

## Step 8 — Summary

Print a report:

- Template files updated from child: N
- New files promoted to template: N
- Skills updated: N
- Wiring changes accepted: N
- Items skipped: N
- Manifest updated: yes/no
