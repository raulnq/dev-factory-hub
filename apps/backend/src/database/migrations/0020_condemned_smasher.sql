CREATE TABLE "dev-factory-hub"."collaborator_charges" (
	"collaboratorChargeId" uuid PRIMARY KEY NOT NULL,
	"collaboratorId" uuid NOT NULL,
	"description" varchar(2000) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"issuedAt" date,
	"canceledAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."collaborator_charges" ADD CONSTRAINT "collaborator_charges_collaboratorId_collaborators_collaboratorId_fk" FOREIGN KEY ("collaboratorId") REFERENCES "dev-factory-hub"."collaborators"("collaboratorId") ON DELETE no action ON UPDATE no action;