import { test, describe } from 'node:test';
import {
  addCollaboratorRole,
  assertCollaboratorRole,
  junior,
} from './collaborator-role-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Add Collaborator Role Endpoint', () => {
  test('should create a new collaborator role with valid data', async () => {
    const input = junior();
    const item = await addCollaboratorRole(input);
    assertCollaboratorRole(item)
      .hasName(input.name)
      .hasCurrency(input.currency)
      .hasFeeRate(input.feeRate)
      .hasCostRate(input.costRate);
  });

  test('should create a new collaborator role with zero rates', async () => {
    const input = junior({ feeRate: 0, costRate: 0 });
    const item = await addCollaboratorRole(input);
    assertCollaboratorRole(item)
      .hasName(input.name)
      .hasCurrency(input.currency)
      .hasFeeRate(0)
      .hasCostRate(0);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty name',
        input: junior({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject name longer than 500 characters',
        input: junior({ name: bigText(501) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 500),
        ]),
      },
      {
        name: 'should reject currency not 3 characters',
        input: junior({ currency: 'US' }),
        expectedError: createValidationError([
          {
            path: 'currency',
            message: 'Too small: expected string to have >=3 characters',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject negative feeRate',
        input: junior({ feeRate: -0.01 }),
        expectedError: createValidationError([
          {
            path: 'feeRate',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject negative costRate',
        input: junior({ costRate: -1 }),
        expectedError: createValidationError([
          {
            path: 'costRate',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addCollaboratorRole(input, expectedError);
      });
    }
  });
});
