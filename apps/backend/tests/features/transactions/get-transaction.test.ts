import { test, describe } from 'node:test';
import {
  addTransaction,
  getTransaction,
  assertTransaction,
  pendingTransaction,
} from './transaction-dsl.js';
import { createNotFoundError } from '../../errors.js';

describe('Get Transaction Endpoint', () => {
  test('should return a transaction by id', async () => {
    const created = await addTransaction(pendingTransaction());
    const item = await getTransaction(created.transactionId);
    assertTransaction(item).isTheSameOf(created);
  });

  test('should return 404 for non-existent transaction', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await getTransaction(
      id,
      createNotFoundError(`Transaction ${id} not found`)
    );
  });
});
