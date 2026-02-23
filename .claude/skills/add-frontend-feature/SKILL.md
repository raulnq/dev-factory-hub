---
name: add-frontend-feature
description: |
  Create frontend pages and components for a feature using React 19, React Router,
  TanStack React Query, and shadcn/ui. Triggers: "add the frontend for projects,"
  "create pages for managing companies," "add UI for notes."
---

# Add Frontend Feature

Use this skill when adding frontend pages and components for a feature in the React frontend.

## Step 0 — Read references

Read the infrastructure files to understand the current app structure:

- `apps/frontend/src/routes.tsx` — route registration
- `apps/frontend/src/components/layout/AppSidebar.tsx` — `NAV_ITEMS` array
- `apps/frontend/src/components/layout/AppHeader.tsx` — `TITLE_BY_PATH` map
- `apps/frontend/src/client.ts` — Hono type-safe client
- `apps/frontend/src/components/ui/field.tsx` — `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `FieldSeparator`
- `apps/frontend/src/components/Pagination.tsx` — pagination component

Also read the shared card components (used by all features — do NOT recreate per-feature):

- `apps/frontend/src/components/ListCardHeader.tsx` — list page card header with title + add button + search children
- `apps/frontend/src/components/FormCardHeader.tsx` — form page card header with title + description + optional action/children
- `apps/frontend/src/components/FormCardContent.tsx` — wraps `<form>` inside `CardContent`
- `apps/frontend/src/components/FormCardFooter.tsx` — cancel + save buttons in `CardFooter`
- `apps/frontend/src/components/ViewCardHeader.tsx` — view page card header with title + action children
- `apps/frontend/src/components/ViewCardContent.tsx` — wraps read-only fields inside `CardContent`
- `apps/frontend/src/components/ViewCardFooter.tsx` — cancel-only button in `CardFooter`
- `apps/frontend/src/components/SearchBar.tsx` — reusable search form wrapper
- `apps/frontend/src/components/ErrorFallback.tsx` — shared error fallback with `message` prop (replaces per-feature error components)
- `apps/frontend/src/components/NoMatchingItems.tsx` — shared empty state for tables with no matching results

Then read the code templates (these are the canonical patterns — follow them exactly):

- `.claude/skills/add-frontend-feature/stores-templates.md` — API client + React Query hooks
- `.claude/skills/add-frontend-feature/components-templates.md` — components
- `.claude/skills/add-frontend-feature/pages-templates.md` — all 4 pages

## Step 1 — Create feature directory

```
apps/frontend/src/features/<entities>/
  components/
  pages/
  stores/
```

## Step 2 — Create stores layer

Follow templates in `stores-templates.md`:

1. **`stores/<entities>Client.ts`** — raw API functions (list, get, add, edit). Each takes `token?: string | null`, uses Hono type-safe client, checks `response.ok`.
2. **`stores/use<Entities>.ts`** — React Query hooks. `useSuspenseQuery` for reads, `useMutation` for writes. Pagination from URL search params. Mutations invalidate list + `setQueryData` for single entity.

## Step 3 — Create components

Follow templates in `components-templates.md`:

1. **`<Entity>SearchBar.tsx`** — uses shared `SearchBar` component, provides filter inputs as children
2. **`<Entity>Table.tsx`** — exports `<Entity>Table` + `<Entities>Skeleton`. Table reads searchParams for filters and pagination, uses `NoMatchingItems` for empty state, `Pagination` at bottom
3. **`Add<Entity>Form.tsx`** — uses `FormCardContent`, `useForm` + `zodResolver`, `Controller` fields with `FieldGroup`
4. **`Edit<Entity>Form.tsx`** — same as Add but with `defaultValues: entity`
5. **`View<Entity>Card.tsx`** — read-only display using `ViewCardContent` with `Field`/`FieldLabel`/disabled `Input`
6. **`<Entity>Skeleton.tsx`** — loading skeleton shared by Edit and View pages

## Step 4 — Create pages

Follow templates in `pages-templates.md`:

All pages wrap content in `Card` and use shared card components (no per-feature headers).

1. **`List<Entity>Page.tsx`** — `Card` with `ListCardHeader` (title + add button + search children) + `CardContent` wrapping triple-layer table
2. **`Add<Entity>Page.tsx`** — `Card` with `FormCardHeader` + `Add<Entity>Form` + `FormCardFooter`. Mutation hook with `toast`
3. **`Edit<Entity>Page.tsx`** — `Card` with `FormCardHeader` (outside or inside inner) + error boundary + `FormCardFooter`. **Inner component pattern**
4. **`View<Entity>Page.tsx`** — `Card` with `ViewCardHeader` (Edit button as child) + error boundary + `ViewCardFooter`. **Inner component pattern**

## Step 5 — Register routes

File: `apps/frontend/src/routes.tsx` — add route group under root layout children:

```tsx
{
  path: '<entities>',
  children: [
    { index: true, element: <List<Entity>Page /> },
    { path: 'new', element: <Add<Entity>Page /> },
    { path: ':<entityId>', element: <View<Entity>Page /> },
    { path: ':<entityId>/edit', element: <Edit<Entity>Page /> },
  ],
},
```

## Step 6 — Add sidebar entry

File: `apps/frontend/src/components/layout/AppSidebar.tsx` — add to `NAV_ITEMS`:

```ts
{ title: '<Entities>', to: '/<entities>', icon: SomeIcon },
```

## Step 7 — Add header title

File: `apps/frontend/src/components/layout/AppHeader.tsx` — add to `TITLE_BY_PATH`:

```ts
'/<entities>': '<Entities>',
```

## Checklist

- [ ] `stores/<entities>Client.ts` — raw API functions (list, get, add, edit)
- [ ] `stores/use<Entities>.ts` — React Query hooks (suspense queries + mutations)
- [ ] `components/<Entity>SearchBar.tsx` — search form using shared `SearchBar` component
- [ ] `components/<Entity>Table.tsx` — table + table skeleton + pagination (reads searchParams for page)
- [ ] `components/Add<Entity>Form.tsx` — form fields only (uses `FormCardContent`)
- [ ] `components/Edit<Entity>Form.tsx` — form fields only (uses `FormCardContent`)
- [ ] `components/View<Entity>Card.tsx` — read-only fields (uses `ViewCardContent`)
- [ ] `components/<Entity>Skeleton.tsx` — loading skeleton (shared by Edit + View pages)
- [ ] `pages/List<Entity>Page.tsx` — `Card` + `ListCardHeader` + search + triple-layer table
- [ ] `pages/Add<Entity>Page.tsx` — `Card` + `FormCardHeader` + form + `FormCardFooter`
- [ ] `pages/Edit<Entity>Page.tsx` — `Card` + `FormCardHeader` + inner component + `FormCardFooter`
- [ ] `pages/View<Entity>Page.tsx` — `Card` + `ViewCardHeader` + inner component + `ViewCardFooter`
- [ ] `routes.tsx` — routes registered
- [ ] `AppSidebar.tsx` — nav item added
- [ ] `AppHeader.tsx` — title added

### Optional (when applicable)

- [ ] `stores/<entities>Client.ts` — `delete<Entity>()` function (if delete needed)
- [ ] `stores/use<Entities>.ts` — `useDelete<Entity>()` mutation hook (if delete needed)
- [ ] `components/Delete<Entity>Dialog.tsx` — delete confirmation dialog (if delete needed)
- [ ] `components/<Entity>Combobox.tsx` — searchable combobox (if entity is referenced as FK in other features)
- [ ] `stores/use<Entities>.ts` — `use<Entities>()` non-Suspense hook for combobox search
- [ ] `components/<Action>Button.tsx` — action button with dialog (for state transitions)
- [ ] `stores/use<Entities>.ts` — action mutation hooks (e.g., `useApprove<Entity>`)
- [ ] Status `Badge` with variants in table (for entities with workflow states)
- [ ] Lazy loading with `React.lazy()` + `Suspense` for heavy components (maps, charts)

## Critical rules

- **`useSuspenseQuery`** for page data fetching — `useQuery` only for combobox search hooks (with `enabled` prop)
- **`Controller` + `zodResolver`** — never `register()` for forms
- **`Field`, `FieldLabel`, `FieldError`** from `@/components/ui/field` — not shadcn `FormField`
- **Triple-layer wrapper**: `QueryErrorResetBoundary` > `ErrorBoundary` > `Suspense`
- **Inner component pattern** for pages that fetch by ID (View, Edit)
- **`@/` alias** for frontend src imports, **`#/`** alias for backend type imports
- **No `.js` extensions** on frontend imports (bundler resolution)
- **Named exports only** — no default exports (except `App.tsx`)
- **`import type`** for type-only imports
- **Clerk `getToken()`** passed to every API call
- **URL search params** for pagination (not component state)
- **`toast` from `sonner`** for success/error notifications
- **Shared card components** — `FormCardHeader`/`FormCardContent`/`FormCardFooter` for forms, `ViewCardHeader`/`ViewCardContent`/`ViewCardFooter` for views, `ListCardHeader` for lists
- **`ErrorFallback`** from `@/components/ErrorFallback` — shared error component with `message` prop (do NOT create per-feature error components)
- **`NoMatchingItems`** from `@/components/NoMatchingItems` — shared empty state for tables
- **`useSearchParams` in components, not hooks** — table components read `page` from searchParams and pass `pageNumber` to hooks
- **`FieldGroup`** wraps form controllers, **`FieldSeparator`** divides form sections
- **Page owns the Card** — form components only render fields inside `FormCardContent`, page adds `Card` + header + footer
- **`form id="form"`** + **`form="form"` on submit button** (button is in `FormCardFooter`, outside form element)
