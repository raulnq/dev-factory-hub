import { Hono } from 'hono';
import { listRoute } from './list-money-exchanges.js';
import { addRoute } from './add-money-exchange.js';
import { getRoute } from './get-money-exchange.js';
import { editRoute } from './edit-money-exchange.js';
import { issueRoute } from './issue-money-exchange.js';
import { cancelRoute } from './cancel-money-exchange.js';
import { uploadRoute } from './upload-money-exchange.js';
import { getDownloadUrlRoute } from './get-download-url.js';

export const moneyExchangeRoute = new Hono()
  .basePath('/money-exchanges')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', issueRoute)
  .route('/', cancelRoute)
  .route('/', uploadRoute)
  .route('/', getDownloadUrlRoute);
