import { Hono } from 'hono';
import { listRoute } from './list-collaborator-balance.js';

export const collaboratorBalanceRoute = new Hono()
  .basePath('/collaborator-balance')
  .route('/', listRoute);
