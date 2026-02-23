import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemas from './schemas.js';
import { ENV } from '#/env.js';
export const client = drizzle(ENV.DATABASE_URL, {
  schema: schemas,
  logger: ENV.NODE_ENV === 'development',
});
