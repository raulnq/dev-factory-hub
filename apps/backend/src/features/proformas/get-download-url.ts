import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformas } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { proformaSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = proformaSchema.pick({ proformaId: true });

export const getDownloadUrlRoute = new Hono().get(
  '/:proformaId/download-url',
  zValidator('param', paramSchema),
  async c => {
    const { proformaId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(proformas)
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Proforma ${proformaId} not found`);
    }

    if (!existing.filePath) {
      return notFoundError(c, `Proforma ${proformaId} has no PDF file`);
    }

    const url = await getPresignedDownloadUrl(existing.filePath, 900);
    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
