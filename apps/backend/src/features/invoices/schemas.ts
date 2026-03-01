import { z } from 'zod';
import { paginationSchema } from '#/pagination.js';

export const invoiceSchema = z.object({
  invoiceId: z.uuidv7(),
  clientId: z.uuidv7(),
  clientName: z.string().optional(),
  currency: z.string().length(3),
  subtotal: z.number().min(0),
  taxes: z.number().min(0),
  total: z.number().min(0),
  status: z.string(),
  issuedAt: z.string().nullable(),
  createdAt: z.date(),
  canceledAt: z.date().nullable(),
  number: z.string().max(20).nullable(),
  exchangeRate: z.number().min(0).nullable(),
});

export type Invoice = z.infer<typeof invoiceSchema>;

export const addInvoiceSchema = z.object({
  clientId: z.uuidv7(),
  currency: z.string().length(3),
  subtotal: z.number().min(0),
  taxes: z.number().min(0),
});

export type AddInvoice = z.infer<typeof addInvoiceSchema>;

export const editInvoiceSchema = z.object({
  currency: z.string().length(3),
  subtotal: z.number().min(0),
  taxes: z.number().min(0),
});

export type EditInvoice = z.infer<typeof editInvoiceSchema>;

export const issueInvoiceSchema = z.object({
  issuedAt: z.iso.date(),
  exchangeRate: z.number().min(0),
  number: z.string().min(1).max(20),
});

export type IssueInvoice = z.infer<typeof issueInvoiceSchema>;

export const listInvoicesSchema = paginationSchema.extend({
  clientId: z.uuidv7().optional(),
});

export type ListInvoices = z.infer<typeof listInvoicesSchema>;
