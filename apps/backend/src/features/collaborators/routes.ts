import { Hono } from 'hono';
import { listRoute } from './list-collaborators.js';
import { addRoute } from './add-collaborator.js';
import { getRoute } from './get-collaborator.js';
import { editRoute } from './edit-collaborator.js';

export const collaboratorRoute = new Hono()
  .basePath('/collaborators')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
