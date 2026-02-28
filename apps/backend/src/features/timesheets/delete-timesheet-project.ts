import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { timesheets, timesheetProjects, worklogs } from './timesheet.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, eq } from 'drizzle-orm';
import { timesheetProjectSchema } from './schemas.js';
import { conflictError, notFoundError } from '#/extensions.js';

const paramSchema = timesheetProjectSchema;

export const deleteProjectRoute = new Hono().delete(
  '/:timesheetId/projects/:projectId',
  zValidator('param', paramSchema),
  async c => {
    const { timesheetId, projectId } = c.req.valid('param');

    const [timesheet] = await client
      .select()
      .from(timesheets)
      .where(eq(timesheets.timesheetId, timesheetId))
      .limit(1);

    if (!timesheet) {
      return notFoundError(c, `Timesheet ${timesheetId} not found`);
    }

    if (timesheet.status === 'Completed') {
      return conflictError(
        c,
        'Cannot remove projects from a completed timesheet'
      );
    }

    const [existing] = await client
      .select()
      .from(timesheetProjects)
      .where(
        and(
          eq(timesheetProjects.timesheetId, timesheetId),
          eq(timesheetProjects.projectId, projectId)
        )
      )
      .limit(1);

    if (!existing) {
      return notFoundError(
        c,
        `Project ${projectId} not found in timesheet ${timesheetId}`
      );
    }

    await client.transaction(async tx => {
      await tx
        .delete(worklogs)
        .where(
          and(
            eq(worklogs.timesheetId, timesheetId),
            eq(worklogs.projectId, projectId)
          )
        );
      await tx
        .delete(timesheetProjects)
        .where(
          and(
            eq(timesheetProjects.timesheetId, timesheetId),
            eq(timesheetProjects.projectId, projectId)
          )
        );
    });

    return c.body(null, StatusCodes.NO_CONTENT);
  }
);
