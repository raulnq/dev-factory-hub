import {
  varchar,
  pgSchema,
  uuid,
  numeric,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const transactions = dbSchema.table('transactions', {
  transactionId: uuid('transactionId').primaryKey(),
  description: varchar('description', { length: 1000 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  total: numeric('total', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
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
  filePath: varchar('filePath', { length: 500 }),
  number: varchar('number', { length: 20 }),
  contentType: varchar('contentType', { length: 100 }),
});
