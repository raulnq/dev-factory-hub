import { Hono } from 'hono';
import { clientRoute } from './features/clients/routes.js';
import { projectsRoute } from './features/projects/routes.js';
import { collaboratorRoute } from './features/collaborators/routes.js';
import { collaboratorRoleRoute } from './features/collaborator-roles/routes.js';
import { timesheetRoute } from './features/timesheets/routes.js';
import { proformaRoute } from './features/proformas/routes.js';
import { collaboratorPaymentRoute } from './features/collaborator-payments/routes.js';
import { collectionRoute } from './features/collections/routes.js';
import { invoiceRoute } from './features/invoices/routes.js';
import { transactionRoute } from './features/transactions/routes.js';
import { moneyExchangeRoute } from './features/money-exchanges/routes.js';
import { payrollPaymentRoute } from './features/payroll-payments/routes.js';
import { taxPaymentRoute } from './features/tax-payments/routes.js';
import { onError } from './middlewares/on-error.js';
import { onNotFound } from './middlewares/on-not-found.js';
import { conditionalClerkMiddleware, requireAuth } from './middlewares/auth.js';
import { ENV } from './env.js';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { pinoLogger } from 'hono-pino';
import { logger } from './logger.js';

export const app = new Hono({ strict: false })
  .use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }))
  .use(
    pinoLogger({
      pino: logger,
      http: {
        onReqBindings: c => ({
          req: {
            method: c.req.method,
            path: c.req.path,
          },
        }),
      },
    })
  )
  .use(secureHeaders())
  .use('*', conditionalClerkMiddleware())
  .use('/api/*', requireAuth)
  .route('/api', clientRoute)
  .route('/api', projectsRoute)
  .route('/api', collaboratorRoute)
  .route('/api', collaboratorRoleRoute)
  .route('/api', timesheetRoute)
  .route('/api', proformaRoute)
  .route('/api', collaboratorPaymentRoute)
  .route('/api', collectionRoute)
  .route('/api', invoiceRoute)
  .route('/api', transactionRoute)
  .route('/api', moneyExchangeRoute)
  .route('/api', payrollPaymentRoute)
  .route('/api', taxPaymentRoute)
  .get('/live', c =>
    c.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: Date.now(),
    })
  )
  .notFound(onNotFound)
  .onError(onError);

export type App = typeof app;
