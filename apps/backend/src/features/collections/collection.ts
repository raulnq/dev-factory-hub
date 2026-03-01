import {
  varchar,
  pgSchema,
  uuid,
  numeric,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { clients } from '#/features/clients/client.js';

const dbSchema = pgSchema('dev-factory-hub');

export const collections = dbSchema.table('collections', {
  collectionId: uuid('collectionId').primaryKey(),
  clientId: uuid('clientId')
    .notNull()
    .references(() => clients.clientId),
  currency: varchar('currency', { length: 3 }).notNull(),
  total: numeric('total', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  commission: numeric('commission', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  taxes: numeric('taxes', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  status: varchar('status', { length: 25 }).notNull(),
  confirmedAt: date('confirmedAt', { mode: 'string' }),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  canceledAt: timestamp('canceledAt', { mode: 'date', withTimezone: true }),
  filePath: varchar('filePath', { length: 500 }),
  contentType: varchar('contentType', { length: 100 }),
});
