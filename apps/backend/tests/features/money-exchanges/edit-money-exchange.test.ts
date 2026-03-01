import { test, describe } from 'node:test';
import {
  addMoneyExchange,
  assertMoneyExchange,
  editMoneyExchange,
  issueMoneyExchange,
  cancelMoneyExchange,
  pendingExchange,
  defaultIssueData,
} from './money-exchange-dsl.js';
import {
  createNotFoundError,
  createConflictError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Edit MoneyExchange Endpoint', () => {
  test('should edit a pending money exchange with valid data', async () => {
    const item = await addMoneyExchange(pendingExchange());
    const updatedInput = pendingExchange({
      fromCurrency: 'GBP',
      toCurrency: 'USD',
      rate: 1.2345,
      fromAmount: 200.0,
      toAmount: 246.9,
      toTaxes: 10.0,
      fromTaxes: 8.0,
    });
    const updated = await editMoneyExchange(item.moneyExchangeId, updatedInput);
    assertMoneyExchange(updated)
      .hasFromCurrency('GBP')
      .hasToCurrency('USD')
      .hasRate(1.2345)
      .hasFromAmount(200.0)
      .hasToAmount(246.9);
  });

  test('should return 409 when editing an issued money exchange', async () => {
    const item = await addMoneyExchange(pendingExchange());
    await issueMoneyExchange(item.moneyExchangeId, defaultIssueData());

    await editMoneyExchange(
      item.moneyExchangeId,
      pendingExchange(),
      createConflictError(
        `Cannot edit money exchange with status "Issued". Must be "Pending".`
      )
    );
  });

  test('should return 409 when editing a canceled money exchange', async () => {
    const item = await addMoneyExchange(pendingExchange());
    await cancelMoneyExchange(item.moneyExchangeId);

    await editMoneyExchange(
      item.moneyExchangeId,
      pendingExchange(),
      createConflictError(
        `Cannot edit money exchange with status "Canceled". Must be "Pending".`
      )
    );
  });

  test('should return 404 for non-existent money exchange', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await editMoneyExchange(
      id,
      pendingExchange(),
      createNotFoundError(`MoneyExchange ${id} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject negative rate',
        input: pendingExchange({ rate: -0.5 }),
        expectedError: createValidationError([
          validationError.nonNegative('rate'),
        ]),
      },
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
        name: 'should reject negative fromAmount',
        input: pendingExchange({ fromAmount: -10 }),
        expectedError: createValidationError([
          validationError.nonNegative('fromAmount'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const item = await addMoneyExchange(pendingExchange());
        await editMoneyExchange(item.moneyExchangeId, input, expectedError);
      });
    }
  });
});
