import { test, describe } from 'node:test';
import {
  addCollaborator,
  assertCollaborator,
  alice,
} from './collaborator-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Add Collaborator Endpoint', () => {
  test('should create a new collaborator with valid data', async () => {
    const input = alice();
    const item = await addCollaborator(input);
    assertCollaborator(item)
      .hasName(input.name)
      .hasEmail(input.email)
      .hasWithholdingPercentage(input.withholdingPercentage);
  });

  test('should create a new collaborator with optional email missing', async () => {
    const input = alice({ email: null });
    const item = await addCollaborator(input);
    assertCollaborator(item).hasEmail(null);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty name',
        input: alice({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject name longer than 500 characters',
        input: alice({ name: bigText(501) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 500),
        ]),
      },
      {
        name: 'should reject email longer than 100 characters',
        input: alice({ email: bigText(101) }),
        expectedError: createValidationError([
          validationError.tooBig('email', 100),
        ]),
      },
      {
        name: 'should reject withholdingPercentage less than 0',
        input: alice({ withholdingPercentage: -0.01 }),
        expectedError: createValidationError([
          {
            path: 'withholdingPercentage',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject withholdingPercentage greater than 100',
        input: alice({ withholdingPercentage: 100.01 }),
        expectedError: createValidationError([
          {
            path: 'withholdingPercentage',
            message: 'Too big: expected number to be <=100',
            code: 'too_big',
          },
        ]),
      },
      {
        name: 'should reject missing withholdingPercentage',
        input: alice({ withholdingPercentage: undefined }),
        expectedError: createValidationError([
          validationError.requiredNumber('withholdingPercentage'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addCollaborator(input, expectedError);
      });
    }
  });
});
