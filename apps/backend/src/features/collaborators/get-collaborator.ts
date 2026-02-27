import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaborators } from './collaborator.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collaboratorSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = collaboratorSchema.pick({ collaboratorId: true });

export const getRoute = new Hono().get(
  '/:collaboratorId',
  zValidator('param', schema),
  async c => {
    const { collaboratorId } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(collaborators)
      .where(eq(collaborators.collaboratorId, collaboratorId))
      .limit(1);
    if (!item) {
      return notFoundError(c, `Collaborator ${collaboratorId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
