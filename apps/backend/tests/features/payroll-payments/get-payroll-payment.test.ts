import { test, describe } from 'node:test';
import {
  addPayrollPayment,
  assertPayrollPayment,
  createCollaborator,
  getPayrollPayment,
  paymentInput,
} from './payroll-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get PayrollPayment Endpoint', () => {
  test('should get an existing payroll payment by ID', async () => {
    const collaboratorId = await createCollaborator();
    const created = await addPayrollPayment(paymentInput(collaboratorId));
    const retrieved = await getPayrollPayment(created.payrollPaymentId);
    assertPayrollPayment(retrieved).isTheSameOf(created);
  });

  test('should return collaboratorName in response', async () => {
    const collaboratorId = await createCollaborator();
    const created = await addPayrollPayment(paymentInput(collaboratorId));
    const retrieved = await getPayrollPayment(created.payrollPaymentId);
    assertPayrollPayment(retrieved).hasCollaboratorName();
  });

  test('should return 404 for non-existent payroll payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getPayrollPayment(
      id,
      createNotFoundError(`PayrollPayment ${id} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getPayrollPayment(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('payrollPaymentId')])
    );
  });
});
