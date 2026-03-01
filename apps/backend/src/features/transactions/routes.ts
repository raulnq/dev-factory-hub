import { Hono } from 'hono';
import { listRoute } from './list-transactions.js';
import { addRoute } from './add-transaction.js';
import { getRoute } from './get-transaction.js';
import { editRoute } from './edit-transaction.js';
import { issueRoute } from './issue-transaction.js';
import { cancelRoute } from './cancel-transaction.js';
import { uploadRoute } from './upload-transaction.js';
import { getDownloadUrlRoute } from './get-download-url.js';

export const transactionRoute = new Hono()
  .basePath('/transactions')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', issueRoute)
  .route('/', cancelRoute)
  .route('/', uploadRoute)
  .route('/', getDownloadUrlRoute);
