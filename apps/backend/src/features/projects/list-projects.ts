import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { projects } from '../clients/project.js';
import { clients } from '../clients/client.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, and, ilike } from 'drizzle-orm';
import { listProjectsQuerySchema } from './schemas.js';

export const listProjectsRoute = new Hono().get(
  '/',
  zValidator('query', listProjectsQuerySchema),
  async c => {
    const { pageNumber, pageSize, name, clientId } = c.req.valid('query');
    const offset = (pageNumber - 1) * pageSize;

    const filters = [];
    if (name) {
      filters.push(ilike(projects.name, `%${name}%`));
    }
    if (clientId) {
      filters.push(eq(projects.clientId, clientId));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.clientId))
      .where(whereClause);

    const items = await client
      .select({
        projectId: projects.projectId,
        clientId: projects.clientId,
        name: projects.name,
        clientName: clients.name,
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.clientId))
      .where(whereClause)
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
