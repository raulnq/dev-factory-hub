import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const taxPaymentSchema = z.object({
  taxPaymentId: z.uuidv7(),
  year: z.number().int().min(2001),
  month: z.number().int().min(1).max(13),
  currency: z.string().length(3),
  taxes: z.number().min(0),
  total: z.number().min(0),
  number: z.string().max(20).nullable(),
  status: z.string().max(25),
  paidAt: z.date().nullable(),
  cancelledAt: z.date().nullable(),
  createdAt: z.date(),
});

export type TaxPayment = z.infer<typeof taxPaymentSchema>;

export const addTaxPaymentSchema = z.object({
  year: z.number().int().min(2001),
  month: z.number().int().min(1).max(13),
  currency: z.string().length(3),
  taxes: z.number().min(0),
});

export type AddTaxPayment = z.infer<typeof addTaxPaymentSchema>;

export const editTaxPaymentSchema = z.object({
  currency: z.string().length(3),
  taxes: z.number().min(0),
});

export type EditTaxPayment = z.infer<typeof editTaxPaymentSchema>;

export const listTaxPaymentsSchema = paginationSchema.extend({
  year: z.coerce.number().int().optional(),
});

export type ListTaxPayments = z.infer<typeof listTaxPaymentsSchema>;

export const payTaxPaymentSchema = z.object({
  paidAt: z.iso.date(),
  number: z.string().min(1).max(20),
});

export type PayTaxPayment = z.infer<typeof payTaxPaymentSchema>;

export const taxPaymentItemSchema = z.object({
  taxPaymentItemId: z.uuidv7(),
  taxPaymentId: z.uuidv7(),
  type: z.string().max(50),
  amount: z.number().min(0),
});

export type TaxPaymentItem = z.infer<typeof taxPaymentItemSchema>;

export const addTaxPaymentItemSchema = z.object({
  type: z.string().min(1).max(50),
  amount: z.number().min(0),
});

export type AddTaxPaymentItem = z.infer<typeof addTaxPaymentItemSchema>;

export const listTaxPaymentItemsSchema = paginationSchema;

export type ListTaxPaymentItems = z.infer<typeof listTaxPaymentItemsSchema>;
