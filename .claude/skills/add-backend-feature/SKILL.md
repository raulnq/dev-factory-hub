---
name: add-backend-feature
description: |
  Create a new backend API feature with CRUD endpoints following the established
  Hono sub-app pattern. Triggers: "add a projects feature," "create API endpoints
  for companies," "add a new entity," "add backend for X."
---

# Add Backend Feature

Use this skill when adding a new API feature (entity with CRUD endpoints) to the Hono backend.

## Step 0 — Read infrastructure files

Before writing any code, read these files to understand the current app structure:

- `apps/backend/src/app.ts` — route registration (see where to add your new route)
- `apps/backend/src/database/schemas.ts` — schema re-exports (see existing entries)
- `apps/backend/src/extensions.ts` — error helpers (RFC 9457 Problem Details)
- `apps/backend/src/validator.ts` — custom `zValidator` wrapper
- `apps/backend/src/pagination.ts` — `Page` type, `createPage`, `paginationSchema`
- `apps/backend/drizzle.config.ts` — migration config (check `migrations.schema`)

The code templates below are the canonical patterns — follow them exactly.

## Step 1 — Create feature directory

```
apps/backend/src/features/<entities>/
```

Use the **plural** form (e.g., `projects`, `companies`, `notes`).

## Step 2 — Create the Drizzle table (`<entity>.ts`)

File: `apps/backend/src/features/<entities>/<entity>.ts`

Key rules:

- Import `pgSchema` from `drizzle-orm/pg-core` and create a schema constant:
  ```ts
  const dbSchema = pgSchema('<entities>_schema');
  ```
- Define the table with `dbSchema.table('<entities>', { ... })`
- Use `uuid('<entityId>').primaryKey()` — no `.defaultRandom()`
- Use `varchar('column', { length: N }).notNull()` with explicit length
- Use `.notNull()` on all required columns
- Export the table constant

## Step 3 — Re-export from schemas registry

File: `apps/backend/src/database/schemas.ts`

Add a re-export line:

```ts
export { <entities> } from '#/features/<entities>/<entity>.js';
```

This is required for Drizzle Kit migration discovery.

## Step 4 — Create Zod schemas (`schemas.ts`)

File: `apps/backend/src/features/<entities>/schemas.ts`

Pattern:

```ts
import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

// Base entity schema — mirrors every column in the Drizzle table
export const <entity>Schema = z.object({
  <entityId>: z.uuidv7(),
  name: z.string().min(1).max(1024),
  // ... other fields
});

export type <Entity> = z.infer<typeof <entity>Schema>;

// Add schema — omit server-generated fields
export const add<Entity>Schema = <entity>Schema.omit({ <entityId>: true });
export type Add<Entity> = z.infer<typeof add<Entity>Schema>;

// Edit schema — pick only editable fields
export const edit<Entity>Schema = <entity>Schema.pick({ name: true /* ... */ });
export type Edit<Entity> = z.infer<typeof edit<Entity>Schema>;

// List schema — extend paginationSchema with optional filters
export const list<Entities>Schema = paginationSchema.extend({
  name: z.string().optional(),
});
export type List<Entities> = z.infer<typeof list<Entities>Schema>;
```

## Step 5 — Create endpoint files

Each endpoint is a **separate file** exporting a `new Hono()` sub-app (NOT a handler function).

### `add-<entity>.ts`

```ts
import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { add<Entity>Schema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', add<Entity>Schema),
  async c => {
    const data = c.req.valid('json');
    const [item] = await client
      .insert(<entities>)
      .values({ ...data, <entityId>: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
```

### `get-<entity>.ts`

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { <entity>Schema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = <entity>Schema.pick({ <entityId>: true });

export const getRoute = new Hono().get(
  '/:<entityId>',
  zValidator('param', schema),
  async c => {
    const { <entityId> } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(<entities>)
      .where(eq(<entities>.<entityId>, <entityId>))
      .limit(1);
    if (!item) {
      return notFoundError(c, `<Entity> ${<entityId>} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
```

### `edit-<entity>.ts`

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { edit<Entity>Schema, <entity>Schema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = <entity>Schema.pick({ <entityId>: true });

export const editRoute = new Hono().put(
  '/:<entityId>',
  zValidator('param', paramSchema),
  zValidator('json', edit<Entity>Schema),
  async c => {
    const { <entityId> } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(<entities>)
      .where(eq(<entities>.<entityId>, <entityId>))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(c, `<Entity> ${<entityId>} not found`);
    }
    const [item] = await client
      .update(<entities>)
      .set(data)
      .where(eq(<entities>.<entityId>, <entityId>))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
```

### `list-<entities>.ts`

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { like, count, SQL, and } from 'drizzle-orm';
import { list<Entities>Schema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', list<Entities>Schema),
  async c => {
    const { pageNumber, pageSize, name } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (name) filters.push(like(<entities>.name, `%${name}%`));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(<entities>)
      .where(and(...filters));

    const items = await client
      .select()
      .from(<entities>)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
```

## Step 6 — Create the route aggregator (`routes.ts`)

File: `apps/backend/src/features/<entities>/routes.ts`

```ts
import { Hono } from 'hono';
import { listRoute } from './list-<entities>.js';
import { addRoute } from './add-<entity>.js';
import { getRoute } from './get-<entity>.js';
import { editRoute } from './edit-<entity>.js';

export const <entity>Route = new Hono()
  .basePath('/<entities>')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
```

## Advanced Patterns (when applicable)

### State transition endpoints

For entities with workflow states (e.g., applications: Submitted → Under Review → Approved/Rejected), create a separate endpoint file per action.

File: `apps/backend/src/features/<entities>/<action>-<entity>.ts`

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { <entity>Schema, <action><Entity>Schema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = <entity>Schema.pick({ <entityId>: true });

export const <action>Route = new Hono().post(
  '/:<entityId>/<action>',
  zValidator('param', paramSchema),
  zValidator('json', <action><Entity>Schema),
  async c => {
    const { <entityId> } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(<entities>)
      .where(eq(<entities>.<entityId>, <entityId>))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `<Entity> ${<entityId>} not found`);
    }

    if (existing.status !== 'Expected Status') {
      return conflictError(
        c,
        `Cannot <action> <entity> with status "${existing.status}". Must be in "Expected Status" status.`
      );
    }

    const [item] = await client
      .update(<entities>)
      .set({ ...data, status: 'New Status' })
      .where(eq(<entities>.<entityId>, <entityId>))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
```

Add to `routes.ts`:

```ts
import { <action>Route } from './<action>-<entity>.js';

export const <entity>Route = new Hono()
  .basePath('/<entities>')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', <action>Route);
```

### Nested resource routes

When an entity belongs to a parent entity (e.g., visits belong to an application), use a nested basePath with the parent's ID param:

```ts
// routes.ts
export const <child>Route = new Hono()
  .basePath('/<parents>/:<parentId>/<children>')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', editRoute);
```

Each child endpoint must validate the parent param and check the parent exists:

```ts
const paramSchema = <child>Schema.pick({ <parentId>: true });

export const addRoute = new Hono().post(
  '/',
  zValidator('param', paramSchema),
  zValidator('json', add<Child>Schema),
  async c => {
    const { <parentId> } = c.req.valid('param');

    const [parent] = await client
      .select()
      .from(<parents>)
      .where(eq(<parents>.<parentId>, <parentId>))
      .limit(1);

    if (!parent) {
      return notFoundError(c, `<Parent> ${<parentId>} not found`);
    }

    const [item] = await client
      .insert(<children>)
      .values({ ...data, <childId>: v7(), <parentId> })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
```

### Edit with join re-query

When an edit endpoint returns data that includes joined fields (e.g., related entity names), separate the update and the re-query:

```ts
// Instead of .update().returning(), use:
await client
  .update(<entities>)
  .set(data)
  .where(eq(<entities>.<entityId>, <entityId>));

const [item] = await get<Entity>WithRelations()
  .where(eq(<entities>.<entityId>, <entityId>))
  .limit(1);

return c.json(item, StatusCodes.OK);
```

### Join queries for related data

When a list endpoint should return data from related tables (e.g., property list showing client name):

```ts
import { eq, and, like, count, SQL } from 'drizzle-orm';
import { <related> } from '#/features/<related>/<relatedEntity>.js';

// In list endpoint:
const items = await client
  .select({
    <entityId>: <entities>.<entityId>,
    name: <entities>.name,
    // ... all entity fields
    <related>Name: <related>.name,  // joined field
  })
  .from(<entities>)
  .leftJoin(<related>, eq(<entities>.<relatedId>, <related>.<relatedId>))
  .where(and(...filters))
  .limit(pageSize)
  .offset(offset);
```

For reuse across multiple endpoints (get, list, state transitions), extract into a helper:

```ts
function get<Entity>WithRelations() {
  return client
    .select({
      <entityId>: <entities>.<entityId>,
      // ... fields
      <related>Name: <related>.name,
    })
    .from(<entities>)
    .leftJoin(<related>, eq(<entities>.<relatedId>, <related>.<relatedId>));
}
```

### Foreign key validation

When inserting entities with foreign key references, verify the referenced entities exist:

```ts
// In add endpoint, before insert:
const [referencedItem] = await client
  .select()
  .from(<related>)
  .where(eq(<related>.<relatedId>, data.<relatedId>))
  .limit(1);

if (!referencedItem) {
  return notFoundError(c, `<Related> ${data.<relatedId>} not found`);
}
```

### Conflict/duplicate detection

When an entity has a unique constraint (e.g., DNI):

```ts
// In add endpoint, before insert:
const [duplicate] = await client
  .select()
  .from(<entities>)
  .where(eq(<entities>.uniqueField, data.uniqueField))
  .limit(1);

if (duplicate) {
  return conflictError(
    c,
    `A <entity> with <field> ${data.uniqueField} already exists`
  );
}
```

### Delete endpoint

File: `apps/backend/src/features/<entities>/delete-<entity>.ts`

Returns `NO_CONTENT` (204) with no body. If the entity has S3 files, delete from storage **before** deleting from DB.

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { <entity>Schema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = <entity>Schema.pick({ <entityId>: true });

export const deleteRoute = new Hono().delete(
  '/:<entityId>',
  zValidator('param', paramSchema),
  async c => {
    const { <entityId> } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(<entities>)
      .where(eq(<entities>.<entityId>, <entityId>))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `<Entity> ${<entityId>} not found`);
    }

    // If entity has S3 files: await deleteFile(existing.filePath);

    await client
      .delete(<entities>)
      .where(eq(<entities>.<entityId>, <entityId>));

    return c.body(null, StatusCodes.NO_CONTENT);
  }
);
```

Add to `routes.ts`:

```ts
import { deleteRoute } from './delete-<entity>.js';

export const <entity>Route = new Hono()
  .basePath('/<entities>')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', deleteRoute);
```

### File upload endpoint (form multipart + S3)

When an endpoint accepts file uploads, use `zValidator('form', ...)` with `z.instanceof(File)` and `.refine()` for validation:

File: `apps/backend/src/features/<entities>/add-<entity>.ts` (upload variant)

```ts
import { Hono } from 'hono';
import { v7 } from 'uuid';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { add<Entity>Schema, <entity>Schema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { uploadFile } from './s3-client.js';

const paramSchema = <entity>Schema.pick({ <parentId>: true });

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formSchema = add<Entity>Schema.extend({
  file: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => ALLOWED_MIME_TYPES.includes(file.type), {
      message: 'File type must be an image, PDF, or Word document',
    })
    .refine(file => file.name.length <= 250, {
      message: 'File name must not exceed 250 characters',
    }),
});

export const addRoute = new Hono().post(
  '/',
  zValidator('param', paramSchema),
  zValidator('form', formSchema),
  async c => {
    const { <parentId> } = c.req.valid('param');
    const { file, ...data } = c.req.valid('form');

    // Verify parent exists...

    const filePath = await uploadFile(file, <parentId>);

    const [item] = await client
      .insert(<entities>)
      .values({
        <entityId>: v7(),
        <parentId>,
        fileName: file.name,
        contentType: file.type,
        filePath,
        ...data,
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
```

### S3 client helper

When a feature needs file storage, create an S3 client file per feature:

File: `apps/backend/src/features/<entities>/s3-client.ts`

```ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENV } from '#/env.js';
import { v7 } from 'uuid';

const s3Client = new S3Client({
  region: ENV.S3_REGION,
  endpoint: ENV.S3_ENDPOINT,
  forcePathStyle: ENV.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = ENV.S3_BUCKET_NAME;

export async function uploadFile(
  file: File,
  parentId: string
): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const filePath = `${parentId}/${v7()}.${fileExtension}`;

  const contentType =
    file.type && file.type.length > 0 && file.type.length <= 255
      ? file.type
      : 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: contentType,
  });
  await s3Client.send(command);
  return filePath;
}

export async function getPresignedDownloadUrl(
  filePath: string,
  expiresIn: number = 900
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(filePath: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
  });
  await s3Client.send(command);
}
```

### Download URL endpoint (presigned URL)

When an entity has S3 files, add an endpoint that returns a short-lived presigned download URL:

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { <entity>Schema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = <entity>Schema.pick({ <parentId>: true, <entityId>: true });

export const getDownloadUrlRoute = new Hono().get(
  '/:<entityId>/download-url',
  zValidator('param', paramSchema),
  async c => {
    const { <parentId>, <entityId> } = c.req.valid('param');

    const [document] = await client
      .select()
      .from(<entities>)
      .where(
        and(
          eq(<entities>.<entityId>, <entityId>),
          eq(<entities>.<parentId>, <parentId>)
        )
      )
      .limit(1);

    if (!document) {
      return notFoundError(c, `<Entity> ${<entityId>} not found`);
    }

    const url = await getPresignedDownloadUrl(document.filePath, 900);
    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
```

## Step 7 — Register the route in the app

File: `apps/backend/src/app.ts`

1. Import the route:
   ```ts
   import { <entity>Route } from './features/<entities>/routes.js';
   ```
2. Chain it onto the app:
   ```ts
   .route('/api', <entity>Route)
   ```

## Checklist

- [ ] `apps/backend/src/features/<entities>/<entity>.ts` — Drizzle table
- [ ] `apps/backend/src/database/schemas.ts` — re-export added
- [ ] `apps/backend/src/features/<entities>/schemas.ts` — Zod schemas
- [ ] `apps/backend/src/features/<entities>/add-<entity>.ts` — POST endpoint
- [ ] `apps/backend/src/features/<entities>/get-<entity>.ts` — GET /:id endpoint
- [ ] `apps/backend/src/features/<entities>/edit-<entity>.ts` — PUT /:id endpoint
- [ ] `apps/backend/src/features/<entities>/list-<entities>.ts` — GET / endpoint
- [ ] `apps/backend/src/features/<entities>/delete-<entity>.ts` — DELETE /:id endpoint (if applicable)
- [ ] `apps/backend/src/features/<entities>/routes.ts` — route aggregator
- [ ] `apps/backend/src/app.ts` — route registered

### Optional (when applicable)

- [ ] `apps/backend/src/features/<entities>/s3-client.ts` — S3 file operations (if file storage needed)
- [ ] `apps/backend/src/features/<entities>/get-download-url.ts` — presigned URL endpoint (if S3)

## Critical rules

- **All imports use `.js` extension** (NodeNext module resolution)
- **Use `#/` alias** for `./src/` imports (e.g., `#/validator.js`, `#/database/client.js`)
- **`zValidator`** from `#/validator.js` (NOT from `@hono/zod-validator` directly)
- **`StatusCodes` enum** from `http-status-codes` (never raw numbers like `200`, `404`)
- **Error helpers** from `#/extensions.js` (`notFoundError`, `validationError`, etc.)
- **UUIDv7** via `v7()` from `uuid` package for primary keys
- **Named exports only** — no default exports
- **`import type`** for type-only imports (`verbatimModuleSyntax: true`)
