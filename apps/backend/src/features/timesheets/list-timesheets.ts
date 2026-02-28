import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { timesheets } from './timesheet.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and } from 'drizzle-orm';
import { listTimesheetsSchema } from './schemas.js';
import { collaborators } from '../collaborators/collaborator.js';
import { collaboratorRoles } from '../collaborator-roles/collaborator-role.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listTimesheetsSchema),
  async c => {
    const { pageNumber, pageSize, collaboratorId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (collaboratorId)
      filters.push(eq(timesheets.collaboratorId, collaboratorId));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(timesheets)
      .leftJoin(
        collaborators,
        eq(timesheets.collaboratorId, collaborators.collaboratorId)
      )
      .leftJoin(
        collaboratorRoles,
        eq(timesheets.collaboratorRoleId, collaboratorRoles.collaboratorRoleId)
      )
      .where(and(...filters));

    const items = await client
      .select({
        timesheetId: timesheets.timesheetId,
        collaboratorId: timesheets.collaboratorId,
        collaboratorName: collaborators.name,
        collaboratorRoleId: timesheets.collaboratorRoleId,
        collaboratorRoleName: collaboratorRoles.name,
        status: timesheets.status,
        startDate: timesheets.startDate,
        endDate: timesheets.endDate,
        createdAt: timesheets.createdAt,
        completedAt: timesheets.completedAt,
      })
      .from(timesheets)
      .leftJoin(
        collaborators,
        eq(timesheets.collaboratorId, collaborators.collaboratorId)
      )
      .leftJoin(
        collaboratorRoles,
        eq(timesheets.collaboratorRoleId, collaboratorRoles.collaboratorRoleId)
      )
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
