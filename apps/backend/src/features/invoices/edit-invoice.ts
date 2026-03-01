import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editInvoiceSchema, invoiceSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getInvoiceWithRelations } from './get-invoice.js';

const paramSchema = invoiceSchema.pick({ invoiceId: true });

export const editRoute = new Hono().put(
  '/:invoiceId',
  zValidator('param', paramSchema),
  zValidator('json', editInvoiceSchema),
  async c => {
    const { invoiceId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Invoice ${invoiceId} not found`);
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot edit invoice with status "${existing.status}". Must be "Pending".`
      );
    }

    const total = data.subtotal + data.taxes;

    await client
      .update(invoices)
      .set({ ...data, total })
      .where(eq(invoices.invoiceId, invoiceId));

    const [item] = await getInvoiceWithRelations()
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
