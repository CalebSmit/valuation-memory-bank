/**
 * Database initialization — run at server startup.
 * Creates all tables (idempotent) and seeds the demo user + reference data if empty.
 * Safe to call on every startup.
 */
import { sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "../shared/schema";
import { nanoid } from "nanoid";
import { REPORT_SECTION_TEMPLATES } from "../shared/report-section-template-data";

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
    CREATE TABLE IF NOT EXISTS report_section_templates (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      parent_slug TEXT,
      level INTEGER NOT NULL,
      title TEXT NOT NULL,
      default_order INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      guidance TEXT,
      is_seed INTEGER DEFAULT 1,
      is_readonly INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_report_section_templates_parent
      ON report_section_templates(parent_slug);
    CREATE TABLE IF NOT EXISTS project_report_sections (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      template_slug TEXT NOT NULL,
      body TEXT,
      status TEXT NOT NULL DEFAULT 'not_started',
      linked_source_ids TEXT,
      linked_assumption_ids TEXT,
      linked_external_model_ids TEXT,
      linked_support_memo_ids TEXT,
      linked_file_ids TEXT,
      external_links TEXT,
      review_status TEXT DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE(project_id, template_slug)
    );
    CREATE INDEX IF NOT EXISTS idx_project_report_sections_project
      ON project_report_sections(project_id);
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

  // ── Seed report section templates (idempotent upsert) ────────────────────
  // Insert any missing templates. Existing rows with the same slug are left
  // alone to preserve manual edits, but level/title/default_order are kept in
  // sync with the canonical list so renames/reorders propagate.
  const insertTplStmt = sqlite.prepare(
    `INSERT OR IGNORE INTO report_section_templates
     (id, slug, parent_slug, level, title, default_order, description, guidance, is_seed, is_readonly, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)`
  );
  const updateTplStmt = sqlite.prepare(
    `UPDATE report_section_templates
     SET parent_slug = ?, level = ?, title = ?, default_order = ?, description = ?, guidance = ?, updated_at = ?
     WHERE slug = ?`
  );
  let seededCount = 0;
  const tplTs = now();
  for (const tpl of REPORT_SECTION_TEMPLATES) {
    const result = insertTplStmt.run(
      nanoid(), tpl.slug, tpl.parentSlug, tpl.level, tpl.title, tpl.defaultOrder,
      tpl.description ?? null, tpl.guidance ?? null, tplTs, tplTs,
    );
    if (result.changes > 0) {
      seededCount++;
    } else {
      updateTplStmt.run(
        tpl.parentSlug, tpl.level, tpl.title, tpl.defaultOrder,
        tpl.description ?? null, tpl.guidance ?? null, tplTs, tpl.slug,
      );
    }
  }
  if (seededCount > 0) {
    console.log(`[init-db] Seeded ${seededCount} report section templates`);
  }

  console.log("[init-db] Database ready");
}
