import { Hono } from 'hono';
import { sendMonthlyStatementRoute } from './send-monthly-statement.js';
import { sendYearlyStatementRoute } from './send-yearly-statement.js';

export const reportsRoute = new Hono()
  .basePath('/reports')
  .route('/', sendMonthlyStatementRoute)
  .route('/', sendYearlyStatementRoute);
