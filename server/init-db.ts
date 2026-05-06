/**
 * Database initialization — run at server startup via registerRoutes().
 * Creates all tables (idempotent via CREATE TABLE IF NOT EXISTS) and
 * runs lightweight ALTER TABLE migrations for columns added after initial release.
 * Seeds the demo user, default workspace, and report-section templates.
 * Safe to call on every startup and in test beforeAll.
 */
import { db } from "./db";
import { nanoid } from "nanoid";
import { REPORT_SECTION_TEMPLATES } from "../shared/report-section-template-data";

function now() { return new Date().toISOString(); }

export async function initDb() {
  const sqlite = (db as any).$client as import("better-sqlite3").Database;

  // ── Create all tables ─────────────────────────────────────────────────────
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
      updated_at TEXT NOT NULL,
      created_by TEXT,
      updated_by TEXT
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
      scope TEXT NOT NULL DEFAULT 'workspace',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assumptions (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      playbook_id TEXT,
      project_id TEXT,
      title TEXT NOT NULL,
      body TEXT,
      assumption_type TEXT NOT NULL DEFAULT 'methodology',
      review_status TEXT NOT NULL DEFAULT 'draft',
      evidence_strength TEXT NOT NULL DEFAULT 'moderate',
      tool_used TEXT NOT NULL DEFAULT '',
      sensitivity_flag INTEGER NOT NULL DEFAULT 0,
      data_source TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      source_type TEXT NOT NULL DEFAULT 'management_report',
      url TEXT,
      description TEXT,
      reliability_score INTEGER,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS evidence_links (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      source_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      note TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS external_model_references (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      model_type TEXT NOT NULL DEFAULT 'dcf',
      storage_location TEXT,
      notes TEXT,
      tool_used TEXT NOT NULL DEFAULT '',
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS support_memos (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      memo_type TEXT NOT NULL DEFAULT 'methodology_support',
      body TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      scope TEXT NOT NULL DEFAULT 'workspace',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS qa_items (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      case_id TEXT,
      question TEXT NOT NULL,
      answer TEXT,
      context TEXT,
      category TEXT NOT NULL DEFAULT 'methodology',
      source_ids TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      body TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lessons_learned (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      body TEXT,
      category TEXT NOT NULL DEFAULT 'methodology',
      created_by TEXT,
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
      scope TEXT NOT NULL DEFAULT 'workspace',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
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
      scope TEXT NOT NULL DEFAULT 'workspace',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
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
      scope TEXT NOT NULL DEFAULT 'workspace',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
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
      scope TEXT NOT NULL DEFAULT 'workspace',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
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
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      created_by TEXT,
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

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tag_links (
      id TEXT PRIMARY KEY,
      tag_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_tasks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      task_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      input TEXT,
      output TEXT,
      error TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      filename TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      storage_url TEXT,
      created_by TEXT,
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
      is_seed INTEGER NOT NULL DEFAULT 1,
      is_readonly INTEGER NOT NULL DEFAULT 1,
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
      linked_source_ids TEXT NOT NULL DEFAULT '[]',
      linked_assumption_ids TEXT NOT NULL DEFAULT '[]',
      linked_external_model_ids TEXT NOT NULL DEFAULT '[]',
      linked_support_memo_ids TEXT NOT NULL DEFAULT '[]',
      external_links TEXT NOT NULL DEFAULT '[]',
      created_by TEXT,
      updated_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_project_report_sections_project
      ON project_report_sections(project_id);
  `);

  // ── Migrations: add columns that may be missing from older DBs ───────────
  // SQLite doesn't support IF NOT EXISTS on ALTER TABLE, so we catch errors.
  const migrations: [string, string][] = [
    ["projects", "created_by TEXT"],
    ["projects", "updated_by TEXT"],
    ["methodology_playbooks", "created_by TEXT"],
    ["methodology_playbooks", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["methodology_playbooks", "is_seed INTEGER NOT NULL DEFAULT 0"],
    ["methodology_playbooks", "is_readonly INTEGER NOT NULL DEFAULT 0"],
    ["assumptions", "created_by TEXT"],
    ["assumptions", "project_id TEXT"],
    ["sources", "created_by TEXT"],
    ["sources", "project_id TEXT"],
    ["evidence_links", "created_by TEXT"],
    ["external_model_references", "created_by TEXT"],
    ["external_model_references", "project_id TEXT"],
    ["support_memos", "created_by TEXT"],
    ["support_memos", "project_id TEXT"],
    ["support_memos", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["support_memos", "is_seed INTEGER NOT NULL DEFAULT 0"],
    ["support_memos", "is_readonly INTEGER NOT NULL DEFAULT 0"],
    ["qa_items", "created_by TEXT"],
    ["qa_items", "project_id TEXT"],
    ["qa_items", "case_id TEXT"],
    ["notes", "created_by TEXT"],
    ["notes", "project_id TEXT"],
    ["lessons_learned", "created_by TEXT"],
    ["lessons_learned", "project_id TEXT"],
    ["decision_frameworks", "created_by TEXT"],
    ["decision_frameworks", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["decision_frameworks", "is_seed INTEGER NOT NULL DEFAULT 0"],
    ["decision_frameworks", "is_readonly INTEGER NOT NULL DEFAULT 0"],
    ["valuation_principles", "created_by TEXT"],
    ["valuation_principles", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["valuation_principles", "is_seed INTEGER NOT NULL DEFAULT 0"],
    ["valuation_principles", "is_readonly INTEGER NOT NULL DEFAULT 0"],
    ["valuation_antipatterns", "created_by TEXT"],
    ["valuation_antipatterns", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["valuation_antipatterns", "is_seed INTEGER NOT NULL DEFAULT 0"],
    ["valuation_antipatterns", "is_readonly INTEGER NOT NULL DEFAULT 0"],
    ["reasoning_templates", "created_by TEXT"],
    ["reasoning_templates", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["reasoning_templates", "is_seed INTEGER NOT NULL DEFAULT 0"],
    ["reasoning_templates", "is_readonly INTEGER NOT NULL DEFAULT 0"],
    ["reference_cases", "created_by TEXT"],
    ["reference_cases", "is_seed INTEGER NOT NULL DEFAULT 0"],
    ["reference_cases", "is_readonly INTEGER NOT NULL DEFAULT 0"],
    ["project_report_sections", "created_by TEXT"],
    ["project_report_sections", "updated_by TEXT"],
  ];

  for (const [table, colDef] of migrations) {
    try {
      sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${colDef}`);
    } catch {
      // Column already exists — safe to ignore
    }
  }

  // ── Seed demo user ─────────────────────────────────────────────────────────
  const existingUser = sqlite.prepare("SELECT id FROM users WHERE id = 'user_demo'").get();
  if (!existingUser) {
    const ts = now();
    sqlite.prepare(
      `INSERT INTO users (id, email, name, role, created_at, updated_at)
       VALUES ('user_demo', 'demo@valuation-memory-bank.local', 'Demo Analyst', 'analyst', ?, ?)`
    ).run(ts, ts);
    console.log("[init-db] Seeded demo user");
  }

  // ── Seed default workspace ─────────────────────────────────────────────────
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
      nanoid(), tpl.slug, tpl.parentSlug ?? null, tpl.level, tpl.title, tpl.defaultOrder,
      tpl.description ?? null, tpl.guidance ?? null, tplTs, tplTs,
    );
    if (result.changes > 0) {
      seededCount++;
    } else {
      updateTplStmt.run(
        tpl.parentSlug ?? null, tpl.level, tpl.title, tpl.defaultOrder,
        tpl.description ?? null, tpl.guidance ?? null, tplTs, tpl.slug,
      );
    }
  }
  if (seededCount > 0) {
    console.log(`[init-db] Seeded ${seededCount} report section templates`);
  }

  console.log("[init-db] Database ready");
}
