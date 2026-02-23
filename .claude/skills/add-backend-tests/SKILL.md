---
name: add-backend-tests
description: |
  Write API integration tests using node:test, Hono testClient, and the project's
  custom DSL pattern. Triggers: "add tests for the projects feature," "write tests
  for add-company endpoint," "test the API."
---

# Add Backend Tests

Use this skill when writing integration tests for backend API features.

## Step 0 — Read shared test infrastructure

Before writing any tests, read these files (they are shared across all features and always exist):

- `apps/backend/tests/assertions.ts` — shared assertion helpers (`assertPage`, `assertStrictEqualProblemDocument`)
- `apps/backend/tests/errors.ts` — error fixtures (`createValidationError`, `validationError`, etc.)
- `apps/backend/tests/setup.ts` — test setup (DB connection teardown)

The code templates below are the canonical patterns for DSL and test files — follow them exactly.

## Test infrastructure overview

- **Test runner:** `node:test` module (`describe`, `test`, `assert`) — NOT Jest/Vitest/Mocha
- **HTTP client:** `testClient(app)` from `hono/testing` — NOT supertest or raw fetch
- **Run command:** `npm test -w @node-monorepo/backend`
- **File structure:** `apps/backend/tests/features/<entities>/`

## Step 1 — Create the DSL file (`<entity>-dsl.ts`)

File: `apps/backend/tests/features/<entities>/<entity>-dsl.ts`

The DSL file contains four sections:

### 1A. Factory functions

Create named factory functions (like `walk()`, `cook()`) that produce valid input objects using `@faker-js/faker`:

```ts
import { faker } from '@faker-js/faker';
import type { Add<Entity> } from '#/features/<entities>/schemas.js';

export const walk = (overrides?: Partial<Add<Entity>>): Add<Entity> => {
  return {
    name: `walk ${faker.string.uuid()}`,
    ...overrides,
  };
};

export const cook = (overrides?: Partial<Add<Entity>>): Add<Entity> => {
  return {
    name: `cook ${faker.string.uuid()}`,
    ...overrides,
  };
};
```

### 1B. Action functions (overloaded)

Each action function has **two overloads**: success returns the entity, error returns ProblemDocument.

```ts
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type { Add<Entity>, Edit<Entity>, <Entity>, List<Entities> } from '#/features/<entities>/schemas.js';

export async function add<Entity>(input: Add<Entity>): Promise<<Entity>>;
export async function add<Entity>(
  input: Add<Entity>,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function add<Entity>(
  input: Add<Entity>,
  expectedProblemDocument?: ProblemDocument
): Promise<<Entity> | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.<entities>.$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(!expectedProblemDocument, 'Expected a problem document but received CREATED status');
    const item = await response.json();
    assert.ok(item);
    return item;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(expectedProblemDocument, `Expected CREATED status but received ${response.status}`);
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}
```

Repeat the same overloaded pattern for `edit<Entity>`, `get<Entity>`, and `list<Entities>`.

### 1C. Fluent assertion builder

```ts
export const assert<Entity> = (item: <Entity>) => {
  return {
    hasName(expected: string) {
      assert.strictEqual(item.name, expected, `Expected name to be ${expected}, got ${item.name}`);
      return this;
    },
    // Add a method for each field...
    isTheSameOf(expected: <Entity>) {
      return this.hasName(expected.name); // chain all field checks
    },
  };
};
```

## Step 2 — Create test files

One test file per endpoint:

### `add-<entity>.test.ts`

```ts
import { test, describe } from 'node:test';
import { add<Entity>, assert<Entity>, walk } from './<entity>-dsl.js';
import { emptyText, bigText, createValidationError, validationError } from '../../errors.js';

describe('Add <Entity> Endpoint', () => {
  test('should create a new <entity> with valid data', async () => {
    const input = walk();
    const item = await add<Entity>(input);
    assert<Entity>(item).hasName(input.name);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty name',
        input: walk({ name: emptyText }),
        expectedError: createValidationError([validationError.tooSmall('name', 1)]),
      },
      {
        name: 'should reject name longer than 1024 characters',
        input: walk({ name: bigText(1025) }),
        expectedError: createValidationError([validationError.tooBig('name', 1024)]),
      },
      {
        name: 'should reject missing name',
        input: walk({ name: undefined }),
        expectedError: createValidationError([validationError.requiredString('name')]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await add<Entity>(input, expectedError);
      });
    }
  });
});
```

### `get-<entity>.test.ts`

```ts
import { test, describe } from 'node:test';
import { add<Entity>, assert<Entity>, get<Entity>, walk } from './<entity>-dsl.js';
import { createNotFoundError, createValidationError, validationError } from '../../errors.js';

describe('Get <Entity> Endpoint', () => {
  test('should get an existing <entity> by ID', async () => {
    const created = await add<Entity>(walk());
    const retrieved = await get<Entity>(created.<entityId>);
    assert<Entity>(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent <entity>', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await get<Entity>(id, createNotFoundError(`<Entity> ${id} not found`));
  });

  test('should reject invalid UUID format', async () => {
    await get<Entity>('invalid-uuid', createValidationError([validationError.invalidUuid('<entityId>')]));
  });
});
```

### `edit-<entity>.test.ts`

```ts
import { test, describe } from 'node:test';
import { add<Entity>, edit<Entity>, walk, cook, assert<Entity> } from './<entity>-dsl.js';
import { emptyText, bigText, createValidationError, validationError, createNotFoundError } from '../../errors.js';

describe('Edit <Entity> Endpoint', () => {
  test('should edit an existing <entity> with valid data', async () => {
    const item = await add<Entity>(walk());
    const input = cook();
    const updated = await edit<Entity>(item.<entityId>, { ...input /* + other fields */ });
    assert<Entity>(updated).hasName(input.name);
  });

  describe('Property validations', async () => {
    const testCases = [
      // Similar to add, but may need to construct from existing entity
    ];
    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const item = await add<Entity>(walk());
        await edit<Entity>(item.<entityId>, input(item), expectedError);
      });
    }
  });

  test('should return 404 for non-existent <entity>', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await edit<Entity>(id, { ...cook() }, createNotFoundError(`<Entity> ${id} not found`));
  });
});
```

### `list-<entities>.test.ts`

```ts
import { test, describe } from 'node:test';
import { add<Entity>, assert<Entity>, list<Entities>, walk } from './<entity>-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List <Entities> Endpoint', () => {
  test('should filter <entities> by name', async () => {
    const item = await add<Entity>(walk());
    const page = await list<Entities>({ name: item.name, pageSize: 10, pageNumber: 1 });
    assertPage(page).hasItemsCount(1);
    assert<Entity>(page.items[0]).isTheSameOf(item);
  });

  test('should return empty items when no match', async () => {
    const page = await list<Entities>({ name: 'nonexistent-xyz', pageSize: 10, pageNumber: 1 });
    assertPage(page).hasEmptyResult();
  });
});
```

## Advanced Patterns (when applicable)

### Dependency creation helpers

When an entity has foreign key dependencies, add helper functions to the DSL for creating prerequisite data. Import factories and actions from other feature DSLs:

```ts
import { alice } from '../../clients/client-dsl.js';
import { addClient } from '../../clients/client-dsl.js';
import { john } from '../../leads/lead-dsl.js';
import { addLead } from '../../leads/lead-dsl.js';

export const createOwner = async (): Promise<string> => {
  const owner = await addClient(alice());
  return owner.clientId;
};

export const createLead = async (): Promise<string> => {
  const lead = await addLead(john());
  return lead.leadId;
};

export const create<Entity> = async (
  overrides?: Partial<Add<Entity>>
): Promise<<Entity>> => {
  const relatedId = overrides?.relatedId ?? (await createRelated());
  return await add<Entity>(factory({ relatedId, ...overrides }));
};
```

### Date helper

For date string inputs in tests:

```ts
export const todayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
```

### Date parsing in action functions

When the API returns date strings (e.g., `createdAt`), parse them to `Date` objects for consistent comparison:

```ts
// In action function, after response.json():
return {
  ...item,
  createdAt: new Date(item.createdAt),
};

// For list actions:
return {
  ...page,
  items: page.items.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt),
  })),
};
```

### State transition action functions

For endpoints like `POST /:id/approve`, use nested routing syntax:

```ts
export async function approve(
  <entityId>: string,
  input: Approve<Entity>
): Promise<<Entity>>;
export async function approve(
  <entityId>: string,
  input: Approve<Entity>,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function approve(
  <entityId>: string,
  input: Approve<Entity>,
  expectedProblemDocument?: ProblemDocument
): Promise<<Entity> | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.<entities>[':<entityId>'].approve.$post({
    param: { <entityId> },
    json: input,
  });
  // ... same overload pattern as CRUD actions
}
```

### State transition tests

```ts
describe('Approve <Entity> Endpoint', () => {
  test('should approve <entity> with valid status', async () => {
    const created = await create<Entity>();
    // Move to required state first
    await startReview(created.<entityId>, { reviewStartedAt: todayDate() });
    const updated = await approve(created.<entityId>, {
      approvedAt: todayDate(),
    });
    assert<Entity>(updated).hasStatus('Approved');
    assert.ok(updated.approvedAt);
  });

  test('should reject approval when status is not Under Review', async () => {
    const created = await create<Entity>();
    await approve(
      created.<entityId>,
      { approvedAt: todayDate() },
      createConflictError(
        `Cannot approve <entity> with status "Submitted". Must be in "Under Review" status.`
      )
    );
  });
});
```

### Conflict/duplicate tests

```ts
test('should reject duplicate uniqueField', async () => {
  const existing = await add<Entity>(factory());
  await add<Entity>(
    factory({ uniqueField: existing.uniqueField }),
    createConflictError(
      `A <entity> with <field> ${existing.uniqueField} already exists`
    )
  );
});
```

### Delete action function

Delete returns `void` on success (204 NO_CONTENT) — different from other actions that return the entity:

```ts
export async function delete<Entity>(
  <entityId>: string
): Promise<void>;
export async function delete<Entity>(
  <entityId>: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function delete<Entity>(
  <entityId>: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.<entities>[':<entityId>'].$delete({
    param: { <entityId> },
  });

  if (response.status === StatusCodes.NO_CONTENT) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received NO_CONTENT status'
    );
    return;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected NO_CONTENT status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}
```

### Delete tests (`delete-<entity>.test.ts`)

```ts
import { test, describe } from 'node:test';
import { add<Entity>, delete<Entity>, list<Entities> } from './<entity>-dsl.js';
import { assertPage } from '../../assertions.js';
import { createNotFoundError } from '../../errors.js';

describe('Delete <Entity> Endpoint', () => {
  test('should delete an existing <entity>', async () => {
    const item = await add<Entity>(walk());
    await delete<Entity>(item.<entityId>);

    // Verify entity no longer exists in list
    const page = await list<Entities>({ name: item.name, pageSize: 10, pageNumber: 1 });
    assertPage(page).hasEmptyResult();
  });

  test('should only delete the specified <entity>', async () => {
    const item1 = await add<Entity>(walk());
    await add<Entity>(cook());
    await delete<Entity>(item1.<entityId>);

    const page = await list<Entities>({ pageSize: 10, pageNumber: 1 });
    assertPage(page).hasItemsCountAtLeast(1);
  });

  test('should return 404 for non-existent <entity>', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await delete<Entity>(id, createNotFoundError(`<Entity> ${id} not found`));
  });
});
```

### File upload action function and tests

For entities that accept file uploads via multipart form, the DSL uses `createMockFile` helpers and passes `form` data:

```ts
// --- Mock file helper ---
export const createMockFile = (overrides?: {
  name?: string;
  type?: string;
  size?: number;
}): File => {
  const name = overrides?.name ?? 'test-document.pdf';
  const type = overrides?.type ?? 'application/pdf';
  const size = overrides?.size ?? 1024;
  const content = 'x'.repeat(size);
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

// --- Factory functions for file uploads ---
export const pdfDocument = (): { type: string; file: File } => ({
  type: 'Pay stubs',
  file: createMockFile({ name: 'paystub.pdf', type: 'application/pdf' }),
});

export const oversizedFile = (): { type: string; file: File } => ({
  type: 'Other',
  file: createMockFile({
    name: 'huge.pdf',
    type: 'application/pdf',
    size: 51 * 1024 * 1024,
  }),
});

export const invalidFileType = (): { type: string; file: File } => ({
  type: 'Other',
  file: createMockFile({
    name: 'script.exe',
    type: 'application/x-msdownload',
  }),
});
```

Action function uses `form` instead of `json`:

```ts
export async function add<Entity>(
  parentId: string,
  documentType: string,
  file: File
): Promise<<Entity>>;
export async function add<Entity>(
  parentId: string,
  documentType: string,
  file: File,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function add<Entity>(
  parentId: string,
  documentType: string,
  file: File,
  expectedProblemDocument?: ProblemDocument
): Promise<<Entity> | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.<parents>[':parentId'].<entities>.$post({
    param: { parentId },
    form: { file, documentType },
  });
  // ... same overload pattern
}
```

Test file validates file constraints:

```ts
describe('Add <Entity> Endpoint', () => {
  test('should upload a valid file', async () => {
    const { type, file } = pdfDocument();
    const item = await add<Entity>(parentId, type, file);
    assert<Entity>(item)
      .hasFileName('paystub.pdf')
      .hasDocumentType('Pay stubs');
  });

  test('should reject files exceeding size limit', async () => {
    const { type, file } = oversizedFile();
    await add<Entity>(
      parentId,
      type,
      file,
      createValidationError([
        /* file size error */
      ])
    );
  });

  test('should reject invalid file types', async () => {
    const { type, file } = invalidFileType();
    await add<Entity>(
      parentId,
      type,
      file,
      createValidationError([
        /* file type error */
      ])
    );
  });
});
```

## Shared helpers reference

### `assertions.ts`

- `assertPage(page)` — fluent builder: `.hasItemsCount(n)`, `.hasTotalCount(n)`, `.hasTotalPages(n)`, `.hasItemsCountAtLeast(n)`, `.hasEmptyResult()`
- `assertStrictEqualProblemDocument(actual, expected)` — compares only `status`, `detail`, and `errors` (NOT full object)

### `errors.ts`

- `emptyText` — empty string constant
- `bigText(length)` — generates string of given length
- `createValidationError(errors)` — creates ProblemDocument with BAD_REQUEST
- `createNotFoundError(detail)` — creates ProblemDocument with NOT_FOUND
- `createConflictError(detail)` — creates ProblemDocument with CONFLICT
- `validationError.tooSmall(path, min)`, `.tooBig(path, max)`, `.requiredString(path)`, `.invalidUrl(path)`, `.invalidUuid(path)`, `.invalidEmail(path)`, `.invalidEnum(path, options)`, `.notPositive(path)`, `.requiredNumber(path)`, `.nonNegative(path)`, `.tooSmallNumber(path, min)`, `.tooBigNumber(path, max)`

## Critical rules

- **`node:test`** — never Jest, Vitest, or Mocha
- **`testClient(app)`** from `hono/testing` — never supertest or raw fetch
- **All imports use `.js` extension** (NodeNext resolution)
- **`#/` alias** for src imports in tests
- **Overloaded action functions** — success returns entity, error returns ProblemDocument
- **Data-driven validation tests** with `testCases` array in nested `describe`
- **`assertStrictEqualProblemDocument`** compares only `status`, `detail`, `errors`
