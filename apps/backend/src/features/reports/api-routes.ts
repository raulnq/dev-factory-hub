import { Hono } from 'hono';
import { listDocumentStatusRoute } from './list-document-status.js';

export const reportsApiRoute = new Hono()
  .basePath('/reports')
  .route('/', listDocumentStatusRoute);
