DROP VIEW IF EXISTS "dev-factory-hub"."client_balance_entries";--> statement-breakpoint
CREATE VIEW "dev-factory-hub"."client_balance_entries" AS

-- 1. Proformas (Issued, total > 0) → Outcome
SELECT
    p."clientId",
    cl."name"                               AS "clientName",
    pf."currency",
    pf."issuedAt",
    'Outcome'                               AS "entryType",
    -ABS(pf."total")                        AS "amount",
    'Proforma for ' || COALESCE(cl."name", 'Unknown') || ' from ' || pf."startDate" || ' to ' || pf."endDate" AS "description"
FROM "dev-factory-hub"."proformas" pf
INNER JOIN "dev-factory-hub"."projects" p   ON pf."projectId" = p."projectId"
INNER JOIN "dev-factory-hub"."clients" cl   ON p."clientId" = cl."clientId"
WHERE pf."status" = 'Issued'
  AND pf."issuedAt" IS NOT NULL
  AND pf."total" > 0

UNION ALL

-- 2. Collections (Confirmed, total > 0) → Income
SELECT
    col."clientId",
    cl."name"                               AS "clientName",
    col."currency",
    col."confirmedAt"                       AS "issuedAt",
    'Income'                                AS "entryType",
    col."total"                             AS "amount",
    'Collection for ' || COALESCE(cl."name", 'Unknown') AS "description"
FROM "dev-factory-hub"."collections" col
INNER JOIN "dev-factory-hub"."clients" cl   ON col."clientId" = cl."clientId"
WHERE col."status" = 'Confirmed'
  AND col."confirmedAt" IS NOT NULL
  AND col."total" > 0;
