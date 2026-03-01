import { test, describe } from 'node:test';
import {
  addPayrollPayment,
  assertPayrollPayment,
  createCollaborator,
  editPayrollPayment,
  editPaymentInput,
  paymentInput,
} from './payroll-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Edit PayrollPayment Endpoint', () => {
  test('should edit an existing payroll payment with valid data', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    const input = editPaymentInput();
    const updated = await editPayrollPayment(item.payrollPaymentId, input);
    assertPayrollPayment(updated)
      .hasCurrency(input.currency)
      .hasNetSalary(input.netSalary)
      .hasComission(input.comission)
      .hasTaxes(input.taxes)
      .hasGrossSalary(input.netSalary);
  });

  test('should recalculate grossSalary when editing netSalary', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    const input = editPaymentInput({ netSalary: 2000 });
    const updated = await editPayrollPayment(item.payrollPaymentId, input);
    assertPayrollPayment(updated).hasGrossSalary(
      2000 + Number(item.pensionAmount)
    );
  });

  test('should return 404 for non-existent payroll payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await editPayrollPayment(
      id,
      editPaymentInput(),
      createNotFoundError(`PayrollPayment ${id} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject negative netSalary',
        input: editPaymentInput({ netSalary: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('netSalary'),
        ]),
      },
      {
        name: 'should reject negative comission',
        input: editPaymentInput({ comission: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('comission'),
        ]),
      },
      {
        name: 'should reject negative taxes',
        input: editPaymentInput({ taxes: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('taxes'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const collaboratorId = await createCollaborator();
        const item = await addPayrollPayment(paymentInput(collaboratorId));
        await editPayrollPayment(item.payrollPaymentId, input, expectedError);
      });
    }
  });
});
