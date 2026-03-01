import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addPayrollPayment,
  assertPayrollPayment,
  createCollaborator,
  listPayrollPayments,
  paymentInput,
} from './payroll-payment-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List PayrollPayments Endpoint', () => {
  test('should list payroll payments with collaboratorName', async () => {
    const collaboratorId = await createCollaborator();
    await addPayrollPayment(paymentInput(collaboratorId));
    const page = await listPayrollPayments({
      collaboratorId,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(1);
    assertPayrollPayment(page.items[0]).hasCollaboratorName();
  });

  test('should filter by collaboratorId', async () => {
    const collaboratorId1 = await createCollaborator();
    const collaboratorId2 = await createCollaborator();
    await addPayrollPayment(paymentInput(collaboratorId1));
    await addPayrollPayment(paymentInput(collaboratorId2));

    const page = await listPayrollPayments({
      collaboratorId: collaboratorId1,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(1);
    page.items.forEach(item => {
      assert.strictEqual(item.collaboratorId, collaboratorId1);
    });
  });

  test('should return empty when collaboratorId has no payments', async () => {
    const collaboratorId = await createCollaborator();
    const page = await listPayrollPayments({
      collaboratorId,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should order by createdAt descending', async () => {
    const collaboratorId = await createCollaborator();
    const first = await addPayrollPayment(paymentInput(collaboratorId));
    const second = await addPayrollPayment(paymentInput(collaboratorId));
    const page = await listPayrollPayments({
      collaboratorId,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(2);
    assert.ok(
      page.items[0].createdAt >= page.items[1].createdAt,
      'Items should be ordered by createdAt descending'
    );
    assert.strictEqual(page.items[0].payrollPaymentId, second.payrollPaymentId);
    assert.strictEqual(page.items[1].payrollPaymentId, first.payrollPaymentId);
  });
});
