import { z } from 'zod';
import { paginationSchema } from '#/pagination.js';

export const collaboratorPaymentSchema = z.object({
  collaboratorPaymentId: z.uuidv7(),
  collaboratorId: z.uuidv7(),
  collaboratorName: z.string().optional(),
  currency: z.string().length(3),
  grossSalary: z.number().min(0),
  withholding: z.number().min(0),
  netSalary: z.number().min(0),
  status: z.string(),
  paidAt: z.iso.date().nullable(),
  confirmedAt: z.iso.date().nullable(),
  canceledAt: z.date().nullable(),
  createdAt: z.date(),
  number: z.string().max(20).nullable(),
});

export const addCollaboratorPaymentSchema = z.object({
  collaboratorId: z.uuidv7(),
  currency: z.string().length(3),
  grossSalary: z.number().min(0),
});

export const editCollaboratorPaymentSchema = z.object({
  currency: z.string().length(3),
  grossSalary: z.number().min(0),
  withholding: z.number().min(0),
});

export const payCollaboratorPaymentSchema = z.object({
  paidAt: z.iso.date(),
});

export const confirmCollaboratorPaymentSchema = z.object({
  confirmedAt: z.iso.date(),
  number: z.string().max(20),
});

export const listCollaboratorPaymentsSchema = paginationSchema.extend({
  collaboratorId: z.uuidv7().optional(),
});

export type CollaboratorPayment = z.infer<typeof collaboratorPaymentSchema>;
export type AddCollaboratorPayment = z.infer<
  typeof addCollaboratorPaymentSchema
>;
export type EditCollaboratorPayment = z.infer<
  typeof editCollaboratorPaymentSchema
>;
export type PayCollaboratorPayment = z.infer<
  typeof payCollaboratorPaymentSchema
>;
export type ConfirmCollaboratorPayment = z.infer<
  typeof confirmCollaboratorPaymentSchema
>;
export type ListCollaboratorPayments = z.infer<
  typeof listCollaboratorPaymentsSchema
>;
