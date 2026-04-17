import { Hono } from 'hono';
import { sendMonthlyStatementRoute } from './send-monthly-statement.js';

export const reportsRoute = new Hono()
  .basePath('/reports')
  .route('/', sendMonthlyStatementRoute);
