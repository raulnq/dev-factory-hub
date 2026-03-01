CREATE TABLE "dev-factory-hub"."collections" (
	"collectionId" uuid PRIMARY KEY NOT NULL,
	"clientId" uuid NOT NULL,
	"currency" varchar(3) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"commission" numeric(10, 2) NOT NULL,
	"taxes" numeric(10, 2) NOT NULL,
	"status" varchar(25) NOT NULL,
	"confirmedAt" date,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"canceledAt" timestamp with time zone,
	"filePath" varchar(500),
	"contentType" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."collections" ADD CONSTRAINT "collections_clientId_clients_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "dev-factory-hub"."clients"("clientId") ON DELETE no action ON UPDATE no action;