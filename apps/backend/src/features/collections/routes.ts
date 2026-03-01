import { Hono } from 'hono';
import { listRoute } from './list-collections.js';
import { addRoute } from './add-collection.js';
import { getRoute } from './get-collection.js';
import { editRoute } from './edit-collection.js';
import { confirmRoute } from './confirm-collection.js';
import { cancelRoute } from './cancel-collection.js';
import { uploadRoute } from './upload-collection.js';
import { getDownloadUrlRoute } from './get-download-url.js';

export const collectionRoute = new Hono()
  .basePath('/collections')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', confirmRoute)
  .route('/', cancelRoute)
  .route('/', uploadRoute)
  .route('/', getDownloadUrlRoute);
