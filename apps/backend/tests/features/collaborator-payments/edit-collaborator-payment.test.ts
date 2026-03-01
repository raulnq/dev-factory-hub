import { test, describe } from 'node:test';
import {
  addCollaboratorPayment,
  assertCollaboratorPayment,
  createCollaborator,
  editCollaboratorPayment,
  editPaymentInput,
  paymentInput,
} from './collaborator-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';
import { v7 } from 'uuid';

describe('Edit CollaboratorPayment Endpoint', () => {
  test('should update currency, grossSalary and withholding, and recalculate netSalary', async () => {
    const collaborator = await createCollaborator(10);
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId, { grossSalary: 1000 })
    );

    const edit = editPaymentInput({
      currency: 'EUR',
      grossSalary: 2000,
      withholding: 300,
    });
    const item = await editCollaboratorPayment(
      created.collaboratorPaymentId,
      edit
    );

    assertCollaboratorPayment(item)
      .hasCurrency('EUR')
      .hasGrossSalary(2000)
      .hasWithholding(300)
      .hasNetSalary(1700);
  });

  test('should return 404 for non-existent payment', async () => {
    const nonExistentId = v7();
    await editCollaboratorPayment(
      nonExistentId,
      editPaymentInput(),
      createNotFoundError(`CollaboratorPayment ${nonExistentId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject negative grossSalary',
        input: editPaymentInput({ grossSalary: -1 }),
        expectedError: createValidationError([
          {
            path: 'grossSalary',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject negative withholding',
        input: editPaymentInput({ withholding: -1 }),
        expectedError: createValidationError([
          {
            path: 'withholding',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject missing currency',
        input: editPaymentInput({ currency: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('currency'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const collaborator = await createCollaborator();
        const created = await addCollaboratorPayment(
          paymentInput(collaborator.collaboratorId)
        );
        await editCollaboratorPayment(
          created.collaboratorPaymentId,
          input as Parameters<typeof editCollaboratorPayment>[1],
          expectedError
        );
      });
    }
  });
});
