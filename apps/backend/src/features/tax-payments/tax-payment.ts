import {
  pgSchema,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const taxPayments = dbSchema.table('tax_payments', {
  taxPaymentId: uuid('taxPaymentId').primaryKey(),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
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
  number: varchar('number', { length: 20 }),
  status: varchar('status', { length: 25 }).notNull().default('Pending'),
  paidAt: timestamp('paidAt', { mode: 'date', withTimezone: true }),
  cancelledAt: timestamp('cancelledAt', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const taxPaymentItems = dbSchema.table('tax_payment_items', {
  taxPaymentItemId: uuid('taxPaymentItemId').primaryKey(),
  taxPaymentId: uuid('taxPaymentId')
    .notNull()
    .references(() => taxPayments.taxPaymentId, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  amount: numeric('amount', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
});
