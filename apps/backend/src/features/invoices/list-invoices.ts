import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { listInvoicesSchema } from './schemas.js';
import { clients } from '#/features/clients/client.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listInvoicesSchema),
  async c => {
    const { pageNumber, pageSize, clientId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (clientId) filters.push(eq(invoices.clientId, clientId));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(invoices)
      .where(and(...filters));

    const items = await client
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
      .innerJoin(clients, eq(invoices.clientId, clients.clientId))
      .where(and(...filters))
      .orderBy(desc(invoices.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
