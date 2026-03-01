import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addInvoice,
  getInvoice,
  assertInvoice,
  createInvoice,
} from './invoice-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Invoice Endpoint', () => {
  test('should get an existing invoice by ID', async () => {
    const created = await addInvoice(await createInvoice());
    const retrieved = await getInvoice(created.invoiceId);
    assertInvoice(retrieved).isTheSameOf(created);
  });

  test('should include clientName from join', async () => {
    const created = await addInvoice(await createInvoice());
    const retrieved = await getInvoice(created.invoiceId);
    assert.ok(
      typeof retrieved.clientName === 'string' &&
        retrieved.clientName.length > 0,
      'Expected clientName to be populated'
    );
  });

  test('should return 404 for non-existent invoice', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await getInvoice(id, createNotFoundError(`Invoice ${id} not found`));
  });

  test('should reject invalid UUID format', async () => {
    await getInvoice(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('invoiceId')])
    );
  });
});
