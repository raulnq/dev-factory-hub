import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addTaxPayment,
  addTaxPaymentItem,
  assertTaxPayment,
  cancelTaxPayment,
  deleteTaxPaymentItem,
  getTaxPayment,
  itemInput,
  listTaxPaymentItems,
  taxPaymentInput,
} from './tax-payment-dsl.js';
import { assertPage } from '../../assertions.js';
import {
  createConflictError,
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Add TaxPaymentItem Endpoint', () => {
  test('should add an item and update tax payment total', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    const item = await addTaxPaymentItem(
      taxPayment.taxPaymentId,
      itemInput({ amount: 300 })
    );
    assert.ok(item.taxPaymentItemId);
    assert.strictEqual(item.taxPaymentId, taxPayment.taxPaymentId);
    assert.strictEqual(Number(item.amount), 300);

    const updated = await getTaxPayment(taxPayment.taxPaymentId);
    assertTaxPayment(updated).hasTotal(300);
  });

  test('should accumulate total across multiple items', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    await addTaxPaymentItem(
      taxPayment.taxPaymentId,
      itemInput({ amount: 100 })
    );
    await addTaxPaymentItem(
      taxPayment.taxPaymentId,
      itemInput({ amount: 200 })
    );
    const updated = await getTaxPayment(taxPayment.taxPaymentId);
    assertTaxPayment(updated).hasTotal(300);
  });

  test('should return 409 when adding to non-pending tax payment', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    await cancelTaxPayment(taxPayment.taxPaymentId);
    await addTaxPaymentItem(
      taxPayment.taxPaymentId,
      itemInput(),
      createConflictError(
        `Cannot add items to tax payment with status "Canceled". Must be "Pending".`
      )
    );
  });

  test('should return 404 for non-existent tax payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await addTaxPaymentItem(
      id,
      itemInput(),
      createNotFoundError(`TaxPayment ${id} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty type',
        item: itemInput({ type: '' }),
        expectedError: createValidationError([
          validationError.tooSmall('type', 1),
        ]),
      },
      {
        name: 'should reject negative amount',
        item: itemInput({ amount: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('amount'),
        ]),
      },
    ];

    for (const { name, item, expectedError } of testCases) {
      test(name, async () => {
        const taxPayment = await addTaxPayment(taxPaymentInput());
        await addTaxPaymentItem(taxPayment.taxPaymentId, item, expectedError);
      });
    }
  });
});

describe('Delete TaxPaymentItem Endpoint', () => {
  test('should delete an item and update tax payment total', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    const item = await addTaxPaymentItem(
      taxPayment.taxPaymentId,
      itemInput({ amount: 400 })
    );
    await deleteTaxPaymentItem(taxPayment.taxPaymentId, item.taxPaymentItemId);

    const updated = await getTaxPayment(taxPayment.taxPaymentId);
    assertTaxPayment(updated).hasTotal(0);
  });

  test('should return 409 when deleting from non-pending tax payment', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    const item = await addTaxPaymentItem(taxPayment.taxPaymentId, itemInput());
    await cancelTaxPayment(taxPayment.taxPaymentId);
    await deleteTaxPaymentItem(
      taxPayment.taxPaymentId,
      item.taxPaymentItemId,
      createConflictError(
        `Cannot remove items from tax payment with status "Canceled". Must be "Pending".`
      )
    );
  });

  test('should return 404 for non-existent tax payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await deleteTaxPaymentItem(
      id,
      '01940b6d-1234-7890-abcd-ef1234567891',
      createNotFoundError(`TaxPayment ${id} not found`)
    );
  });

  test('should return 404 for non-existent item', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    const itemId = '01940b6d-1234-7890-abcd-ef1234567891';
    await deleteTaxPaymentItem(
      taxPayment.taxPaymentId,
      itemId,
      createNotFoundError(`TaxPaymentItem ${itemId} not found`)
    );
  });
});

describe('List TaxPaymentItems Endpoint', () => {
  test('should list items for a tax payment', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    await addTaxPaymentItem(taxPayment.taxPaymentId, itemInput());
    await addTaxPaymentItem(
      taxPayment.taxPaymentId,
      itemInput({ type: 'RENTA', amount: 100 })
    );

    const page = await listTaxPaymentItems(taxPayment.taxPaymentId);
    assertPage(page).hasItemsCount(2);
  });

  test('should return empty page when no items', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    const page = await listTaxPaymentItems(taxPayment.taxPaymentId);
    assertPage(page).hasEmptyResult();
  });

  test('should paginate items', async () => {
    const taxPayment = await addTaxPayment(taxPaymentInput());
    for (let i = 0; i < 3; i++) {
      await addTaxPaymentItem(
        taxPayment.taxPaymentId,
        itemInput({ amount: (i + 1) * 100 })
      );
    }
    const page = await listTaxPaymentItems(taxPayment.taxPaymentId, 1, 2);
    assertPage(page).hasItemsCount(2).hasTotalCount(3);
    assert.strictEqual(page.totalPages, 2);
  });
});
