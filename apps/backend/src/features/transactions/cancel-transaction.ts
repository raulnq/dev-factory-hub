import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { transactions } from './transaction.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { transactionSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = transactionSchema.pick({ transactionId: true });

export const cancelRoute = new Hono().post(
  '/:transactionId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { transactionId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(transactions)
      .where(eq(transactions.transactionId, transactionId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Transaction ${transactionId} not found`);
    }

    if (existing.status === 'Canceled') {
      return conflictError(
        c,
        `Cannot cancel transaction with status "Canceled". Already canceled.`
      );
    }

    const [item] = await client
      .update(transactions)
      .set({ status: 'Canceled', canceledAt: new Date() })
      .where(eq(transactions.transactionId, transactionId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
