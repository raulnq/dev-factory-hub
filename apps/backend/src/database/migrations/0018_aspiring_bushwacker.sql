CREATE TABLE "dev-factory-hub"."exchangeRates" (
	"exchangeRateId" uuid PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"fromCurrency" varchar(3) NOT NULL,
	"toCurrency" varchar(3) NOT NULL,
	"rate" numeric(10, 4) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."collaborator_payments" ALTER COLUMN "taxes" SET DEFAULT 0;