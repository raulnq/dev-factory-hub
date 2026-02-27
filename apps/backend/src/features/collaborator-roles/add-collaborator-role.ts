import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { collaboratorRoles } from './collaborator-role.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addCollaboratorRoleSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addCollaboratorRoleSchema),
  async c => {
    const data = c.req.valid('json');
    const [item] = await client
      .insert(collaboratorRoles)
      .values({ ...data, collaboratorRoleId: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
