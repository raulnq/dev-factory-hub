import { test, describe } from 'node:test';
import {
  addCollaboratorPayment,
  assertCollaboratorPayment,
  createCollaborator,
  paymentInput,
} from './collaborator-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';
import { v7 } from 'uuid';

describe('Add CollaboratorPayment Endpoint', () => {
  test('should create a payment with default pending status', async () => {
    const collaborator = await createCollaborator(10);
    const input = paymentInput(collaborator.collaboratorId, {
      grossSalary: 1000,
    });
    const item = await addCollaboratorPayment(input);

    assertCollaboratorPayment(item)
      .hasStatus('Pending')
      .hasCurrency('USD')
      .hasGrossSalary(1000)
      .hasWithholding(100)
      .hasNetSalary(900)
      .hasPaidAt(null)
      .hasConfirmedAt(null)
      .hasCanceledAt(false)
      .hasCollaboratorName(collaborator.name);
  });

  test('should calculate withholding and netSalary from collaborator percentage', async () => {
    const collaborator = await createCollaborator(15.5);
    const input = paymentInput(collaborator.collaboratorId, {
      grossSalary: 2000,
    });
    const item = await addCollaboratorPayment(input);

    assertCollaboratorPayment(item)
      .hasGrossSalary(2000)
      .hasWithholding(310)
      .hasNetSalary(1690);
  });

  test('should return 404 when collaborator does not exist', async () => {
    const input = paymentInput(v7());
    const nonExistentId = input.collaboratorId;
    await addCollaboratorPayment(
      input,
      createNotFoundError(`Collaborator ${nonExistentId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing collaboratorId',
        input: { collaboratorId: undefined, currency: 'USD', grossSalary: 100 },
        expectedError: createValidationError([
          validationError.requiredString('collaboratorId'),
        ]),
      },
      {
        name: 'should reject invalid collaboratorId',
        input: {
          collaboratorId: 'not-a-uuid',
          currency: 'USD',
          grossSalary: 100,
        },
        expectedError: createValidationError([
          validationError.invalidUuid('collaboratorId'),
        ]),
      },
      {
        name: 'should reject negative grossSalary',
        input: {
          collaboratorId: v7(),
          currency: 'USD',
          grossSalary: -1,
        },
        expectedError: createValidationError([
          {
            path: 'grossSalary',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addCollaboratorPayment(
          input as Parameters<typeof addCollaboratorPayment>[0],
          expectedError
        );
      });
    }
  });
});
