import { Hono } from 'hono';
import { todoRoute } from './features/todos/routes.js';
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
  .route('/api', todoRoute)
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
