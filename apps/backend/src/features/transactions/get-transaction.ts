import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { transactions } from './transaction.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { transactionSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = transactionSchema.pick({ transactionId: true });

export const getRoute = new Hono().get(
  '/:transactionId',
  zValidator('param', schema),
  async c => {
    const { transactionId } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(transactions)
      .where(eq(transactions.transactionId, transactionId))
      .limit(1);

    if (!item) {
      return notFoundError(c, `Transaction ${transactionId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
