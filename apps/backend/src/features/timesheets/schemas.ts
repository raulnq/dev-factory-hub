import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const timesheetSchema = z.object({
  timesheetId: z.uuidv7(),
  collaboratorId: z.uuidv7(),
  collaboratorName: z.string().nullish(),
  collaboratorRoleId: z.uuidv7(),
  collaboratorRoleName: z.string().nullish(),
  status: z.string(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  feeRate: z.number().nonnegative().nullable(),
  costRate: z.number().nonnegative().nullable(),
  currency: z.string().max(3).nullable(),
  completedAt: z.iso.date().nullable(),
  createdAt: z.date(),
});

export type Timesheet = z.infer<typeof timesheetSchema>;

export const addTimesheetSchema = timesheetSchema
  .pick({
    collaboratorId: true,
    collaboratorRoleId: true,
    startDate: true,
    endDate: true,
  })
  .refine(data => new Date(data.startDate) < new Date(data.endDate), {
    message: 'Start date must be before end date',
    path: ['endDate'],
  });

export type AddTimesheet = z.infer<typeof addTimesheetSchema>;

export const listTimesheetsSchema = paginationSchema.extend({
  collaboratorId: z.uuidv7().optional(),
});
export type ListTimesheets = z.infer<typeof listTimesheetsSchema>;

export const timesheetProjectSchema = z.object({
  timesheetId: z.uuidv7(),
  projectId: z.uuidv7(),
});
export type TimesheetProject = z.infer<typeof timesheetProjectSchema>;

export const addTimesheetProjectSchema = timesheetProjectSchema.pick({
  projectId: true,
  timesheetId: true,
});

export const worklogSchema = z.object({
  timesheetId: z.uuidv7(),
  projectId: z.uuidv7(),
  date: z.string(),
  hours: z.number().nonnegative(),
});
export type Worklog = z.infer<typeof worklogSchema>;

export const editWorklogSchema = worklogSchema.pick({
  hours: true,
});
export type EditWorklog = z.infer<typeof editWorklogSchema>;

export const completeTimesheetSchema = z.object({
  completedAt: z.iso.date(),
});
export type CompleteTimesheet = z.infer<typeof completeTimesheetSchema>;

export const timesheetProjectWithWorklogsSchema = z.object({
  projectId: z.uuidv7(),
  projectName: z.string(),
  worklogs: z.array(worklogSchema),
});
export type TimesheetProjectWithWorklogs = z.infer<
  typeof timesheetProjectWithWorklogsSchema
>;
