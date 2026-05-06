/**
 * Database initialization — run at server startup.
 * Creates all tables (idempotent) and seeds the demo user + reference data if empty.
 * Safe to call on every startup.
 */
import { sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "../shared/schema";
import { nanoid } from "nanoid";

function now() { return new Date().toISOString(); }

export async function initDb() {
  // Import the raw sqlite connection to run CREATE TABLE IF NOT EXISTS
  // We use drizzle's underlying db.$client (better-sqlite3 Database instance)
  const sqlite = (db as any).$client as import("better-sqlite3").Database;

  // ── Create tables ─────────────────────────────────────────────────────────
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'analyst',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      default_currency_label TEXT,
      firm_or_team_label TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workspace_memberships (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      subject_company_label TEXT,
      assignment_type TEXT,
      industry TEXT,
      valuation_date TEXT,
      report_date TEXT,
      standard_of_value TEXT,
      premise_of_value TEXT,
      subject_interest TEXT,
      level_of_value TEXT,
      intended_use TEXT,
      intended_users TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS methodology_playbooks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      approach TEXT NOT NULL,
      context TEXT,
      decision_logic TEXT,
      steps TEXT,
      caveats TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      version INTEGER NOT NULL DEFAULT 1,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS assumptions (
      id TEXT PRIMARY KEY,
      playbook_id TEXT NOT NULL,
      label TEXT NOT NULL,
      rationale TEXT,
      data_source TEXT,
      sensitivity_flag INTEGER NOT NULL DEFAULT 0,
      evidence_strength TEXT NOT NULL DEFAULT 'moderate',
      tool_used TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS external_models (
      id TEXT PRIMARY KEY,
      playbook_id TEXT NOT NULL,
      model_name TEXT NOT NULL,
      source TEXT,
      output_used TEXT,
      limitations TEXT,
      tool_used TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS decision_frameworks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      situation TEXT,
      criteria TEXT,
      outcome TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS valuation_principles (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      principle TEXT,
      rationale TEXT,
      exceptions TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS valuation_antipatterns (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      why_wrong TEXT,
      correct_approach TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reasoning_templates (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      context TEXT,
      template_text TEXT,
      variables TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reference_cases (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      case_id TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      industry TEXT,
      approach_used TEXT,
      key_decisions TEXT,
      outcome TEXT,
      lessons_learned TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reference_case_artifacts (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      artifact_type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      file_url TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS qa_items (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT,
      context TEXT,
      source_ids TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT,
      type TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // ── Seed demo user if not present ─────────────────────────────────────────
  const existingUser = sqlite.prepare("SELECT id FROM users WHERE id = 'user_demo'").get();
  if (!existingUser) {
    const ts = now();
    sqlite.prepare(
      `INSERT INTO users (id, email, name, role, created_at, updated_at)
       VALUES ('user_demo', 'demo@valuation-memory-bank.local', 'Demo Analyst', 'analyst', ?, ?)`
    ).run(ts, ts);
    console.log("[init-db] Seeded demo user");
  }

  // ── Seed default workspace if not present ─────────────────────────────────
  const existingWs = sqlite.prepare("SELECT id FROM workspaces LIMIT 1").get() as { id: string } | undefined;
  let workspaceId = existingWs?.id;
  if (!workspaceId) {
    workspaceId = "ws_default";
    const ts = now();
    sqlite.prepare(
      `INSERT INTO workspaces (id, name, description, created_at, updated_at)
       VALUES (?, 'My Firm', 'Default workspace', ?, ?)`
    ).run(workspaceId, ts, ts);
    sqlite.prepare(
      `INSERT INTO workspace_memberships (id, workspace_id, user_id, role, created_at)
       VALUES (?, ?, 'user_demo', 'owner', ?)`
    ).run(nanoid(), workspaceId, ts);
    console.log("[init-db] Seeded default workspace");
  }

  console.log("[init-db] Database ready");
}
