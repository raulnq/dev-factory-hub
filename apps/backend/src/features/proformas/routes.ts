import { Hono } from 'hono';
import { listRoute } from './list-proformas.js';
import { addRoute } from './add-proforma.js';
import { getRoute } from './get-proforma.js';
import { editRoute } from './edit-proforma.js';
import { issueRoute } from './issue-proforma.js';
import { cancelRoute } from './cancel-proforma.js';
import { addItemRoute } from './add-item.js';
import { deleteItemRoute } from './delete-item.js';
import { listItemsRoute } from './list-items.js';

export const proformaRoute = new Hono()
  .basePath('/proformas')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', issueRoute)
  .route('/', cancelRoute)
  .route('/', addItemRoute)
  .route('/', deleteItemRoute)
  .route('/', listItemsRoute);
