import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddTransaction,
  EditTransaction,
  IssueTransaction,
  ListTransactions,
  Transaction,
} from '#/features/transactions/schemas.js';

export const todayDate = (): string => new Date().toISOString().split('T')[0];

export const pendingTransaction = (
  overrides?: Partial<AddTransaction>
): AddTransaction => ({
  description: faker.lorem.sentence(),
  currency: 'USD',
  type: 'Income',
  subtotal: 100,
  taxes: 18,
  ...overrides,
});

export const defaultIssueData = (
  overrides?: Partial<IssueTransaction>
): IssueTransaction => ({
  issuedAt: todayDate(),
  number: `TRX-${faker.string.numeric(6)}`,
  ...overrides,
});

// --- mapTransaction helper (converts date strings to Date objects) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapTransaction = (item: any): Transaction => ({
  ...item,
  createdAt: new Date(item.createdAt),
  canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
});

// --- Action functions ---

export async function addTransaction(
  input: AddTransaction
): Promise<Transaction>;
export async function addTransaction(
  input: AddTransaction,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addTransaction(
  input: AddTransaction,
  expectedProblemDocument?: ProblemDocument
): Promise<Transaction | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.transactions.$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTransaction(item);
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

export async function getTransaction(
  transactionId: string
): Promise<Transaction>;
export async function getTransaction(
  transactionId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getTransaction(
  transactionId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Transaction | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.transactions[':transactionId'].$get({
    param: { transactionId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTransaction(item);
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

export async function editTransaction(
  transactionId: string,
  input: EditTransaction
): Promise<Transaction>;
export async function editTransaction(
  transactionId: string,
  input: EditTransaction,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editTransaction(
  transactionId: string,
  input: EditTransaction,
  expectedProblemDocument?: ProblemDocument
): Promise<Transaction | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.transactions[':transactionId'].$put({
    param: { transactionId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTransaction(item);
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

export async function listTransactions(
  params: ListTransactions
): Promise<Page<Transaction>>;
export async function listTransactions(
  params: ListTransactions,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listTransactions(
  params: ListTransactions,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Transaction> | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.transactions.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      type: params.type,
      description: params.description,
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
      items: data.items.map((item: any) => mapTransaction(item)),
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

export async function issueTransaction(
  transactionId: string,
  input: IssueTransaction
): Promise<Transaction>;
export async function issueTransaction(
  transactionId: string,
  input: IssueTransaction,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function issueTransaction(
  transactionId: string,
  input: IssueTransaction,
  expectedProblemDocument?: ProblemDocument
): Promise<Transaction | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.transactions[':transactionId'].issue.$post({
    param: { transactionId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTransaction(item);
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

export async function cancelTransaction(
  transactionId: string
): Promise<Transaction>;
export async function cancelTransaction(
  transactionId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelTransaction(
  transactionId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Transaction | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.transactions[':transactionId'].cancel.$post({
    param: { transactionId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTransaction(item);
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

// --- Assertion builder ---

export const assertTransaction = (item: Transaction) => ({
  hasStatus(expected: string) {
    assert.strictEqual(item.status, expected);
    return this;
  },
  hasTotal(expected: number) {
    assert.strictEqual(Number(item.total), expected);
    return this;
  },
  hasSubtotal(expected: number) {
    assert.strictEqual(Number(item.subtotal), expected);
    return this;
  },
  hasTaxes(expected: number) {
    assert.strictEqual(Number(item.taxes), expected);
    return this;
  },
  hasCurrency(expected: string) {
    assert.strictEqual(item.currency, expected);
    return this;
  },
  hasType(expected: string) {
    assert.strictEqual(item.type, expected);
    return this;
  },
  hasDescription(expected: string) {
    assert.strictEqual(item.description, expected);
    return this;
  },
  hasNumber(expected: string) {
    assert.strictEqual(item.number, expected);
    return this;
  },
  hasIssuedAt(expected: string) {
    assert.strictEqual(item.issuedAt, expected);
    return this;
  },
  hasCanceledAt() {
    assert.ok(item.canceledAt, 'Expected canceledAt to be set');
    return this;
  },
  isTheSameOf(expected: Transaction) {
    return this.hasStatus(expected.status)
      .hasTotal(Number(expected.total))
      .hasSubtotal(Number(expected.subtotal))
      .hasTaxes(Number(expected.taxes))
      .hasCurrency(expected.currency)
      .hasType(expected.type)
      .hasDescription(expected.description);
  },
});
