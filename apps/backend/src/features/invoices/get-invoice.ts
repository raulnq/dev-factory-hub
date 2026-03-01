import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { invoiceSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { clients } from '#/features/clients/client.js';

const schema = invoiceSchema.pick({ invoiceId: true });

export const getRoute = new Hono().get(
  '/:invoiceId',
  zValidator('param', schema),
  async c => {
    const { invoiceId } = c.req.valid('param');
    const [item] = await getInvoiceWithRelations()
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    if (!item) {
      return notFoundError(c, `Invoice ${invoiceId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);

export function getInvoiceWithRelations() {
  return client
    .select({
      invoiceId: invoices.invoiceId,
      clientId: invoices.clientId,
      clientName: clients.name,
      currency: invoices.currency,
      subtotal: invoices.subtotal,
      taxes: invoices.taxes,
      total: invoices.total,
      status: invoices.status,
      issuedAt: invoices.issuedAt,
      createdAt: invoices.createdAt,
      canceledAt: invoices.canceledAt,
      number: invoices.number,
      exchangeRate: invoices.exchangeRate,
    })
    .from(invoices)
    .innerJoin(clients, eq(invoices.clientId, clients.clientId));
}
