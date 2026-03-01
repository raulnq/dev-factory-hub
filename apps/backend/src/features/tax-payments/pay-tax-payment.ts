import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { taxPayments } from './tax-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { taxPaymentSchema, payTaxPaymentSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = taxPaymentSchema.pick({ taxPaymentId: true });

export const payRoute = new Hono().post(
  '/:taxPaymentId/pay',
  zValidator('param', paramSchema),
  zValidator('json', payTaxPaymentSchema),
  async c => {
    const { taxPaymentId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(taxPayments)
      .where(eq(taxPayments.taxPaymentId, taxPaymentId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `TaxPayment ${taxPaymentId} not found`);
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot pay tax payment with status "${existing.status}". Must be in "Pending" status.`
      );
    }

    const [item] = await client
      .update(taxPayments)
      .set({
        status: 'Paid',
        paidAt: new Date(data.paidAt),
        number: data.number,
      })
      .where(eq(taxPayments.taxPaymentId, taxPaymentId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
