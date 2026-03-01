import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { listPayrollPaymentsSchema } from './schemas.js';
import { collaborators } from '#/features/collaborators/collaborator.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listPayrollPaymentsSchema),
  async c => {
    const { pageNumber, pageSize, collaboratorId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (collaboratorId) {
      filters.push(eq(payrollPayments.collaboratorId, collaboratorId));
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(payrollPayments)
      .where(and(...filters));

    const items = await client
      .select({
        payrollPaymentId: payrollPayments.payrollPaymentId,
        collaboratorId: payrollPayments.collaboratorId,
        collaboratorName: collaborators.name,
        currency: payrollPayments.currency,
        netSalary: payrollPayments.netSalary,
        pensionAmount: payrollPayments.pensionAmount,
        grossSalary: payrollPayments.grossSalary,
        comission: payrollPayments.comission,
        taxes: payrollPayments.taxes,
        status: payrollPayments.status,
        paidAt: payrollPayments.paidAt,
        pensionPaidAt: payrollPayments.pensionPaidAt,
        createdAt: payrollPayments.createdAt,
        canceledAt: payrollPayments.canceledAt,
        filePath: payrollPayments.filePath,
        contentType: payrollPayments.contentType,
      })
      .from(payrollPayments)
      .innerJoin(
        collaborators,
        eq(payrollPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...filters))
      .orderBy(desc(payrollPayments.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
