import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { taxPaymentItems, taxPayments } from './tax-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { taxPaymentItemSchema } from './schemas.js';
import { eq, and } from 'drizzle-orm';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = taxPaymentItemSchema.pick({
  taxPaymentId: true,
  taxPaymentItemId: true,
});

export const deleteItemRoute = new Hono().delete(
  '/:taxPaymentId/items/:taxPaymentItemId',
  zValidator('param', paramSchema),
  async c => {
    const { taxPaymentId, taxPaymentItemId } = c.req.valid('param');

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
        `Cannot remove items from tax payment with status "${taxPayment.status}". Must be "Pending".`
      );
    }

    const [item] = await client
      .select()
      .from(taxPaymentItems)
      .where(
        and(
          eq(taxPaymentItems.taxPaymentItemId, taxPaymentItemId),
          eq(taxPaymentItems.taxPaymentId, taxPaymentId)
        )
      )
      .limit(1);

    if (!item) {
      return notFoundError(c, `TaxPaymentItem ${taxPaymentItemId} not found`);
    }

    await client.transaction(async tx => {
      await tx
        .delete(taxPaymentItems)
        .where(eq(taxPaymentItems.taxPaymentItemId, taxPaymentItemId));

      const total = Number(taxPayment.total) - Number(item.amount);

      await tx
        .update(taxPayments)
        .set({ total })
        .where(eq(taxPayments.taxPaymentId, taxPaymentId));
    });

    return c.body(null, StatusCodes.NO_CONTENT);
  }
);
