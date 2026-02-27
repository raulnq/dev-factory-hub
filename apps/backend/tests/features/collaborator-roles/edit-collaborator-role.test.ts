import { test, describe } from 'node:test';
import {
  addCollaboratorRole,
  editCollaboratorRole,
  junior,
  senior,
  assertCollaboratorRole,
} from './collaborator-role-dsl.js';
import {
  emptyText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../../errors.js';
import type { CollaboratorRole } from '#/features/collaborator-roles/schemas.js';

describe('Edit Collaborator Role Endpoint', () => {
  test('should edit an existing collaborator role with valid data', async () => {
    const item = await addCollaboratorRole(junior());
    const input = senior();
    const updated = await editCollaboratorRole(item.collaboratorRoleId, input);
    assertCollaboratorRole(updated)
      .hasName(input.name)
      .hasCurrency(input.currency)
      .hasFeeRate(input.feeRate)
      .hasCostRate(input.costRate);
  });

  test('should return 404 for non-existent collaborator role', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await editCollaboratorRole(
      id,
      senior(),
      createNotFoundError(`Collaborator Role ${id} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty name',
        input: (item: CollaboratorRole) => ({ ...item, name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const item = await addCollaboratorRole(junior());
        await editCollaboratorRole(
          item.collaboratorRoleId,
          input(item),
          expectedError
        );
      });
    }
  });
});
