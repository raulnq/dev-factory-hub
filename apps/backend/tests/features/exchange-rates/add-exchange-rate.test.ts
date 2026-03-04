import { describe, test } from 'node:test';
import {
  addExchangeRate,
  assertExchangeRate,
  usdToEur,
} from './exchange-rate-dsl.js';
import { createValidationError, validationError } from '../../errors.js';

describe('Add Exchange Rate Endpoint', () => {
  test('should create a new exchange rate with valid data', async () => {
    const input = usdToEur();
    const item = await addExchangeRate(input);
    assertExchangeRate(item)
      .hasDate(input.date)
      .hasFromCurrency(input.fromCurrency)
      .hasToCurrency(input.toCurrency)
      .hasRate(input.rate);
  });

  test('should create an exchange rate with zero rate', async () => {
    const input = usdToEur({ rate: 0 });
    const item = await addExchangeRate(input);
    assertExchangeRate(item).hasRate(0);
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
        name: 'should reject missing fromCurrency',
        input: usdToEur({ fromCurrency: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('fromCurrency'),
        ]),
      },
      {
        name: 'should reject fromCurrency shorter than 3 characters',
        input: usdToEur({ fromCurrency: 'US' }),
        expectedError: createValidationError([
          {
            path: 'fromCurrency',
            message: 'Too small: expected string to have >=3 characters',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject fromCurrency longer than 3 characters',
        input: usdToEur({ fromCurrency: 'USDD' }),
        expectedError: createValidationError([
          {
            path: 'fromCurrency',
            message: 'Too big: expected string to have <=3 characters',
            code: 'too_big',
          },
        ]),
      },
      {
        name: 'should reject missing toCurrency',
        input: usdToEur({ toCurrency: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('toCurrency'),
        ]),
      },
      {
        name: 'should reject toCurrency shorter than 3 characters',
        input: usdToEur({ toCurrency: 'EU' }),
        expectedError: createValidationError([
          {
            path: 'toCurrency',
            message: 'Too small: expected string to have >=3 characters',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject toCurrency longer than 3 characters',
        input: usdToEur({ toCurrency: 'EURO' }),
        expectedError: createValidationError([
          {
            path: 'toCurrency',
            message: 'Too big: expected string to have <=3 characters',
            code: 'too_big',
          },
        ]),
      },
      {
        name: 'should reject missing rate',
        input: usdToEur({ rate: undefined }),
        expectedError: createValidationError([
          validationError.requiredNumber('rate'),
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
        await addExchangeRate(input, expectedError);
      });
    }
  });
});
