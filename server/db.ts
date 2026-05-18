import * as schema from "../shared/schema";

// ── Database setup ────────────────────────────────────────────────────────────
// Production (Render): use Turso hosted libSQL so data persists across container
// restarts (Render free tier has no persistent disk — sqlite file is wiped on
// every restart / deploy).
// Development: fall back to local better-sqlite3 file.

function buildDb() {
  if (process.env.TURSO_DATABASE_URL) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require("@libsql/client") as typeof import("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { drizzle } = require("drizzle-orm/libsql") as typeof import("drizzle-orm/libsql");
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return drizzle(client, { schema });
  }

  // Local dev — better-sqlite3
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require("better-sqlite3") as typeof import("better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { drizzle } = require("drizzle-orm/better-sqlite3") as typeof import("drizzle-orm/better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { existsSync, mkdirSync } = require("fs") as typeof import("fs");

  function getDbPath(): string {
    const dbDir = "/var/data";
    try {
      if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });
      return `${dbDir}/local.db`;
    } catch {
      return process.env.DATABASE_PATH ?? "local.db";
    }
  }

  const sqlite = new (Database as any)(getDbPath());
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, { schema });
}

export const db = buildDb();
