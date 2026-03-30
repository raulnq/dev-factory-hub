import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, asc, eq, gte, lte, SQL } from 'drizzle-orm';
import { listClientBalanceSchema } from './schemas.js';
import { clientBalanceEntries } from './client-balance-view.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listClientBalanceSchema),
  async c => {
    const { currency, clientId, startDate, endDate } = c.req.valid('query');

    const filters: SQL[] = [
      eq(clientBalanceEntries.clientId, clientId),
      eq(clientBalanceEntries.currency, currency),
    ];

    if (startDate) filters.push(gte(clientBalanceEntries.issuedAt, startDate));
    if (endDate) filters.push(lte(clientBalanceEntries.issuedAt, endDate));

    const rows = await client
      .select({
        issuedAt: clientBalanceEntries.issuedAt,
        type: clientBalanceEntries.entryType,
        name: clientBalanceEntries.clientName,
        description: clientBalanceEntries.description,
        amount: clientBalanceEntries.amount,
      })
      .from(clientBalanceEntries)
      .where(and(...filters))
      .orderBy(asc(clientBalanceEntries.issuedAt));

    let runningBalance = 0;
    const result = rows.map(entry => {
      runningBalance = Math.round((runningBalance + entry.amount) * 100) / 100;
      return {
        issuedAt: entry.issuedAt,
        type: entry.type,
        name: entry.name ?? 'Unknown',
        description: entry.description,
        amount: entry.amount,
        balance: runningBalance,
      };
    });

    return c.json(
      { entries: result, finalBalance: runningBalance },
      StatusCodes.OK
    );
  }
);
