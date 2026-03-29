DROP VIEW IF EXISTS "dev-factory-hub"."collaborator_balance_entries";--> statement-breakpoint
CREATE VIEW "dev-factory-hub"."collaborator_balance_entries" AS

-- 1. Timesheets (Completed)
SELECT
    t."collaboratorId",
    c."name"                                    AS "collaboratorName",
    COALESCE(t."currency", cr."currency")       AS "currency",
    t."completedAt"                             AS "issuedAt",
    'Income'                                    AS "entryType",
    'Timesheet'                                 AS "source",
    COALESCE(SUM(w."hours"), 0) * COALESCE(t."costRate", 0) AS "amount",
    'Timesheet for ' || COALESCE(c."name", 'Unknown') || ' with the ' || COALESCE(cr."name", 'Unknown') || ' from ' || t."startDate" || ' to ' || t."endDate" AS "description"
FROM "dev-factory-hub"."timesheets" t
LEFT JOIN "dev-factory-hub"."collaborators" c       ON t."collaboratorId" = c."collaboratorId"
LEFT JOIN "dev-factory-hub"."collaborator_roles" cr ON t."collaboratorRoleId" = cr."collaboratorRoleId"
LEFT JOIN "dev-factory-hub"."worklogs" w            ON t."timesheetId" = w."timesheetId"
WHERE t."status" = 'Completed'
  AND t."completedAt" IS NOT NULL
GROUP BY t."timesheetId", c."name", cr."name", cr."currency",
         t."currency", t."costRate", t."completedAt",
         t."collaboratorId", t."startDate", t."endDate"
HAVING COALESCE(SUM(w."hours"), 0) * COALESCE(t."costRate", 0) > 0

UNION ALL

-- 2. Collaborator Payments (Paid/Confirmed)
SELECT
    cp."collaboratorId",
    c."name"                    AS "collaboratorName",
    cp."currency",
    cp."paidAt"                 AS "issuedAt",
    'Outcome'                   AS "entryType",
    'CollaboratorPayment'       AS "source",
    -ABS(cp."grossSalary")      AS "amount",
    'Collaborator payment to ' || COALESCE(c."name", 'Unknown') AS "description"
FROM "dev-factory-hub"."collaborator_payments" cp
LEFT JOIN "dev-factory-hub"."collaborators" c ON cp."collaboratorId" = c."collaboratorId"
WHERE cp."status" IN ('Paid', 'Confirmed')
  AND cp."paidAt" IS NOT NULL
  AND cp."netSalary" > 0

UNION ALL

-- 3. Payroll Payments — net salary (Paid/PensionPaid)
SELECT
    pp."collaboratorId",
    c."name"                    AS "collaboratorName",
    pp."currency",
    pp."paidAt"                 AS "issuedAt",
    'Outcome'                   AS "entryType",
    'PayrollPayment'            AS "source",
    -ABS(pp."netSalary")        AS "amount",
    'Payroll payment for ' || COALESCE(c."name", 'Unknown') AS "description"
FROM "dev-factory-hub"."payroll_payments" pp
LEFT JOIN "dev-factory-hub"."collaborators" c ON pp."collaboratorId" = c."collaboratorId"
WHERE pp."status" IN ('Paid', 'PensionPaid')
  AND pp."paidAt" IS NOT NULL
  AND pp."netSalary" > 0

UNION ALL

-- 4. Payroll Payments — pension (PensionPaid)
SELECT
    pp."collaboratorId",
    c."name"                    AS "collaboratorName",
    pp."currency",
    pp."pensionPaidAt"          AS "issuedAt",
    'Outcome'                   AS "entryType",
    'PayrollPension'            AS "source",
    -ABS(pp."pensionAmount")    AS "amount",
    'Payroll pension payment for ' || COALESCE(c."name", 'Unknown') AS "description"
FROM "dev-factory-hub"."payroll_payments" pp
LEFT JOIN "dev-factory-hub"."collaborators" c ON pp."collaboratorId" = c."collaboratorId"
WHERE pp."status" = 'PensionPaid'
  AND pp."pensionPaidAt" IS NOT NULL
  AND pp."pensionAmount" > 0

UNION ALL

-- 5. Collaborator Charges (Issued)
SELECT
    cc."collaboratorId",
    c."name"                    AS "collaboratorName",
    cc."currency",
    cc."issuedAt",
    CASE WHEN cc."amount" < 0 THEN 'Outcome' ELSE 'Income' END AS "entryType",
    'CollaboratorCharge'        AS "source",
    cc."amount",
    cc."description"
FROM "dev-factory-hub"."collaborator_charges" cc
LEFT JOIN "dev-factory-hub"."collaborators" c ON cc."collaboratorId" = c."collaboratorId"
WHERE cc."status" = 'Issued'
  AND cc."issuedAt" IS NOT NULL;
