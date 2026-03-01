CREATE TABLE "dev-factory-hub"."invoices" (
	"invoiceId" uuid PRIMARY KEY NOT NULL,
	"clientId" uuid NOT NULL,
	"currency" varchar(3) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"taxes" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"issuedAt" date,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"canceledAt" timestamp with time zone,
	"number" varchar(20),
	"exchangeRate" numeric(10, 4)
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."invoices" ADD CONSTRAINT "invoices_clientId_clients_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "dev-factory-hub"."clients"("clientId") ON DELETE no action ON UPDATE no action;