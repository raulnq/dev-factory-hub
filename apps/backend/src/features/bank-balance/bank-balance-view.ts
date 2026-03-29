import { pgSchema, varchar, numeric, date } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const bankBalanceEntries = dbSchema
  .view('bank_balance_entries', {
    currency: varchar('currency', { length: 3 }).notNull(),
    issuedAt: date('issuedAt', { mode: 'string' }).notNull(),
    entryType: varchar('entryType', { length: 25 }).notNull(),
    description: varchar('description', { length: 2000 }).notNull(),
    total: numeric('total', {
      precision: 14,
      scale: 2,
      mode: 'number',
    }).notNull(),
    taxes: numeric('taxes', {
      precision: 14,
      scale: 2,
      mode: 'number',
    }).notNull(),
  })
  .existing();
