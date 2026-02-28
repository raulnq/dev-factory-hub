import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { timesheets, timesheetProjects, worklogs } from './timesheet.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { addTimesheetProjectSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

export const addProjectRoute = new Hono().post(
  '/:timesheetId/projects/:projectId',
  zValidator('param', addTimesheetProjectSchema),
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
      return conflictError(c, 'Cannot add projects to a completed timesheet');
    }

    // Check if project already added
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

    if (existing) {
      return conflictError(c, 'Project already added to this timesheet');
    }

    await client.transaction(async tx => {
      await tx.insert(timesheetProjects).values({ timesheetId, projectId });

      // Generate worklogs
      const start = new Date(timesheet.startDate);
      const end = new Date(timesheet.endDate);
      const logs = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        logs.push({
          timesheetId,
          projectId,
          date: d.toISOString().split('T')[0],
          hours: 0,
        });
      }

      if (logs.length > 0) {
        await tx.insert(worklogs).values(logs);
      }
    });

    return c.body(null, StatusCodes.CREATED);
  }
);
