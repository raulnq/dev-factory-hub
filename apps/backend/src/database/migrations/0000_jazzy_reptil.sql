CREATE SCHEMA IF NOT EXISTS "dev-factory-hub";
CREATE TABLE "dev-factory-hub"."clients" (
	"clientId" uuid PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"documentNumber" varchar(20),
	"phone" varchar(20),
	"address" varchar(1000),
	"email" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "dev-factory-hub"."contacts" (
	"contactId" uuid PRIMARY KEY NOT NULL,
	"clientId" uuid NOT NULL,
	"name" varchar(500) NOT NULL,
	"email" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "dev-factory-hub"."projects" (
	"projectId" uuid PRIMARY KEY NOT NULL,
	"clientId" uuid NOT NULL,
	"name" varchar(500) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."contacts" ADD CONSTRAINT "contacts_clientId_clients_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "dev-factory-hub"."clients"("clientId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."projects" ADD CONSTRAINT "projects_clientId_clients_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "dev-factory-hub"."clients"("clientId") ON DELETE no action ON UPDATE no action;