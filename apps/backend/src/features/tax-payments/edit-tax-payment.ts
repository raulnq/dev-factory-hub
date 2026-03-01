import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { taxPayments } from './tax-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editTaxPaymentSchema, taxPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = taxPaymentSchema.pick({ taxPaymentId: true });

export const editRoute = new Hono().put(
  '/:taxPaymentId',
  zValidator('param', paramSchema),
  zValidator('json', editTaxPaymentSchema),
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

    const [item] = await client
      .update(taxPayments)
      .set(data)
      .where(eq(taxPayments.taxPaymentId, taxPaymentId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
