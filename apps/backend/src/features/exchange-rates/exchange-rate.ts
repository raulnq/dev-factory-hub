import {
  date,
  numeric,
  pgSchema,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const exchangeRates = dbSchema.table('exchangeRates', {
  exchangeRateId: uuid('exchangeRateId').primaryKey(),
  date: date('date', { mode: 'string' }).notNull(),
  fromCurrency: varchar('fromCurrency', { length: 3 }).notNull(),
  toCurrency: varchar('toCurrency', { length: 3 }).notNull(),
  rate: numeric('rate', { precision: 10, scale: 4, mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
});
