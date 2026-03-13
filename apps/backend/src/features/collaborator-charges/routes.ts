import { Hono } from 'hono';
import { listRoute } from './list-collaborator-charges.js';
import { addRoute } from './add-collaborator-charge.js';
import { getRoute } from './get-collaborator-charge.js';
import { editRoute } from './edit-collaborator-charge.js';
import { payRoute } from './pay-collaborator-charge.js';
import { cancelRoute } from './cancel-collaborator-charge.js';

export const collaboratorChargeRoute = new Hono()
  .basePath('/collaborator-charges')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', payRoute)
  .route('/', cancelRoute);
