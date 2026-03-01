import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { payrollPaymentSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getPayrollPaymentWithRelations } from './get-payroll-payment.js';

const paramSchema = payrollPaymentSchema.pick({ payrollPaymentId: true });

export const cancelRoute = new Hono().post(
  '/:payrollPaymentId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { payrollPaymentId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(payrollPayments)
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `PayrollPayment ${payrollPaymentId} not found`);
    }

    if (existing.status === 'Canceled') {
      return conflictError(
        c,
        `Cannot cancel payroll payment with status "Canceled". Already canceled.`
      );
    }

    await client
      .update(payrollPayments)
      .set({ status: 'Canceled', canceledAt: new Date() })
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId));

    const [item] = await getPayrollPaymentWithRelations()
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
