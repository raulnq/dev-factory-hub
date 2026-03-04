import { describe, test } from 'node:test';
import {
  addExchangeRate,
  assertExchangeRate,
  listExchangeRates,
  penToUsd,
  usdToEur,
} from './exchange-rate-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Exchange Rates Endpoint', () => {
  test('should filter exchange rates by fromCurrency', async () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXY';
    const uniqueCurrency =
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)];
    const item = await addExchangeRate(
      usdToEur({ fromCurrency: uniqueCurrency })
    );
    const page = await listExchangeRates({
      fromCurrency: uniqueCurrency,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertExchangeRate(page.items[0]).isTheSameOf(item);
  });

  test('should return empty result when fromCurrency has no matches', async () => {
    const page = await listExchangeRates({
      fromCurrency: 'ZZZ',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should return all records when no fromCurrency filter applied', async () => {
    await addExchangeRate(usdToEur());
    await addExchangeRate(penToUsd());
    const page = await listExchangeRates({ pageSize: 100, pageNumber: 1 });
    assertPage(page).hasItemsCountAtLeast(2);
  });

  test('should return records ordered by date descending', async () => {
    await addExchangeRate(usdToEur({ date: '2024-01-01' }));
    await addExchangeRate(usdToEur({ date: '2024-06-15' }));
    await addExchangeRate(usdToEur({ date: '2024-03-10' }));
    const page = await listExchangeRates({
      fromCurrency: 'USD',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(3);
    for (let i = 0; i < page.items.length - 1; i++) {
      const a = page.items[i].date;
      const b = page.items[i + 1].date;
      if (a < b)
        throw new Error(`Expected descending order but got ${a} before ${b}`);
    }
  });

  test('should paginate results correctly', async () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXY';
    const from =
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)];
    await addExchangeRate(usdToEur({ fromCurrency: from, date: '2024-01-01' }));
    await addExchangeRate(usdToEur({ fromCurrency: from, date: '2024-02-01' }));
    await addExchangeRate(usdToEur({ fromCurrency: from, date: '2024-03-01' }));

    const page1 = await listExchangeRates({
      fromCurrency: from,
      pageSize: 2,
      pageNumber: 1,
    });
    assertPage(page1).hasItemsCount(2).hasTotalCount(3).hasTotalPages(2);

    const page2 = await listExchangeRates({
      fromCurrency: from,
      pageSize: 2,
      pageNumber: 2,
    });
    assertPage(page2).hasItemsCount(1).hasTotalCount(3).hasTotalPages(2);
  });
});
