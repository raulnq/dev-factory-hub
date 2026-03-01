import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addTaxPayment,
  listTaxPayments,
  taxPaymentInput,
} from './tax-payment-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List TaxPayments Endpoint', () => {
  test('should filter tax payments by year', async () => {
    const item = await addTaxPayment(taxPaymentInput({ year: 2020, month: 1 }));
    const page = await listTaxPayments({
      year: 2020,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(1);
    const found = page.items.find(i => i.taxPaymentId === item.taxPaymentId);
    assert.ok(found);
  });

  test('should return items ordered by year desc, month desc', async () => {
    await addTaxPayment(taxPaymentInput({ year: 2021, month: 1 }));
    await addTaxPayment(taxPaymentInput({ year: 2021, month: 6 }));
    const page = await listTaxPayments({
      year: 2021,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(2);
    const months = page.items.map(i => i.month);
    for (let i = 0; i < months.length - 1; i++) {
      assert.ok(
        months[i] >= months[i + 1],
        `Expected months to be in descending order, got ${months[i]} then ${months[i + 1]}`
      );
    }
  });

  test('should return empty when no match for year', async () => {
    const page = await listTaxPayments({
      year: 1999,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should paginate results', async () => {
    const page = await listTaxPayments({
      pageSize: 5,
      pageNumber: 1,
    });
    assert.ok(page.pageSize === 5);
    assert.ok(page.pageNumber === 1);
  });
});
