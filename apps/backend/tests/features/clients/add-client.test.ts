import { describe, test } from 'node:test';
import { acme, techCorp, addClient, assertClient } from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Add Client Endpoint', () => {
  test('should create a client with only required fields', async () => {
    const input = acme();
    const item = await addClient(input);
    assertClient(item)
      .hasName(input.name)
      .hasDocumentNumber(null)
      .hasEmail(null);
  });

  test('should create a client with all fields', async () => {
    const input = techCorp();
    const item = await addClient(input);
    assertClient(item)
      .hasName(input.name)
      .hasDocumentNumber(input.documentNumber)
      .hasEmail(input.email);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty client name',
        input: acme({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject client name longer than 500 characters',
        input: acme({ name: bigText(501) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 500),
        ]),
      },
      {
        name: 'should reject documentNumber longer than 20 characters',
        input: acme({ documentNumber: bigText(21) }),
        expectedError: createValidationError([
          validationError.tooBig('documentNumber', 20),
        ]),
      },
      {
        name: 'should reject phone longer than 20 characters',
        input: acme({ phone: bigText(21) }),
        expectedError: createValidationError([
          validationError.tooBig('phone', 20),
        ]),
      },
      {
        name: 'should reject address longer than 1000 characters',
        input: acme({ address: bigText(1001) }),
        expectedError: createValidationError([
          validationError.tooBig('address', 1000),
        ]),
      },
      {
        name: 'should reject email longer than 100 characters',
        input: acme({ email: bigText(101) }),
        expectedError: createValidationError([
          validationError.tooBig('email', 100),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addClient(input, expectedError);
      });
    }
  });
});
