import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load env from root using a path relative to the current file to avoid process.cwd() issues
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes("dummy")) {
  throw new Error(
    "❌ DATABASE_URL is missing or invalid. Please check your root .env file.",
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export * from "./schema";
