CREATE TABLE "dev-factory-hub"."proforma_items" (
	"proformaItemId" uuid PRIMARY KEY NOT NULL,
	"proformaId" uuid NOT NULL,
	"description" varchar(500) NOT NULL,
	"amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dev-factory-hub"."proformas" (
	"proformaId" uuid PRIMARY KEY NOT NULL,
	"projectId" uuid NOT NULL,
	"currency" varchar(3) NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"expenses" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) NOT NULL,
	"taxes" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"number" varchar(20) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"issuedAt" timestamp with time zone,
	"cancelledAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	CONSTRAINT "proformas_number_unique" UNIQUE("number")
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."proforma_items" ADD CONSTRAINT "proforma_items_proformaId_proformas_proformaId_fk" FOREIGN KEY ("proformaId") REFERENCES "dev-factory-hub"."proformas"("proformaId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."proformas" ADD CONSTRAINT "proformas_projectId_projects_projectId_fk" FOREIGN KEY ("projectId") REFERENCES "dev-factory-hub"."projects"("projectId") ON DELETE no action ON UPDATE no action;