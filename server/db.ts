import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import * as schema from "../shared/schema";

// On Render free tier: use persistent disk at /var/data so the DB survives
// container restarts. Locally (where /var/data is not writable), fall back
// to local.db in the working directory.
function getDbPath(): string {
  const dbDir = "/var/data";
  try {
    if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });
    return `${dbDir}/local.db`;
  } catch {
    // /var/data is not writable — local dev, use working directory
    return process.env.DATABASE_PATH ?? "local.db";
  }
}

const dbPath = getDbPath();
const sqlite = new Database(dbPath);
// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
