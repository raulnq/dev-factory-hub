import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addPayrollPayment,
  assertPayrollPayment,
  cancelPayrollPayment,
  createCollaborator,
  payInput,
  paymentInput,
  payPayrollPayment,
  payPensionInput,
  payPensionPayrollPayment,
  todayDate,
} from './payroll-payment-dsl.js';
import {
  createConflictError,
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Pay PayrollPayment Endpoint', () => {
  test('should pay a pending payroll payment', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    const paidAt = todayDate();
    const updated = await payPayrollPayment(
      item.payrollPaymentId,
      payInput({ paidAt })
    );
    assertPayrollPayment(updated).hasStatus('Paid').hasPaidAt(paidAt);
  });

  test('should return 409 when paying a non-pending payment', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    await cancelPayrollPayment(item.payrollPaymentId);
    await payPayrollPayment(
      item.payrollPaymentId,
      payInput(),
      createConflictError(
        `Cannot pay payroll payment with status "Canceled". Must be in "Pending" status.`
      )
    );
  });

  test('should return 404 for non-existent payroll payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await payPayrollPayment(
      id,
      payInput(),
      createNotFoundError(`PayrollPayment ${id} not found`)
    );
  });

  test('should reject missing paidAt', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    await payPayrollPayment(
      item.payrollPaymentId,
      { paidAt: undefined as never },
      createValidationError([validationError.requiredString('paidAt')])
    );
  });
});

describe('PayPension PayrollPayment Endpoint', () => {
  test('should pay pension for a paid payroll payment', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    await payPayrollPayment(item.payrollPaymentId, payInput());
    const pensionPaidAt = todayDate();
    const pensionAmount = 200;
    const updated = await payPensionPayrollPayment(
      item.payrollPaymentId,
      payPensionInput({ pensionPaidAt, pensionAmount })
    );
    assertPayrollPayment(updated)
      .hasStatus('PensionPaid')
      .hasPensionPaidAt(pensionPaidAt)
      .hasPensionAmount(pensionAmount);
    assert.strictEqual(
      Number(updated.grossSalary),
      Number(item.netSalary) + pensionAmount
    );
  });

  test('should return 409 when paying pension for a non-paid payment', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    await cancelPayrollPayment(item.payrollPaymentId);
    await payPensionPayrollPayment(
      item.payrollPaymentId,
      payPensionInput(),
      createConflictError(
        `Cannot pay pension for payroll payment with status "Canceled". Must be in "Paid" status.`
      )
    );
  });

  test('should return 404 for non-existent payroll payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await payPensionPayrollPayment(
      id,
      payPensionInput(),
      createNotFoundError(`PayrollPayment ${id} not found`)
    );
  });

  test('should reject negative pensionAmount', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    await payPensionPayrollPayment(
      item.payrollPaymentId,
      payPensionInput({ pensionAmount: -1 }),
      createValidationError([validationError.nonNegative('pensionAmount')])
    );
  });
});

describe('Cancel PayrollPayment Endpoint', () => {
  test('should cancel a pending payroll payment', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    const updated = await cancelPayrollPayment(item.payrollPaymentId);
    assertPayrollPayment(updated).hasStatus('Canceled').hasCanceledAt();
  });

  test('should cancel a paid payroll payment', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    await payPayrollPayment(item.payrollPaymentId, payInput());
    const updated = await cancelPayrollPayment(item.payrollPaymentId);
    assertPayrollPayment(updated).hasStatus('Canceled').hasCanceledAt();
  });

  test('should return 409 when canceling an already canceled payment', async () => {
    const collaboratorId = await createCollaborator();
    const item = await addPayrollPayment(paymentInput(collaboratorId));
    await cancelPayrollPayment(item.payrollPaymentId);
    await cancelPayrollPayment(
      item.payrollPaymentId,
      createConflictError(
        `Cannot cancel payroll payment with status "Canceled". Already canceled.`
      )
    );
  });

  test('should return 404 for non-existent payroll payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await cancelPayrollPayment(
      id,
      createNotFoundError(`PayrollPayment ${id} not found`)
    );
  });
});
