import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { clients } from '#/features/clients/client.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { listCollectionsSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listCollectionsSchema),
  async c => {
    const { pageNumber, pageSize, clientId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (clientId) filters.push(eq(collections.clientId, clientId));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(collections)
      .where(and(...filters));

    const items = await client
      .select({
        collectionId: collections.collectionId,
        clientId: collections.clientId,
        clientName: clients.name,
        currency: collections.currency,
        total: collections.total,
        commission: collections.commission,
        taxes: collections.taxes,
        status: collections.status,
        confirmedAt: collections.confirmedAt,
        createdAt: collections.createdAt,
        canceledAt: collections.canceledAt,
        filePath: collections.filePath,
        contentType: collections.contentType,
      })
      .from(collections)
      .leftJoin(clients, eq(collections.clientId, clients.clientId))
      .where(and(...filters))
      .orderBy(desc(collections.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
