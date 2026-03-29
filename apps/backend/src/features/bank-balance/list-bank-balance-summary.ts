import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, lte, sql, SQL } from 'drizzle-orm';
import { createPage } from '#/pagination.js';
import { bankBalanceSummaryQuerySchema } from './schemas.js';
import { bankBalanceEntries } from './bank-balance-view.js';

export const summaryRoute = new Hono().get(
  '/summary',
  zValidator('query', bankBalanceSummaryQuerySchema),
  async c => {
    const { date, pageNumber = 1, pageSize = 10 } = c.req.valid('query');

    const filters: SQL[] = [];

    if (date) filters.push(lte(bankBalanceEntries.issuedAt, date));

    const rows = await client
      .select({
        currency: bankBalanceEntries.currency,
        balance: sql<number>`SUM(${bankBalanceEntries.total} + ${bankBalanceEntries.taxes})::float8`,
      })
      .from(bankBalanceEntries)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .groupBy(bankBalanceEntries.currency);

    const allResults = rows
      .map(row => ({
        currency: row.currency,
        balance: Math.round(row.balance * 100) / 100,
      }))
      .sort((a, b) => a.currency.localeCompare(b.currency));

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const items = allResults.slice(start, end);

    return c.json(
      createPage(items, allResults.length, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
