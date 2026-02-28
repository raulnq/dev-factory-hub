import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { timesheets } from './timesheet.js';
import { collaborators } from '../collaborators/collaborator.js';
import { collaboratorRoles } from '../collaborator-roles/collaborator-role.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { timesheetSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = timesheetSchema.pick({ timesheetId: true });

export const getRoute = new Hono().get(
  '/:timesheetId',
  zValidator('param', schema),
  async c => {
    const { timesheetId } = c.req.valid('param');
    const [item] = await getTimesheetWithRelations()
      .where(eq(timesheets.timesheetId, timesheetId))
      .limit(1);
    if (!item) {
      return notFoundError(c, `Timesheet ${timesheetId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);

export function getTimesheetWithRelations() {
  return client
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
    );
}
