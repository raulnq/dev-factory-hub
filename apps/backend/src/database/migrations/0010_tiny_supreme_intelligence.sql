CREATE TABLE "dev-factory-hub"."payroll_payments" (
	"payrollPaymentId" uuid PRIMARY KEY NOT NULL,
	"collaboratorId" uuid NOT NULL,
	"currency" varchar(3) NOT NULL,
	"netSalary" numeric(10, 2) NOT NULL,
	"pensionAmount" numeric(10, 2) NOT NULL,
	"grossSalary" numeric(10, 2) NOT NULL,
	"comission" numeric(10, 2) NOT NULL,
	"taxes" numeric(10, 2) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"paidAt" date,
	"pensionPaidAt" date,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"canceledAt" timestamp with time zone,
	"filePath" varchar(500),
	"contentType" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."payroll_payments" ADD CONSTRAINT "payroll_payments_collaboratorId_collaborators_collaboratorId_fk" FOREIGN KEY ("collaboratorId") REFERENCES "dev-factory-hub"."collaborators"("collaboratorId") ON DELETE no action ON UPDATE no action;