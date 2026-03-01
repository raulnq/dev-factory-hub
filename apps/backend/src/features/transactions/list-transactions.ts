import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { transactions } from './transaction.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, like, count, SQL, and, desc } from 'drizzle-orm';
import { listTransactionsSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listTransactionsSchema),
  async c => {
    const { pageNumber, pageSize, type, description } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (type) filters.push(eq(transactions.type, type));
    if (description)
      filters.push(like(transactions.description, `%${description}%`));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(transactions)
      .where(and(...filters));

    const items = await client
      .select()
      .from(transactions)
      .where(and(...filters))
      .orderBy(desc(transactions.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
