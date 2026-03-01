import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddCollection,
  Collection,
  ConfirmCollection,
  EditCollection,
  ListCollections,
  DownloadUrlResponse,
} from '#/features/collections/schemas.js';
import { addClient, acme } from '../clients/client-dsl.js';

// --- Factory functions ---

export const createClient = async () => {
  return addClient(acme());
};

export const collectionInput = (
  clientId: string,
  overrides?: Partial<AddCollection>
): AddCollection => ({
  clientId,
  currency: 'USD',
  total: 1000,
  commission: 100,
  taxes: 50,
  ...overrides,
});

export const editCollectionInput = (
  overrides?: Partial<EditCollection>
): EditCollection => ({
  currency: 'EUR',
  total: 2000,
  commission: 200,
  taxes: 100,
  ...overrides,
});

export const confirmCollectionInput = (
  overrides?: Partial<ConfirmCollection>
): ConfirmCollection => ({
  confirmedAt: faker.date.recent().toISOString().split('T')[0],
  ...overrides,
});

// --- Action functions ---

export async function addCollection(input: AddCollection): Promise<Collection>;
export async function addCollection(
  input: AddCollection,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addCollection(
  input: AddCollection,
  expectedProblemDocument?: ProblemDocument
): Promise<Collection | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections.$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function getCollection(collectionId: string): Promise<Collection>;
export async function getCollection(
  collectionId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getCollection(
  collectionId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Collection | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections[':collectionId'].$get({
    param: { collectionId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function listCollections(
  params: ListCollections
): Promise<Page<Collection>>;
export async function listCollections(
  params: ListCollections,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listCollections(
  params: ListCollections,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Collection> | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      clientId: params.clientId,
    },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const data = await response.json();
    assert.ok(data);
    return {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: data.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
      })),
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function editCollection(
  collectionId: string,
  input: EditCollection
): Promise<Collection>;
export async function editCollection(
  collectionId: string,
  input: EditCollection,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editCollection(
  collectionId: string,
  input: EditCollection,
  expectedProblemDocument?: ProblemDocument
): Promise<Collection | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections[':collectionId'].$put({
    param: { collectionId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function confirmCollection(
  collectionId: string,
  input: ConfirmCollection
): Promise<Collection>;
export async function confirmCollection(
  collectionId: string,
  input: ConfirmCollection,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function confirmCollection(
  collectionId: string,
  input: ConfirmCollection,
  expectedProblemDocument?: ProblemDocument
): Promise<Collection | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections[':collectionId'].confirm.$post({
    param: { collectionId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected success status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function cancelCollection(
  collectionId: string
): Promise<Collection>;
export async function cancelCollection(
  collectionId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelCollection(
  collectionId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Collection | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections[':collectionId'].cancel.$post({
    param: { collectionId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected success status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function uploadCollection(
  collectionId: string,
  file: File
): Promise<Collection>;
export async function uploadCollection(
  collectionId: string,
  file: File,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function uploadCollection(
  collectionId: string,
  file: File,
  expectedProblemDocument?: ProblemDocument
): Promise<Collection | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections[':collectionId'].upload.$post({
    param: { collectionId },
    form: { file },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function getCollectionDownloadUrl(
  collectionId: string
): Promise<DownloadUrlResponse>;
export async function getCollectionDownloadUrl(
  collectionId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getCollectionDownloadUrl(
  collectionId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<DownloadUrlResponse | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.collections[':collectionId'][
    'download-url'
  ].$get({
    param: { collectionId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const data = await response.json();
    assert.ok(data);
    return data;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

// --- Fluent assertion builder ---

export const assertCollection = (item: Collection) => ({
  hasStatus(expected: string) {
    assert.strictEqual(
      item.status,
      expected,
      `Expected status to be ${expected}, got ${item.status}`
    );
    return this;
  },
  hasCurrency(expected: string) {
    assert.strictEqual(
      item.currency,
      expected,
      `Expected currency to be ${expected}, got ${item.currency}`
    );
    return this;
  },
  hasTotal(expected: number) {
    assert.strictEqual(
      Number(item.total),
      expected,
      `Expected total to be ${expected}, got ${item.total}`
    );
    return this;
  },
  hasCommission(expected: number) {
    assert.strictEqual(
      Number(item.commission),
      expected,
      `Expected commission to be ${expected}, got ${item.commission}`
    );
    return this;
  },
  hasTaxes(expected: number) {
    assert.strictEqual(
      Number(item.taxes),
      expected,
      `Expected taxes to be ${expected}, got ${item.taxes}`
    );
    return this;
  },
  hasConfirmedAt(expected: string | null) {
    assert.strictEqual(
      item.confirmedAt,
      expected,
      `Expected confirmedAt to be ${expected}, got ${item.confirmedAt}`
    );
    return this;
  },
  hasCanceledAt(expected: boolean) {
    if (expected) {
      assert.ok(
        item.canceledAt != null,
        'Expected canceledAt to be set but it is null'
      );
    } else {
      assert.strictEqual(
        item.canceledAt,
        null,
        'Expected canceledAt to be null'
      );
    }
    return this;
  },
  hasClientName(expected: string) {
    assert.strictEqual(
      item.clientName,
      expected,
      `Expected clientName to be ${expected}, got ${item.clientName}`
    );
    return this;
  },
  hasFilePath(expected: boolean) {
    if (expected) {
      assert.ok(
        item.filePath != null && item.filePath !== '',
        'Expected filePath to be set but it is null/empty'
      );
    } else {
      assert.ok(
        item.filePath == null || item.filePath === '',
        'Expected filePath to be null/empty'
      );
    }
    return this;
  },
});
