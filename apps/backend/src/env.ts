import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

const ENVSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string(),
  SEQ_URL: z.string().optional(),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
  CORS_ORIGIN: z.string().optional().default('http://localhost:5173'),
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  S3_REGION: z.string().optional().default('us-east-1'),
  S3_ENDPOINT: z.string().optional(),
  S3_FORCE_PATH_STYLE: z
    .string()
    .optional()
    .transform(v => v === 'true')
    .default(false),
  S3_ACCESS_KEY_ID: z.string().optional().default(''),
  S3_SECRET_ACCESS_KEY: z.string().optional().default(''),
  S3_COLLECTIONS_BUCKET_NAME: z.string().optional().default('collections'),
  S3_TRANSACTIONS_BUCKET_NAME: z.string().optional().default('transactions'),
});

expand(config());

try {
  ENVSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const e = new Error(
      `Environment validation failed:\n ${z.treeifyError(error)}`
    );
    e.stack = '';
    throw e;
  } else {
    console.error('Unexpected error during environment validation:', error);
    throw error;
  }
}

export const ENV = ENVSchema.parse(process.env);
