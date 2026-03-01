import { test, describe } from 'node:test';
import {
  addMoneyExchange,
  assertMoneyExchange,
  listMoneyExchanges,
  pendingExchange,
} from './money-exchange-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List MoneyExchanges Endpoint', () => {
  test('should return a list of money exchanges', async () => {
    await addMoneyExchange(pendingExchange());
    const page = await listMoneyExchanges({ pageNumber: 1, pageSize: 10 });
    assertPage(page).hasItemsCountAtLeast(1);
  });

  test('should filter by fromCurrency', async () => {
    const item = await addMoneyExchange(
      pendingExchange({ fromCurrency: 'JPY', toCurrency: 'USD' })
    );
    const page = await listMoneyExchanges({
      fromCurrency: 'JPY',
      pageNumber: 1,
      pageSize: 10,
    });
    assertPage(page).hasItemsCountAtLeast(1);
    assertMoneyExchange(page.items[0]).hasFromCurrency('JPY');
    assertMoneyExchange(page.items[0]).isTheSameOf(item);
  });

  test('should filter by toCurrency', async () => {
    const item = await addMoneyExchange(
      pendingExchange({ fromCurrency: 'EUR', toCurrency: 'ARS' })
    );
    const page = await listMoneyExchanges({
      toCurrency: 'ARS',
      pageNumber: 1,
      pageSize: 10,
    });
    assertPage(page).hasItemsCountAtLeast(1);
    assertMoneyExchange(page.items[0]).hasToCurrency('ARS');
    assertMoneyExchange(page.items[0]).isTheSameOf(item);
  });

  test('should return empty result when no match', async () => {
    const page = await listMoneyExchanges({
      fromCurrency: 'XYZ',
      pageNumber: 1,
      pageSize: 10,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should order results by createdAt descending', async () => {
    const first = await addMoneyExchange(
      pendingExchange({ fromCurrency: 'CAD', toCurrency: 'EUR' })
    );
    const second = await addMoneyExchange(
      pendingExchange({ fromCurrency: 'CAD', toCurrency: 'EUR' })
    );
    const page = await listMoneyExchanges({
      fromCurrency: 'CAD',
      toCurrency: 'EUR',
      pageNumber: 1,
      pageSize: 10,
    });
    assertPage(page).hasItemsCountAtLeast(2);
    // Most recent (second) should come first
    assertMoneyExchange(page.items[0]).isTheSameOf(second);
    assertMoneyExchange(page.items[1]).isTheSameOf(first);
  });
});
