import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorRoles } from './collaborator-role.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collaboratorRoleSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = collaboratorRoleSchema.pick({ collaboratorRoleId: true });

export const getRoute = new Hono().get(
  '/:collaboratorRoleId',
  zValidator('param', schema),
  async c => {
    const { collaboratorRoleId } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(collaboratorRoles)
      .where(eq(collaboratorRoles.collaboratorRoleId, collaboratorRoleId))
      .limit(1);
    if (!item) {
      return notFoundError(
        c,
        `Collaborator Role ${collaboratorRoleId} not found`
      );
    }
    return c.json(item, StatusCodes.OK);
  }
);
