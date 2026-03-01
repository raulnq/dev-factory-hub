import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { transactions } from './transaction.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addTransactionSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addTransactionSchema),
  async c => {
    const data = c.req.valid('json');
    const total = data.subtotal + data.taxes;

    const [item] = await client
      .insert(transactions)
      .values({
        ...data,
        transactionId: v7(),
        total,
        status: 'Pending',
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
