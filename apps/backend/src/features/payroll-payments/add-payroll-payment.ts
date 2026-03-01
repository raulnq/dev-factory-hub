import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addPayrollPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { eq } from 'drizzle-orm';
import { getPayrollPaymentWithRelations } from './get-payroll-payment.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addPayrollPaymentSchema),
  async c => {
    const data = c.req.valid('json');

    const [collaborator] = await client
      .select()
      .from(collaborators)
      .where(eq(collaborators.collaboratorId, data.collaboratorId))
      .limit(1);

    if (!collaborator) {
      return notFoundError(c, `Collaborator ${data.collaboratorId} not found`);
    }

    const pensionAmount = 0;
    const grossSalary =
      Math.round((data.netSalary + pensionAmount) * 100) / 100;

    const [inserted] = await client
      .insert(payrollPayments)
      .values({
        ...data,
        payrollPaymentId: v7(),
        pensionAmount,
        grossSalary,
        status: 'Pending',
      })
      .returning();

    const [item] = await getPayrollPaymentWithRelations()
      .where(eq(payrollPayments.payrollPaymentId, inserted.payrollPaymentId))
      .limit(1);

    return c.json(item, StatusCodes.CREATED);
  }
);
