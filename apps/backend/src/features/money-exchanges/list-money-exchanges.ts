import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { moneyExchanges } from './money-exchange.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { listMoneyExchangesSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listMoneyExchangesSchema),
  async c => {
    const { pageNumber, pageSize, fromCurrency, toCurrency } =
      c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (fromCurrency)
      filters.push(eq(moneyExchanges.fromCurrency, fromCurrency));
    if (toCurrency) filters.push(eq(moneyExchanges.toCurrency, toCurrency));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(moneyExchanges)
      .where(and(...filters));

    const items = await client
      .select()
      .from(moneyExchanges)
      .where(and(...filters))
      .orderBy(desc(moneyExchanges.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
