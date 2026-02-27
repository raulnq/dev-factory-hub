CREATE TABLE "dev-factory-hub"."collaborator_roles" (
	"collaboratorRoleId" uuid PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"feeRate" numeric(10, 2) NOT NULL,
	"costRate" numeric(10, 2) NOT NULL
);
