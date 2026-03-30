import { pgSchema, uuid, varchar, numeric, date } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const clientBalanceEntries = dbSchema
  .view('client_balance_entries', {
    clientId: uuid('clientId').notNull(),
    clientName: varchar('clientName', { length: 500 }),
    currency: varchar('currency', { length: 3 }),
    issuedAt: date('issuedAt', { mode: 'string' }).notNull(),
    entryType: varchar('entryType', { length: 25 }).notNull(),
    amount: numeric('amount', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    description: varchar('description', { length: 2000 }).notNull(),
  })
  .existing();
