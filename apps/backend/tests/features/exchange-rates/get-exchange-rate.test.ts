import { describe, test } from 'node:test';
import {
  addExchangeRate,
  assertExchangeRate,
  getExchangeRate,
  usdToEur,
} from './exchange-rate-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Exchange Rate Endpoint', () => {
  test('should get an existing exchange rate by ID', async () => {
    const created = await addExchangeRate(usdToEur());
    const retrieved = await getExchangeRate(created.exchangeRateId);
    assertExchangeRate(retrieved).isTheSameOf(created);
  });

  test('should return 404 for non-existent exchange rate', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getExchangeRate(
      id,
      createNotFoundError(`ExchangeRate ${id} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getExchangeRate(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('exchangeRateId')])
    );
  });
});
