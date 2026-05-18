import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import * as schema from "../shared/schema";

// ── Database setup ────────────────────────────────────────────────────────────
// Production (Render free tier): use Turso embedded replica.
//   - On startup, a local SQLite file at /tmp/local.db is synced from Turso.
//   - better-sqlite3 opens the replica file for SYNCHRONOUS reads/writes (no
//     code changes needed in storage.ts).
//   - After each write, the tursoSync() helper pushes changes back to Turso.
//   - On next startup/restart, sync() pulls latest state back down.
//
// Development: use a local better-sqlite3 file directly (no Turso needed).

let _tursoClient: any = null;

// Call this after every mutating storage operation to push writes to Turso.
export async function tursoSync() {
  if (_tursoClient) {
    try { await _tursoClient.sync(); } catch { /* non-fatal */ }
  }
}

function getLocalDbPath(): string {
  if (process.env.TURSO_DATABASE_URL) {
    // Use /tmp for the replica — it's always writable on Render
    return "/tmp/turso-replica.db";
  }
  const dbDir = "/var/data";
  try {
    if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });
    return `${dbDir}/local.db`;
  } catch {
    return process.env.DATABASE_PATH ?? "local.db";
  }
}

const dbPath = getLocalDbPath();

// If Turso is configured, set up the embedded replica client.
// The actual DB open happens after syncFromTurso() is called at startup.
if (process.env.TURSO_DATABASE_URL) {
  const { createClient } = require("@libsql/client") as typeof import("@libsql/client");
  _tursoClient = createClient({
    url: `file:${dbPath}`,
    syncUrl: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

// syncFromTurso pulls the latest DB from Turso before we open it with better-sqlite3.
// Must be called before initDb() in server startup.
export async function syncFromTurso() {
  if (_tursoClient) {
    console.log("[db] Syncing from Turso...");
    try {
      await _tursoClient.sync();
      console.log("[db] Turso sync complete");
    } catch (e: any) {
      console.warn("[db] Turso sync warning:", e.message);
      // Non-fatal: if sync fails (first run, no DB yet), better-sqlite3 will
      // create a fresh file and init-db will build it from scratch.
    }
  }
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite, { schema });
