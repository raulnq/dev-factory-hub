import {
  pgSchema,
  uuid,
  varchar,
  numeric,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { clients } from '#/features/clients/client.js';

const dbSchema = pgSchema('dev-factory-hub');

export const invoices = dbSchema.table('invoices', {
  invoiceId: uuid('invoiceId').primaryKey(),
  clientId: uuid('clientId')
    .notNull()
    .references(() => clients.clientId),
  currency: varchar('currency', { length: 3 }).notNull(),
  subtotal: numeric('subtotal', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  taxes: numeric('taxes', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  total: numeric('total', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  status: varchar('status', { length: 25 }).notNull().default('Pending'),
  issuedAt: date('issuedAt', { mode: 'string' }),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  canceledAt: timestamp('canceledAt', {
    mode: 'date',
    withTimezone: true,
  }),
  number: varchar('number', { length: 20 }),
  exchangeRate: numeric('exchangeRate', {
    precision: 10,
    scale: 4,
    mode: 'number',
  }),
});
