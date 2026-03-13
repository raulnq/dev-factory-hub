import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { client } from '#/database/client.js';
import { collaboratorCharges } from './collaborator-charge.js';
import { zValidator } from '#/validator.js';
import { listCollaboratorChargesSchema } from './schemas.js';
import { createPage } from '#/pagination.js';
import { getCollaboratorChargeWithRelations } from './get-collaborator-charge.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listCollaboratorChargesSchema),
  async c => {
    const { pageNumber, pageSize, collaboratorId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;

    if (collaboratorId) {
      filters.push(eq(collaboratorCharges.collaboratorId, collaboratorId));
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(collaboratorCharges)
      .where(and(...filters));

    const items = await getCollaboratorChargeWithRelations()
      .where(and(...filters))
      .orderBy(desc(collaboratorCharges.issuedAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
