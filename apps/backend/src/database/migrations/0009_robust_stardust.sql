CREATE TABLE "dev-factory-hub"."money_exchanges" (
	"moneyExchangeId" uuid PRIMARY KEY NOT NULL,
	"fromCurrency" varchar(3) NOT NULL,
	"toCurrency" varchar(3) NOT NULL,
	"rate" numeric(14, 4) NOT NULL,
	"fromAmount" numeric(14, 2) NOT NULL,
	"toAmount" numeric(14, 2) NOT NULL,
	"toTaxes" numeric(14, 2) NOT NULL,
	"fromTaxes" numeric(14, 2) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"issuedAt" date,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"canceledAt" timestamp with time zone,
	"filePath" varchar(500),
	"contentType" varchar(100)
);
