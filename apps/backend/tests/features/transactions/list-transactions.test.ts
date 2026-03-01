import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  addTransaction,
  listTransactions,
  assertTransaction,
  pendingTransaction,
} from './transaction-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Transactions Endpoint', () => {
  test('should list transactions with pagination', async () => {
    await addTransaction(pendingTransaction());
    const page = await listTransactions({ pageNumber: 1, pageSize: 10 });
    assertPage(page).hasItemsCountAtLeast(1);
  });

  test('should filter transactions by type', async () => {
    await addTransaction(pendingTransaction({ type: 'Income' }));
    await addTransaction(pendingTransaction({ type: 'Outcome' }));

    const page = await listTransactions({
      pageNumber: 1,
      pageSize: 10,
      type: 'Income',
    });
    assertPage(page).hasItemsCountAtLeast(1);
    for (const item of page.items) {
      assertTransaction(item).hasType('Income');
    }
  });

  test('should filter transactions by description partial match', async () => {
    const uniqueWord = `unique-${Date.now()}`;
    await addTransaction(
      pendingTransaction({ description: `Payment for ${uniqueWord} services` })
    );
    await addTransaction(
      pendingTransaction({ description: 'Unrelated description' })
    );

    const page = await listTransactions({
      pageNumber: 1,
      pageSize: 10,
      description: uniqueWord,
    });
    assertPage(page).hasItemsCountAtLeast(1);
    assert.ok(
      page.items.every(i => i.description.includes(uniqueWord)),
      'Expected all results to contain the search word in description'
    );
  });

  test('should return empty result when no transactions match filter', async () => {
    const page = await listTransactions({
      pageNumber: 1,
      pageSize: 10,
      description: `no-match-${Date.now()}`,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should order transactions by createdAt descending', async () => {
    const uniqueWord = `order-${Date.now()}`;
    const first = await addTransaction(
      pendingTransaction({ description: `${uniqueWord} first` })
    );
    const second = await addTransaction(
      pendingTransaction({ description: `${uniqueWord} second` })
    );

    const page = await listTransactions({
      pageNumber: 1,
      pageSize: 10,
      description: uniqueWord,
    });
    assertPage(page).hasItemsCountAtLeast(2);

    const ids = page.items.map(i => i.transactionId);
    const firstIdx = ids.indexOf(first.transactionId);
    const secondIdx = ids.indexOf(second.transactionId);

    assert.ok(
      secondIdx < firstIdx,
      'Expected more recently created transaction to appear first (createdAt descending)'
    );
  });
});
