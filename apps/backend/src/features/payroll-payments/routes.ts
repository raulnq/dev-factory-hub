import { Hono } from 'hono';
import { listRoute } from './list-payroll-payments.js';
import { addRoute } from './add-payroll-payment.js';
import { getRoute } from './get-payroll-payment.js';
import { editRoute } from './edit-payroll-payment.js';
import { payRoute } from './pay-payroll-payment.js';
import { payPensionRoute } from './pay-pension-payroll-payment.js';
import { cancelRoute } from './cancel-payroll-payment.js';
import { uploadRoute } from './upload-payroll-payment.js';
import { getDownloadUrlRoute } from './get-download-url.js';

export const payrollPaymentRoute = new Hono()
  .basePath('/payroll-payments')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', payRoute)
  .route('/', payPensionRoute)
  .route('/', cancelRoute)
  .route('/', uploadRoute)
  .route('/', getDownloadUrlRoute);
