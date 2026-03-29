import { Hono } from 'hono';
import { listRoute } from './list-bank-balance.js';
import { summaryRoute } from './list-bank-balance-summary.js';

export const bankBalanceRoute = new Hono()
  .basePath('/bank-balance')
  .route('/', listRoute)
  .route('/', summaryRoute);
