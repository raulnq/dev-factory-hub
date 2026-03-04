import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddExchangeRate,
  EditExchangeRate,
  ExchangeRate,
  ListExchangeRates,
} from '#/features/exchange-rates/schemas.js';

// --- Factory functions ---

export const todayDate = (): string => new Date().toISOString().split('T')[0];

export const usdToEur = (
  overrides?: Partial<AddExchangeRate>
): AddExchangeRate => {
  return {
    date: todayDate(),
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.9234,
    ...overrides,
  };
};

export const penToUsd = (
  overrides?: Partial<AddExchangeRate>
): AddExchangeRate => {
  return {
    date: `2025-${String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0')}-01`,
    fromCurrency: 'PEN',
    toCurrency: 'USD',
    rate: 0.2654,
    ...overrides,
  };
};

// --- Action functions ---

export async function addExchangeRate(
  input: AddExchangeRate
): Promise<ExchangeRate>;
export async function addExchangeRate(
  input: AddExchangeRate,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addExchangeRate(
  input: AddExchangeRate,
  expectedProblemDocument?: ProblemDocument
): Promise<ExchangeRate | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['exchange-rates'].$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return { ...item, createdAt: new Date(item.createdAt) };
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

export async function getExchangeRate(
  exchangeRateId: string
): Promise<ExchangeRate>;
export async function getExchangeRate(
  exchangeRateId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getExchangeRate(
  exchangeRateId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<ExchangeRate | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['exchange-rates'][':exchangeRateId'].$get({
    param: { exchangeRateId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return { ...item, createdAt: new Date(item.createdAt) };
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

export async function editExchangeRate(
  exchangeRateId: string,
  input: EditExchangeRate
): Promise<ExchangeRate>;
export async function editExchangeRate(
  exchangeRateId: string,
  input: EditExchangeRate,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editExchangeRate(
  exchangeRateId: string,
  input: EditExchangeRate,
  expectedProblemDocument?: ProblemDocument
): Promise<ExchangeRate | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['exchange-rates'][':exchangeRateId'].$put({
    param: { exchangeRateId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return { ...item, createdAt: new Date(item.createdAt) };
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

export async function listExchangeRates(
  query: ListExchangeRates
): Promise<Page<ExchangeRate>>;
export async function listExchangeRates(
  query: ListExchangeRates,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listExchangeRates(
  params: ListExchangeRates,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<ExchangeRate> | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['exchange-rates'].$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      fromCurrency: params.fromCurrency,
    },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const page = await response.json();
    assert.ok(page);
    return {
      ...page,
      items: page.items.map((item: ExchangeRate & { createdAt: string }) => ({
        ...item,
        createdAt: new Date(item.createdAt),
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

// --- Fluent assertion builder ---

export const assertExchangeRate = (item: ExchangeRate) => {
  return {
    hasDate(expected: string) {
      assert.strictEqual(
        item.date,
        expected,
        `Expected date to be ${expected}, got ${item.date}`
      );
      return this;
    },
    hasFromCurrency(expected: string) {
      assert.strictEqual(
        item.fromCurrency,
        expected,
        `Expected fromCurrency to be ${expected}, got ${item.fromCurrency}`
      );
      return this;
    },
    hasToCurrency(expected: string) {
      assert.strictEqual(
        item.toCurrency,
        expected,
        `Expected toCurrency to be ${expected}, got ${item.toCurrency}`
      );
      return this;
    },
    hasRate(expected: number) {
      assert.strictEqual(
        item.rate,
        expected,
        `Expected rate to be ${expected}, got ${item.rate}`
      );
      return this;
    },
    isTheSameOf(expected: ExchangeRate) {
      return this.hasDate(expected.date)
        .hasFromCurrency(expected.fromCurrency)
        .hasToCurrency(expected.toCurrency)
        .hasRate(expected.rate);
    },
  };
};
