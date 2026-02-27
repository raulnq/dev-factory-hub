import { test, describe } from 'node:test';
import {
  addCollaborator,
  editCollaborator,
  alice,
  bob,
  assertCollaborator,
} from './collaborator-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../../errors.js';
import type { Collaborator } from '#/features/collaborators/schemas.js';

describe('Edit Collaborator Endpoint', () => {
  test('should edit an existing collaborator with valid data', async () => {
    const item = await addCollaborator(alice());
    const input = bob();
    const updated = await editCollaborator(item.collaboratorId, input);
    assertCollaborator(updated)
      .hasName(input.name)
      .hasEmail(input.email)
      .hasWithholdingPercentage(input.withholdingPercentage);
  });

  describe('Property validations', async () => {
    const testCases = [
      {
        name: 'should reject empty name',
        input: (item: Collaborator) => ({ ...item, name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject name longer than 500 characters',
        input: (item: Collaborator) => ({ ...item, name: bigText(501) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 500),
        ]),
      },
      {
        name: 'should reject withholdingPercentage less than 0',
        input: (item: Collaborator) => ({ ...item, withholdingPercentage: -1 }),
        expectedError: createValidationError([
          {
            path: 'withholdingPercentage',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
    ];
    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const item = await addCollaborator(alice());
        await editCollaborator(item.collaboratorId, input(item), expectedError);
      });
    }
  });

  test('should return 404 for non-existent collaborator', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await editCollaborator(
      id,
      bob(),
      createNotFoundError(`Collaborator ${id} not found`)
    );
  });
});
