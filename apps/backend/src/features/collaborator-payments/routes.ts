import { Hono } from 'hono';
import { listRoute } from './list-collaborator-payments.js';
import { addRoute } from './add-collaborator-payment.js';
import { getRoute } from './get-collaborator-payment.js';
import { editRoute } from './edit-collaborator-payment.js';
import { payRoute } from './pay-collaborator-payment.js';
import { confirmRoute } from './confirm-collaborator-payment.js';
import { cancelRoute } from './cancel-collaborator-payment.js';

export const collaboratorPaymentRoute = new Hono()
  .basePath('/collaborator-payments')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', payRoute)
  .route('/', confirmRoute)
  .route('/', cancelRoute);
