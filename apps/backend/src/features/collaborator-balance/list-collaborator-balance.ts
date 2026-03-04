import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import {
  and,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
  SQL,
} from 'drizzle-orm';
import { listCollaboratorBalanceSchema } from './schemas.js';
import { timesheets, worklogs } from '#/features/timesheets/timesheet.js';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { collaboratorRoles } from '#/features/collaborator-roles/collaborator-role.js';
import { collaboratorPayments } from '#/features/collaborator-payments/collaborator-payment.js';
import { payrollPayments } from '#/features/payroll-payments/payroll-payment.js';
import { exchangeRates } from '#/features/exchange-rates/exchange-rate.js';

type RawEntry = {
  issuedAt: string;
  type: 'Income' | 'Outcome';
  name: string;
  description: string;
  amount: number;
};

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listCollaboratorBalanceSchema),
  async c => {
    const { currency, collaboratorId, startDate, endDate, exchangeCurrencyTo } =
      c.req.valid('query');

    const entries: RawEntry[] = [];

    // 1. Timesheets (Completed)
    const tsCurrencyFilter = or(
      and(isNotNull(timesheets.currency), eq(timesheets.currency, currency)),
      and(isNull(timesheets.currency), eq(collaboratorRoles.currency, currency))
    );

    const tsFilters: SQL[] = [
      eq(timesheets.status, 'Completed'),
      eq(timesheets.collaboratorId, collaboratorId),
      isNotNull(timesheets.completedAt),
      ...(tsCurrencyFilter ? [tsCurrencyFilter] : []),
    ];

    if (startDate) tsFilters.push(gte(timesheets.completedAt, startDate));
    if (endDate) tsFilters.push(lte(timesheets.completedAt, endDate));

    const tsRows = await client
      .select({
        collaboratorName: collaborators.name,
        collaboratorRoleName: collaboratorRoles.name,
        startDate: timesheets.startDate,
        endDate: timesheets.endDate,
        costRate: timesheets.costRate,
        completedAt: timesheets.completedAt,
        totalHours: sql<number>`COALESCE(SUM(${worklogs.hours}), 0)::float8`,
      })
      .from(timesheets)
      .leftJoin(
        collaborators,
        eq(timesheets.collaboratorId, collaborators.collaboratorId)
      )
      .leftJoin(
        collaboratorRoles,
        eq(timesheets.collaboratorRoleId, collaboratorRoles.collaboratorRoleId)
      )
      .leftJoin(worklogs, eq(timesheets.timesheetId, worklogs.timesheetId))
      .where(and(...tsFilters))
      .groupBy(
        timesheets.timesheetId,
        collaborators.name,
        collaboratorRoles.name,
        timesheets.startDate,
        timesheets.endDate,
        timesheets.costRate,
        timesheets.completedAt
      );

    for (const ts of tsRows) {
      if (!ts.completedAt) continue;
      const collaboratorName = ts.collaboratorName ?? 'Unknown';
      const roleName = ts.collaboratorRoleName ?? 'Unknown';
      const amount = ts.totalHours * (ts.costRate ?? 0);
      if (amount <= 0) continue;
      entries.push({
        issuedAt: ts.completedAt,
        type: 'Income',
        name: collaboratorName,
        description: `Timesheet for ${collaboratorName} with the ${roleName} from ${ts.startDate} to ${ts.endDate}`,
        amount,
      });
    }

    // 2. CollaboratorPayments (Paid, netSalary > 0)
    const cpFilters: SQL[] = [
      or(
        eq(collaboratorPayments.status, 'Paid'),
        eq(collaboratorPayments.status, 'Confirmed')
      ) as SQL,
      eq(collaboratorPayments.collaboratorId, collaboratorId),
      eq(collaboratorPayments.currency, currency),
      isNotNull(collaboratorPayments.paidAt),
    ];
    if (startDate) cpFilters.push(gte(collaboratorPayments.paidAt, startDate));
    if (endDate) cpFilters.push(lte(collaboratorPayments.paidAt, endDate));

    const cpRows = await client
      .select({
        collaboratorName: collaborators.name,
        grossSalary: collaboratorPayments.grossSalary,
        netSalary: collaboratorPayments.netSalary,
        paidAt: collaboratorPayments.paidAt,
      })
      .from(collaboratorPayments)
      .leftJoin(
        collaborators,
        eq(collaboratorPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...cpFilters));

    for (const cp of cpRows) {
      if (!cp.paidAt || cp.netSalary <= 0) continue;
      const collaboratorName = cp.collaboratorName ?? 'Unknown';
      entries.push({
        issuedAt: cp.paidAt,
        type: 'Outcome',
        name: collaboratorName,
        description: `Collaborator payment to ${collaboratorName}`,
        amount: -Math.abs(cp.grossSalary),
      });
    }

    // 3. PayrollPayments (Paid, netSalary > 0)
    const ppPaidFilters: SQL[] = [
      or(
        eq(payrollPayments.status, 'Paid'),
        eq(payrollPayments.status, 'PensionPaid')
      ) as SQL,
      eq(payrollPayments.collaboratorId, collaboratorId),
      eq(payrollPayments.currency, currency),
      isNotNull(payrollPayments.paidAt),
    ];
    if (startDate) ppPaidFilters.push(gte(payrollPayments.paidAt, startDate));
    if (endDate) ppPaidFilters.push(lte(payrollPayments.paidAt, endDate));

    const ppPaidRows = await client
      .select({
        collaboratorName: collaborators.name,
        netSalary: payrollPayments.netSalary,
        paidAt: payrollPayments.paidAt,
      })
      .from(payrollPayments)
      .leftJoin(
        collaborators,
        eq(payrollPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...ppPaidFilters));

    for (const pp of ppPaidRows) {
      if (!pp.paidAt || pp.netSalary <= 0) continue;
      const collaboratorName = pp.collaboratorName ?? 'Unknown';
      entries.push({
        issuedAt: pp.paidAt,
        type: 'Outcome',
        name: collaboratorName,
        description: `Payroll payment for ${collaboratorName}`,
        amount: -Math.abs(pp.netSalary),
      });
    }

    // 4. PayrollPayments (PensionPaid, pensionAmount > 0)
    const ppPensionFilters: SQL[] = [
      eq(payrollPayments.status, 'PensionPaid'),
      eq(payrollPayments.collaboratorId, collaboratorId),
      eq(payrollPayments.currency, currency),
      isNotNull(payrollPayments.pensionPaidAt),
    ];
    if (startDate)
      ppPensionFilters.push(gte(payrollPayments.pensionPaidAt, startDate));
    if (endDate)
      ppPensionFilters.push(lte(payrollPayments.pensionPaidAt, endDate));

    const ppPensionRows = await client
      .select({
        collaboratorName: collaborators.name,
        pensionAmount: payrollPayments.pensionAmount,
        pensionPaidAt: payrollPayments.pensionPaidAt,
      })
      .from(payrollPayments)
      .leftJoin(
        collaborators,
        eq(payrollPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...ppPensionFilters));

    for (const pp of ppPensionRows) {
      if (!pp.pensionPaidAt || pp.pensionAmount <= 0) continue;
      const collaboratorName = pp.collaboratorName ?? 'Unknown';
      entries.push({
        issuedAt: pp.pensionPaidAt,
        type: 'Outcome',
        name: collaboratorName,
        description: `Payroll pension payment for ${collaboratorName}`,
        amount: -Math.abs(pp.pensionAmount),
      });
    }

    // Sort by issuedAt ascending, compute running balance
    entries.sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));

    let runningBalance = 0;
    const result = entries.map(entry => {
      runningBalance = Math.round((runningBalance + entry.amount) * 100) / 100;
      return { ...entry, balance: runningBalance };
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
        rate !== undefined ? Math.round(entry.amount * rate * 100) / 100 : 0;
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
