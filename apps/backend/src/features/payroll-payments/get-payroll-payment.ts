import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { payrollPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { collaborators } from '#/features/collaborators/collaborator.js';

const paramSchema = payrollPaymentSchema.pick({ payrollPaymentId: true });

export const getRoute = new Hono().get(
  '/:payrollPaymentId',
  zValidator('param', paramSchema),
  async c => {
    const { payrollPaymentId } = c.req.valid('param');
    const [item] = await getPayrollPaymentWithRelations()
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId))
      .limit(1);

    if (!item) {
      return notFoundError(c, `PayrollPayment ${payrollPaymentId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);

export function getPayrollPaymentWithRelations() {
  return client
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
    );
}
