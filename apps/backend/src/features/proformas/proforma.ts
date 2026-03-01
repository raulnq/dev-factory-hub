import {
  pgSchema,
  uuid,
  varchar,
  numeric,
  date,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import { projects } from '#/features/clients/project.js';

const dbSchema = pgSchema('dev-factory-hub');

export const proformas = dbSchema.table('proformas', {
  proformaId: uuid('proformaId').primaryKey(),
  projectId: uuid('projectId')
    .notNull()
    .references(() => projects.projectId),
  currency: varchar('currency', { length: 3 }).notNull(),
  startDate: date('startDate', { mode: 'string' }).notNull(),
  endDate: date('endDate', { mode: 'string' }).notNull(),
  subtotal: numeric('subtotal', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  expenses: numeric('expenses', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  discount: numeric('discount', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
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
  number: varchar('number', { length: 20 }).notNull().unique(),
  status: varchar('status', { length: 25 }).notNull().default('Pending'),
  issuedAt: timestamp('issuedAt', { mode: 'date', withTimezone: true }),
  cancelledAt: timestamp('cancelledAt', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  notes: text('notes'),
});

export const proformaItems = dbSchema.table('proforma_items', {
  proformaItemId: uuid('proformaItemId').primaryKey(),
  proformaId: uuid('proformaId')
    .notNull()
    .references(() => proformas.proformaId, { onDelete: 'cascade' }),
  description: varchar('description', { length: 500 }).notNull(),
  amount: numeric('amount', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
});
