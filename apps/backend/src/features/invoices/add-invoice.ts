import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addInvoiceSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { clients } from '#/features/clients/client.js';
import { eq } from 'drizzle-orm';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addInvoiceSchema),
  async c => {
    const data = c.req.valid('json');

    const [existingClient] = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, data.clientId))
      .limit(1);

    if (!existingClient) {
      return notFoundError(c, `Client ${data.clientId} not found`);
    }

    const total = data.subtotal + data.taxes;

    const [item] = await client
      .insert(invoices)
      .values({
        ...data,
        invoiceId: v7(),
        total,
        status: 'Pending',
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
