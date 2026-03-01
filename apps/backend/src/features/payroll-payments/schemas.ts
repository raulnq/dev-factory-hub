import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const payrollPaymentSchema = z.object({
  payrollPaymentId: z.uuidv7(),
  collaboratorId: z.uuidv7(),
  collaboratorName: z.string().optional(),
  currency: z.string().length(3),
  netSalary: z.number().min(0),
  pensionAmount: z.number().min(0),
  grossSalary: z.number().min(0),
  comission: z.number().min(0),
  taxes: z.number().min(0),
  status: z.string().max(25),
  paidAt: z.iso.date().nullable(),
  pensionPaidAt: z.iso.date().nullable(),
  createdAt: z.date(),
  canceledAt: z.date().nullable(),
  filePath: z.string().max(500).nullable(),
  contentType: z.string().max(100).nullable(),
});

export type PayrollPayment = z.infer<typeof payrollPaymentSchema>;

export const addPayrollPaymentSchema = z.object({
  collaboratorId: z.uuidv7(),
  currency: z.string().length(3),
  netSalary: z.number().min(0),
  comission: z.number().min(0),
  taxes: z.number().min(0),
});

export type AddPayrollPayment = z.infer<typeof addPayrollPaymentSchema>;

export const editPayrollPaymentSchema = z.object({
  currency: z.string().length(3),
  netSalary: z.number().min(0),
  comission: z.number().min(0),
  taxes: z.number().min(0),
});

export type EditPayrollPayment = z.infer<typeof editPayrollPaymentSchema>;

export const payPayrollPaymentSchema = z.object({
  paidAt: z.iso.date(),
});

export type PayPayrollPayment = z.infer<typeof payPayrollPaymentSchema>;

export const payPensionPayrollPaymentSchema = z.object({
  pensionPaidAt: z.iso.date(),
  pensionAmount: z.number().min(0),
});

export type PayPensionPayrollPayment = z.infer<
  typeof payPensionPayrollPaymentSchema
>;

export const listPayrollPaymentsSchema = paginationSchema.extend({
  collaboratorId: z.uuidv7().optional(),
});

export type ListPayrollPayments = z.infer<typeof listPayrollPaymentsSchema>;

export const downloadUrlResponseSchema = z.object({
  url: z.string(),
  expiresIn: z.number(),
});

export type DownloadUrlResponse = z.infer<typeof downloadUrlResponseSchema>;
