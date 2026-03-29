import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, asc, eq, gte, lte, SQL } from 'drizzle-orm';
import { listBankBalanceSchema } from './schemas.js';
import { bankBalanceEntries } from './bank-balance-view.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listBankBalanceSchema),
  async c => {
    const { currency, startDate, endDate } = c.req.valid('query');

    const filters: SQL[] = [eq(bankBalanceEntries.currency, currency)];

    if (startDate) filters.push(gte(bankBalanceEntries.issuedAt, startDate));
    if (endDate) filters.push(lte(bankBalanceEntries.issuedAt, endDate));

    const rows = await client
      .select({
        issuedAt: bankBalanceEntries.issuedAt,
        type: bankBalanceEntries.entryType,
        description: bankBalanceEntries.description,
        total: bankBalanceEntries.total,
        taxes: bankBalanceEntries.taxes,
      })
      .from(bankBalanceEntries)
      .where(and(...filters))
      .orderBy(asc(bankBalanceEntries.issuedAt));

    let runningBalance = 0;
    const result = rows.map(entry => {
      runningBalance =
        Math.round((runningBalance + entry.total + entry.taxes) * 100) / 100;
      return { ...entry, balance: runningBalance };
    });

    return c.json(
      { entries: result, finalBalance: runningBalance },
      StatusCodes.OK
    );
  }
);
