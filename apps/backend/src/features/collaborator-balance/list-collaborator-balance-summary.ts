import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, eq, inArray, lte, sql, SQL } from 'drizzle-orm';
import { createPage } from '#/pagination.js';
import { collaboratorBalanceSummaryQuerySchema } from './schemas.js';
import { collaboratorBalanceEntries } from './collaborator-balance-view.js';

type SummaryMap = Map<string, { name: string; balances: Map<string, number> }>;

export const summaryRoute = new Hono().get(
  '/summary',
  zValidator('query', collaboratorBalanceSummaryQuerySchema),
  async c => {
    const {
      currency,
      collaboratorId,
      date,
      pageNumber = 1,
      pageSize = 10,
    } = c.req.valid('query');

    const collaboratorIds = Array.isArray(collaboratorId)
      ? collaboratorId
      : collaboratorId
        ? [collaboratorId]
        : [];

    const filters: SQL[] = [];

    if (collaboratorIds.length > 0)
      filters.push(
        inArray(collaboratorBalanceEntries.collaboratorId, collaboratorIds)
      );
    if (currency)
      filters.push(eq(collaboratorBalanceEntries.currency, currency));
    if (date) filters.push(lte(collaboratorBalanceEntries.issuedAt, date));

    const rows = await client
      .select({
        collaboratorId: collaboratorBalanceEntries.collaboratorId,
        collaboratorName: collaboratorBalanceEntries.collaboratorName,
        currency: collaboratorBalanceEntries.currency,
        total: sql<number>`SUM(${collaboratorBalanceEntries.amount})::float8`,
      })
      .from(collaboratorBalanceEntries)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .groupBy(
        collaboratorBalanceEntries.collaboratorId,
        collaboratorBalanceEntries.collaboratorName,
        collaboratorBalanceEntries.currency
      );

    const summaryMap: SummaryMap = new Map();
    for (const row of rows) {
      if (!row.currency) continue;
      const id = row.collaboratorId;
      if (!summaryMap.has(id)) {
        summaryMap.set(id, {
          name: row.collaboratorName ?? 'Unknown',
          balances: new Map(),
        });
      }
      const collabData = summaryMap.get(id)!;
      collabData.balances.set(row.currency, Math.round(row.total * 100) / 100);
    }

    const allResults = Array.from(summaryMap.entries()).map(
      ([collaboratorId, data]) => ({
        collaboratorId,
        collaboratorName: data.name,
        balances: Array.from(data.balances.entries()).map(
          ([currency, balance]) => ({
            currency,
            balance,
          })
        ),
      })
    );

    allResults.sort((a, b) =>
      a.collaboratorName.localeCompare(b.collaboratorName)
    );

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const items = allResults.slice(start, end);

    return c.json(
      createPage(items, allResults.length, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
