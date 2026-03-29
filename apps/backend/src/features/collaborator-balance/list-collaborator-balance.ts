import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, asc, eq, gte, inArray, lte, SQL } from 'drizzle-orm';
import { listCollaboratorBalanceSchema } from './schemas.js';
import { collaboratorBalanceEntries } from './collaborator-balance-view.js';
import { exchangeRates } from '#/features/exchange-rates/exchange-rate.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listCollaboratorBalanceSchema),
  async c => {
    const { currency, collaboratorId, startDate, endDate, exchangeCurrencyTo } =
      c.req.valid('query');

    const filters: SQL[] = [
      eq(collaboratorBalanceEntries.collaboratorId, collaboratorId),
      eq(collaboratorBalanceEntries.currency, currency),
    ];

    if (startDate)
      filters.push(gte(collaboratorBalanceEntries.issuedAt, startDate));
    if (endDate)
      filters.push(lte(collaboratorBalanceEntries.issuedAt, endDate));

    const rows = await client
      .select({
        issuedAt: collaboratorBalanceEntries.issuedAt,
        type: collaboratorBalanceEntries.entryType,
        name: collaboratorBalanceEntries.collaboratorName,
        description: collaboratorBalanceEntries.description,
        amount: collaboratorBalanceEntries.amount,
      })
      .from(collaboratorBalanceEntries)
      .where(and(...filters))
      .orderBy(asc(collaboratorBalanceEntries.issuedAt));

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

    if (!exchangeCurrencyTo) {
      return c.json(
        { entries: result, finalBalance: runningBalance },
        StatusCodes.OK
      );
    }

    // Exchange rate conversion
    const dates = [...new Set(result.map(e => e.issuedAt.substring(0, 10)))];
    const rateRows =
      dates.length > 0
        ? await client
            .select({ date: exchangeRates.date, rate: exchangeRates.rate })
            .from(exchangeRates)
            .where(
              and(
                eq(exchangeRates.fromCurrency, currency),
                eq(exchangeRates.toCurrency, exchangeCurrencyTo),
                inArray(exchangeRates.date, dates)
              )
            )
        : [];
    const rateMap = new Map(rateRows.map(r => [r.date, r.rate]));

    let runningConvertedBalance = 0;
    const convertedResult = result.map(entry => {
      const entryDate = entry.issuedAt.substring(0, 10);
      const rate = rateMap.get(entryDate);
      const convertedAmount =
        rate !== undefined ? Math.round((entry.amount / rate) * 100) / 100 : 0;
      runningConvertedBalance =
        Math.round((runningConvertedBalance + convertedAmount) * 100) / 100;
      return {
        ...entry,
        convertedAmount,
        convertedBalance: runningConvertedBalance,
      };
    });

    return c.json(
      {
        entries: convertedResult,
        finalBalance: runningBalance,
        finalConvertedBalance: runningConvertedBalance,
      },
      StatusCodes.OK
    );
  }
);
