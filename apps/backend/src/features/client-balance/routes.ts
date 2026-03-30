import { Hono } from 'hono';
import { listRoute } from './list-client-balance.js';
import { summaryRoute } from './list-client-balance-summary.js';

export const clientBalanceRoute = new Hono()
  .basePath('/client-balance')
  .route('/', listRoute)
  .route('/', summaryRoute);
