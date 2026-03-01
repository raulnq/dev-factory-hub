import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { invoiceSchema, issueInvoiceSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getInvoiceWithRelations } from './get-invoice.js';

const paramSchema = invoiceSchema.pick({ invoiceId: true });

export const issueRoute = new Hono().post(
  '/:invoiceId/issue',
  zValidator('param', paramSchema),
  zValidator('json', issueInvoiceSchema),
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
        `Cannot issue invoice with status "${existing.status}". Must be "Pending".`
      );
    }

    await client
      .update(invoices)
      .set({
        status: 'Issued',
        issuedAt: data.issuedAt,
        exchangeRate: data.exchangeRate,
        number: data.number,
      })
      .where(eq(invoices.invoiceId, invoiceId));

    const [item] = await getInvoiceWithRelations()
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
