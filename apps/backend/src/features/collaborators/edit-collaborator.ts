import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaborators } from './collaborator.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editCollaboratorSchema, collaboratorSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = collaboratorSchema.pick({ collaboratorId: true });

export const editRoute = new Hono().put(
  '/:collaboratorId',
  zValidator('param', paramSchema),
  zValidator('json', editCollaboratorSchema),
  async c => {
    const { collaboratorId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(collaborators)
      .where(eq(collaborators.collaboratorId, collaboratorId))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(c, `Collaborator ${collaboratorId} not found`);
    }
    const [item] = await client
      .update(collaborators)
      .set(data)
      .where(eq(collaborators.collaboratorId, collaboratorId))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
