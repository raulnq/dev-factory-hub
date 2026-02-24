import { describe, test } from 'node:test';
import {
  acme,
  techCorp,
  addClient,
  editClient,
  assertClient,
} from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createNotFoundError,
  validationError,
} from '../../errors.js';

describe('Edit Client Endpoint', () => {
  test('should update all client fields', async () => {
    const created = await addClient(acme());
    const input = techCorp();
    const updated = await editClient(created.clientId, {
      name: input.name,
      documentNumber: input.documentNumber,
      phone: input.phone,
      address: input.address,
      email: input.email,
    });
    assertClient(updated)
      .hasName(input.name)
      .hasDocumentNumber(input.documentNumber)
      .hasEmail(input.email);
  });

  test('should clear optional fields when set to null', async () => {
    const created = await addClient(techCorp());
    const updated = await editClient(created.clientId, {
      name: created.name,
      documentNumber: null,
      phone: null,
      address: null,
      email: null,
    });
    assertClient(updated).hasDocumentNumber(null).hasEmail(null);
  });

  test('should return 404 for non-existent client', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await editClient(
      nonExistentId,
      acme(),
      createNotFoundError(`Client ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await editClient(
      'invalid-uuid',
      acme(),
      createValidationError([validationError.invalidUuid('clientId')])
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty client name',
        override: { name: emptyText },
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject client name longer than 500 characters',
        override: { name: bigText(501) },
        expectedError: createValidationError([
          validationError.tooBig('name', 500),
        ]),
      },
    ];

    for (const { name, override, expectedError } of testCases) {
      test(name, async () => {
        const created = await addClient(acme());
        await editClient(
          created.clientId,
          { ...acme(), ...override },
          expectedError
        );
      });
    }
  });
});
