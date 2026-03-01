import { Hono } from 'hono';
import { listRoute } from './list-bank-balance.js';

export const bankBalanceRoute = new Hono()
  .basePath('/bank-balance')
  .route('/', listRoute);
