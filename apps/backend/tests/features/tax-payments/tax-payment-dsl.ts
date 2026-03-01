import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddTaxPayment,
  EditTaxPayment,
  ListTaxPayments,
  PayTaxPayment,
  TaxPayment,
  TaxPaymentItem,
  AddTaxPaymentItem,
} from '#/features/tax-payments/schemas.js';

// --- Helpers ---

export const todayDate = (): string => new Date().toISOString().split('T')[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapTaxPayment = (item: any): TaxPayment => ({
  ...item,
  createdAt: new Date(item.createdAt),
  paidAt: item.paidAt ? new Date(item.paidAt) : null,
  cancelledAt: item.cancelledAt ? new Date(item.cancelledAt) : null,
});

// --- Factory functions ---

export const taxPaymentInput = (
  overrides?: Partial<AddTaxPayment>
): AddTaxPayment => ({
  year: 2025,
  month: faker.number.int({ min: 1, max: 12 }),
  currency: 'USD',
  taxes: 150,
  ...overrides,
});

export const editTaxPaymentInput = (
  overrides?: Partial<EditTaxPayment>
): EditTaxPayment => ({
  currency: 'EUR',
  taxes: 200,
  ...overrides,
});

export const payInput = (
  overrides?: Partial<PayTaxPayment>
): PayTaxPayment => ({
  paidAt: todayDate(),
  number: `REC-${faker.string.alphanumeric(6)}`,
  ...overrides,
});

export const itemInput = (
  overrides?: Partial<AddTaxPaymentItem>
): AddTaxPaymentItem => ({
  type: 'ESSALUD',
  amount: 500,
  ...overrides,
});

// --- Action functions ---

export async function addTaxPayment(input: AddTaxPayment): Promise<TaxPayment>;
export async function addTaxPayment(
  input: AddTaxPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addTaxPayment(
  input: AddTaxPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<TaxPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'].$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTaxPayment(item);
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

export async function getTaxPayment(taxPaymentId: string): Promise<TaxPayment>;
export async function getTaxPayment(
  taxPaymentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getTaxPayment(
  taxPaymentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<TaxPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'][':taxPaymentId'].$get({
    param: { taxPaymentId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTaxPayment(item);
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

export async function editTaxPayment(
  taxPaymentId: string,
  input: EditTaxPayment
): Promise<TaxPayment>;
export async function editTaxPayment(
  taxPaymentId: string,
  input: EditTaxPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editTaxPayment(
  taxPaymentId: string,
  input: EditTaxPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<TaxPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'][':taxPaymentId'].$put({
    param: { taxPaymentId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTaxPayment(item);
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

export async function listTaxPayments(
  params: ListTaxPayments
): Promise<Page<TaxPayment>>;
export async function listTaxPayments(
  params: ListTaxPayments,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listTaxPayments(
  params: ListTaxPayments,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<TaxPayment> | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'].$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      year: params.year?.toString(),
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
      items: data.items.map((item: any) => mapTaxPayment(item)),
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

export async function payTaxPayment(
  taxPaymentId: string,
  input: PayTaxPayment
): Promise<TaxPayment>;
export async function payTaxPayment(
  taxPaymentId: string,
  input: PayTaxPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function payTaxPayment(
  taxPaymentId: string,
  input: PayTaxPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<TaxPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'][':taxPaymentId'].pay.$post({
    param: { taxPaymentId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTaxPayment(item);
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

export async function cancelTaxPayment(
  taxPaymentId: string
): Promise<TaxPayment>;
export async function cancelTaxPayment(
  taxPaymentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelTaxPayment(
  taxPaymentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<TaxPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'][':taxPaymentId'].cancel.$post({
    param: { taxPaymentId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapTaxPayment(item);
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

export async function addTaxPaymentItem(
  taxPaymentId: string,
  input: AddTaxPaymentItem
): Promise<TaxPaymentItem>;
export async function addTaxPaymentItem(
  taxPaymentId: string,
  input: AddTaxPaymentItem,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addTaxPaymentItem(
  taxPaymentId: string,
  input: AddTaxPaymentItem,
  expectedProblemDocument?: ProblemDocument
): Promise<TaxPaymentItem | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'][':taxPaymentId'].items.$post({
    param: { taxPaymentId },
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return item as TaxPaymentItem;
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

export async function deleteTaxPaymentItem(
  taxPaymentId: string,
  taxPaymentItemId: string
): Promise<void>;
export async function deleteTaxPaymentItem(
  taxPaymentId: string,
  taxPaymentItemId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function deleteTaxPaymentItem(
  taxPaymentId: string,
  taxPaymentItemId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['tax-payments'][':taxPaymentId'].items[
    ':taxPaymentItemId'
  ].$delete({
    param: { taxPaymentId, taxPaymentItemId },
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

export async function listTaxPaymentItems(
  taxPaymentId: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<Page<TaxPaymentItem>> {
  const api = testClient(app);
  const response = await api.api['tax-payments'][':taxPaymentId'].items.$get({
    param: { taxPaymentId },
    query: {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    },
  });
  assert.strictEqual(response.status, StatusCodes.OK);
  return response.json() as Promise<Page<TaxPaymentItem>>;
}

// --- Assertion builder ---

export const assertTaxPayment = (item: TaxPayment) => ({
  hasStatus(expected: string) {
    assert.strictEqual(item.status, expected);
    return this;
  },
  hasCurrency(expected: string) {
    assert.strictEqual(item.currency, expected);
    return this;
  },
  hasYear(expected: number) {
    assert.strictEqual(item.year, expected);
    return this;
  },
  hasMonth(expected: number) {
    assert.strictEqual(item.month, expected);
    return this;
  },
  hasTaxes(expected: number) {
    assert.strictEqual(Number(item.taxes), expected);
    return this;
  },
  hasTotal(expected: number) {
    assert.strictEqual(Number(item.total), expected);
    return this;
  },
  hasPaidAt() {
    assert.ok(item.paidAt, 'Expected paidAt to be set');
    return this;
  },
  hasCancelledAt() {
    assert.ok(item.cancelledAt, 'Expected cancelledAt to be set');
    return this;
  },
  hasNumber(expected: string | null) {
    assert.strictEqual(item.number, expected);
    return this;
  },
  isTheSameOf(expected: TaxPayment) {
    return this.hasStatus(expected.status)
      .hasCurrency(expected.currency)
      .hasYear(expected.year)
      .hasMonth(expected.month)
      .hasTaxes(Number(expected.taxes));
  },
});
