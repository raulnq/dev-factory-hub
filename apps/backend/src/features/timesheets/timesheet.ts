import {
  varchar,
  pgSchema,
  uuid,
  numeric,
  timestamp,
  date,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { collaboratorRoles } from '#/features/collaborator-roles/collaborator-role.js';
import { projects } from '#/features/clients/project.js';

const dbSchema = pgSchema('dev-factory-hub');

export const timesheets = dbSchema.table('timesheets', {
  timesheetId: uuid('timesheetId').primaryKey(),
  collaboratorId: uuid('collaboratorId')
    .notNull()
    .references(() => collaborators.collaboratorId),
  collaboratorRoleId: uuid('collaboratorRoleId')
    .notNull()
    .references(() => collaboratorRoles.collaboratorRoleId),
  status: varchar('status', { length: 25 }).notNull(),
  startDate: date('startDate', { mode: 'string' }).notNull(),
  endDate: date('endDate', { mode: 'string' }).notNull(),
  feeRate: numeric('feeRate', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }),
  costRate: numeric('costRate', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }),
  currency: varchar('currency', { length: 3 }),
  completedAt: date('completedAt', { mode: 'string' }),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const timesheetProjects = dbSchema.table(
  'timesheet_projects',
  {
    timesheetId: uuid('timesheetId')
      .notNull()
      .references(() => timesheets.timesheetId),
    projectId: uuid('projectId')
      .notNull()
      .references(() => projects.projectId),
  },
  t => ({
    pk: primaryKey({ columns: [t.timesheetId, t.projectId] }),
  })
);

export const worklogs = dbSchema.table(
  'worklogs',
  {
    timesheetId: uuid('timesheetId').notNull(),
    projectId: uuid('projectId').notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    hours: numeric('hours', {
      precision: 10,
      scale: 4,
      mode: 'number',
    }).notNull(),
  },
  t => ({
    pk: primaryKey({ columns: [t.timesheetId, t.projectId, t.date] }),
    timesheetProjectFk: foreignKey({
      columns: [t.timesheetId, t.projectId],
      foreignColumns: [
        timesheetProjects.timesheetId,
        timesheetProjects.projectId,
      ],
    }),
  })
);
