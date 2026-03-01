import { test, describe } from 'node:test';
import { addInvoice, createInvoice, assertInvoice } from './invoice-dsl.js';
import {
  createValidationError,
  createNotFoundError,
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

describe('Add Invoice Endpoint', () => {
  test('should create a new invoice with valid data', async () => {
    const input = await createInvoice({ subtotal: 100, taxes: 18 });
    const item = await addInvoice(input);
    assertInvoice(item)
      .hasStatus('Pending')
      .hasSubtotal(100)
      .hasTaxes(18)
      .hasTotal(118)
      .hasCurrency('USD')
      .hasClientId(input.clientId);
  });

  test('should compute total as subtotal + taxes', async () => {
    const input = await createInvoice({ subtotal: 250.5, taxes: 45 });
    const item = await addInvoice(input);
    assertInvoice(item).hasTotal(295.5);
  });

  test('should accept zero subtotal and taxes', async () => {
    const input = await createInvoice({ subtotal: 0, taxes: 0 });
    const item = await addInvoice(input);
    assertInvoice(item).hasStatus('Pending').hasTotal(0);
  });

  test('should return 404 when client does not exist', async () => {
    const nonExistentClientId = '01940b6d-1234-7000-8000-ef1234567890';
    const input = await createInvoice({ clientId: nonExistentClientId });
    await addInvoice(
      input,
      createNotFoundError(`Client ${nonExistentClientId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing clientId',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, clientId: undefined as unknown as string };
        },
        expectedError: createValidationError([
          validationError.requiredString('clientId'),
        ]),
      },
      {
        name: 'should reject invalid clientId UUID',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, clientId: 'not-a-uuid' };
        },
        expectedError: createValidationError([
          validationError.invalidUuid('clientId'),
        ]),
      },
      {
        name: 'should reject missing currency',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, currency: undefined as unknown as string };
        },
        expectedError: createValidationError([
          validationError.requiredString('currency'),
        ]),
      },
      {
        name: 'should reject currency not equal to 3 characters',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, currency: 'US' };
        },
        expectedError: createValidationError([
          validationError.tooSmall('currency', 3),
        ]),
      },
      {
        name: 'should reject missing subtotal',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, subtotal: undefined as unknown as number };
        },
        expectedError: createValidationError([
          validationError.requiredNumber('subtotal'),
        ]),
      },
      {
        name: 'should reject negative subtotal',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, subtotal: -1 };
        },
        expectedError: nonNegativeNumber('subtotal'),
      },
      {
        name: 'should reject missing taxes',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, taxes: undefined as unknown as number };
        },
        expectedError: createValidationError([
          validationError.requiredNumber('taxes'),
        ]),
      },
      {
        name: 'should reject negative taxes',
        buildInput: async () => {
          const input = await createInvoice();
          return { ...input, taxes: -5 };
        },
        expectedError: nonNegativeNumber('taxes'),
      },
    ];

    for (const { name, buildInput, expectedError } of testCases) {
      test(name, async () => {
        const input = await buildInput();
        await addInvoice(
          input as Parameters<typeof addInvoice>[0],
          expectedError
        );
      });
    }
  });
});
