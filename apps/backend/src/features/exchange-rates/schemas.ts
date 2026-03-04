import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const exchangeRateSchema = z.object({
  exchangeRateId: z.uuidv7(),
  date: z.string().date(),
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  rate: z.number().nonnegative(),
  createdAt: z.coerce.date(),
});

export type ExchangeRate = z.infer<typeof exchangeRateSchema>;

export const addExchangeRateSchema = exchangeRateSchema.pick({
  date: true,
  fromCurrency: true,
  toCurrency: true,
  rate: true,
});

export type AddExchangeRate = z.infer<typeof addExchangeRateSchema>;

export const editExchangeRateSchema = exchangeRateSchema.pick({
  date: true,
  fromCurrency: true,
  toCurrency: true,
  rate: true,
});

export type EditExchangeRate = z.infer<typeof editExchangeRateSchema>;

export const listExchangeRatesSchema = paginationSchema.extend({
  fromCurrency: z.string().length(3).optional(),
});

export type ListExchangeRates = z.infer<typeof listExchangeRatesSchema>;
