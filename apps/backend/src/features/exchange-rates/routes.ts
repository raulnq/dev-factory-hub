import { Hono } from 'hono';
import { addRoute } from './add-exchange-rate.js';
import { editRoute } from './edit-exchange-rate.js';
import { getRoute } from './get-exchange-rate.js';
import { listRoute } from './list-exchange-rates.js';

export const exchangeRateRoute = new Hono()
  .basePath('/exchange-rates')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
