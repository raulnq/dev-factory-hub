import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  CollaboratorBalance,
  CollaboratorBalanceSummary,
  CollaboratorBalanceSummaryQuery,
  ListCollaboratorBalance,
} from '#/features/collaborator-balance/schemas.js';

// --- Action functions ---

export async function getCollaboratorBalanceSummary(
  params: CollaboratorBalanceSummaryQuery
): Promise<Page<CollaboratorBalanceSummary[number]>>;
export async function getCollaboratorBalanceSummary(
  params: CollaboratorBalanceSummaryQuery,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getCollaboratorBalanceSummary(
  params: CollaboratorBalanceSummaryQuery,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<CollaboratorBalanceSummary[number]> | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-balance'].summary.$get({
    query: {
      currency: params.currency,
      collaboratorId: params.collaboratorId,
      date: params.date,
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 10,
    },
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

export async function getCollaboratorBalance(
  params: ListCollaboratorBalance
): Promise<CollaboratorBalance>;
export async function getCollaboratorBalance(
  params: Omit<ListCollaboratorBalance, 'exchangeCurrencyTo'> & {
    exchangeCurrencyTo?: string;
  },
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getCollaboratorBalance(
  params: Omit<ListCollaboratorBalance, 'exchangeCurrencyTo'> & {
    exchangeCurrencyTo?: string;
  },
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorBalance | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-balance'].$get({
    query: {
      currency: params.currency,
      collaboratorId: params.collaboratorId,
      startDate: params.startDate,
      endDate: params.endDate,
      exchangeCurrencyTo: params.exchangeCurrencyTo,
    },
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

export const assertBalance = (data: CollaboratorBalance) => {
  return {
    hasEntryCount(expected: number) {
      assert.strictEqual(
        data.entries.length,
        expected,
        `Expected ${expected} entries, got ${data.entries.length}`
      );
      return this;
    },
    hasFinalBalance(expected: number) {
      assert.strictEqual(
        data.finalBalance,
        expected,
        `Expected finalBalance ${expected}, got ${data.finalBalance}`
      );
      return this;
    },
    hasFinalConvertedBalance(expected: number) {
      assert.strictEqual(
        data.finalConvertedBalance,
        expected,
        `Expected finalConvertedBalance ${expected}, got ${data.finalConvertedBalance}`
      );
      return this;
    },
    entryAt(index: number) {
      const entry = data.entries[index];
      assert.ok(entry, `No entry at index ${index}`);
      return {
        hasConvertedAmount(expected: number) {
          assert.strictEqual(
            entry.convertedAmount,
            expected,
            `Entry[${index}] expected convertedAmount ${expected}, got ${entry.convertedAmount}`
          );
          return this;
        },
        hasConvertedBalance(expected: number) {
          assert.strictEqual(
            entry.convertedBalance,
            expected,
            `Entry[${index}] expected convertedBalance ${expected}, got ${entry.convertedBalance}`
          );
          return this;
        },
      };
    },
  };
};
