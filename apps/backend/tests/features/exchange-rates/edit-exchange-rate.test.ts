import { describe, test } from 'node:test';
import {
  addExchangeRate,
  assertExchangeRate,
  editExchangeRate,
  penToUsd,
  usdToEur,
} from './exchange-rate-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Edit Exchange Rate Endpoint', () => {
  test('should edit an existing exchange rate with valid data', async () => {
    const created = await addExchangeRate(usdToEur());
    const input = penToUsd();
    const updated = await editExchangeRate(created.exchangeRateId, input);
    assertExchangeRate(updated)
      .hasDate(input.date)
      .hasFromCurrency(input.fromCurrency)
      .hasToCurrency(input.toCurrency)
      .hasRate(input.rate);
  });

  test('should return 404 for non-existent exchange rate', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await editExchangeRate(
      id,
      usdToEur(),
      createNotFoundError(`ExchangeRate ${id} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing date',
        input: usdToEur({ date: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('date'),
        ]),
      },
      {
        name: 'should reject invalid date format',
        input: usdToEur({ date: 'not-a-date' }),
        expectedError: createValidationError([
          {
            path: 'date',
            message: 'Invalid ISO date',
            code: 'invalid_format',
          },
        ]),
      },
      {
        name: 'should reject negative rate',
        input: usdToEur({ rate: -0.0001 }),
        expectedError: createValidationError([
          validationError.nonNegative('rate'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const created = await addExchangeRate(usdToEur());
        await editExchangeRate(created.exchangeRateId, input, expectedError);
      });
    }
  });
});
