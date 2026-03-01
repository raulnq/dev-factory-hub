import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import {
  payrollPaymentSchema,
  payPensionPayrollPaymentSchema,
} from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getPayrollPaymentWithRelations } from './get-payroll-payment.js';

const paramSchema = payrollPaymentSchema.pick({ payrollPaymentId: true });

export const payPensionRoute = new Hono().post(
  '/:payrollPaymentId/pay-pension',
  zValidator('param', paramSchema),
  zValidator('json', payPensionPayrollPaymentSchema),
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

    if (existing.status !== 'Paid') {
      return conflictError(
        c,
        `Cannot pay pension for payroll payment with status "${existing.status}". Must be in "Paid" status.`
      );
    }

    const grossSalary =
      Math.round((existing.netSalary + data.pensionAmount) * 100) / 100;

    await client
      .update(payrollPayments)
      .set({
        status: 'PensionPaid',
        pensionPaidAt: data.pensionPaidAt,
        pensionAmount: data.pensionAmount,
        grossSalary,
      })
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId));

    const [item] = await getPayrollPaymentWithRelations()
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
