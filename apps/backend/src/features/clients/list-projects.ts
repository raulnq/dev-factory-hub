import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { projects } from './project.js';
import { clients } from './client.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count } from 'drizzle-orm';
import { listProjectsSchema, clientSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = clientSchema.pick({ clientId: true });

export const listProjectsRoute = new Hono().get(
  '/:clientId/projects',
  zValidator('param', paramSchema),
  zValidator('query', listProjectsSchema),
  async c => {
    const { clientId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');
    const offset = (pageNumber - 1) * pageSize;

    const [existingClient] = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .limit(1);

    if (!existingClient) {
      return notFoundError(c, `Client ${clientId} not found`);
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(projects)
      .where(eq(projects.clientId, clientId));

    const items = await client
      .select()
      .from(projects)
      .where(eq(projects.clientId, clientId))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
