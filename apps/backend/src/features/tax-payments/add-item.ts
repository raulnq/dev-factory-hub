import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { taxPaymentItems, taxPayments } from './tax-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addTaxPaymentItemSchema, taxPaymentSchema } from './schemas.js';
import { eq } from 'drizzle-orm';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = taxPaymentSchema.pick({ taxPaymentId: true });

export const addItemRoute = new Hono().post(
  '/:taxPaymentId/items',
  zValidator('param', paramSchema),
  zValidator('json', addTaxPaymentItemSchema),
  async c => {
    const { taxPaymentId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [taxPayment] = await client
      .select()
      .from(taxPayments)
      .where(eq(taxPayments.taxPaymentId, taxPaymentId))
      .limit(1);

    if (!taxPayment) {
      return notFoundError(c, `TaxPayment ${taxPaymentId} not found`);
    }

    if (taxPayment.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot add items to tax payment with status "${taxPayment.status}". Must be "Pending".`
      );
    }

    const result = await client.transaction(async tx => {
      const [item] = await tx
        .insert(taxPaymentItems)
        .values({
          ...data,
          taxPaymentItemId: v7(),
          taxPaymentId,
        })
        .returning();

      const total = Number(taxPayment.total) + data.amount;

      await tx
        .update(taxPayments)
        .set({ total })
        .where(eq(taxPayments.taxPaymentId, taxPaymentId));

      return item;
    });

    return c.json(result, StatusCodes.CREATED);
  }
);
