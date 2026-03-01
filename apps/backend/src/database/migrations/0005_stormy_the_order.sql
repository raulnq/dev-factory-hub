CREATE TABLE "dev-factory-hub"."collaborator_payments" (
	"collaboratorPaymentId" uuid PRIMARY KEY NOT NULL,
	"collaboratorId" uuid NOT NULL,
	"currency" varchar(3) NOT NULL,
	"grossSalary" numeric(10, 2) NOT NULL,
	"withholding" numeric(10, 2) NOT NULL,
	"netSalary" numeric(10, 2) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"paidAt" date,
	"confirmedAt" date,
	"canceledAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"number" varchar(20)
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."collaborator_payments" ADD CONSTRAINT "collaborator_payments_collaboratorId_collaborators_collaboratorId_fk" FOREIGN KEY ("collaboratorId") REFERENCES "dev-factory-hub"."collaborators"("collaboratorId") ON DELETE no action ON UPDATE no action;