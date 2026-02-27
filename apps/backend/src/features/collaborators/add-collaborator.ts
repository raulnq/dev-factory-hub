import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { collaborators } from './collaborator.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addCollaboratorSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addCollaboratorSchema),
  async c => {
    const data = c.req.valid('json');
    const [item] = await client
      .insert(collaborators)
      .values({ ...data, collaboratorId: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
