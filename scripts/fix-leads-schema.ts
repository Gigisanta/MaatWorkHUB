import { db } from "../packages/database/src/index";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Adding columns to leads table...");
  try {
    await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS external_sync_id text;`);
    await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_synced_at timestamp;`);
    
    // Audit Vault Core Table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id text PRIMARY KEY,
        app_id text REFERENCES apps(id),
        user_id text REFERENCES users(id),
        action text NOT NULL,
        entity_type text NOT NULL,
        entity_id text,
        metadata jsonb,
        ip_address text,
        user_agent text,
        created_at timestamp NOT NULL DEFAULT now()
      );
    `);
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS audit_logs_app_idx ON audit_logs (app_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at DESC);`);

    // MaatAnalytics Core Table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id text PRIMARY KEY,
        app_id text REFERENCES apps(id),
        event_type text NOT NULL,
        source text NOT NULL,
        value decimal(15, 2),
        metadata jsonb,
        created_at timestamp NOT NULL DEFAULT now()
      );
    `);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS analytics_event_type_idx ON analytics_events (event_type);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS analytics_created_at_idx ON analytics_events (created_at DESC);`);
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error adding columns:", error);
    process.exit(1);
  }
}

run();
