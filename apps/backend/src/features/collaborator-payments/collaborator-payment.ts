import {
  pgSchema,
  uuid,
  varchar,
  numeric,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { collaborators } from '#/features/collaborators/collaborator.js';

const dbSchema = pgSchema('dev-factory-hub');

export const collaboratorPayments = dbSchema.table('collaborator_payments', {
  collaboratorPaymentId: uuid('collaboratorPaymentId').primaryKey(),
  collaboratorId: uuid('collaboratorId')
    .notNull()
    .references(() => collaborators.collaboratorId),
  currency: varchar('currency', { length: 3 }).notNull(),
  grossSalary: numeric('grossSalary', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  withholding: numeric('withholding', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  netSalary: numeric('netSalary', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  status: varchar('status', { length: 25 }).notNull().default('Pending'),
  paidAt: date('paidAt', { mode: 'string' }),
  confirmedAt: date('confirmedAt', { mode: 'string' }),
  canceledAt: timestamp('canceledAt', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  number: varchar('number', { length: 20 }),
});
