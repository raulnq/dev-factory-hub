import { Hono } from 'hono';
import { listDocumentStatusRoute } from './list-document-status.js';
import { sendMonthlyStatementApiRoute } from './send-monthly-statement.js';

export const reportsApiRoute = new Hono()
  .basePath('/reports')
  .route('/', listDocumentStatusRoute)
  .route('/', sendMonthlyStatementApiRoute);
