import { test, describe } from 'node:test';
import {
  addCollaborator,
  assertCollaborator,
  getCollaborator,
  alice,
} from './collaborator-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Collaborator Endpoint', () => {
  test('should get an existing collaborator by ID', async () => {
    const created = await addCollaborator(alice());
    const retrieved = await getCollaborator(created.collaboratorId);
    assertCollaborator(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent collaborator', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getCollaborator(
      id,
      createNotFoundError(`Collaborator ${id} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getCollaborator(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('collaboratorId')])
    );
  });
});
