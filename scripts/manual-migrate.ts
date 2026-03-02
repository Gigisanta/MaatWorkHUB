import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const sql = neon(connectionString);

const statements = [
  `CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text,
	"event_type" text NOT NULL,
	"source" text NOT NULL,
	"value" numeric(15, 2),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text,
	"user_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "lead_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"type" text DEFAULT 'note' NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"status" text DEFAULT 'new' NOT NULL,
	"value" numeric(10, 2),
	"notes" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"external_sync_id" text,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
  );`,
  `ALTER TABLE "apps" ADD COLUMN IF NOT EXISTS "github_repo" text;`,
  `ALTER TABLE "apps" ADD COLUMN IF NOT EXISTS "vercel_project_id" text;`,
  `ALTER TABLE "apps" ADD COLUMN IF NOT EXISTS "vercel_url" text;`,
  `ALTER TABLE "apps" ADD COLUMN IF NOT EXISTS "neon_url" text;`,
  `ALTER TABLE "apps" ADD COLUMN IF NOT EXISTS "is_internal" boolean DEFAULT false;`,
  `DO $$ BEGIN
    ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE no action ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,
  `DO $$ BEGIN
    ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE no action ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,
  `DO $$ BEGIN
    ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`,
  `DO $$ BEGIN
    ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE no action ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;`
];

async function apply() {
  for (const statement of statements) {
    try {
      console.log('Executing:', statement.substring(0, 50) + '...');
      await sql(statement);
    } catch (e) {
      console.error('Failed statement:', statement);
      console.error(e);
    }
  }
}

apply().then(() => console.log('Done'));
