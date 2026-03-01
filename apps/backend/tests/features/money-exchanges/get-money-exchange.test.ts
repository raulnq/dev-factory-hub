import { test, describe } from 'node:test';
import {
  addMoneyExchange,
  assertMoneyExchange,
  getMoneyExchange,
  pendingExchange,
} from './money-exchange-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get MoneyExchange Endpoint', () => {
  test('should get an existing money exchange by ID', async () => {
    const created = await addMoneyExchange(pendingExchange());
    const retrieved = await getMoneyExchange(created.moneyExchangeId);
    assertMoneyExchange(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent money exchange', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getMoneyExchange(
      id,
      createNotFoundError(`MoneyExchange ${id} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getMoneyExchange(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('moneyExchangeId')])
    );
  });
});
