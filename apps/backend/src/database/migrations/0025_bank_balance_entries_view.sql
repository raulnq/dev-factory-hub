DROP VIEW IF EXISTS "dev-factory-hub"."bank_balance_entries";--> statement-breakpoint
CREATE VIEW "dev-factory-hub"."bank_balance_entries" AS

-- 1. Transactions (Issued, total > 0)
SELECT
    tx."currency",
    tx."issuedAt",
    tx."type"                           AS "entryType",
    tx."description",
    CASE WHEN tx."type" = 'Income' THEN tx."total" ELSE -ABS(tx."total") END AS "total",
    0::numeric                          AS "taxes"
FROM "dev-factory-hub"."transactions" tx
WHERE tx."status" = 'Issued'
  AND tx."issuedAt" IS NOT NULL
  AND tx."total" > 0

UNION ALL

-- 2a. Collections — total (Confirmed, total > 0)
SELECT
    col."currency",
    col."confirmedAt"                   AS "issuedAt",
    'Income'                            AS "entryType",
    'Collection for ' || COALESCE(cl."name", 'Unknown') AS "description",
    col."total",
    CASE WHEN col."taxes" > 0 THEN -ABS(col."taxes") ELSE 0 END AS "taxes"
FROM "dev-factory-hub"."collections" col
LEFT JOIN "dev-factory-hub"."clients" cl ON col."clientId" = cl."clientId"
WHERE col."status" = 'Confirmed'
  AND col."confirmedAt" IS NOT NULL
  AND col."total" > 0

UNION ALL

-- 2b. Collections — commission (Confirmed, commission > 0)
SELECT
    col."currency",
    col."confirmedAt"                   AS "issuedAt",
    'Outcome'                           AS "entryType",
    'Commission''s collection for ' || COALESCE(cl."name", 'Unknown') AS "description",
    -ABS(col."commission")              AS "total",
    0::numeric                          AS "taxes"
FROM "dev-factory-hub"."collections" col
LEFT JOIN "dev-factory-hub"."clients" cl ON col."clientId" = cl."clientId"
WHERE col."status" = 'Confirmed'
  AND col."confirmedAt" IS NOT NULL
  AND col."commission" > 0

UNION ALL

-- 3. Collaborator Payments (Paid/Confirmed, netSalary > 0)
SELECT
    cp."currency",
    cp."paidAt"                         AS "issuedAt",
    'Outcome'                           AS "entryType",
    'Collaborator payment to ' || COALESCE(c."name", 'Unknown') AS "description",
    -ABS(cp."netSalary")                AS "total",
    CASE WHEN cp."taxes" > 0 THEN -ABS(cp."taxes") ELSE 0 END AS "taxes"
FROM "dev-factory-hub"."collaborator_payments" cp
LEFT JOIN "dev-factory-hub"."collaborators" c ON cp."collaboratorId" = c."collaboratorId"
WHERE cp."status" IN ('Paid', 'Confirmed')
  AND cp."paidAt" IS NOT NULL
  AND cp."netSalary" > 0

UNION ALL

-- 4a. Money Exchanges — from side (Issued, fromAmount > 0)
SELECT
    me."fromCurrency"                   AS "currency",
    me."issuedAt",
    'Outcome'                           AS "entryType",
    'Exchange from ' || me."fromCurrency" AS "description",
    -ABS(me."fromAmount")               AS "total",
    CASE WHEN me."fromTaxes" > 0 THEN -ABS(me."fromTaxes") ELSE 0 END AS "taxes"
FROM "dev-factory-hub"."money_exchanges" me
WHERE me."status" = 'Issued'
  AND me."issuedAt" IS NOT NULL
  AND me."fromAmount" > 0

UNION ALL

-- 4b. Money Exchanges — to side (Issued, toAmount > 0)
SELECT
    me."toCurrency"                     AS "currency",
    me."issuedAt",
    'Income'                            AS "entryType",
    'Exchange to ' || me."toCurrency"   AS "description",
    me."toAmount"                       AS "total",
    CASE WHEN me."toTaxes" > 0 THEN -ABS(me."toTaxes") ELSE 0 END AS "taxes"
FROM "dev-factory-hub"."money_exchanges" me
WHERE me."status" = 'Issued'
  AND me."issuedAt" IS NOT NULL
  AND me."toAmount" > 0

UNION ALL

-- 5a. Payroll Payments — net salary (Paid/PensionPaid)
SELECT
    pp."currency",
    pp."paidAt"                         AS "issuedAt",
    'Outcome'                           AS "entryType",
    'Payroll payment for ' || COALESCE(c."name", 'Unknown') AS "description",
    -ABS(pp."netSalary")                AS "total",
    CASE WHEN pp."taxes" > 0 THEN -ABS(pp."taxes") ELSE 0 END AS "taxes"
FROM "dev-factory-hub"."payroll_payments" pp
LEFT JOIN "dev-factory-hub"."collaborators" c ON pp."collaboratorId" = c."collaboratorId"
WHERE pp."status" IN ('Paid', 'PensionPaid')
  AND pp."paidAt" IS NOT NULL
  AND pp."netSalary" > 0

UNION ALL

-- 5b. Payroll Payments — commission (Paid/PensionPaid, comission > 0)
SELECT
    pp."currency",
    pp."paidAt"                         AS "issuedAt",
    'Outcome'                           AS "entryType",
    'Commission''s payroll payment for ' || COALESCE(c."name", 'Unknown') AS "description",
    -ABS(pp."comission")                AS "total",
    0::numeric                          AS "taxes"
FROM "dev-factory-hub"."payroll_payments" pp
LEFT JOIN "dev-factory-hub"."collaborators" c ON pp."collaboratorId" = c."collaboratorId"
WHERE pp."status" IN ('Paid', 'PensionPaid')
  AND pp."paidAt" IS NOT NULL
  AND pp."comission" > 0

UNION ALL

-- 5c. Payroll Payments — pension (PensionPaid, pensionAmount > 0)
SELECT
    pp."currency",
    pp."pensionPaidAt"                  AS "issuedAt",
    'Outcome'                           AS "entryType",
    'Payroll pension payment for ' || COALESCE(c."name", 'Unknown') AS "description",
    -ABS(pp."pensionAmount")            AS "total",
    0::numeric                          AS "taxes"
FROM "dev-factory-hub"."payroll_payments" pp
LEFT JOIN "dev-factory-hub"."collaborators" c ON pp."collaboratorId" = c."collaboratorId"
WHERE pp."status" = 'PensionPaid'
  AND pp."pensionPaidAt" IS NOT NULL
  AND pp."pensionAmount" > 0

UNION ALL

-- 6. Tax Payments (Paid, total > 0)
SELECT
    tp."currency",
    (tp."paidAt" AT TIME ZONE 'UTC')::date AS "issuedAt",
    'Outcome'                           AS "entryType",
    'Tax payments ' || tp."year" || '-' || LPAD(tp."month"::text, 2, '0') AS "description",
    -ABS(tp."total")                    AS "total",
    CASE WHEN tp."taxes" > 0 THEN -ABS(tp."taxes") ELSE 0 END AS "taxes"
FROM "dev-factory-hub"."tax_payments" tp
WHERE tp."status" = 'Paid'
  AND tp."paidAt" IS NOT NULL
  AND tp."total" > 0;
