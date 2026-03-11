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

Also read the shared components (used by all features — do NOT recreate per-feature):

- `apps/frontend/src/components/FormCard.tsx` — `FormCard` (monolithic card with header/content/footer, uses `useId()` internally) + `FormSkeleton` (loading skeleton wrapper)
- `apps/frontend/src/components/ListCardHeader.tsx` — list page card header with title + `renderAction` + search children
- `apps/frontend/src/components/AddButton.tsx` — shared Add button (Plus icon + link), passed as `renderAction` to `ListCardHeader`
- `apps/frontend/src/components/EditButton.tsx` — shared Edit button (Pencil icon + link), used in view card `renderAction`
- `apps/frontend/src/components/SearchBar.tsx` — reusable search form wrapper
- `apps/frontend/src/components/SearchCombobox.tsx` — generic searchable combobox (used by feature comboboxes)
- `apps/frontend/src/components/ErrorFallback.tsx` — shared error fallback with `message` prop
- `apps/frontend/src/components/NoMatchingItems.tsx` — shared empty state for tables
- `apps/frontend/src/components/StatusBadge.tsx` — badge for entity status display
- `apps/frontend/src/components/DateReadOnlyField.tsx` — formatted read-only date field
- `apps/frontend/src/components/UncontrolledFormDialog.tsx` — dialog with form for state transition actions
- `apps/frontend/src/components/UncontrolledConfirmDialog.tsx` — confirmation dialog for destructive/no-data actions
- `apps/frontend/src/components/UncontrolledFileUploadDialog.tsx` — file upload dialog
- `apps/frontend/src/components/ControlledFormDialog.tsx` — externally controlled form dialog
- `apps/frontend/src/components/ControlledConfirmDialog.tsx` — externally controlled confirm dialog
- Table cell helpers: `TextTableCell`, `NumberTableCell`, `DateTableCell`, `BadgeTableCell`, `ActionTableCell`, `LinkTableCell`, `EditCellButton`, `ViewCellButton`

Then read the code templates (these are the canonical patterns — follow them exactly):

- `.claude/skills/add-frontend-feature/stores-templates.md` — API client + React Query hooks
- `.claude/skills/add-frontend-feature/components-templates.md` — components
- `.claude/skills/add-frontend-feature/pages-templates.md` — all page types

## Step 1 — Create feature directory

```
apps/frontend/src/features/<entities>/
  components/
  pages/
  stores/
```

## Step 2 — Create stores layer

Follow templates in `stores-templates.md`:

1. **`stores/<entities>Client.ts`** — raw API functions (list, get, add, edit). Each takes `token?: string | null`, uses Hono type-safe client (`import { client } from '@/client'`), checks `response.ok`.
2. **`stores/use<Entities>.ts`** — React Query hooks. `useSuspenseQuery` for reads, `useMutation` for writes. Mutations invalidate list + `setQueryData` for single entity.

## Step 3 — Create components

Follow templates in `components-templates.md`:

1. **`<Entity>SearchBar.tsx`** — uses shared `SearchBar` component, provides filter inputs as children
2. **`<Entity>Table.tsx`** — exports `<Entity>Table` + `<Entities>Skeleton`. Table reads searchParams for filters and pagination, uses `NoMatchingItems` for empty state, `Pagination` at bottom, shared table cell components (`TextTableCell`, `NumberTableCell`, etc.)
3. **`<Entity>AddForm.tsx`** — renders `FormCard` directly with title, description, fields, `onSubmit`, `onCancel`. Uses `useForm` + `zodResolver`, `Controller` fields with `FieldGroup`
4. **`<Entity>EditForm.tsx`** — same as Add but with `defaultValues: entity`. For features with state transitions: `readOnly={!isEditable}`, `renderTitleSuffix={<StatusBadge>}`, `renderAction={<Toolbar>}`
5. **`<Entity>ViewCard.tsx`** — renders `FormCard` without `onSubmit`, with `renderAction={<EditButton>}` and disabled fields
6. **`<Entity>Skeleton.tsx`** — loading skeleton using `FormSkeleton` from `@/components/FormCard`, shared by Edit and View pages

## Step 4 — Create pages

Follow templates in `pages-templates.md`:

Form/view components render `FormCard` directly — pages do NOT wrap in Card (except list pages).

1. **`List<Entity>Page.tsx`** — `Card` with `ListCardHeader` (title + `renderAction={<AddButton>}` + search children) + `CardContent` wrapping triple-layer table
2. **`Add<Entity>Page.tsx`** — renders `<Entity>AddForm` directly (no Card wrapping). Mutation hook with `toast`
3. **`Edit<Entity>Page.tsx`** — error boundary wrapping inner component. **Inner component pattern**. Two variants: simple (page manages mutation) or with state transitions (inner manages all mutations)
4. **`View<Entity>Page.tsx`** — error boundary wrapping inner component that renders `<Entity>ViewCard`. **Inner component pattern**

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

- [ ] `stores/<entities>Client.ts` — raw API functions (list, get, add, edit) using `import { client } from '@/client'`
- [ ] `stores/use<Entities>.ts` — React Query hooks (suspense queries + mutations)
- [ ] `components/<Entity>SearchBar.tsx` — search form using shared `SearchBar` component
- [ ] `components/<Entity>Table.tsx` — table + table skeleton + pagination (reads searchParams for page), uses shared cell components
- [ ] `components/<Entity>AddForm.tsx` — renders `FormCard` directly with form fields
- [ ] `components/<Entity>EditForm.tsx` — renders `FormCard` directly with entity data as defaults
- [ ] `components/<Entity>ViewCard.tsx` — renders `FormCard` without `onSubmit`, with `renderAction={<EditButton>}`
- [ ] `components/<Entity>Skeleton.tsx` — loading skeleton using `FormSkeleton` from `@/components/FormCard`
- [ ] `pages/List<Entity>Page.tsx` — `Card` + `ListCardHeader` with `renderAction={<AddButton>}` + search + triple-layer table
- [ ] `pages/Add<Entity>Page.tsx` — renders `<Entity>AddForm` directly, mutation hook with toast
- [ ] `pages/Edit<Entity>Page.tsx` — error boundary + inner component pattern
- [ ] `pages/View<Entity>Page.tsx` — error boundary + inner component pattern
- [ ] `routes.tsx` — routes registered
- [ ] `AppSidebar.tsx` — nav item added
- [ ] `AppHeader.tsx` — title added

### Optional (when applicable)

- [ ] `stores/<entities>Client.ts` — `delete<Entity>()` function (if delete needed)
- [ ] `stores/use<Entities>.ts` — `useDelete<Entity>()` mutation hook (if delete needed)
- [ ] `components/<Entity>Combobox.tsx` — thin wrapper around `SearchCombobox` (if entity is referenced as FK in other features)
- [ ] `stores/use<Entities>.ts` — `use<Entities>()` non-Suspense hook for combobox search
- [ ] `components/<Entity>{Action}Action.tsx` — action component using `UncontrolledFormDialog`, `UncontrolledConfirmDialog`, or `UncontrolledFileUploadDialog`
- [ ] `components/<Entity>Toolbar.tsx` — composes action components with status-based enable/disable logic
- [ ] `utils/status-variants.ts` — maps status strings to badge variants via `getStatusVariant()`
- [ ] `stores/use<Entities>.ts` — action mutation hooks (e.g., `useConfirm<Entity>`, `useCancel<Entity>`)
- [ ] Lazy loading with `React.lazy()` + `Suspense` for heavy components (maps, charts)

## Critical rules

- **`FormCard`** from `@/components/FormCard` — form components render `FormCard` directly (it includes header/content/footer internally, uses `useId()` for form ID)
- **`FormSkeleton`** from `@/components/FormCard` — skeleton components wrap field skeletons inside `FormSkeleton`
- **Form components own the card** — they render `FormCard` with `title`, `description`, `onCancel`, `onSubmit`, and field children. Pages do NOT wrap forms in `Card`
- **`ListCardHeader`** uses `renderAction={<AddButton link="..." text="..." />}` — no `addLink`/`addText` props
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
- **`ErrorFallback`** from `@/components/ErrorFallback` — shared error component with `message` prop (do NOT create per-feature error components)
- **`NoMatchingItems`** from `@/components/NoMatchingItems` — shared empty state for tables
- **`useSearchParams` in components, not hooks** — table components read `page` from searchParams and pass `pageNumber` to hooks
- **`FieldGroup`** wraps form controllers, **`FieldSeparator`** divides form sections
- **Action components** follow `{Entity}{Action}Action` naming and use shared dialog components (`UncontrolledFormDialog`, `UncontrolledConfirmDialog`, `UncontrolledFileUploadDialog`)
- **Toolbar components** compose action components with status-based `can{Action}` booleans
- **Edit forms with status** use `readOnly={!isEditable}`, `renderTitleSuffix={<StatusBadge>}`, `renderAction={<Toolbar>}`
- **View cards** follow `<Entity>ViewCard` naming, use `FormCard` without `onSubmit`, with `renderAction={<EditButton>}` and disabled fields
- **Comboboxes** are thin wrappers around `SearchCombobox<TItem>` from `@/components/SearchCombobox`
- **Store client files** use `import { client } from '@/client'` (not relative paths)
