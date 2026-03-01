import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { invoiceSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getInvoiceWithRelations } from './get-invoice.js';

const paramSchema = invoiceSchema.pick({ invoiceId: true });

export const cancelRoute = new Hono().post(
  '/:invoiceId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { invoiceId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Invoice ${invoiceId} not found`);
    }

    if (existing.status === 'Canceled') {
      return conflictError(
        c,
        `Cannot cancel invoice with status "Canceled". Already canceled.`
      );
    }

    await client
      .update(invoices)
      .set({
        status: 'Canceled',
        canceledAt: new Date(),
      })
      .where(eq(invoices.invoiceId, invoiceId));

    const [item] = await getInvoiceWithRelations()
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
