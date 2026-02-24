import { describe, test } from 'node:test';
import {
  acme,
  addClient,
  johnDoe,
  janeDoe,
  addContact,
  editContact,
  assertContact,
} from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createNotFoundError,
  validationError,
} from '../../errors.js';

describe('Edit Contact Endpoint', () => {
  test('should update a contact', async () => {
    const clientItem = await addClient(acme());
    const contact = await addContact(clientItem.clientId, johnDoe());
    const newInput = janeDoe();
    const updated = await editContact(
      clientItem.clientId,
      contact.contactId,
      newInput
    );
    assertContact(updated).hasName(newInput.name).hasEmail(newInput.email);
  });

  test('should clear email when set to null', async () => {
    const clientItem = await addClient(acme());
    const contact = await addContact(clientItem.clientId, janeDoe());
    const updated = await editContact(clientItem.clientId, contact.contactId, {
      name: contact.name,
      email: null,
    });
    assertContact(updated).hasEmail(null);
  });

  test('should return 404 for non-existent contact', async () => {
    const clientItem = await addClient(acme());
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await editContact(
      clientItem.clientId,
      nonExistentId,
      johnDoe(),
      createNotFoundError(`Contact ${nonExistentId} not found`)
    );
  });

  test('should reject invalid contact UUID format', async () => {
    const clientItem = await addClient(acme());
    await editContact(
      clientItem.clientId,
      'invalid-uuid',
      johnDoe(),
      createValidationError([validationError.invalidUuid('contactId')])
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
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const clientItem = await addClient(acme());
        const contact = await addContact(clientItem.clientId, johnDoe());
        await editContact(
          clientItem.clientId,
          contact.contactId,
          input,
          expectedError
        );
      });
    }
  });
});
