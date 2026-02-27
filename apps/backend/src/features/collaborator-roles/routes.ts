import { Hono } from 'hono';
import { listRoute } from './list-collaborator-roles.js';
import { addRoute } from './add-collaborator-role.js';
import { getRoute } from './get-collaborator-role.js';
import { editRoute } from './edit-collaborator-role.js';

export const collaboratorRoleRoute = new Hono()
  .basePath('/collaborator-roles')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
