import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { timesheetProjects, worklogs } from './timesheet.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import {
  timesheetSchema,
  type TimesheetProjectWithWorklogs,
} from './schemas.js';
import { projects } from '#/features/clients/project.js';

const paramSchema = timesheetSchema.pick({ timesheetId: true });

export const listProjectsRoute = new Hono().get(
  '/:timesheetId/projects',
  zValidator('param', paramSchema),
  async c => {
    const { timesheetId } = c.req.valid('param');

    const tpList = await client
      .select({
        projectId: timesheetProjects.projectId,
        projectName: projects.name,
      })
      .from(timesheetProjects)
      .leftJoin(projects, eq(timesheetProjects.projectId, projects.projectId))
      .where(eq(timesheetProjects.timesheetId, timesheetId));

    const result: TimesheetProjectWithWorklogs[] = [];

    for (const tp of tpList) {
      const logs = await client
        .select()
        .from(worklogs)
        .where(
          and(
            eq(worklogs.timesheetId, timesheetId),
            eq(worklogs.projectId, tp.projectId)
          )
        );
      result.push({
        projectId: tp.projectId,
        projectName: tp.projectName || '',
        worklogs: logs,
      });
    }

    return c.json(result, StatusCodes.OK);
  }
);
