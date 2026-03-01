import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { transactions } from './transaction.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editTransactionSchema, transactionSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = transactionSchema.pick({ transactionId: true });

export const editRoute = new Hono().put(
  '/:transactionId',
  zValidator('param', paramSchema),
  zValidator('json', editTransactionSchema),
  async c => {
    const { transactionId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(transactions)
      .where(eq(transactions.transactionId, transactionId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Transaction ${transactionId} not found`);
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot edit transaction with status "${existing.status}". Must be "Pending".`
      );
    }

    const total = data.subtotal + data.taxes;

    const [item] = await client
      .update(transactions)
      .set({ ...data, total })
      .where(eq(transactions.transactionId, transactionId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
