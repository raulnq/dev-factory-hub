import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { and, eq, gte, isNotNull, lte, SQL } from 'drizzle-orm';
import { listClientBalanceSchema } from './schemas.js';
import { proformas } from '#/features/proformas/proforma.js';
import { collections } from '#/features/collections/collection.js';
import { clients } from '#/features/clients/client.js';
import { projects } from '#/features/clients/project.js';

type RawEntry = {
  issuedAt: string;
  type: 'Income' | 'Outcome';
  name: string;
  description: string;
  amount: number;
};

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listClientBalanceSchema),
  async c => {
    const { currency, clientId, startDate, endDate } = c.req.valid('query');

    const entries: RawEntry[] = [];

    // 1. Proformas (Issued, total > 0) → Income
    const pfFilters: SQL[] = [
      eq(proformas.status, 'Issued'),
      eq(proformas.currency, currency),
      eq(projects.clientId, clientId),
      isNotNull(proformas.issuedAt),
    ];

    if (startDate) {
      pfFilters.push(gte(proformas.issuedAt, new Date(startDate)));
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      pfFilters.push(lte(proformas.issuedAt, endDateTime));
    }

    const pfRows = await client
      .select({
        clientName: clients.name,
        startDate: proformas.startDate,
        endDate: proformas.endDate,
        total: proformas.total,
        issuedAt: proformas.issuedAt,
      })
      .from(proformas)
      .innerJoin(projects, eq(proformas.projectId, projects.projectId))
      .innerJoin(clients, eq(projects.clientId, clients.clientId))
      .where(and(...pfFilters));

    for (const pf of pfRows) {
      if (!pf.issuedAt || pf.total <= 0) continue;
      const clientName = pf.clientName ?? 'Unknown';
      entries.push({
        issuedAt: pf.issuedAt.toISOString().split('T')[0],
        type: 'Income',
        name: clientName,
        description: `Proforma for ${clientName} from ${pf.startDate} to ${pf.endDate}`,
        amount: pf.total,
      });
    }

    // 2. Collections (Confirmed, total > 0) → Outcome
    const colFilters: SQL[] = [
      eq(collections.status, 'Confirmed'),
      eq(collections.currency, currency),
      eq(collections.clientId, clientId),
      isNotNull(collections.confirmedAt),
    ];

    if (startDate) colFilters.push(gte(collections.confirmedAt, startDate));
    if (endDate) colFilters.push(lte(collections.confirmedAt, endDate));

    const colRows = await client
      .select({
        clientName: clients.name,
        total: collections.total,
        confirmedAt: collections.confirmedAt,
      })
      .from(collections)
      .innerJoin(clients, eq(collections.clientId, clients.clientId))
      .where(and(...colFilters));

    for (const col of colRows) {
      if (!col.confirmedAt || col.total <= 0) continue;
      const clientName = col.clientName ?? 'Unknown';
      entries.push({
        issuedAt: col.confirmedAt,
        type: 'Outcome',
        name: clientName,
        description: `Collection for ${clientName}`,
        amount: -Math.abs(col.total),
      });
    }

    // Sort by issuedAt ascending, compute running balance
    entries.sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));

    let runningBalance = 0;
    const result = entries.map(entry => {
      runningBalance = Math.round((runningBalance + entry.amount) * 100) / 100;
      return { ...entry, balance: runningBalance };
    });

    return c.json(
      { entries: result, finalBalance: runningBalance },
      StatusCodes.OK
    );
  }
);
