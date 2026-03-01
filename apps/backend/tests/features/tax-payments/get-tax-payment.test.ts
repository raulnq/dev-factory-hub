import { test, describe } from 'node:test';
import {
  addTaxPayment,
  assertTaxPayment,
  getTaxPayment,
  taxPaymentInput,
} from './tax-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get TaxPayment Endpoint', () => {
  test('should get an existing tax payment by ID', async () => {
    const created = await addTaxPayment(taxPaymentInput());
    const retrieved = await getTaxPayment(created.taxPaymentId);
    assertTaxPayment(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent tax payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getTaxPayment(id, createNotFoundError(`TaxPayment ${id} not found`));
  });

  test('should reject invalid UUID format', async () => {
    await getTaxPayment(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('taxPaymentId')])
    );
  });
});
