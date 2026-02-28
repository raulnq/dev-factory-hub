import { Hono } from 'hono';
import { listRoute } from './list-timesheets.js';
import { addRoute } from './add-timesheet.js';
import { getRoute } from './get-timesheet.js';
import { addProjectRoute } from './add-timesheet-project.js';
import { listProjectsRoute } from './list-timesheet-projects.js';
import { deleteProjectRoute } from './delete-timesheet-project.js';
import { editWorklogRoute } from './edit-worklog.js';
import { completeRoute } from './complete-timesheet.js';

export const timesheetRoute = new Hono()
  .basePath('/timesheets')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', addProjectRoute)
  .route('/', listProjectsRoute)
  .route('/', deleteProjectRoute)
  .route('/', editWorklogRoute)
  .route('/', completeRoute);
