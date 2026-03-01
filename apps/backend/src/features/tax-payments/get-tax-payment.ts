import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { taxPayments } from './tax-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { taxPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = taxPaymentSchema.pick({ taxPaymentId: true });

export const getRoute = new Hono().get(
  '/:taxPaymentId',
  zValidator('param', paramSchema),
  async c => {
    const { taxPaymentId } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(taxPayments)
      .where(eq(taxPayments.taxPaymentId, taxPaymentId))
      .limit(1);

    if (!item) {
      return notFoundError(c, `TaxPayment ${taxPaymentId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
