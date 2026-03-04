import { client } from '#/database/client.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { and, count, desc, eq, type SQL } from 'drizzle-orm';
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { exchangeRates } from './exchange-rate.js';
import { listExchangeRatesSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listExchangeRatesSchema),
  async c => {
    const { pageNumber, pageSize, fromCurrency } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (fromCurrency) {
      filters.push(eq(exchangeRates.fromCurrency, fromCurrency));
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(exchangeRates)
      .where(and(...filters));

    const items = await client
      .select()
      .from(exchangeRates)
      .where(and(...filters))
      .orderBy(desc(exchangeRates.date))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
