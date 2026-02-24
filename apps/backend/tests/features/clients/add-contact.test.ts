import { describe, test } from 'node:test';
import {
  acme,
  addClient,
  johnDoe,
  janeDoe,
  addContact,
  assertContact,
} from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createNotFoundError,
  validationError,
} from '../../errors.js';

describe('Add Contact Endpoint', () => {
  test('should create a contact with only required fields', async () => {
    const clientItem = await addClient(acme());
    const input = johnDoe();
    const contact = await addContact(clientItem.clientId, input);
    assertContact(contact).hasName(input.name).hasEmail(null);
  });

  test('should create a contact with email', async () => {
    const clientItem = await addClient(acme());
    const input = janeDoe();
    const contact = await addContact(clientItem.clientId, input);
    assertContact(contact).hasName(input.name).hasEmail(input.email);
  });

  test('should return 404 when client does not exist', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await addContact(
      nonExistentId,
      johnDoe(),
      createNotFoundError(`Client ${nonExistentId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty contact name',
        input: johnDoe({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject contact name longer than 500 characters',
        input: johnDoe({ name: bigText(501) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 500),
        ]),
      },
      {
        name: 'should reject email longer than 100 characters',
        input: johnDoe({ email: bigText(101) }),
        expectedError: createValidationError([
          validationError.tooBig('email', 100),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const clientItem = await addClient(acme());
        await addContact(clientItem.clientId, input, expectedError);
      });
    }
  });
});
