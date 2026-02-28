CREATE TABLE "dev-factory-hub"."timesheet_projects" (
	"timesheetId" uuid NOT NULL,
	"projectId" uuid NOT NULL,
	CONSTRAINT "timesheet_projects_timesheetId_projectId_pk" PRIMARY KEY("timesheetId","projectId")
);
--> statement-breakpoint
CREATE TABLE "dev-factory-hub"."timesheets" (
	"timesheetId" uuid PRIMARY KEY NOT NULL,
	"collaboratorId" uuid NOT NULL,
	"collaboratorRoleId" uuid NOT NULL,
	"status" varchar(25) NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"completedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dev-factory-hub"."worklogs" (
	"timesheetId" uuid NOT NULL,
	"projectId" uuid NOT NULL,
	"date" date NOT NULL,
	"hours" numeric(10, 4) NOT NULL,
	CONSTRAINT "worklogs_timesheetId_projectId_date_pk" PRIMARY KEY("timesheetId","projectId","date")
);
--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."timesheet_projects" ADD CONSTRAINT "timesheet_projects_timesheetId_timesheets_timesheetId_fk" FOREIGN KEY ("timesheetId") REFERENCES "dev-factory-hub"."timesheets"("timesheetId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."timesheet_projects" ADD CONSTRAINT "timesheet_projects_projectId_projects_projectId_fk" FOREIGN KEY ("projectId") REFERENCES "dev-factory-hub"."projects"("projectId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."timesheets" ADD CONSTRAINT "timesheets_collaboratorId_collaborators_collaboratorId_fk" FOREIGN KEY ("collaboratorId") REFERENCES "dev-factory-hub"."collaborators"("collaboratorId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."timesheets" ADD CONSTRAINT "timesheets_collaboratorRoleId_collaborator_roles_collaboratorRoleId_fk" FOREIGN KEY ("collaboratorRoleId") REFERENCES "dev-factory-hub"."collaborator_roles"("collaboratorRoleId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dev-factory-hub"."worklogs" ADD CONSTRAINT "worklogs_timesheetId_projectId_timesheet_projects_timesheetId_projectId_fk" FOREIGN KEY ("timesheetId","projectId") REFERENCES "dev-factory-hub"."timesheet_projects"("timesheetId","projectId") ON DELETE no action ON UPDATE no action;