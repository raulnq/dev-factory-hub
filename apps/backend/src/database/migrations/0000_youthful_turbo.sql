CREATE SCHEMA IF NOT EXISTS "todos_schema";
CREATE TABLE "todos_schema"."todos" (
	"todoId" uuid PRIMARY KEY NOT NULL,
	"name" varchar(1024) NOT NULL,
	"completed" boolean NOT NULL
);
