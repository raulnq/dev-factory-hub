CREATE TABLE "dev-factory-hub"."tax_payment_items" (
	"taxPaymentItemId" uuid PRIMARY KEY NOT NULL,
	"taxPaymentId" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dev-factory-hub"."tax_payments" (
	"taxPaymentId" uuid PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"taxes" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"number" varchar(20) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"paidAt" timestamp with time zone,
	"cancelledAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."tax_payment_items" ADD CONSTRAINT "tax_payment_items_taxPaymentId_tax_payments_taxPaymentId_fk" FOREIGN KEY ("taxPaymentId") REFERENCES "dev-factory-hub"."tax_payments"("taxPaymentId") ON DELETE cascade ON UPDATE no action;