CREATE TABLE "participants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"wants_to_build" text NOT NULL,
	"profile" text NOT NULL,
	"website" text,
	"linkedin_handle" text,
	"github_handle" text,
	"x_handle" text,
	"organization" text,
	"has_built" text,
	"hashed_password" text NOT NULL,
	CONSTRAINT "participants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"secret_hash" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_participants_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;