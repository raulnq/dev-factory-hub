import { test, describe } from 'node:test';
import {
  addPayrollPayment,
  assertPayrollPayment,
  createCollaborator,
  paymentInput,
} from './payroll-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Add PayrollPayment Endpoint', () => {
  test('should create a new payroll payment with valid data', async () => {
    const collaboratorId = await createCollaborator();
    const input = paymentInput(collaboratorId);
    const item = await addPayrollPayment(input);
    assertPayrollPayment(item)
      .hasCurrency(input.currency)
      .hasNetSalary(input.netSalary)
      .hasComission(input.comission)
      .hasTaxes(input.taxes)
      .hasPensionAmount(0)
      .hasGrossSalary(input.netSalary)
      .hasStatus('Pending')
      .hasCollaboratorName();
  });

  test('should return 404 for non-existent collaborator', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    const input = paymentInput(nonExistentId);
    await addPayrollPayment(
      input,
      createNotFoundError(`Collaborator ${nonExistentId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing collaboratorId',
        input: (collaboratorId: string) =>
          paymentInput(collaboratorId, { collaboratorId: undefined as never }),
        expectedError: createValidationError([
          validationError.requiredString('collaboratorId'),
        ]),
      },
      {
        name: 'should reject currency not exactly 3 chars',
        input: (collaboratorId: string) =>
          paymentInput(collaboratorId, { currency: 'US' }),
        expectedError: createValidationError([
          validationError.tooSmall('currency', 3),
        ]),
      },
      {
        name: 'should reject negative netSalary',
        input: (collaboratorId: string) =>
          paymentInput(collaboratorId, { netSalary: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('netSalary'),
        ]),
      },
      {
        name: 'should reject negative comission',
        input: (collaboratorId: string) =>
          paymentInput(collaboratorId, { comission: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('comission'),
        ]),
      },
      {
        name: 'should reject negative taxes',
        input: (collaboratorId: string) =>
          paymentInput(collaboratorId, { taxes: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('taxes'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const collaboratorId = await createCollaborator();
        await addPayrollPayment(input(collaboratorId), expectedError);
      });
    }
  });
});
