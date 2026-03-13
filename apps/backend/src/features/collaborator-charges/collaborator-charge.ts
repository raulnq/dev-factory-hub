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

export const collaboratorCharges = dbSchema.table('collaborator_charges', {
  collaboratorChargeId: uuid('collaboratorChargeId').primaryKey(),
  collaboratorId: uuid('collaboratorId')
    .notNull()
    .references(() => collaborators.collaboratorId),
  description: varchar('description', { length: 2000 }).notNull(),
  amount: numeric('amount', {
    precision: 12,
    scale: 2,
    mode: 'number',
  }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  status: varchar('status', { length: 25 }).notNull().default('Pending'),
  issuedAt: date('issuedAt', { mode: 'string' }),
  canceledAt: timestamp('canceledAt', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
