import { pgSchema, uuid, varchar, numeric, date } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const collaboratorBalanceEntries = dbSchema
  .view('collaborator_balance_entries', {
    collaboratorId: uuid('collaboratorId').notNull(),
    collaboratorName: varchar('collaboratorName', { length: 500 }),
    currency: varchar('currency', { length: 3 }),
    issuedAt: date('issuedAt', { mode: 'string' }).notNull(),
    entryType: varchar('entryType', { length: 25 }).notNull(),
    source: varchar('source', { length: 25 }).notNull(),
    amount: numeric('amount', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    description: varchar('description', { length: 2000 }).notNull(),
  })
  .existing();
