import { test, describe } from 'node:test';
import {
  addTaxPayment,
  assertTaxPayment,
  editTaxPayment,
  editTaxPaymentInput,
  taxPaymentInput,
} from './tax-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Edit TaxPayment Endpoint', () => {
  test('should edit currency and taxes of an existing tax payment', async () => {
    const created = await addTaxPayment(taxPaymentInput());
    const input = editTaxPaymentInput({ currency: 'EUR', taxes: 300 });
    const updated = await editTaxPayment(created.taxPaymentId, input);
    assertTaxPayment(updated).hasCurrency('EUR').hasTaxes(300);
  });

  test('should not change the total when editing', async () => {
    const created = await addTaxPayment(taxPaymentInput());
    const updated = await editTaxPayment(
      created.taxPaymentId,
      editTaxPaymentInput()
    );
    assertTaxPayment(updated).hasTotal(0);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject currency not exactly 3 chars',
        input: editTaxPaymentInput({ currency: 'US' }),
        expectedError: createValidationError([
          validationError.tooSmall('currency', 3),
        ]),
      },
      {
        name: 'should reject currency longer than 3 chars',
        input: editTaxPaymentInput({ currency: 'USDA' }),
        expectedError: createValidationError([
          validationError.tooBig('currency', 3),
        ]),
      },
      {
        name: 'should reject negative taxes',
        input: editTaxPaymentInput({ taxes: -1 }),
        expectedError: createValidationError([
          validationError.nonNegative('taxes'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const created = await addTaxPayment(taxPaymentInput());
        await editTaxPayment(created.taxPaymentId, input, expectedError);
      });
    }
  });

  test('should return 404 for non-existent tax payment', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await editTaxPayment(
      id,
      editTaxPaymentInput(),
      createNotFoundError(`TaxPayment ${id} not found`)
    );
  });
});
