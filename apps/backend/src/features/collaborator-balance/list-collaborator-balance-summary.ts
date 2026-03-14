import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import {
  and,
  eq,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
  SQL,
} from 'drizzle-orm';
import { createPage } from '#/pagination.js';
import { collaboratorBalanceSummaryQuerySchema } from './schemas.js';
import { timesheets, worklogs } from '#/features/timesheets/timesheet.js';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { collaboratorRoles } from '#/features/collaborator-roles/collaborator-role.js';
import { collaboratorPayments } from '#/features/collaborator-payments/collaborator-payment.js';
import { payrollPayments } from '#/features/payroll-payments/payroll-payment.js';
import { collaboratorCharges } from '#/features/collaborator-charges/collaborator-charge.js';

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
    const summaryMap: SummaryMap = new Map();

    const collaboratorIds = Array.isArray(collaboratorId)
      ? collaboratorId
      : collaboratorId
        ? [collaboratorId]
        : [];

    // 1. Timesheets (Completed)
    const tsFilters: SQL[] = [
      eq(timesheets.status, 'Completed'),
      isNotNull(timesheets.completedAt),
    ];
    if (collaboratorIds.length > 0)
      tsFilters.push(inArray(timesheets.collaboratorId, collaboratorIds));
    if (date) tsFilters.push(lte(timesheets.completedAt, date));

    if (currency) {
      tsFilters.push(
        or(
          and(
            isNotNull(timesheets.currency),
            eq(timesheets.currency, currency)
          ),
          and(
            isNull(timesheets.currency),
            eq(collaboratorRoles.currency, currency)
          )
        ) as SQL
      );
    }

    const tsRows = await client
      .select({
        collaboratorId: timesheets.collaboratorId,
        collaboratorName: collaborators.name,
        tsCurrency: timesheets.currency,
        roleCurrency: collaboratorRoles.currency,
        costRate: timesheets.costRate,
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
        timesheets.collaboratorId,
        collaborators.name,
        timesheets.currency,
        collaboratorRoles.currency,
        timesheets.costRate,
        timesheets.timesheetId
      );

    for (const ts of tsRows) {
      const actualCurrency = ts.tsCurrency ?? ts.roleCurrency;
      if (!actualCurrency) continue;
      const amount = ts.totalHours * (ts.costRate ?? 0);
      if (amount <= 0) continue;
      addToSummary(
        summaryMap,
        ts.collaboratorId,
        ts.collaboratorName ?? 'Unknown',
        actualCurrency,
        amount
      );
    }

    // 2. CollaboratorPayments (Paid, netSalary > 0)
    const cpFilters: SQL[] = [
      or(
        eq(collaboratorPayments.status, 'Paid'),
        eq(collaboratorPayments.status, 'Confirmed')
      ) as SQL,
      isNotNull(collaboratorPayments.paidAt),
    ];
    if (collaboratorIds.length > 0)
      cpFilters.push(
        inArray(collaboratorPayments.collaboratorId, collaboratorIds)
      );
    if (currency) cpFilters.push(eq(collaboratorPayments.currency, currency));
    if (date) cpFilters.push(lte(collaboratorPayments.paidAt, date));

    const cpRows = await client
      .select({
        collaboratorId: collaboratorPayments.collaboratorId,
        collaboratorName: collaborators.name,
        currency: collaboratorPayments.currency,
        grossSalary: collaboratorPayments.grossSalary,
      })
      .from(collaboratorPayments)
      .leftJoin(
        collaborators,
        eq(collaboratorPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...cpFilters));

    for (const cp of cpRows) {
      if (!cp.currency) continue;
      addToSummary(
        summaryMap,
        cp.collaboratorId,
        cp.collaboratorName ?? 'Unknown',
        cp.currency,
        -Math.abs(cp.grossSalary)
      );
    }

    // 3. PayrollPayments (Paid, netSalary > 0)
    const ppPaidFilters: SQL[] = [
      or(
        eq(payrollPayments.status, 'Paid'),
        eq(payrollPayments.status, 'PensionPaid')
      ) as SQL,
      isNotNull(payrollPayments.paidAt),
    ];
    if (collaboratorIds.length > 0)
      ppPaidFilters.push(
        inArray(payrollPayments.collaboratorId, collaboratorIds)
      );
    if (currency) ppPaidFilters.push(eq(payrollPayments.currency, currency));
    if (date) ppPaidFilters.push(lte(payrollPayments.paidAt, date));

    const ppPaidRows = await client
      .select({
        collaboratorId: payrollPayments.collaboratorId,
        collaboratorName: collaborators.name,
        currency: payrollPayments.currency,
        netSalary: payrollPayments.netSalary,
      })
      .from(payrollPayments)
      .leftJoin(
        collaborators,
        eq(payrollPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...ppPaidFilters));

    for (const pp of ppPaidRows) {
      if (!pp.currency || pp.netSalary <= 0) continue;
      addToSummary(
        summaryMap,
        pp.collaboratorId,
        pp.collaboratorName ?? 'Unknown',
        pp.currency,
        -Math.abs(pp.netSalary)
      );
    }

    // 4. PayrollPayments (PensionPaid, pensionAmount > 0)
    const ppPensionFilters: SQL[] = [
      eq(payrollPayments.status, 'PensionPaid'),
      isNotNull(payrollPayments.pensionPaidAt),
    ];
    if (collaboratorIds.length > 0)
      ppPensionFilters.push(
        inArray(payrollPayments.collaboratorId, collaboratorIds)
      );
    if (currency) ppPensionFilters.push(eq(payrollPayments.currency, currency));
    if (date) ppPensionFilters.push(lte(payrollPayments.pensionPaidAt, date));

    const ppPensionRows = await client
      .select({
        collaboratorId: payrollPayments.collaboratorId,
        collaboratorName: collaborators.name,
        currency: payrollPayments.currency,
        pensionAmount: payrollPayments.pensionAmount,
      })
      .from(payrollPayments)
      .leftJoin(
        collaborators,
        eq(payrollPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...ppPensionFilters));

    for (const pp of ppPensionRows) {
      if (!pp.currency || pp.pensionAmount <= 0) continue;
      addToSummary(
        summaryMap,
        pp.collaboratorId,
        pp.collaboratorName ?? 'Unknown',
        pp.currency,
        -Math.abs(pp.pensionAmount)
      );
    }

    // 5. CollaboratorCharges (Issued)
    const ccFilters: SQL[] = [
      eq(collaboratorCharges.status, 'Issued'),
      isNotNull(collaboratorCharges.issuedAt),
    ];
    if (collaboratorIds.length > 0)
      ccFilters.push(
        inArray(collaboratorCharges.collaboratorId, collaboratorIds)
      );
    if (currency) ccFilters.push(eq(collaboratorCharges.currency, currency));
    if (date) ccFilters.push(lte(collaboratorCharges.issuedAt, date));

    const ccRows = await client
      .select({
        collaboratorId: collaboratorCharges.collaboratorId,
        collaboratorName: collaborators.name,
        currency: collaboratorCharges.currency,
        amount: collaboratorCharges.amount,
      })
      .from(collaboratorCharges)
      .leftJoin(
        collaborators,
        eq(collaboratorCharges.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...ccFilters));

    for (const cc of ccRows) {
      if (!cc.currency) continue;
      addToSummary(
        summaryMap,
        cc.collaboratorId,
        cc.collaboratorName ?? 'Unknown',
        cc.currency,
        cc.amount
      );
    }

    const allResults = Array.from(summaryMap.entries()).map(
      ([collaboratorId, data]) => ({
        collaboratorId,
        collaboratorName: data.name,
        balances: Array.from(data.balances.entries()).map(
          ([currency, balance]) => ({
            currency,
            balance: Math.round(balance * 100) / 100,
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

function addToSummary(
  map: SummaryMap,
  collaboratorId: string,
  name: string,
  currency: string,
  amount: number
) {
  if (!map.has(collaboratorId)) {
    map.set(collaboratorId, { name, balances: new Map() });
  }
  const collabData = map.get(collaboratorId)!;
  const currentBalance = collabData.balances.get(currency) ?? 0;
  collabData.balances.set(currency, currentBalance + amount);
}
