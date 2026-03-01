import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { taxPaymentItems } from './tax-payment.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and } from 'drizzle-orm';
import { listTaxPaymentItemsSchema, taxPaymentSchema } from './schemas.js';

const paramSchema = taxPaymentSchema.pick({ taxPaymentId: true });

export const listItemsRoute = new Hono().get(
  '/:taxPaymentId/items',
  zValidator('param', paramSchema),
  zValidator('query', listTaxPaymentItemsSchema),
  async c => {
    const { taxPaymentId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');

    const filters: SQL[] = [eq(taxPaymentItems.taxPaymentId, taxPaymentId)];
    const offset = (pageNumber - 1) * pageSize;

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(taxPaymentItems)
      .where(and(...filters));

    const items = await client
      .select()
      .from(taxPaymentItems)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
