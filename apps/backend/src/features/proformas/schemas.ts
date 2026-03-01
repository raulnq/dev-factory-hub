import { z } from 'zod';
import { paginationSchema } from '#/pagination.js';

export const proformaSchema = z.object({
  proformaId: z.uuidv7(),
  projectId: z.uuidv7(),
  projectName: z.string().optional(),
  currency: z.string().length(3),

  startDate: z.iso.date(),
  endDate: z.iso.date(),
  subtotal: z.number().min(0),
  expenses: z.number().min(0),
  discount: z.number().min(0),
  taxes: z.number().min(0),
  total: z.number().min(0),
  number: z.string().max(20),
  status: z.string(),
  issuedAt: z.date().nullable(),
  cancelledAt: z.date().nullable(),
  createdAt: z.date(),
  notes: z.string().nullable(),
});

export const addProformaSchema = z.object({
  projectId: z.uuidv7(),
  currency: z.string().length(3),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  notes: z.string().optional(),
});

export const editProformaSchema = z.object({
  expenses: z.number().min(0),
  discount: z.number().min(0),
  taxes: z.number().min(0),
  notes: z.string().optional(),
});

export const proformaItemSchema = z.object({
  proformaItemId: z.uuidv7(),
  proformaId: z.uuidv7(),
  description: z.string().max(500),
  amount: z.number().min(0),
});

export const addProformaItemSchema = z.object({
  description: z.string().max(500),
  amount: z.number().min(0),
});

export const listProformaSchema = paginationSchema.extend({
  projectId: z.uuidv7().optional(),
});

export const listProformaItemsSchema = paginationSchema;

export type Proforma = z.infer<typeof proformaSchema>;
export type ProformaItem = z.infer<typeof proformaItemSchema>;
export type AddProforma = z.infer<typeof addProformaSchema>;
export type EditProforma = z.infer<typeof editProformaSchema>;
export type AddProformaItem = z.infer<typeof addProformaItemSchema>;
export type ListProforma = z.infer<typeof listProformaSchema>;
export type ListProformaItems = z.infer<typeof listProformaItemsSchema>;
