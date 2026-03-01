import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { transactions } from './transaction.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { transactionSchema, issueTransactionSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = transactionSchema.pick({ transactionId: true });

export const issueRoute = new Hono().post(
  '/:transactionId/issue',
  zValidator('param', paramSchema),
  zValidator('json', issueTransactionSchema),
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
        `Cannot issue transaction with status "${existing.status}". Must be "Pending".`
      );
    }

    const [item] = await client
      .update(transactions)
      .set({
        status: 'Issued',
        issuedAt: data.issuedAt,
        number: data.number,
      })
      .where(eq(transactions.transactionId, transactionId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
