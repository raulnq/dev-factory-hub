import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, eq, inArray, lte, sql, SQL } from 'drizzle-orm';
import { createPage } from '#/pagination.js';
import { clientBalanceSummaryQuerySchema } from './schemas.js';
import { clientBalanceEntries } from './client-balance-view.js';

type SummaryMap = Map<string, { name: string; balances: Map<string, number> }>;

export const summaryRoute = new Hono().get(
  '/summary',
  zValidator('query', clientBalanceSummaryQuerySchema),
  async c => {
    const {
      currency,
      clientId,
      date,
      pageNumber = 1,
      pageSize = 10,
    } = c.req.valid('query');

    const clientIds = Array.isArray(clientId)
      ? clientId
      : clientId
        ? [clientId]
        : [];

    const filters: SQL[] = [];

    if (clientIds.length > 0)
      filters.push(inArray(clientBalanceEntries.clientId, clientIds));
    if (currency) filters.push(eq(clientBalanceEntries.currency, currency));
    if (date) filters.push(lte(clientBalanceEntries.issuedAt, date));

    const rows = await client
      .select({
        clientId: clientBalanceEntries.clientId,
        clientName: clientBalanceEntries.clientName,
        currency: clientBalanceEntries.currency,
        total: sql<number>`SUM(${clientBalanceEntries.amount})::float8`,
      })
      .from(clientBalanceEntries)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .groupBy(
        clientBalanceEntries.clientId,
        clientBalanceEntries.clientName,
        clientBalanceEntries.currency
      );

    const summaryMap: SummaryMap = new Map();
    for (const row of rows) {
      if (!row.currency) continue;
      const id = row.clientId;
      if (!summaryMap.has(id)) {
        summaryMap.set(id, {
          name: row.clientName ?? 'Unknown',
          balances: new Map(),
        });
      }
      const clientData = summaryMap.get(id)!;
      clientData.balances.set(row.currency, Math.round(row.total * 100) / 100);
    }

    const allResults = Array.from(summaryMap.entries()).map(
      ([clientId, data]) => ({
        clientId,
        clientName: data.name,
        balances: Array.from(data.balances.entries()).map(
          ([currency, balance]) => ({
            currency,
            balance,
          })
        ),
      })
    );

    allResults.sort((a, b) => a.clientName.localeCompare(b.clientName));

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const items = allResults.slice(start, end);

    return c.json(
      createPage(items, allResults.length, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
