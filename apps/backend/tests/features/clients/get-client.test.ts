import { describe, test } from 'node:test';
import { acme, addClient, getClient, assertClient } from './client-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Client Endpoint', () => {
  test('should get an existing client by ID', async () => {
    const created = await addClient(acme());
    const retrieved = await getClient(created.clientId);
    assertClient(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent client', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await getClient(
      nonExistentId,
      createNotFoundError(`Client ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getClient(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('clientId')])
    );
  });
});
