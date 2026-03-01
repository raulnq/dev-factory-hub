import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, eq, gte, isNotNull, lte, or, SQL } from 'drizzle-orm';
import { listBankBalanceSchema } from './schemas.js';
import { transactions } from '#/features/transactions/transaction.js';
import { collections } from '#/features/collections/collection.js';
import { clients } from '#/features/clients/client.js';
import { collaboratorPayments } from '#/features/collaborator-payments/collaborator-payment.js';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { moneyExchanges } from '#/features/money-exchanges/money-exchange.js';
import { payrollPayments } from '#/features/payroll-payments/payroll-payment.js';
import { taxPayments } from '#/features/tax-payments/tax-payment.js';

type RawEntry = {
  issuedAt: string;
  type: 'Income' | 'Outcome';
  description: string;
  total: number;
  taxes: number;
};

function negAbsOrZero(value: number): number {
  return value > 0 ? -Math.abs(value) : 0;
}

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listBankBalanceSchema),
  async c => {
    const { currency, startDate, endDate } = c.req.valid('query');

    const entries: RawEntry[] = [];

    // 1. Transactions (Issued, total > 0)
    const txFilters: SQL[] = [
      eq(transactions.status, 'Issued'),
      eq(transactions.currency, currency),
      isNotNull(transactions.issuedAt),
    ];
    if (startDate) txFilters.push(gte(transactions.issuedAt, startDate));
    if (endDate) txFilters.push(lte(transactions.issuedAt, endDate));

    const txRows = await client
      .select()
      .from(transactions)
      .where(and(...txFilters));

    for (const tx of txRows) {
      if (!tx.issuedAt || tx.total <= 0) continue;
      const isIncome = tx.type === 'Income';
      entries.push({
        issuedAt: tx.issuedAt,
        type: tx.type as 'Income' | 'Outcome',
        description: tx.description,
        total: isIncome ? tx.total : -Math.abs(tx.total),
        taxes: 0,
      });
    }

    // 2. Collections (Confirmed)
    const colFilters: SQL[] = [
      eq(collections.status, 'Confirmed'),
      eq(collections.currency, currency),
      isNotNull(collections.confirmedAt),
    ];
    if (startDate) colFilters.push(gte(collections.confirmedAt, startDate));
    if (endDate) colFilters.push(lte(collections.confirmedAt, endDate));

    const colRows = await client
      .select({
        clientName: clients.name,
        total: collections.total,
        commission: collections.commission,
        taxes: collections.taxes,
        confirmedAt: collections.confirmedAt,
      })
      .from(collections)
      .leftJoin(clients, eq(collections.clientId, clients.clientId))
      .where(and(...colFilters));

    for (const col of colRows) {
      if (!col.confirmedAt) continue;
      const clientName = col.clientName ?? 'Unknown';

      if (col.total > 0) {
        entries.push({
          issuedAt: col.confirmedAt,
          type: 'Income',
          description: `Collection for ${clientName}`,
          total: col.total,
          taxes: negAbsOrZero(col.taxes),
        });
      }
      if (col.commission > 0) {
        entries.push({
          issuedAt: col.confirmedAt,
          type: 'Outcome',
          description: `Commission's collection for ${clientName}`,
          total: -Math.abs(col.commission),
          taxes: 0,
        });
      }
    }

    // 3. CollaboratorPayments (Paid, netSalary > 0)
    const cpFilters: SQL[] = [
      eq(collaboratorPayments.status, 'Paid'),
      eq(collaboratorPayments.currency, currency),
      isNotNull(collaboratorPayments.paidAt),
    ];
    if (startDate) cpFilters.push(gte(collaboratorPayments.paidAt, startDate));
    if (endDate) cpFilters.push(lte(collaboratorPayments.paidAt, endDate));

    const cpRows = await client
      .select({
        collaboratorName: collaborators.name,
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
      entries.push({
        issuedAt: cp.paidAt,
        type: 'Outcome',
        description: `Collaborator payment to ${cp.collaboratorName ?? 'Unknown'}`,
        total: -Math.abs(cp.netSalary),
        taxes: 0,
      });
    }

    // 4. MoneyExchanges (Issued, from or to currency match)
    const meCurrencyFilter = or(
      eq(moneyExchanges.fromCurrency, currency),
      eq(moneyExchanges.toCurrency, currency)
    );
    const meFilters: SQL[] = [
      eq(moneyExchanges.status, 'Issued'),
      isNotNull(moneyExchanges.issuedAt),
      ...(meCurrencyFilter ? [meCurrencyFilter] : []),
    ];
    if (startDate) meFilters.push(gte(moneyExchanges.issuedAt, startDate));
    if (endDate) meFilters.push(lte(moneyExchanges.issuedAt, endDate));

    const meRows = await client
      .select()
      .from(moneyExchanges)
      .where(and(...meFilters));

    for (const me of meRows) {
      if (!me.issuedAt) continue;
      if (me.fromCurrency === currency && me.fromAmount > 0) {
        entries.push({
          issuedAt: me.issuedAt,
          type: 'Outcome',
          description: `Exchange from ${me.fromCurrency}`,
          total: -Math.abs(me.fromAmount),
          taxes: negAbsOrZero(me.fromTaxes),
        });
      }
      if (me.toCurrency === currency && me.toAmount > 0) {
        entries.push({
          issuedAt: me.issuedAt,
          type: 'Income',
          description: `Exchange to ${me.toCurrency}`,
          total: me.toAmount,
          taxes: negAbsOrZero(me.toTaxes),
        });
      }
    }

    // 5a. PayrollPayments (Paid)
    const ppPaidFilters: SQL[] = [
      eq(payrollPayments.status, 'Paid'),
      eq(payrollPayments.currency, currency),
      isNotNull(payrollPayments.paidAt),
    ];
    if (startDate) ppPaidFilters.push(gte(payrollPayments.paidAt, startDate));
    if (endDate) ppPaidFilters.push(lte(payrollPayments.paidAt, endDate));

    const ppPaidRows = await client
      .select({
        collaboratorName: collaborators.name,
        netSalary: payrollPayments.netSalary,
        comission: payrollPayments.comission,
        taxes: payrollPayments.taxes,
        paidAt: payrollPayments.paidAt,
      })
      .from(payrollPayments)
      .leftJoin(
        collaborators,
        eq(payrollPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...ppPaidFilters));

    for (const pp of ppPaidRows) {
      if (!pp.paidAt) continue;
      const collaboratorName = pp.collaboratorName ?? 'Unknown';

      if (pp.netSalary > 0) {
        entries.push({
          issuedAt: pp.paidAt,
          type: 'Outcome',
          description: `Payroll payment for ${collaboratorName}`,
          total: -Math.abs(pp.netSalary),
          taxes: negAbsOrZero(pp.taxes),
        });
      }
      if (pp.comission > 0) {
        entries.push({
          issuedAt: pp.paidAt,
          type: 'Outcome',
          description: `Commission's payroll payment for ${collaboratorName}`,
          total: -Math.abs(pp.comission),
          taxes: 0,
        });
      }
    }

    // 5b. PayrollPayments (PensionPaid)
    const ppPensionFilters: SQL[] = [
      eq(payrollPayments.status, 'PensionPaid'),
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
      entries.push({
        issuedAt: pp.pensionPaidAt,
        type: 'Outcome',
        description: `Payroll pension payment for ${pp.collaboratorName ?? 'Unknown'}`,
        total: -Math.abs(pp.pensionAmount),
        taxes: 0,
      });
    }

    // 6. TaxPayments (Paid)
    const tpFilters: SQL[] = [
      eq(taxPayments.status, 'Paid'),
      eq(taxPayments.currency, currency),
      isNotNull(taxPayments.paidAt),
    ];
    if (startDate) tpFilters.push(gte(taxPayments.paidAt, new Date(startDate)));
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      tpFilters.push(lte(taxPayments.paidAt, endDateTime));
    }

    const tpRows = await client
      .select()
      .from(taxPayments)
      .where(and(...tpFilters));

    for (const tp of tpRows) {
      if (!tp.paidAt || tp.total <= 0) continue;
      const monthStr = String(tp.month).padStart(2, '0');
      entries.push({
        issuedAt: tp.paidAt.toISOString().split('T')[0],
        type: 'Outcome',
        description: `Tax payments ${tp.year}-${monthStr}`,
        total: -Math.abs(tp.total),
        taxes: negAbsOrZero(tp.taxes),
      });
    }

    // Sort by issuedAt ascending, compute running balance
    entries.sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));

    let runningBalance = 0;
    const result = entries.map(entry => {
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
