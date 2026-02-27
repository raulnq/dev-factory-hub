import { test, describe } from 'node:test';
import {
  addCollaboratorRole,
  assertCollaboratorRole,
  getCollaboratorRole,
  junior,
} from './collaborator-role-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Collaborator Role Endpoint', () => {
  test('should get an existing collaborator role by ID', async () => {
    const created = await addCollaboratorRole(junior());
    const retrieved = await getCollaboratorRole(created.collaboratorRoleId);
    assertCollaboratorRole(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent collaborator role', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getCollaboratorRole(
      id,
      createNotFoundError(`Collaborator Role ${id} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getCollaboratorRole(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('collaboratorRoleId')])
    );
  });
});
