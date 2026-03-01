import { test, describe } from 'node:test';
import {
  addTransaction,
  editTransaction,
  issueTransaction,
  cancelTransaction,
  assertTransaction,
  pendingTransaction,
  defaultIssueData,
} from './transaction-dsl.js';
import {
  createValidationError,
  createNotFoundError,
  createConflictError,
  validationError,
} from '../../errors.js';

const nonNegativeNumber = (path: string) =>
  createValidationError([
    {
      path,
      message: 'Too small: expected number to be >=0',
      code: 'too_small',
    },
  ]);

describe('Edit Transaction Endpoint', () => {
  test('should update a pending transaction', async () => {
    const created = await addTransaction(
      pendingTransaction({ subtotal: 100, taxes: 10 })
    );
    const updated = await editTransaction(created.transactionId, {
      description: 'Updated description',
      currency: 'EUR',
      type: 'Outcome',
      subtotal: 200,
      taxes: 20,
    });
    assertTransaction(updated)
      .hasDescription('Updated description')
      .hasCurrency('EUR')
      .hasType('Outcome')
      .hasSubtotal(200)
      .hasTaxes(20)
      .hasTotal(220);
  });

  test('should recalculate total as subtotal + taxes', async () => {
    const created = await addTransaction(pendingTransaction());
    const updated = await editTransaction(created.transactionId, {
      ...pendingTransaction(),
      subtotal: 300,
      taxes: 50,
    });
    assertTransaction(updated).hasTotal(350);
  });

  test('should return 404 for non-existent transaction', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await editTransaction(
      id,
      pendingTransaction(),
      createNotFoundError(`Transaction ${id} not found`)
    );
  });

  test('should return 409 when trying to edit an issued transaction', async () => {
    const created = await addTransaction(pendingTransaction());
    await issueTransaction(created.transactionId, defaultIssueData());

    await editTransaction(
      created.transactionId,
      pendingTransaction(),
      createConflictError(
        `Cannot edit transaction with status "Issued". Must be "Pending".`
      )
    );
  });

  test('should return 409 when trying to edit a canceled transaction', async () => {
    const created = await addTransaction(pendingTransaction());
    await cancelTransaction(created.transactionId);

    await editTransaction(
      created.transactionId,
      pendingTransaction(),
      createConflictError(
        `Cannot edit transaction with status "Canceled". Must be "Pending".`
      )
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing description',
        input: {
          ...pendingTransaction(),
          description: undefined as unknown as string,
        },
        expectedError: createValidationError([
          validationError.requiredString('description'),
        ]),
      },
      {
        name: 'should reject empty description',
        input: { ...pendingTransaction(), description: '' },
        expectedError: createValidationError([
          validationError.tooSmall('description', 1),
        ]),
      },
      {
        name: 'should reject description longer than 1000 characters',
        input: { ...pendingTransaction(), description: 'a'.repeat(1001) },
        expectedError: createValidationError([
          validationError.tooBig('description', 1000),
        ]),
      },
      {
        name: 'should reject missing currency',
        input: {
          ...pendingTransaction(),
          currency: undefined as unknown as string,
        },
        expectedError: createValidationError([
          validationError.requiredString('currency'),
        ]),
      },
      {
        name: 'should reject negative subtotal',
        input: { ...pendingTransaction(), subtotal: -1 },
        expectedError: nonNegativeNumber('subtotal'),
      },
      {
        name: 'should reject negative taxes',
        input: { ...pendingTransaction(), taxes: -5 },
        expectedError: nonNegativeNumber('taxes'),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const created = await addTransaction(pendingTransaction());
        await editTransaction(
          created.transactionId,
          input as Parameters<typeof editTransaction>[1],
          expectedError
        );
      });
    }
  });
});
