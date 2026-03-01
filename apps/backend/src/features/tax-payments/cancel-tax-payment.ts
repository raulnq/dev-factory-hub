import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { taxPayments } from './tax-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { taxPaymentSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = taxPaymentSchema.pick({ taxPaymentId: true });

export const cancelRoute = new Hono().post(
  '/:taxPaymentId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { taxPaymentId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(taxPayments)
      .where(eq(taxPayments.taxPaymentId, taxPaymentId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `TaxPayment ${taxPaymentId} not found`);
    }

    if (existing.status !== 'Pending' && existing.status !== 'Paid') {
      return conflictError(
        c,
        `Cannot cancel tax payment with status "${existing.status}". Must be "Pending" or "Paid".`
      );
    }

    const [item] = await client
      .update(taxPayments)
      .set({
        status: 'Canceled',
        cancelledAt: new Date(),
      })
      .where(eq(taxPayments.taxPaymentId, taxPaymentId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
