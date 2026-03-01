import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addTaxPayment,
  assertTaxPayment,
  taxPaymentInput,
} from './tax-payment-dsl.js';
import { createValidationError, validationError } from '../../errors.js';

describe('Add TaxPayment Endpoint', () => {
  test('should create a new tax payment with valid data', async () => {
    const input = taxPaymentInput();
    const item = await addTaxPayment(input);
    assertTaxPayment(item)
      .hasStatus('Pending')
      .hasCurrency(input.currency)
      .hasYear(input.year)
      .hasMonth(input.month)
      .hasTaxes(input.taxes)
      .hasTotal(0);
  });

  test('should have null number on creation', async () => {
    const item = await addTaxPayment(taxPaymentInput());
    assert.strictEqual(item.number, null);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject year below 2001',
        input: taxPaymentInput({ year: 2000 }),
        expectedError: createValidationError([
          {
            path: 'year',
            message: 'Too small: expected number to be >=2001',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject month below 1',
        input: taxPaymentInput({ month: 0 }),
        expectedError: createValidationError([
          {
            path: 'month',
            message: 'Too small: expected number to be >=1',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject month above 13',
        input: taxPaymentInput({ month: 14 }),
        expectedError: createValidationError([
          {
            path: 'month',
            message: 'Too big: expected number to be <=13',
            code: 'too_big',
          },
        ]),
      },
      {
        name: 'should reject currency not exactly 3 chars',
        input: taxPaymentInput({ currency: 'US' }),
        expectedError: createValidationError([
          validationError.tooSmall('currency', 3),
        ]),
      },
      {
        name: 'should reject currency longer than 3 chars',
        input: taxPaymentInput({ currency: 'USDA' }),
        expectedError: createValidationError([
          validationError.tooBig('currency', 3),
        ]),
      },
      {
        name: 'should reject negative taxes',
        input: taxPaymentInput({ taxes: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('taxes'),
        ]),
      },
      {
        name: 'should reject missing year',
        input: taxPaymentInput({ year: undefined as never }),
        expectedError: createValidationError([
          validationError.requiredNumber('year'),
        ]),
      },
      {
        name: 'should reject missing month',
        input: taxPaymentInput({ month: undefined as never }),
        expectedError: createValidationError([
          validationError.requiredNumber('month'),
        ]),
      },
      {
        name: 'should reject missing currency',
        input: taxPaymentInput({ currency: undefined as never }),
        expectedError: createValidationError([
          validationError.requiredString('currency'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addTaxPayment(input, expectedError);
      });
    }
  });
});
