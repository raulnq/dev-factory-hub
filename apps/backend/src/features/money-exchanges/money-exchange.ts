import {
  varchar,
  pgSchema,
  uuid,
  numeric,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const moneyExchanges = dbSchema.table('money_exchanges', {
  moneyExchangeId: uuid('moneyExchangeId').primaryKey(),
  fromCurrency: varchar('fromCurrency', { length: 3 }).notNull(),
  toCurrency: varchar('toCurrency', { length: 3 }).notNull(),
  rate: numeric('rate', {
    precision: 14,
    scale: 4,
    mode: 'number',
  }).notNull(),
  fromAmount: numeric('fromAmount', {
    precision: 14,
    scale: 2,
    mode: 'number',
  }).notNull(),
  toAmount: numeric('toAmount', {
    precision: 14,
    scale: 2,
    mode: 'number',
  }).notNull(),
  toTaxes: numeric('toTaxes', {
    precision: 14,
    scale: 2,
    mode: 'number',
  }).notNull(),
  fromTaxes: numeric('fromTaxes', {
    precision: 14,
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
  contentType: varchar('contentType', { length: 100 }),
});
