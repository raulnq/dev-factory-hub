import { test, describe } from 'node:test';
import {
  addTransaction,
  assertTransaction,
  pendingTransaction,
} from './transaction-dsl.js';
import { createValidationError, validationError } from '../../errors.js';

const nonNegativeNumber = (path: string) =>
  createValidationError([
    {
      path,
      message: 'Too small: expected number to be >=0',
      code: 'too_small',
    },
  ]);

describe('Add Transaction Endpoint', () => {
  test('should create a new transaction with valid data', async () => {
    const input = pendingTransaction({ subtotal: 100, taxes: 18 });
    const item = await addTransaction(input);
    assertTransaction(item)
      .hasStatus('Pending')
      .hasSubtotal(100)
      .hasTaxes(18)
      .hasTotal(118)
      .hasCurrency('USD')
      .hasType('Income');
  });

  test('should compute total as subtotal + taxes', async () => {
    const input = pendingTransaction({ subtotal: 250.5, taxes: 45 });
    const item = await addTransaction(input);
    assertTransaction(item).hasTotal(295.5);
  });

  test('should accept zero subtotal and taxes', async () => {
    const input = pendingTransaction({ subtotal: 0, taxes: 0 });
    const item = await addTransaction(input);
    assertTransaction(item).hasStatus('Pending').hasTotal(0);
  });

  test('should accept Outcome type', async () => {
    const input = pendingTransaction({ type: 'Outcome' });
    const item = await addTransaction(input);
    assertTransaction(item).hasType('Outcome');
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
        name: 'should reject currency shorter than 3 characters',
        input: { ...pendingTransaction(), currency: 'US' },
        expectedError: createValidationError([
          validationError.tooSmall('currency', 3),
        ]),
      },
      {
        name: 'should reject currency longer than 3 characters',
        input: { ...pendingTransaction(), currency: 'USDD' },
        expectedError: createValidationError([
          validationError.tooBig('currency', 3),
        ]),
      },
      {
        name: 'should reject missing type',
        input: {
          ...pendingTransaction(),
          type: undefined as unknown as string,
        },
        expectedError: createValidationError([
          validationError.requiredString('type'),
        ]),
      },
      {
        name: 'should reject empty type',
        input: { ...pendingTransaction(), type: '' },
        expectedError: createValidationError([
          validationError.tooSmall('type', 1),
        ]),
      },
      {
        name: 'should reject missing subtotal',
        input: {
          ...pendingTransaction(),
          subtotal: undefined as unknown as number,
        },
        expectedError: createValidationError([
          validationError.requiredNumber('subtotal'),
        ]),
      },
      {
        name: 'should reject negative subtotal',
        input: { ...pendingTransaction(), subtotal: -1 },
        expectedError: nonNegativeNumber('subtotal'),
      },
      {
        name: 'should reject missing taxes',
        input: {
          ...pendingTransaction(),
          taxes: undefined as unknown as number,
        },
        expectedError: createValidationError([
          validationError.requiredNumber('taxes'),
        ]),
      },
      {
        name: 'should reject negative taxes',
        input: { ...pendingTransaction(), taxes: -5 },
        expectedError: nonNegativeNumber('taxes'),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addTransaction(
          input as Parameters<typeof addTransaction>[0],
          expectedError
        );
      });
    }
  });
});
