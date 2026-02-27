CREATE TABLE "dev-factory-hub"."collaborators" (
	"collaboratorId" uuid PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"email" varchar(100),
	"withholdingPercentage" numeric(5, 2) NOT NULL
);
