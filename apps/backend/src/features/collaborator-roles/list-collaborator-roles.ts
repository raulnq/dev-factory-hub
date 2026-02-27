import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorRoles } from './collaborator-role.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { like, count, SQL, and } from 'drizzle-orm';
import { listCollaboratorRolesSchema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listCollaboratorRolesSchema),
  async c => {
    const { pageNumber, pageSize, name } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (name) filters.push(like(collaboratorRoles.name, `%${name}%`));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(collaboratorRoles)
      .where(and(...filters));

    const items = await client
      .select()
      .from(collaboratorRoles)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
