import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { projects } from './project.js';
import { clients } from './client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { addProjectSchema, clientSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = clientSchema.pick({ clientId: true });

export const addProjectRoute = new Hono().post(
  '/:clientId/projects',
  zValidator('param', paramSchema),
  zValidator('json', addProjectSchema),
  async c => {
    const { clientId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existingClient] = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .limit(1);

    if (!existingClient) {
      return notFoundError(c, `Client ${clientId} not found`);
    }

    const [item] = await client
      .insert(projects)
      .values({ ...data, projectId: v7(), clientId })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
