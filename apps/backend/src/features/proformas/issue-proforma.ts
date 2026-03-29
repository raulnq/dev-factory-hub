import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformas, proformaItems } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { proformaSchema, issueProformaSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getProformaWithRelations } from './get-proforma.js';
import { projects } from '#/features/clients/project.js';
import { clients } from '#/features/clients/client.js';
import { generateProformaPdf } from './generate-proforma-pdf.js';
import { uploadPdfBuffer } from './s3-client.js';

const paramSchema = proformaSchema.pick({ proformaId: true });

export const issueRoute = new Hono().post(
  '/:proformaId/issue',
  zValidator('param', paramSchema),
  zValidator('json', issueProformaSchema),
  async c => {
    const { proformaId } = c.req.valid('param');
    const { issuedAt } = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(proformas)
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Proforma ${proformaId} not found`);
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot issue proforma with status "${existing.status}". Must be "Pending".`
      );
    }

    if (Number(existing.total) <= 0) {
      return conflictError(
        c,
        `Cannot issue proforma with total "${existing.total}". Must be greater than 0.`
      );
    }

    // Fetch project + client data for PDF
    const [projectRow] = await client
      .select({
        projectName: projects.name,
        clientName: clients.name,
        clientAddress: clients.address,
        clientDocumentNumber: clients.documentNumber,
        clientPhone: clients.phone,
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.clientId))
      .where(eq(projects.projectId, existing.projectId))
      .limit(1);

    // Fetch proforma items
    const items = await client
      .select({
        description: proformaItems.description,
        amount: proformaItems.amount,
      })
      .from(proformaItems)
      .where(eq(proformaItems.proformaId, proformaId));

    // Generate PDF
    const pdfBuffer = await generateProformaPdf(
      {
        number: existing.number,
        projectName: projectRow?.projectName ?? '',
        startDate: existing.startDate,
        endDate: existing.endDate,
        currency: existing.currency,
        subtotal: existing.subtotal,
        expenses: existing.expenses,
        discount: existing.discount,
        taxes: existing.taxes,
        total: existing.total,
      },
      {
        name: projectRow?.clientName ?? '',
        address: projectRow?.clientAddress ?? null,
        documentNumber: projectRow?.clientDocumentNumber ?? null,
        phone: projectRow?.clientPhone ?? null,
      },
      items
    );

    // Upload PDF to S3
    const filePath = await uploadPdfBuffer(pdfBuffer, proformaId);

    await client
      .update(proformas)
      .set({
        status: 'Issued',
        issuedAt,
        filePath,
        contentType: 'application/pdf',
      })
      .where(eq(proformas.proformaId, proformaId));

    const [item] = await getProformaWithRelations()
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
