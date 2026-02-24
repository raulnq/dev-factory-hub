import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { projects } from './project.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { clientSchema, projectSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { z } from 'zod';

const paramSchema = z.object({
  clientId: clientSchema.shape.clientId,
  projectId: projectSchema.shape.projectId,
});

export const deleteProjectRoute = new Hono().delete(
  '/:clientId/projects/:projectId',
  zValidator('param', paramSchema),
  async c => {
    const { clientId, projectId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(projects)
      .where(
        and(eq(projects.projectId, projectId), eq(projects.clientId, clientId))
      )
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Project ${projectId} not found`);
    }

    await client
      .delete(projects)
      .where(
        and(eq(projects.projectId, projectId), eq(projects.clientId, clientId))
      );

    return c.body(null, StatusCodes.NO_CONTENT);
  }
);
