import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const moneyExchangeSchema = z.object({
  moneyExchangeId: z.uuidv7(),
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  rate: z.number().min(0),
  fromAmount: z.number().min(0),
  toAmount: z.number().min(0),
  toTaxes: z.number().min(0),
  fromTaxes: z.number().min(0),
  status: z.string().max(25),
  issuedAt: z.string().nullable(),
  createdAt: z.date(),
  canceledAt: z.date().nullable(),
  filePath: z.string().max(500).nullable(),
  contentType: z.string().max(100).nullable(),
});

export type MoneyExchange = z.infer<typeof moneyExchangeSchema>;

export const addMoneyExchangeSchema = z.object({
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  rate: z.number().min(0),
  fromAmount: z.number().min(0),
  toAmount: z.number().min(0),
  toTaxes: z.number().min(0),
  fromTaxes: z.number().min(0),
});

export type AddMoneyExchange = z.infer<typeof addMoneyExchangeSchema>;

export const editMoneyExchangeSchema = z.object({
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  rate: z.number().min(0),
  fromAmount: z.number().min(0),
  toAmount: z.number().min(0),
  toTaxes: z.number().min(0),
  fromTaxes: z.number().min(0),
});

export type EditMoneyExchange = z.infer<typeof editMoneyExchangeSchema>;

export const issueMoneyExchangeSchema = z.object({
  issuedAt: z.iso.date(),
});

export type IssueMoneyExchange = z.infer<typeof issueMoneyExchangeSchema>;

export const listMoneyExchangesSchema = paginationSchema.extend({
  fromCurrency: z.string().optional(),
  toCurrency: z.string().optional(),
});

export type ListMoneyExchanges = z.infer<typeof listMoneyExchangesSchema>;

export const downloadUrlResponseSchema = z.object({
  url: z.string(),
  expiresIn: z.number(),
});

export type DownloadUrlResponse = z.infer<typeof downloadUrlResponseSchema>;
