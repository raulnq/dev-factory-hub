import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { contacts } from './contact.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { editContactSchema, clientSchema, contactSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { z } from 'zod';

const paramSchema = z.object({
  clientId: clientSchema.shape.clientId,
  contactId: contactSchema.shape.contactId,
});

export const editContactRoute = new Hono().put(
  '/:clientId/contacts/:contactId',
  zValidator('param', paramSchema),
  zValidator('json', editContactSchema),
  async c => {
    const { clientId, contactId } = c.req.valid('param');
    const data = c.req.valid('json');

    const existing = await client
      .select()
      .from(contacts)
      .where(
        and(eq(contacts.contactId, contactId), eq(contacts.clientId, clientId))
      )
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Contact ${contactId} not found`);
    }

    const [item] = await client
      .update(contacts)
      .set(data)
      .where(
        and(eq(contacts.contactId, contactId), eq(contacts.clientId, clientId))
      )
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
