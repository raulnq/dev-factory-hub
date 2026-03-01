import { Hono } from 'hono';
import { listRoute } from './list-tax-payments.js';
import { addRoute } from './add-tax-payment.js';
import { getRoute } from './get-tax-payment.js';
import { editRoute } from './edit-tax-payment.js';
import { payRoute } from './pay-tax-payment.js';
import { cancelRoute } from './cancel-tax-payment.js';
import { addItemRoute } from './add-item.js';
import { deleteItemRoute } from './delete-item.js';
import { listItemsRoute } from './list-items.js';

export const taxPaymentRoute = new Hono()
  .basePath('/tax-payments')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', payRoute)
  .route('/', cancelRoute)
  .route('/', addItemRoute)
  .route('/', deleteItemRoute)
  .route('/', listItemsRoute);
