import { Hono } from 'hono';
import { listRoute } from './list-collaborator-balance.js';
import { summaryRoute } from './list-collaborator-balance-summary.js';

export const collaboratorBalanceRoute = new Hono()
  .basePath('/collaborator-balance')
  .route('/', listRoute)
  .route('/', summaryRoute);
