import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editPayrollPaymentSchema, payrollPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPayrollPaymentWithRelations } from './get-payroll-payment.js';

const paramSchema = payrollPaymentSchema.pick({ payrollPaymentId: true });

export const editRoute = new Hono().put(
  '/:payrollPaymentId',
  zValidator('param', paramSchema),
  zValidator('json', editPayrollPaymentSchema),
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

    const grossSalary =
      Math.round((data.netSalary + existing.pensionAmount) * 100) / 100;

    await client
      .update(payrollPayments)
      .set({ ...data, grossSalary })
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId));

    const [item] = await getPayrollPaymentWithRelations()
      .where(eq(payrollPayments.payrollPaymentId, payrollPaymentId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
