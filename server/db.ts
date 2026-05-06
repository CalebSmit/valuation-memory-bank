import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { existsSync } from "node:fs";
import { join } from "node:path";
import * as schema from "../shared/schema";

// On Render: use persistent disk at /data; locally: project root
function getDbPath(): string {
  const renderDisk = "/data";
  if (existsSync(renderDisk)) {
    return join(renderDisk, "local.db");
  }
  return process.env.DATABASE_PATH ?? "local.db";
}

const dbPath = getDbPath();
const sqlite = new Database(dbPath);
// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
