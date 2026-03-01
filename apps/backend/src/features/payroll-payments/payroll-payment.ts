import {
  varchar,
  pgSchema,
  uuid,
  numeric,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { collaborators } from '#/features/collaborators/collaborator.js';

const dbSchema = pgSchema('dev-factory-hub');

export const payrollPayments = dbSchema.table('payroll_payments', {
  payrollPaymentId: uuid('payrollPaymentId').primaryKey(),
  collaboratorId: uuid('collaboratorId')
    .notNull()
    .references(() => collaborators.collaboratorId),
  currency: varchar('currency', { length: 3 }).notNull(),
  netSalary: numeric('netSalary', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  pensionAmount: numeric('pensionAmount', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  grossSalary: numeric('grossSalary', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  comission: numeric('comission', {
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
  paidAt: date('paidAt', { mode: 'string' }),
  pensionPaidAt: date('pensionPaidAt', { mode: 'string' }),
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
