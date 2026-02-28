import { Hono } from 'hono';
import { listProjectsRoute } from './list-projects.js';

export const projectsRoute = new Hono()
  .basePath('/projects')
  .route('/', listProjectsRoute);
