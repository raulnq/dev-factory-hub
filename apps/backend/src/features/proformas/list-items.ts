import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformaItems } from './proforma.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and } from 'drizzle-orm';
import { listProformaItemsSchema, proformaSchema } from './schemas.js';

const paramSchema = proformaSchema.pick({ proformaId: true });

export const listItemsRoute = new Hono().get(
  '/:proformaId/items',
  zValidator('param', paramSchema),
  zValidator('query', listProformaItemsSchema),
  async c => {
    const { proformaId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');

    const filters: SQL[] = [eq(proformaItems.proformaId, proformaId)];
    const offset = (pageNumber - 1) * pageSize;

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(proformaItems)
      .where(and(...filters));

    const items = await client
      .select()
      .from(proformaItems)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
