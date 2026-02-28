import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { timesheets, worklogs } from './timesheet.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { worklogSchema, editWorklogSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = worklogSchema.omit({ hours: true });

export const editWorklogRoute = new Hono().put(
  '/:timesheetId/projects/:projectId/worklogs/:date',
  zValidator('param', paramSchema),
  zValidator('json', editWorklogSchema),
  async c => {
    const { timesheetId, projectId, date } = c.req.valid('param');
    const { hours } = c.req.valid('json');

    const [timesheet] = await client
      .select()
      .from(timesheets)
      .where(eq(timesheets.timesheetId, timesheetId))
      .limit(1);

    if (!timesheet) {
      return notFoundError(c, `Timesheet ${timesheetId} not found`);
    }

    if (timesheet.status === 'Completed') {
      return conflictError(c, 'Cannot edit worklogs of a completed timesheet');
    }

    const [existing] = await client
      .select()
      .from(worklogs)
      .where(
        and(
          eq(worklogs.timesheetId, timesheetId),
          eq(worklogs.projectId, projectId),
          eq(worklogs.date, date)
        )
      )
      .limit(1);

    if (!existing) {
      return notFoundError(c, 'Worklog not found');
    }

    const [item] = await client
      .update(worklogs)
      .set({ hours })
      .where(
        and(
          eq(worklogs.timesheetId, timesheetId),
          eq(worklogs.projectId, projectId),
          eq(worklogs.date, date)
        )
      )
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
