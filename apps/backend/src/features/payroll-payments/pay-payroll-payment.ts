import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { payrollPaymentSchema, payPayrollPaymentSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getPayrollPaymentWithRelations } from './get-payroll-payment.js';

const paramSchema = payrollPaymentSchema.pick({ payrollPaymentId: true });

export const payRoute = new Hono().post(
  '/:payrollPaymentId/pay',
  zValidator('param', paramSchema),
  zValidator('json', payPayrollPaymentSchema),
  async c => {
    const { payrollPaymentId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(payrollPayments)
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `PayrollPayment ${payrollPaymentId} not found`);
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot pay payroll payment with status "${existing.status}". Must be in "Pending" status.`
      );
    }

    await client
      .update(payrollPayments)
      .set({ status: 'Paid', paidAt: data.paidAt })
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId));

    const [item] = await getPayrollPaymentWithRelations()
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
