import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { projects } from './project.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { editProjectSchema, clientSchema, projectSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { z } from 'zod';

const paramSchema = z.object({
  clientId: clientSchema.shape.clientId,
  projectId: projectSchema.shape.projectId,
});

export const editProjectRoute = new Hono().put(
  '/:clientId/projects/:projectId',
  zValidator('param', paramSchema),
  zValidator('json', editProjectSchema),
  async c => {
    const { clientId, projectId } = c.req.valid('param');
    const data = c.req.valid('json');

    const existing = await client
      .select()
      .from(projects)
      .where(
        and(eq(projects.projectId, projectId), eq(projects.clientId, clientId))
      )
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Project ${projectId} not found`);
    }

    const [item] = await client
      .update(projects)
      .set(data)
      .where(
        and(eq(projects.projectId, projectId), eq(projects.clientId, clientId))
      )
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
