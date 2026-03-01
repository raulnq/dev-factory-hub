import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddMoneyExchange,
  EditMoneyExchange,
  IssueMoneyExchange,
  ListMoneyExchanges,
  MoneyExchange,
} from '#/features/money-exchanges/schemas.js';

export const todayDate = (): string => new Date().toISOString().split('T')[0];

export const pendingExchange = (
  overrides?: Partial<AddMoneyExchange>
): AddMoneyExchange => ({
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  rate: 0.9234,
  fromAmount: 100.0,
  toAmount: 92.34,
  toTaxes: 5.0,
  fromTaxes: 3.0,
  ...overrides,
});

export const defaultIssueData = (
  overrides?: Partial<IssueMoneyExchange>
): IssueMoneyExchange => ({
  issuedAt: todayDate(),
  ...overrides,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapMoneyExchange = (item: any): MoneyExchange => ({
  ...item,
  createdAt: new Date(item.createdAt),
  canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
});

// --- Action functions ---

export async function addMoneyExchange(
  input: AddMoneyExchange
): Promise<MoneyExchange>;
export async function addMoneyExchange(
  input: AddMoneyExchange,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addMoneyExchange(
  input: AddMoneyExchange,
  expectedProblemDocument?: ProblemDocument
): Promise<MoneyExchange | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['money-exchanges'].$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapMoneyExchange(item);
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

export async function getMoneyExchange(
  moneyExchangeId: string
): Promise<MoneyExchange>;
export async function getMoneyExchange(
  moneyExchangeId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getMoneyExchange(
  moneyExchangeId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<MoneyExchange | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['money-exchanges'][':moneyExchangeId'].$get({
    param: { moneyExchangeId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapMoneyExchange(item);
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

export async function editMoneyExchange(
  moneyExchangeId: string,
  input: EditMoneyExchange
): Promise<MoneyExchange>;
export async function editMoneyExchange(
  moneyExchangeId: string,
  input: EditMoneyExchange,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editMoneyExchange(
  moneyExchangeId: string,
  input: EditMoneyExchange,
  expectedProblemDocument?: ProblemDocument
): Promise<MoneyExchange | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['money-exchanges'][':moneyExchangeId'].$put({
    param: { moneyExchangeId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapMoneyExchange(item);
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

export async function listMoneyExchanges(
  params: ListMoneyExchanges
): Promise<Page<MoneyExchange>>;
export async function listMoneyExchanges(
  params: ListMoneyExchanges,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listMoneyExchanges(
  params: ListMoneyExchanges,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<MoneyExchange> | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['money-exchanges'].$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      fromCurrency: params.fromCurrency,
      toCurrency: params.toCurrency,
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
      items: data.items.map((item: any) => mapMoneyExchange(item)),
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

export async function issueMoneyExchange(
  moneyExchangeId: string,
  input: IssueMoneyExchange
): Promise<MoneyExchange>;
export async function issueMoneyExchange(
  moneyExchangeId: string,
  input: IssueMoneyExchange,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function issueMoneyExchange(
  moneyExchangeId: string,
  input: IssueMoneyExchange,
  expectedProblemDocument?: ProblemDocument
): Promise<MoneyExchange | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['money-exchanges'][
    ':moneyExchangeId'
  ].issue.$post({
    param: { moneyExchangeId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapMoneyExchange(item);
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

export async function cancelMoneyExchange(
  moneyExchangeId: string
): Promise<MoneyExchange>;
export async function cancelMoneyExchange(
  moneyExchangeId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelMoneyExchange(
  moneyExchangeId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<MoneyExchange | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['money-exchanges'][
    ':moneyExchangeId'
  ].cancel.$post({
    param: { moneyExchangeId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapMoneyExchange(item);
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

export const assertMoneyExchange = (item: MoneyExchange) => ({
  hasStatus(expected: string) {
    assert.strictEqual(item.status, expected);
    return this;
  },
  hasFromCurrency(expected: string) {
    assert.strictEqual(item.fromCurrency, expected);
    return this;
  },
  hasToCurrency(expected: string) {
    assert.strictEqual(item.toCurrency, expected);
    return this;
  },
  hasRate(expected: number) {
    assert.strictEqual(Number(item.rate), expected);
    return this;
  },
  hasFromAmount(expected: number) {
    assert.strictEqual(Number(item.fromAmount), expected);
    return this;
  },
  hasToAmount(expected: number) {
    assert.strictEqual(Number(item.toAmount), expected);
    return this;
  },
  hasToTaxes(expected: number) {
    assert.strictEqual(Number(item.toTaxes), expected);
    return this;
  },
  hasFromTaxes(expected: number) {
    assert.strictEqual(Number(item.fromTaxes), expected);
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
  isTheSameOf(expected: MoneyExchange) {
    return this.hasStatus(expected.status)
      .hasFromCurrency(expected.fromCurrency)
      .hasToCurrency(expected.toCurrency)
      .hasRate(Number(expected.rate))
      .hasFromAmount(Number(expected.fromAmount))
      .hasToAmount(Number(expected.toAmount))
      .hasToTaxes(Number(expected.toTaxes))
      .hasFromTaxes(Number(expected.fromTaxes));
  },
});
