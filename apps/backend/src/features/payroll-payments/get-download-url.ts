import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { payrollPayments } from './payroll-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { payrollPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = payrollPaymentSchema.pick({ payrollPaymentId: true });

export const getDownloadUrlRoute = new Hono().get(
  '/:payrollPaymentId/download-url',
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

    if (!existing.filePath) {
      return notFoundError(c, `PayrollPayment ${payrollPaymentId} has no file`);
    }

    const url = await getPresignedDownloadUrl(existing.filePath, 900);
    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
