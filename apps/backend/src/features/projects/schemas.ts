import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const projectWithClientSchema = z.object({
  projectId: z.uuidv7(),
  clientId: z.uuidv7(),
  name: z.string(),
  clientName: z.string(),
});

export type ProjectWithClient = z.infer<typeof projectWithClientSchema>;

export const listProjectsQuerySchema = paginationSchema.extend({
  name: z.string().optional(),
  clientId: z.uuidv7().optional(),
});

export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
