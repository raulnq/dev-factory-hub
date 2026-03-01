import { Hono } from 'hono';
import { listRoute } from './list-invoices.js';
import { addRoute } from './add-invoice.js';
import { getRoute } from './get-invoice.js';
import { editRoute } from './edit-invoice.js';
import { issueRoute } from './issue-invoice.js';
import { cancelRoute } from './cancel-invoice.js';

export const invoiceRoute = new Hono()
  .basePath('/invoices')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', issueRoute)
  .route('/', cancelRoute);
