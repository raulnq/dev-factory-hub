import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  addTransaction,
  issueTransaction,
  cancelTransaction,
  assertTransaction,
  pendingTransaction,
  defaultIssueData,
  todayDate,
} from './transaction-dsl.js';
import {
  createNotFoundError,
  createConflictError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Issue Transaction Endpoint', () => {
  test('should issue a pending transaction with valid data', async () => {
    const created = await addTransaction(pendingTransaction());
    const issueData = defaultIssueData({
      issuedAt: todayDate(),
      number: 'TRX-001',
    });

    const issued = await issueTransaction(created.transactionId, issueData);
    assertTransaction(issued)
      .hasStatus('Issued')
      .hasIssuedAt(issueData.issuedAt)
      .hasNumber('TRX-001');
  });

  test('should return 409 when trying to issue an already issued transaction', async () => {
    const created = await addTransaction(pendingTransaction());
    await issueTransaction(created.transactionId, defaultIssueData());

    await issueTransaction(
      created.transactionId,
      defaultIssueData(),
      createConflictError(
        `Cannot issue transaction with status "Issued". Must be "Pending".`
      )
    );
  });

  test('should return 409 when trying to issue a canceled transaction', async () => {
    const created = await addTransaction(pendingTransaction());
    await cancelTransaction(created.transactionId);

    await issueTransaction(
      created.transactionId,
      defaultIssueData(),
      createConflictError(
        `Cannot issue transaction with status "Canceled". Must be "Pending".`
      )
    );
  });

  test('should return 404 for non-existent transaction', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await issueTransaction(
      id,
      defaultIssueData(),
      createNotFoundError(`Transaction ${id} not found`)
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
      {
        name: 'should reject empty number',
        input: { ...defaultIssueData(), number: '' },
        expectedError: createValidationError([
          validationError.tooSmall('number', 1),
        ]),
      },
      {
        name: 'should reject number longer than 20 characters',
        input: { ...defaultIssueData(), number: 'a'.repeat(21) },
        expectedError: createValidationError([
          validationError.tooBig('number', 20),
        ]),
      },
      {
        name: 'should reject missing number',
        input: {
          ...defaultIssueData(),
          number: undefined as unknown as string,
        },
        expectedError: createValidationError([
          validationError.requiredString('number'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const created = await addTransaction(pendingTransaction());
        await issueTransaction(
          created.transactionId,
          input as Parameters<typeof issueTransaction>[1],
          expectedError
        );
      });
    }
  });
});

describe('Cancel Transaction Endpoint', () => {
  test('should cancel a pending transaction', async () => {
    const created = await addTransaction(pendingTransaction());
    const canceled = await cancelTransaction(created.transactionId);
    assertTransaction(canceled).hasStatus('Canceled').hasCanceledAt();
  });

  test('should cancel an issued transaction', async () => {
    const created = await addTransaction(pendingTransaction());
    await issueTransaction(created.transactionId, defaultIssueData());

    const canceled = await cancelTransaction(created.transactionId);
    assertTransaction(canceled).hasStatus('Canceled').hasCanceledAt();
  });

  test('should set canceledAt to current datetime', async () => {
    const before = new Date();
    const created = await addTransaction(pendingTransaction());
    const canceled = await cancelTransaction(created.transactionId);
    const after = new Date();

    assert.ok(canceled.canceledAt, 'Expected canceledAt to be set');
    assert.ok(
      canceled.canceledAt >= before && canceled.canceledAt <= after,
      'Expected canceledAt to be within test execution time range'
    );
  });

  test('should return 409 when trying to cancel an already canceled transaction', async () => {
    const created = await addTransaction(pendingTransaction());
    await cancelTransaction(created.transactionId);

    await cancelTransaction(
      created.transactionId,
      createConflictError(
        `Cannot cancel transaction with status "Canceled". Already canceled.`
      )
    );
  });

  test('should return 404 for non-existent transaction', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await cancelTransaction(
      id,
      createNotFoundError(`Transaction ${id} not found`)
    );
  });
});
