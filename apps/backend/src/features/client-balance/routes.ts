import { Hono } from 'hono';
import { listRoute } from './list-client-balance.js';

export const clientBalanceRoute = new Hono()
  .basePath('/client-balance')
  .route('/', listRoute);
