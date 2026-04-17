import { z } from 'zod';

export const sendMonthlyStatementSchema = z.object({
  fromEmail: z.string().email(),
  toEmail: z.string().email(),
  ccEmails: z.array(z.string().email()),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export type SendMonthlyStatement = z.infer<typeof sendMonthlyStatementSchema>;
