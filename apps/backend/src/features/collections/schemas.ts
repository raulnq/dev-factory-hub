import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const collectionSchema = z.object({
  collectionId: z.uuidv7(),
  clientId: z.uuidv7(),
  clientName: z.string().nullable(),
  currency: z.string().min(1).max(3),
  total: z.number().min(0),
  commission: z.number().min(0),
  taxes: z.number().min(0),
  status: z.string().max(25),
  confirmedAt: z.string().nullable(),
  createdAt: z.date(),
  canceledAt: z.date().nullable(),
  filePath: z.string().max(500).nullable(),
  contentType: z.string().max(100).nullable(),
});

export type Collection = z.infer<typeof collectionSchema>;

export const addCollectionSchema = z.object({
  clientId: z.uuidv7(),
  currency: z.string().min(1).max(3),
  total: z.number().min(0),
  commission: z.number().min(0),
  taxes: z.number().min(0),
});
export type AddCollection = z.infer<typeof addCollectionSchema>;

export const editCollectionSchema = z.object({
  currency: z.string().min(1).max(3),
  total: z.number().min(0),
  commission: z.number().min(0),
  taxes: z.number().min(0),
});
export type EditCollection = z.infer<typeof editCollectionSchema>;

export const listCollectionsSchema = paginationSchema.extend({
  clientId: z.uuidv7().optional(),
});
export type ListCollections = z.infer<typeof listCollectionsSchema>;

export const confirmCollectionSchema = z.object({
  confirmedAt: z.string(),
});
export type ConfirmCollection = z.infer<typeof confirmCollectionSchema>;

export const downloadUrlResponseSchema = z.object({
  url: z.string(),
  expiresIn: z.number(),
});
export type DownloadUrlResponse = z.infer<typeof downloadUrlResponseSchema>;
