import { test, describe } from 'node:test';
import {
  addMoneyExchange,
  assertMoneyExchange,
  pendingExchange,
} from './money-exchange-dsl.js';
import { createValidationError, validationError } from '../../errors.js';

describe('Add MoneyExchange Endpoint', () => {
  test('should create a new money exchange with valid data', async () => {
    const input = pendingExchange();
    const item = await addMoneyExchange(input);
    assertMoneyExchange(item)
      .hasStatus('Pending')
      .hasFromCurrency('USD')
      .hasToCurrency('EUR')
      .hasRate(0.9234)
      .hasFromAmount(100.0)
      .hasToAmount(92.34)
      .hasToTaxes(5.0)
      .hasFromTaxes(3.0);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing fromCurrency',
        input: pendingExchange({
          fromCurrency: undefined as unknown as string,
        }),
        expectedError: createValidationError([
          validationError.requiredString('fromCurrency'),
        ]),
      },
      {
        name: 'should reject fromCurrency with wrong length (2 chars)',
        input: pendingExchange({ fromCurrency: 'US' }),
        expectedError: createValidationError([
          validationError.tooSmall('fromCurrency', 3),
        ]),
      },
      {
        name: 'should reject fromCurrency with wrong length (4 chars)',
        input: pendingExchange({ fromCurrency: 'USDT' }),
        expectedError: createValidationError([
          validationError.tooBig('fromCurrency', 3),
        ]),
      },
      {
        name: 'should reject missing toCurrency',
        input: pendingExchange({ toCurrency: undefined as unknown as string }),
        expectedError: createValidationError([
          validationError.requiredString('toCurrency'),
        ]),
      },
      {
        name: 'should reject toCurrency with wrong length (2 chars)',
        input: pendingExchange({ toCurrency: 'EU' }),
        expectedError: createValidationError([
          validationError.tooSmall('toCurrency', 3),
        ]),
      },
      {
        name: 'should reject missing rate',
        input: pendingExchange({ rate: undefined as unknown as number }),
        expectedError: createValidationError([
          validationError.requiredNumber('rate'),
        ]),
      },
      {
        name: 'should reject negative rate',
        input: pendingExchange({ rate: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('rate'),
        ]),
      },
      {
        name: 'should reject missing fromAmount',
        input: pendingExchange({ fromAmount: undefined as unknown as number }),
        expectedError: createValidationError([
          validationError.requiredNumber('fromAmount'),
        ]),
      },
      {
        name: 'should reject negative fromAmount',
        input: pendingExchange({ fromAmount: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('fromAmount'),
        ]),
      },
      {
        name: 'should reject missing toAmount',
        input: pendingExchange({ toAmount: undefined as unknown as number }),
        expectedError: createValidationError([
          validationError.requiredNumber('toAmount'),
        ]),
      },
      {
        name: 'should reject negative toAmount',
        input: pendingExchange({ toAmount: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('toAmount'),
        ]),
      },
      {
        name: 'should reject missing fromTaxes',
        input: pendingExchange({ fromTaxes: undefined as unknown as number }),
        expectedError: createValidationError([
          validationError.requiredNumber('fromTaxes'),
        ]),
      },
      {
        name: 'should reject negative fromTaxes',
        input: pendingExchange({ fromTaxes: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('fromTaxes'),
        ]),
      },
      {
        name: 'should reject missing toTaxes',
        input: pendingExchange({ toTaxes: undefined as unknown as number }),
        expectedError: createValidationError([
          validationError.requiredNumber('toTaxes'),
        ]),
      },
      {
        name: 'should reject negative toTaxes',
        input: pendingExchange({ toTaxes: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('toTaxes'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addMoneyExchange(input, expectedError);
      });
    }
  });
});
