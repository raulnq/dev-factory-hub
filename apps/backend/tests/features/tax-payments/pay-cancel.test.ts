import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addTaxPayment,
  assertTaxPayment,
  cancelTaxPayment,
  payInput,
  payTaxPayment,
  taxPaymentInput,
  todayDate,
} from './tax-payment-dsl.js';
import {
  createConflictError,
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Pay TaxPayment Endpoint', () => {
  test('should pay a pending tax payment', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    const paidAt = todayDate();
    const number = 'REC-001';
    const updated = await payTaxPayment(item.taxPaymentId, {
      paidAt,
      number,
    });
    assertTaxPayment(updated).hasStatus('Paid').hasPaidAt().hasNumber(number);
    assert.ok(updated.paidAt);
  });

  test('should return 409 when paying a non-pending payment (Canceled)', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    await cancelTaxPayment(item.taxPaymentId);
    await payTaxPayment(
      item.taxPaymentId,
      payInput(),
      createConflictError(
        `Cannot pay tax payment with status "Canceled". Must be in "Pending" status.`
      )
    );
  });

  test('should return 409 when paying an already paid payment', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    await payTaxPayment(item.taxPaymentId, payInput());
    await payTaxPayment(
      item.taxPaymentId,
      payInput(),
      createConflictError(
        `Cannot pay tax payment with status "Paid". Must be in "Pending" status.`
      )
    );
  });

  test('should return 404 for non-existent tax payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await payTaxPayment(
      id,
      payInput(),
      createNotFoundError(`TaxPayment ${id} not found`)
    );
  });

  test('should reject missing paidAt', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    await payTaxPayment(
      item.taxPaymentId,
      payInput({ paidAt: undefined as never }),
      createValidationError([validationError.requiredString('paidAt')])
    );
  });

  test('should reject missing number', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    await payTaxPayment(
      item.taxPaymentId,
      payInput({ number: undefined as never }),
      createValidationError([validationError.requiredString('number')])
    );
  });

  test('should reject number longer than 20 chars', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    await payTaxPayment(
      item.taxPaymentId,
      payInput({ number: 'A'.repeat(21) }),
      createValidationError([validationError.tooBig('number', 20)])
    );
  });
});

describe('Cancel TaxPayment Endpoint', () => {
  test('should cancel a pending tax payment', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    const updated = await cancelTaxPayment(item.taxPaymentId);
    assertTaxPayment(updated).hasStatus('Canceled').hasCancelledAt();
  });

  test('should cancel a paid tax payment', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    await payTaxPayment(item.taxPaymentId, payInput());
    const updated = await cancelTaxPayment(item.taxPaymentId);
    assertTaxPayment(updated).hasStatus('Canceled').hasCancelledAt();
  });

  test('should return 409 when canceling an already canceled payment', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    await cancelTaxPayment(item.taxPaymentId);
    await cancelTaxPayment(
      item.taxPaymentId,
      createConflictError(
        `Cannot cancel tax payment with status "Canceled". Must be "Pending" or "Paid".`
      )
    );
  });

  test('should return 404 for non-existent tax payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await cancelTaxPayment(
      id,
      createNotFoundError(`TaxPayment ${id} not found`)
    );
  });
});
