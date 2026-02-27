import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorRoles } from './collaborator-role.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import {
  editCollaboratorRoleSchema,
  collaboratorRoleSchema,
} from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = collaboratorRoleSchema.pick({ collaboratorRoleId: true });

export const editRoute = new Hono().put(
  '/:collaboratorRoleId',
  zValidator('param', paramSchema),
  zValidator('json', editCollaboratorRoleSchema),
  async c => {
    const { collaboratorRoleId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(collaboratorRoles)
      .where(eq(collaboratorRoles.collaboratorRoleId, collaboratorRoleId))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(
        c,
        `Collaborator Role ${collaboratorRoleId} not found`
      );
    }
    const [item] = await client
      .update(collaboratorRoles)
      .set(data)
      .where(eq(collaboratorRoles.collaboratorRoleId, collaboratorRoleId))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
