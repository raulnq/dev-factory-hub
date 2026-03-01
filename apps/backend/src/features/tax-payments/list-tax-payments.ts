import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { taxPayments } from './tax-payment.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { listTaxPaymentsSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listTaxPaymentsSchema),
  async c => {
    const { pageNumber, pageSize, year } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (year !== undefined) filters.push(eq(taxPayments.year, year));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(taxPayments)
      .where(and(...filters));

    const items = await client
      .select()
      .from(taxPayments)
      .where(and(...filters))
      .orderBy(desc(taxPayments.year), desc(taxPayments.month))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
