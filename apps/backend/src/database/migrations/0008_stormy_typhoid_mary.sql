CREATE TABLE "dev-factory-hub"."transactions" (
	"transactionId" uuid PRIMARY KEY NOT NULL,
	"description" varchar(1000) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"type" varchar(20) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"taxes" numeric(10, 2) NOT NULL,
	"status" varchar(25) DEFAULT 'Pending' NOT NULL,
	"issuedAt" date,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"canceledAt" timestamp with time zone,
	"filePath" varchar(500),
	"number" varchar(20),
	"contentType" varchar(100)
);
