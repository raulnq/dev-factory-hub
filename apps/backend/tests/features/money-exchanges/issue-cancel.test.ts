import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  addMoneyExchange,
  assertMoneyExchange,
  issueMoneyExchange,
  cancelMoneyExchange,
  pendingExchange,
  defaultIssueData,
  todayDate,
} from './money-exchange-dsl.js';
import {
  createNotFoundError,
  createConflictError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Issue MoneyExchange Endpoint', () => {
  test('should issue a pending money exchange with valid data', async () => {
    const created = await addMoneyExchange(pendingExchange());
    const issueData = defaultIssueData({ issuedAt: todayDate() });

    const issued = await issueMoneyExchange(created.moneyExchangeId, issueData);
    assertMoneyExchange(issued)
      .hasStatus('Issued')
      .hasIssuedAt(issueData.issuedAt);
  });

  test('should return 409 when trying to issue an already issued money exchange', async () => {
    const created = await addMoneyExchange(pendingExchange());
    await issueMoneyExchange(created.moneyExchangeId, defaultIssueData());

    await issueMoneyExchange(
      created.moneyExchangeId,
      defaultIssueData(),
      createConflictError(
        `Cannot issue money exchange with status "Issued". Must be "Pending".`
      )
    );
  });

  test('should return 409 when trying to issue a canceled money exchange', async () => {
    const created = await addMoneyExchange(pendingExchange());
    await cancelMoneyExchange(created.moneyExchangeId);

    await issueMoneyExchange(
      created.moneyExchangeId,
      defaultIssueData(),
      createConflictError(
        `Cannot issue money exchange with status "Canceled". Must be "Pending".`
      )
    );
  });

  test('should return 404 for non-existent money exchange', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await issueMoneyExchange(
      id,
      defaultIssueData(),
      createNotFoundError(`MoneyExchange ${id} not found`)
    );
  });

  describe('Issue validation', () => {
    const testCases = [
      {
        name: 'should reject missing issuedAt',
        input: {
          ...defaultIssueData(),
          issuedAt: undefined as unknown as string,
        },
        expectedError: createValidationError([
          validationError.requiredString('issuedAt'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const created = await addMoneyExchange(pendingExchange());
        await issueMoneyExchange(
          created.moneyExchangeId,
          input as Parameters<typeof issueMoneyExchange>[1],
          expectedError
        );
      });
    }
  });
});

describe('Cancel MoneyExchange Endpoint', () => {
  test('should cancel a pending money exchange', async () => {
    const created = await addMoneyExchange(pendingExchange());
    const canceled = await cancelMoneyExchange(created.moneyExchangeId);
    assertMoneyExchange(canceled).hasStatus('Canceled').hasCanceledAt();
  });

  test('should cancel an issued money exchange', async () => {
    const created = await addMoneyExchange(pendingExchange());
    await issueMoneyExchange(created.moneyExchangeId, defaultIssueData());

    const canceled = await cancelMoneyExchange(created.moneyExchangeId);
    assertMoneyExchange(canceled).hasStatus('Canceled').hasCanceledAt();
  });

  test('should set canceledAt to current datetime', async () => {
    const before = new Date();
    const created = await addMoneyExchange(pendingExchange());
    const canceled = await cancelMoneyExchange(created.moneyExchangeId);
    const after = new Date();

    assert.ok(canceled.canceledAt, 'Expected canceledAt to be set');
    assert.ok(
      canceled.canceledAt >= before && canceled.canceledAt <= after,
      'Expected canceledAt to be within test execution time range'
    );
  });

  test('should return 409 when trying to cancel an already canceled money exchange', async () => {
    const created = await addMoneyExchange(pendingExchange());
    await cancelMoneyExchange(created.moneyExchangeId);

    await cancelMoneyExchange(
      created.moneyExchangeId,
      createConflictError(
        `Cannot cancel money exchange with status "Canceled". Already canceled.`
      )
    );
  });

  test('should return 404 for non-existent money exchange', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await cancelMoneyExchange(
      id,
      createNotFoundError(`MoneyExchange ${id} not found`)
    );
  });
});
