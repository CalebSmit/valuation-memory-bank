/**
 * Database initialization — run at server startup via registerRoutes().
 * Creates all tables (idempotent via CREATE TABLE IF NOT EXISTS) and
 * runs lightweight ALTER TABLE migrations for columns added after initial release.
 * Seeds the demo user, default workspace, report-section templates, and knowledge content.
 * Safe to call on every startup.
 *
 * Supports both Turso (async libSQL) and local better-sqlite3 (sync).
 */
import { nanoid } from "nanoid";
import { REPORT_SECTION_TEMPLATES } from "../shared/report-section-template-data";

function now() { return new Date().toISOString(); }

// ── Unified async DB executor ─────────────────────────────────────────────────
// Wraps either the Turso client or better-sqlite3 so init logic is written once.

interface DbRunner {
  exec(sql: string): Promise<void>;
  query(sql: string, args?: any[]): Promise<{ rows: any[] }>;
  run(sql: string, args?: any[]): Promise<{ rowsAffected: number }>;
}

function buildRunner(): DbRunner {
  if (process.env.TURSO_DATABASE_URL) {
    const { createClient } = require("@libsql/client") as typeof import("@libsql/client");
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return {
      async exec(sql) {
        // Split into individual statements for Turso (it doesn't support multi-statement exec)
        const stmts = sql.split(";").map(s => s.trim()).filter(Boolean);
        for (const stmt of stmts) {
          await client.execute(stmt);
        }
      },
      async query(sql, args = []) {
        const result = await client.execute({ sql, args: args as any });
        return { rows: result.rows as any[] };
      },
      async run(sql, args = []) {
        const result = await client.execute({ sql, args: args as any });
        return { rowsAffected: result.rowsAffected };
      },
    };
  }

  // Local dev — better-sqlite3 (sync, wrapped in async)
  const Database = require("better-sqlite3") as typeof import("better-sqlite3");
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

  const sqlite = new (Database as any)(getDbPath()) as import("better-sqlite3").Database;
  sqlite.pragma("journal_mode = WAL");

  return {
    async exec(sql) { sqlite.exec(sql); },
    async query(sql, args = []) {
      const rows = sqlite.prepare(sql).all(...args) as any[];
      return { rows };
    },
    async run(sql, args = []) {
      const result = sqlite.prepare(sql).run(...args);
      return { rowsAffected: result.changes };
    },
  };
}

export async function initDb() {
  const db = buildRunner();

  // ── Create all tables ───────────────────────────────────────────────────────
  const createTables = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'analyst',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      default_currency_label TEXT,
      firm_or_team_label TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS workspace_memberships (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
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
    )`,
    `CREATE TABLE IF NOT EXISTS methodology_playbooks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      scope TEXT NOT NULL DEFAULT 'workspace',
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      purpose TEXT NOT NULL,
      when_to_use TEXT,
      when_not_to_use TEXT,
      key_concepts TEXT,
      required_evidence TEXT,
      common_sources TEXT,
      reviewer_questions TEXT,
      common_mistakes TEXT,
      report_language_examples TEXT,
      review_status TEXT DEFAULT 'draft',
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      case_id TEXT,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS decision_frameworks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      scope TEXT NOT NULL DEFAULT 'workspace',
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      purpose TEXT NOT NULL,
      decision_question TEXT,
      inputs_to_consider TEXT,
      decision_criteria TEXT,
      evidence_needed TEXT,
      possible_outcomes TEXT,
      reviewer_prompts TEXT,
      example_application TEXT,
      related_playbooks TEXT,
      review_status TEXT DEFAULT 'draft',
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      case_id TEXT,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS valuation_principles (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      scope TEXT NOT NULL DEFAULT 'workspace',
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      body TEXT,
      rationale TEXT,
      related_playbooks TEXT,
      related_antipatterns TEXT,
      review_status TEXT DEFAULT 'draft',
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      case_id TEXT,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS valuation_antipatterns (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      scope TEXT NOT NULL DEFAULT 'workspace',
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      why_it_matters TEXT,
      warning_signs TEXT,
      how_to_fix TEXT,
      related_playbooks TEXT,
      related_principles TEXT,
      related_templates TEXT,
      review_status TEXT DEFAULT 'draft',
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      case_id TEXT,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS reasoning_templates (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      scope TEXT NOT NULL DEFAULT 'workspace',
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      use_case TEXT,
      prompt_scaffold TEXT,
      required_supporting_inputs TEXT,
      optional_supporting_inputs TEXT,
      example_output TEXT,
      related_playbooks TEXT,
      related_frameworks TEXT,
      related_principles TEXT,
      ai_drafting_allowed INTEGER DEFAULT 1,
      review_status TEXT DEFAULT 'draft',
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      case_id TEXT,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS reference_cases (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      source_label TEXT,
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS reference_case_artifacts (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      artifact_type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      source_note TEXT,
      artifact_metadata TEXT,
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      review_status TEXT DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS assumptions (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      name TEXT NOT NULL,
      category TEXT,
      stated_assumption_text TEXT,
      context TEXT,
      external_model_reference TEXT,
      method_area TEXT,
      rationale TEXT,
      source_links TEXT,
      evidence_strength TEXT DEFAULT 'moderate',
      review_status TEXT DEFAULT 'draft',
      tags TEXT,
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      case_id TEXT,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      publisher_author TEXT,
      source_type TEXT,
      publication_date TEXT,
      valuation_date_relevance_note TEXT,
      url_or_file_reference TEXT,
      citation_text TEXT,
      reliability_assessment TEXT,
      notes TEXT,
      tags TEXT,
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      case_id TEXT,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS evidence_links (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_entity_type TEXT NOT NULL,
      target_entity_id TEXT NOT NULL,
      support_type TEXT,
      relevance_note TEXT,
      strength_rating TEXT,
      page_section_reference TEXT,
      quote_or_paraphrase_note TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS external_model_references (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      model_type TEXT,
      tool_used TEXT DEFAULT '',
      file_or_url_reference TEXT,
      version_label TEXT,
      prepared_by TEXT,
      prepared_date TEXT,
      notes TEXT,
      linked_assumptions TEXT,
      linked_sources TEXT,
      linked_reasoning_templates TEXT,
      linked_qa_items TEXT,
      review_status TEXT DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS support_memos (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      memo_type TEXT,
      title TEXT NOT NULL,
      body TEXT,
      linked_playbook_id TEXT,
      linked_framework_id TEXT,
      linked_template_id TEXT,
      linked_assumptions TEXT,
      linked_sources TEXT,
      linked_external_model_reference TEXT,
      review_status TEXT DEFAULT 'draft',
      tags TEXT,
      case_id TEXT,
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS qa_items (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      case_id TEXT,
      question TEXT NOT NULL,
      answer_scaffold TEXT,
      draft_answer TEXT,
      linked_assumptions TEXT,
      linked_sources TEXT,
      linked_support_memo TEXT,
      linked_playbook TEXT,
      linked_framework TEXT,
      linked_template TEXT,
      difficulty TEXT,
      audience TEXT,
      review_status TEXT DEFAULT 'draft',
      tags TEXT,
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      body TEXT,
      entity_type TEXT,
      entity_id TEXT,
      visibility TEXT DEFAULT 'private',
      tags TEXT,
      is_favorite INTEGER DEFAULT 0,
      review_status TEXT DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS lessons_learned (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      case_id TEXT,
      title TEXT NOT NULL,
      lesson TEXT,
      context TEXT,
      mistake_avoided TEXT,
      future_checklist_prompt TEXT,
      related_antipattern TEXT,
      related_principle TEXT,
      related_project TEXT,
      related_reference_case TEXT,
      tags TEXT,
      review_status TEXT DEFAULT 'draft',
      is_seed INTEGER DEFAULT 0,
      is_readonly INTEGER DEFAULT 0,
      clonable INTEGER DEFAULT 1,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      color TEXT,
      is_seed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS tag_links (
      id TEXT PRIMARY KEY,
      tag_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      workspace_id TEXT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      actor_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      entity_title TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS ai_tasks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      task_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      prompt_version TEXT,
      input_references TEXT,
      output_preview TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      title TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT,
      storage_mode TEXT,
      url_or_path TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS project_sections (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      section_type TEXT NOT NULL DEFAULT 'custom',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS report_section_templates (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_report_section_templates_parent ON report_section_templates(parent_slug)`,
    `CREATE TABLE IF NOT EXISTS project_report_sections (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_project_report_sections_project ON project_report_sections(project_id)`,
  ];

  for (const sql of createTables) {
    await db.exec(sql);
  }

  // ── Migrations: add columns that may be missing from older DBs ──────────────
  const migrations: [string, string][] = [
    ["projects", "created_by TEXT"],
    ["projects", "updated_by TEXT"],
    ["methodology_playbooks", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["methodology_playbooks", "slug TEXT NOT NULL DEFAULT ''"],
    ["methodology_playbooks", "purpose TEXT NOT NULL DEFAULT ''"],
    ["methodology_playbooks", "when_to_use TEXT"],
    ["methodology_playbooks", "when_not_to_use TEXT"],
    ["methodology_playbooks", "key_concepts TEXT"],
    ["methodology_playbooks", "required_evidence TEXT"],
    ["methodology_playbooks", "common_sources TEXT"],
    ["methodology_playbooks", "reviewer_questions TEXT"],
    ["methodology_playbooks", "common_mistakes TEXT"],
    ["methodology_playbooks", "report_language_examples TEXT"],
    ["methodology_playbooks", "review_status TEXT DEFAULT 'draft'"],
    ["methodology_playbooks", "is_seed INTEGER DEFAULT 0"],
    ["methodology_playbooks", "is_readonly INTEGER DEFAULT 0"],
    ["methodology_playbooks", "clonable INTEGER DEFAULT 1"],
    ["methodology_playbooks", "case_id TEXT"],
    ["methodology_playbooks", "cloned_from_type TEXT"],
    ["methodology_playbooks", "cloned_from_id TEXT"],
    ["methodology_playbooks", "created_by TEXT"],
    ["decision_frameworks", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["decision_frameworks", "slug TEXT NOT NULL DEFAULT ''"],
    ["decision_frameworks", "purpose TEXT NOT NULL DEFAULT ''"],
    ["decision_frameworks", "decision_question TEXT"],
    ["decision_frameworks", "inputs_to_consider TEXT"],
    ["decision_frameworks", "decision_criteria TEXT"],
    ["decision_frameworks", "evidence_needed TEXT"],
    ["decision_frameworks", "possible_outcomes TEXT"],
    ["decision_frameworks", "reviewer_prompts TEXT"],
    ["decision_frameworks", "example_application TEXT"],
    ["decision_frameworks", "related_playbooks TEXT"],
    ["decision_frameworks", "review_status TEXT DEFAULT 'draft'"],
    ["decision_frameworks", "is_seed INTEGER DEFAULT 0"],
    ["decision_frameworks", "is_readonly INTEGER DEFAULT 0"],
    ["decision_frameworks", "clonable INTEGER DEFAULT 1"],
    ["decision_frameworks", "case_id TEXT"],
    ["decision_frameworks", "cloned_from_type TEXT"],
    ["decision_frameworks", "cloned_from_id TEXT"],
    ["decision_frameworks", "created_by TEXT"],
    ["valuation_principles", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["valuation_principles", "slug TEXT NOT NULL DEFAULT ''"],
    ["valuation_principles", "body TEXT"],
    ["valuation_principles", "rationale TEXT"],
    ["valuation_principles", "related_playbooks TEXT"],
    ["valuation_principles", "related_antipatterns TEXT"],
    ["valuation_principles", "review_status TEXT DEFAULT 'draft'"],
    ["valuation_principles", "is_seed INTEGER DEFAULT 0"],
    ["valuation_principles", "is_readonly INTEGER DEFAULT 0"],
    ["valuation_principles", "clonable INTEGER DEFAULT 1"],
    ["valuation_principles", "case_id TEXT"],
    ["valuation_principles", "cloned_from_type TEXT"],
    ["valuation_principles", "cloned_from_id TEXT"],
    ["valuation_principles", "created_by TEXT"],
    ["valuation_antipatterns", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["valuation_antipatterns", "slug TEXT NOT NULL DEFAULT ''"],
    ["valuation_antipatterns", "description TEXT"],
    ["valuation_antipatterns", "why_it_matters TEXT"],
    ["valuation_antipatterns", "warning_signs TEXT"],
    ["valuation_antipatterns", "how_to_fix TEXT"],
    ["valuation_antipatterns", "related_playbooks TEXT"],
    ["valuation_antipatterns", "related_principles TEXT"],
    ["valuation_antipatterns", "related_templates TEXT"],
    ["valuation_antipatterns", "review_status TEXT DEFAULT 'draft'"],
    ["valuation_antipatterns", "is_seed INTEGER DEFAULT 0"],
    ["valuation_antipatterns", "is_readonly INTEGER DEFAULT 0"],
    ["valuation_antipatterns", "clonable INTEGER DEFAULT 1"],
    ["valuation_antipatterns", "case_id TEXT"],
    ["valuation_antipatterns", "cloned_from_type TEXT"],
    ["valuation_antipatterns", "cloned_from_id TEXT"],
    ["valuation_antipatterns", "created_by TEXT"],
    ["reasoning_templates", "scope TEXT NOT NULL DEFAULT 'workspace'"],
    ["reasoning_templates", "slug TEXT NOT NULL DEFAULT ''"],
    ["reasoning_templates", "use_case TEXT"],
    ["reasoning_templates", "prompt_scaffold TEXT"],
    ["reasoning_templates", "required_supporting_inputs TEXT"],
    ["reasoning_templates", "optional_supporting_inputs TEXT"],
    ["reasoning_templates", "example_output TEXT"],
    ["reasoning_templates", "related_playbooks TEXT"],
    ["reasoning_templates", "related_frameworks TEXT"],
    ["reasoning_templates", "related_principles TEXT"],
    ["reasoning_templates", "ai_drafting_allowed INTEGER DEFAULT 1"],
    ["reasoning_templates", "review_status TEXT DEFAULT 'draft'"],
    ["reasoning_templates", "is_seed INTEGER DEFAULT 0"],
    ["reasoning_templates", "is_readonly INTEGER DEFAULT 0"],
    ["reasoning_templates", "clonable INTEGER DEFAULT 1"],
    ["reasoning_templates", "case_id TEXT"],
    ["reasoning_templates", "cloned_from_type TEXT"],
    ["reasoning_templates", "cloned_from_id TEXT"],
    ["reasoning_templates", "created_by TEXT"],
    ["reference_cases", "description TEXT"],
    ["reference_cases", "source_label TEXT"],
    ["reference_cases", "is_seed INTEGER DEFAULT 0"],
    ["reference_cases", "is_readonly INTEGER DEFAULT 0"],
    ["reference_cases", "clonable INTEGER DEFAULT 0"],
    ["reference_case_artifacts", "body TEXT"],
    ["reference_case_artifacts", "source_note TEXT"],
    ["reference_case_artifacts", "artifact_metadata TEXT"],
    ["reference_case_artifacts", "is_seed INTEGER DEFAULT 0"],
    ["reference_case_artifacts", "is_readonly INTEGER DEFAULT 0"],
    ["reference_case_artifacts", "clonable INTEGER DEFAULT 1"],
    ["reference_case_artifacts", "review_status TEXT DEFAULT 'draft'"],
    ["reference_case_artifacts", "updated_at TEXT NOT NULL DEFAULT ''"],
    ["assumptions", "project_id TEXT"],
    ["assumptions", "name TEXT NOT NULL DEFAULT ''"],
    ["assumptions", "category TEXT"],
    ["assumptions", "stated_assumption_text TEXT"],
    ["assumptions", "context TEXT"],
    ["assumptions", "external_model_reference TEXT"],
    ["assumptions", "method_area TEXT"],
    ["assumptions", "rationale TEXT"],
    ["assumptions", "source_links TEXT"],
    ["assumptions", "evidence_strength TEXT DEFAULT 'moderate'"],
    ["assumptions", "review_status TEXT DEFAULT 'draft'"],
    ["assumptions", "tags TEXT"],
    ["assumptions", "is_seed INTEGER DEFAULT 0"],
    ["assumptions", "is_readonly INTEGER DEFAULT 0"],
    ["assumptions", "clonable INTEGER DEFAULT 1"],
    ["assumptions", "case_id TEXT"],
    ["assumptions", "cloned_from_type TEXT"],
    ["assumptions", "cloned_from_id TEXT"],
    ["assumptions", "created_by TEXT"],
    ["sources", "project_id TEXT"],
    ["sources", "publisher_author TEXT"],
    ["sources", "source_type TEXT"],
    ["sources", "publication_date TEXT"],
    ["sources", "valuation_date_relevance_note TEXT"],
    ["sources", "url_or_file_reference TEXT"],
    ["sources", "citation_text TEXT"],
    ["sources", "reliability_assessment TEXT"],
    ["sources", "notes TEXT"],
    ["sources", "tags TEXT"],
    ["sources", "is_seed INTEGER DEFAULT 0"],
    ["sources", "is_readonly INTEGER DEFAULT 0"],
    ["sources", "clonable INTEGER DEFAULT 1"],
    ["sources", "case_id TEXT"],
    ["sources", "cloned_from_type TEXT"],
    ["sources", "cloned_from_id TEXT"],
    ["sources", "created_by TEXT"],
    ["evidence_links", "target_entity_type TEXT NOT NULL DEFAULT ''"],
    ["evidence_links", "target_entity_id TEXT NOT NULL DEFAULT ''"],
    ["evidence_links", "support_type TEXT"],
    ["evidence_links", "relevance_note TEXT"],
    ["evidence_links", "strength_rating TEXT"],
    ["evidence_links", "page_section_reference TEXT"],
    ["evidence_links", "quote_or_paraphrase_note TEXT"],
    ["evidence_links", "created_by TEXT"],
    ["evidence_links", "updated_at TEXT NOT NULL DEFAULT ''"],
    ["external_model_references", "project_id TEXT"],
    ["external_model_references", "model_type TEXT"],
    ["external_model_references", "tool_used TEXT DEFAULT ''"],
    ["external_model_references", "file_or_url_reference TEXT"],
    ["external_model_references", "version_label TEXT"],
    ["external_model_references", "prepared_by TEXT"],
    ["external_model_references", "prepared_date TEXT"],
    ["external_model_references", "linked_assumptions TEXT"],
    ["external_model_references", "linked_sources TEXT"],
    ["external_model_references", "linked_reasoning_templates TEXT"],
    ["external_model_references", "linked_qa_items TEXT"],
    ["external_model_references", "review_status TEXT DEFAULT 'draft'"],
    ["external_model_references", "created_by TEXT"],
    ["support_memos", "project_id TEXT"],
    ["support_memos", "memo_type TEXT"],
    ["support_memos", "linked_playbook_id TEXT"],
    ["support_memos", "linked_framework_id TEXT"],
    ["support_memos", "linked_template_id TEXT"],
    ["support_memos", "linked_assumptions TEXT"],
    ["support_memos", "linked_sources TEXT"],
    ["support_memos", "linked_external_model_reference TEXT"],
    ["support_memos", "review_status TEXT DEFAULT 'draft'"],
    ["support_memos", "tags TEXT"],
    ["support_memos", "case_id TEXT"],
    ["support_memos", "is_seed INTEGER DEFAULT 0"],
    ["support_memos", "is_readonly INTEGER DEFAULT 0"],
    ["support_memos", "clonable INTEGER DEFAULT 1"],
    ["support_memos", "cloned_from_type TEXT"],
    ["support_memos", "cloned_from_id TEXT"],
    ["support_memos", "created_by TEXT"],
    ["qa_items", "project_id TEXT"],
    ["qa_items", "case_id TEXT"],
    ["qa_items", "answer_scaffold TEXT"],
    ["qa_items", "draft_answer TEXT"],
    ["qa_items", "linked_assumptions TEXT"],
    ["qa_items", "linked_sources TEXT"],
    ["qa_items", "linked_support_memo TEXT"],
    ["qa_items", "linked_playbook TEXT"],
    ["qa_items", "linked_framework TEXT"],
    ["qa_items", "linked_template TEXT"],
    ["qa_items", "difficulty TEXT"],
    ["qa_items", "audience TEXT"],
    ["qa_items", "review_status TEXT DEFAULT 'draft'"],
    ["qa_items", "tags TEXT"],
    ["qa_items", "is_seed INTEGER DEFAULT 0"],
    ["qa_items", "is_readonly INTEGER DEFAULT 0"],
    ["qa_items", "clonable INTEGER DEFAULT 1"],
    ["qa_items", "cloned_from_type TEXT"],
    ["qa_items", "cloned_from_id TEXT"],
    ["qa_items", "created_by TEXT"],
    ["notes", "project_id TEXT"],
    ["notes", "entity_type TEXT"],
    ["notes", "entity_id TEXT"],
    ["notes", "visibility TEXT DEFAULT 'private'"],
    ["notes", "tags TEXT"],
    ["notes", "is_favorite INTEGER DEFAULT 0"],
    ["notes", "review_status TEXT DEFAULT 'draft'"],
    ["notes", "created_by TEXT"],
    ["lessons_learned", "project_id TEXT"],
    ["lessons_learned", "case_id TEXT"],
    ["lessons_learned", "lesson TEXT"],
    ["lessons_learned", "context TEXT"],
    ["lessons_learned", "mistake_avoided TEXT"],
    ["lessons_learned", "future_checklist_prompt TEXT"],
    ["lessons_learned", "related_antipattern TEXT"],
    ["lessons_learned", "related_principle TEXT"],
    ["lessons_learned", "related_project TEXT"],
    ["lessons_learned", "related_reference_case TEXT"],
    ["lessons_learned", "tags TEXT"],
    ["lessons_learned", "review_status TEXT DEFAULT 'draft'"],
    ["lessons_learned", "is_seed INTEGER DEFAULT 0"],
    ["lessons_learned", "is_readonly INTEGER DEFAULT 0"],
    ["lessons_learned", "clonable INTEGER DEFAULT 1"],
    ["lessons_learned", "cloned_from_type TEXT"],
    ["lessons_learned", "cloned_from_id TEXT"],
    ["lessons_learned", "created_by TEXT"],
    ["tags", "slug TEXT NOT NULL DEFAULT ''"],
    ["tags", "is_seed INTEGER DEFAULT 0"],
    ["tag_links", "entity_type TEXT NOT NULL DEFAULT ''"],
    ["tag_links", "entity_id TEXT NOT NULL DEFAULT ''"],
    ["favorites", "entity_type TEXT NOT NULL DEFAULT ''"],
    ["favorites", "entity_id TEXT NOT NULL DEFAULT ''"],
    ["activity_log", "actor_id TEXT"],
    ["activity_log", "entity_title TEXT"],
    ["ai_tasks", "prompt_version TEXT"],
    ["ai_tasks", "input_references TEXT"],
    ["ai_tasks", "output_preview TEXT"],
    ["files", "title TEXT NOT NULL DEFAULT ''"],
    ["files", "file_name TEXT NOT NULL DEFAULT ''"],
    ["files", "storage_mode TEXT"],
    ["files", "url_or_path TEXT"],
    ["files", "notes TEXT"],
    ["files", "created_by TEXT"],
    ["project_report_sections", "created_by TEXT"],
    ["project_report_sections", "updated_by TEXT"],
    ["project_report_sections", "linked_file_ids TEXT"],
    ["project_report_sections", "review_status TEXT DEFAULT 'draft'"],
  ];

  for (const [table, colDef] of migrations) {
    try {
      await db.run(`ALTER TABLE ${table} ADD COLUMN ${colDef}`);
    } catch {
      // Column already exists — safe to ignore
    }
  }

  // ── Seed demo user ──────────────────────────────────────────────────────────
  const { rows: userRows } = await db.query("SELECT id FROM users WHERE id = 'user_demo'");
  if (userRows.length === 0) {
    const ts = now();
    await db.run(
      "INSERT INTO users (id, email, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      ["user_demo", "demo@valuation-memory-bank.local", "Demo Analyst", "analyst", ts, ts]
    );
    console.log("[init-db] Seeded demo user");
  }

  // ── Seed default workspace ──────────────────────────────────────────────────
  const { rows: wsRows } = await db.query("SELECT id FROM workspaces LIMIT 1");
  let workspaceId: string | undefined = (wsRows[0] as any)?.id;
  if (!workspaceId) {
    workspaceId = "ws_default";
    const ts = now();
    await db.run(
      "INSERT INTO workspaces (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [workspaceId, "My Firm", "Default workspace", ts, ts]
    );
    await db.run(
      "INSERT INTO workspace_memberships (id, workspace_id, user_id, role, created_at) VALUES (?, ?, ?, ?, ?)",
      [nanoid(), workspaceId, "user_demo", "owner", ts]
    );
    console.log("[init-db] Seeded default workspace");
  }

  // ── Seed report section templates (idempotent) ──────────────────────────────
  let seededCount = 0;
  const tplTs = now();
  for (const tpl of REPORT_SECTION_TEMPLATES) {
    const result = await db.run(
      `INSERT OR IGNORE INTO report_section_templates
       (id, slug, parent_slug, level, title, default_order, description, guidance, is_seed, is_readonly, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)`,
      [nanoid(), tpl.slug, tpl.parentSlug ?? null, tpl.level, tpl.title, tpl.defaultOrder,
       tpl.description ?? null, tpl.guidance ?? null, tplTs, tplTs]
    );
    if (result.rowsAffected > 0) {
      seededCount++;
    } else {
      await db.run(
        `UPDATE report_section_templates
         SET parent_slug = ?, level = ?, title = ?, default_order = ?, description = ?, guidance = ?, updated_at = ?
         WHERE slug = ?`,
        [tpl.parentSlug ?? null, tpl.level, tpl.title, tpl.defaultOrder,
         tpl.description ?? null, tpl.guidance ?? null, tplTs, tpl.slug]
      );
    }
  }
  if (seededCount > 0) {
    console.log(`[init-db] Seeded ${seededCount} report section templates`);
  }

  // ── Seed knowledge content (idempotent — checks is_seed flag) ───────────────
  await seedKnowledge(db, workspaceId);

  console.log("[init-db] Database ready");
}

// ── Knowledge seed data ──────────────────────────────────────────────────────

async function seedKnowledge(db: DbRunner, workspaceId: string) {
  // Check if already seeded (look for any seed playbook)
  const { rows: existing } = await db.query(
    "SELECT id FROM methodology_playbooks WHERE is_seed = 1 LIMIT 1"
  );
  if (existing.length > 0) {
    return; // Already seeded
  }
  console.log("[init-db] Seeding knowledge content...");
  const ts = now();

  // ── Playbooks ────────────────────────────────────────────────────────────────
  const playbooks = [
    {
      id: nanoid(), slug: "income-approach-dcf", title: "Income Approach – DCF / Capitalization",
      purpose: "Apply the income approach using discounted cash flow or capitalization of earnings to derive the value of a business interest. This playbook covers normalized earnings, discount/cap rate development, and terminal value.",
      whenToUse: "Use when the subject company has predictable cash flows, a track record of profitability, and when an earnings-based indication is appropriate under the standard and premise of value.",
      whenNotToUse: "Avoid as the sole method when the company is pre-revenue, asset-heavy (e.g., real estate holding company), or when earnings are highly cyclical with no stabilizing trend.",
      keyConcepts: "Normalized EBITDA/SDE, WACC, build-up method, terminal value, Gordon Growth Model, capitalization rate = discount rate minus long-term growth rate",
      requiredEvidence: "5 years of financial statements, tax returns, interim financials, management projections if available, comparable public company data for beta",
      commonSources: "BizMiner, IBISWorld, Duff & Phelps Cost of Capital Navigator, Damodaran beta datasets, Federal Reserve H.15 (risk-free rate)",
      reviewerQuestions: "What normalization adjustments were made and why? How was the discount rate developed? What growth rate was used in the terminal value and is it supportable?",
      commonMistakes: "Failing to normalize owner compensation to market; using book depreciation instead of economic depreciation; ignoring working capital changes; applying a growth rate higher than GDP without justification",
      reportLanguageExamples: "The Company's indicated value under the income approach, utilizing a discounted cash flow method, was determined to be $X million. The discount rate of X% was developed using the build-up method, incorporating the risk-free rate, equity risk premium, size premium, and company-specific risk premium.",
    },
    {
      id: nanoid(), slug: "market-approach-gpc", title: "Market Approach – Guideline Public Company",
      purpose: "Derive valuation multiples from comparable publicly traded companies and apply them to the subject company's financial metrics.",
      whenToUse: "Use when there are reasonably comparable public companies and the subject company is large enough for GPC comparison to be meaningful.",
      whenNotToUse: "Avoid when no truly comparable public companies exist, when the subject is very small relative to public comps, or when public market sentiment is distorted.",
      keyConcepts: "EV/EBITDA, EV/Revenue, Price/Earnings, TEV (Total Enterprise Value), DLOM, size adjustments, marketability",
      requiredEvidence: "SEC filings (10-K, 10-Q) of guideline companies, market cap data, EBITDA reconciliations, subject company trailing twelve months financials",
      commonSources: "Capital IQ, Bloomberg, FactSet, SEC EDGAR, Compustat",
      reviewerQuestions: "Why were these specific companies selected? What adjustments were made for size and risk differences? How was DLOM determined?",
      commonMistakes: "Using multiples without adjusting for size/risk differences; selecting superficially similar but fundamentally different companies; failing to apply DLOM for minority non-marketable interests",
      reportLanguageExamples: "The selected guideline public companies were chosen based on similarity of SIC code, revenue size, geographic market, and business model. Median EV/EBITDA of X.Xx was selected after consideration of the subject company's relative risk and growth profile.",
    },
    {
      id: nanoid(), slug: "market-approach-gtc", title: "Market Approach – Guideline Transaction (M&A)",
      purpose: "Use arm's length M&A transactions involving comparable companies to develop valuation multiples for the subject.",
      whenToUse: "Use when sufficient transaction data exists and the standard of value is fair market value or strategic value; useful for control-level valuations.",
      whenNotToUse: "Avoid when transaction data is sparse or stale (>5 years old in a changing market), or when deal terms included non-standard consideration.",
      keyConcepts: "Control premium, synergies, deal structure (asset vs. stock), earnouts, TEV, EBITDA multiples",
      requiredEvidence: "Transaction databases (Done Deals, BVR, PreerSearch), press releases, 8-K filings for public targets",
      commonSources: "BVR/DoneDeals, PitchBook, Capital IQ Transactions, Mergerstat",
      reviewerQuestions: "Are the transactions sufficiently recent and comparable? Were synergies included in the transaction price? Was the deal structure similar to the subject?",
      commonMistakes: "Using old transactions without acknowledging market changes; failing to distinguish between asset and stock deal multiples; ignoring earnouts in the stated consideration",
      reportLanguageExamples: "Selected transactions were screened by SIC code, revenue range, and transaction date. The selected multiple of X.Xx times EBITDA reflects the median of the screened transactions, adjusted downward for the subject company's smaller scale.",
    },
    {
      id: nanoid(), slug: "asset-approach-nav", title: "Asset Approach – Net Asset Value",
      purpose: "Value the business by adjusting book value of assets and liabilities to fair market value.",
      whenToUse: "Use for holding companies, real estate entities, capital-intensive businesses, or when the going-concern value is less than asset value.",
      whenNotToUse: "Rarely appropriate as the sole method for operating companies with significant intangible value (customer relationships, brand, workforce).",
      keyConcepts: "Adjusted book value, intangible assets (customer lists, IP, goodwill), deferred taxes, liquidation value vs. going-concern",
      requiredEvidence: "Balance sheet, appraisals of real property/equipment, intangible asset studies, deferred tax analysis",
      commonSources: "USPAP-compliant real property appraisals, machinery & equipment appraisals, internal R&D records",
      reviewerQuestions: "Were all off-balance sheet liabilities identified? Were intangible assets separately identified and valued? Was the deferred tax liability computed on the built-in gains?",
      commonMistakes: "Ignoring intangible assets; failing to tax-affect built-in gains; using book value without adjustment for LIFO reserves or depreciation methods",
      reportLanguageExamples: "Under the asset-based approach, each balance sheet asset and liability was adjusted to estimated fair market value. Identified intangible assets including customer relationships and trade names were separately valued and included.",
    },
    {
      id: nanoid(), slug: "dlom-analysis", title: "DLOM – Discount for Lack of Marketability",
      purpose: "Quantify the discount applied to a non-marketable interest to reflect the cost and time required to convert to cash.",
      whenToUse: "Apply whenever valuing a minority or controlling interest in a non-public company where the standard of value is fair market value.",
      whenNotToUse: "Not applicable for publicly traded interests or when the premise of value is liquidation.",
      keyConcepts: "Restricted stock studies, pre-IPO studies, Mandelbaum factors, put option models (Finnerty, Chaffee, LEAPS), liquidity premium",
      requiredEvidence: "Comparable restricted stock studies, pre-IPO discount data, subject company characteristics (dividends, size, time to liquidity)",
      commonSources: "Stout Restricted Stock Study, Columbia Financial Advisors Study, BVR DLOM database, Pluris Marketability Discount Study",
      reviewerQuestions: "Which DLOM methods were used and why? Were the Mandelbaum factors analyzed? Is the selected discount consistent with the company's specific liquidity profile?",
      commonMistakes: "Applying a generic DLOM without company-specific analysis; using restricted stock studies for very small companies; double-counting the discount in the cap rate and DLOM",
      reportLanguageExamples: "A discount for lack of marketability of X% was applied to reflect the subject interest's illiquidity relative to the freely traded guideline public companies. This discount was supported by analysis of empirical restricted stock data and consideration of the Mandelbaum factors.",
    },
    {
      id: nanoid(), slug: "esop-valuation", title: "ESOP Valuation",
      purpose: "Determine fair market value of employer securities for ESOP transactions, annual updates, and repurchase obligations.",
      whenToUse: "Required annually for ESOP-owned companies and at the time of ESOP formation, major transactions, or repurchase events.",
      whenNotToUse: "This specific playbook does not apply to non-ESOP equity compensation valuations (see 409A playbook).",
      keyConcepts: "DOL independence requirements, adequate consideration standard, repurchase obligation study, S-corp ESOP tax benefits, pass-through savings, control premium considerations",
      requiredEvidence: "ESOP plan documents, loan agreements, 5-year financial statements, management projections, prior appraisals, repurchase obligation data",
      commonSources: "DOL Advisory Opinion 76-65, ERISA Section 3(18), Proposed DOL Regulations, National Center for Employee Ownership (NCEO)",
      reviewerQuestions: "Was the valuation prepared by a qualified independent appraiser? Were S-corp tax benefits reflected? Was the repurchase obligation studied?",
      commonMistakes: "Failing to reflect S-corp pass-through tax savings in the discount rate or cash flows; inadequate independence documentation; ignoring selling shareholders' post-transaction interests",
      reportLanguageExamples: "This valuation was prepared in accordance with the adequate consideration standard under ERISA Section 3(18) and reflects the fair market value of the subject shares as of the valuation date.",
    },
    {
      id: nanoid(), slug: "409a-valuation", title: "409A / Stock Option Valuation",
      purpose: "Determine the fair market value of common stock for stock option grants to comply with IRC Section 409A.",
      whenToUse: "Required whenever a startup or private company issues stock options. Must be updated at least annually or when a material event occurs.",
      whenNotToUse: "Not applicable for ESOP purposes (separate regulatory framework) or for RSU grants at public companies.",
      keyConcepts: "PWERM (Probability-Weighted Expected Return Method), OPM (Option Pricing Method), common stock discount (CSED), preferred vs. common waterfall",
      requiredEvidence: "Cap table, all financing terms (liquidation preferences, participation rights), company projections, recent financing rounds",
      commonSources: "AICPA Practice Aid: Valuation of Privately-Held-Company Equity Securities Issued as Compensation (Cheap Stock Guide)",
      reviewerQuestions: "Were all classes of equity in the cap table modeled correctly? Were liquidation preferences and participation rights reflected? Is the CSED supportable?",
      commonMistakes: "Ignoring liquidation preferences; using incorrect volatility inputs; not updating after a new financing round; applying a cap rate to pre-revenue companies",
      reportLanguageExamples: "The Company's common stock was valued using the Option Pricing Method, reflecting the rights and preferences of each equity class in the capital structure as of the valuation date.",
    },
    {
      id: nanoid(), slug: "normalization-adjustments", title: "Normalization Adjustments",
      purpose: "Identify and adjust non-recurring, non-operating, and owner-related items in the financial statements to arrive at economic earnings.",
      whenToUse: "Apply in every income approach engagement before applying any capitalization rate or discount rate.",
      whenNotToUse: "Adjustments must be supportable — do not make speculative adjustments without evidence.",
      keyConcepts: "Owner compensation (market rate vs. actual), non-recurring revenues/expenses, personal expenses run through the business, related-party rents, working capital normalization",
      requiredEvidence: "Payroll records, comparable compensation studies (BLS, RCM, PAS/Abbott-Langer), lease comparables, 5 years of financials",
      commonSources: "BLS Occupational Employment Statistics, RCM Capital Markets compensation studies, local commercial real estate comps",
      reviewerQuestions: "Is each adjustment documented and supportable? Was owner compensation adjusted to market (not eliminated)? Were non-recurring items truly one-time?",
      commonMistakes: "Adjusting owner comp to zero instead of market; treating cyclical downturns as non-recurring; not disclosing adjustments in the report",
      reportLanguageExamples: "The following adjustments were made to reflect the earnings of a hypothetical, similarly-situated business operating at arm's length. Owner compensation was adjusted to $X per year, consistent with market rates for a CEO/operator of a business of similar size and complexity.",
    },
    {
      id: nanoid(), slug: "report-writing", title: "Report Writing & Documentation",
      purpose: "Draft a defensible, USPAP-compliant valuation report that clearly communicates the methodology, analysis, and conclusion.",
      whenToUse: "Every engagement. Report quality is part of the deliverable.",
      whenNotToUse: "N/A — documentation is always required.",
      keyConcepts: "USPAP Standards Rule 10, summary vs. detailed reports, scope of work, limiting conditions, extraordinary assumptions",
      requiredEvidence: "All working papers, source documentation for every exhibit, signed engagement letter",
      commonSources: "USPAP (current edition), ASA Business Valuation Standards, NACVA Professional Standards",
      reviewerQuestions: "Does the report contain all required USPAP elements? Is the scope of work clearly defined? Are all assumptions and limiting conditions disclosed?",
      commonMistakes: "Cutting and pasting from prior reports without updating; inadequate disclosure of extraordinary assumptions; vague descriptions of the methodology",
      reportLanguageExamples: "This report has been prepared in conformity with the Uniform Standards of Professional Appraisal Practice (USPAP), as promulgated by the Appraisal Standards Board of The Appraisal Foundation.",
    },
    {
      id: nanoid(), slug: "quality-of-earnings", title: "Quality of Earnings (QofE) Analysis",
      purpose: "Assess the sustainability, accuracy, and underlying drivers of reported earnings for M&A due diligence or valuation support.",
      whenToUse: "M&A transactions, sell-side preparation, banker engagements where earnings quality is questioned.",
      whenNotToUse: "Not a standalone valuation — this is an analytical supplement to standard valuation methods.",
      keyConcepts: "Adjusted EBITDA, one-time add-backs, recurring vs. non-recurring revenue, revenue recognition policies, working capital normalization, customer concentration",
      requiredEvidence: "Detailed G/L data, sales reports by customer/product, accounts receivable aging, revenue recognition policies",
      commonSources: "Management representations, accounting records, CPA-prepared financials",
      reviewerQuestions: "Are add-backs truly non-recurring? What is the customer concentration? Are revenue recognition policies appropriate?",
      commonMistakes: "Accepting management's add-backs without independent verification; ignoring revenue quality for subscription businesses; not analyzing working capital seasonality",
      reportLanguageExamples: "Based on our analysis, Adjusted EBITDA for the trailing twelve months ended [Date] was $X million, after giving effect to the following addbacks that management represents to be non-recurring in nature.",
    },
  ];

  for (const pb of playbooks) {
    await db.run(
      `INSERT OR IGNORE INTO methodology_playbooks
       (id, workspace_id, scope, title, slug, purpose, when_to_use, when_not_to_use, key_concepts, required_evidence, common_sources, reviewer_questions, common_mistakes, report_language_examples, review_status, is_seed, is_readonly, clonable, created_at, updated_at, created_by)
       VALUES (?, ?, 'global', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 1, 1, 1, ?, ?, 'system')`,
      [pb.id, null, pb.title, pb.slug, pb.purpose, pb.whenToUse, pb.whenNotToUse, pb.keyConcepts,
       pb.requiredEvidence, pb.commonSources, pb.reviewerQuestions, pb.commonMistakes, pb.reportLanguageExamples, ts, ts]
    );
  }

  // ── Principles ────────────────────────────────────────────────────────────────
  const principles = [
    { slug: "independence", title: "Independence of the Valuation Analyst", body: "The appraiser must be independent, impartial, and objective. No financial or personal interest in the outcome of the valuation is permissible. Document independence in the engagement letter and certification.", rationale: "USPAP, ASA, NACVA standards all require independence. Violating this principle exposes the appraiser to professional sanctions and renders the report inadmissible in litigation." },
    { slug: "standard-of-value", title: "Define the Standard of Value Before Starting", body: "Always confirm and document the applicable standard of value (Fair Market Value, Fair Value, Investment Value, etc.) before performing any analysis. Different standards yield materially different conclusions.", rationale: "Confusing FMV with statutory Fair Value (used in shareholder disputes) is one of the most common errors in litigation valuations." },
    { slug: "premise-of-value", title: "Premise of Value Drives Methodology Selection", body: "Going-concern premise supports income and market approaches. Liquidation premise drives asset approach. Always match methodology to the appropriate premise.", rationale: "Applying an income approach to a liquidating entity overstates value by assuming cash flows that will not materialize." },
    { slug: "normalization-required", title: "Always Normalize Financial Statements", body: "Raw financial statements of privately held companies are rarely suitable for direct application in a valuation. Owner compensation, personal expenses, non-recurring items, and related-party transactions must all be analyzed and adjusted.", rationale: "Failure to normalize is the most common reason a valuation is challenged by opposing experts in litigation." },
    { slug: "multiple-approaches", title: "Consider All Three Approaches", body: "USPAP requires consideration of all three approaches (income, market, asset). Document why each is used, given less weight, or excluded. Never exclude an approach without explanation.", rationale: "Courts and regulators expect a thoughtful discussion of all approaches. Unexplained exclusion of an approach is a significant vulnerability." },
    { slug: "reconciliation", title: "Reconcile, Don't Just Average", body: "The reconciliation of indications of value from multiple methods is a professional judgment process, not a mechanical average. Weight each indication based on data quality, comparability, and appropriateness to the subject.", rationale: "Mechanical averaging suggests the appraiser did not exercise professional judgment. The ASA BVS requires reasoned reconciliation." },
    { slug: "valuation-date-specificity", title: "Valuation Is Date-Specific", body: "Value is determined as of a specific date. Use only information that was known or knowable as of the valuation date. Hindsight is prohibited except in retrospective appraisals.", rationale: "Using post-valuation date events (e.g., a subsequent sale or loss of a customer) can violate USPAP and distort the conclusion." },
    { slug: "document-everything", title: "Document Your Work Completely", body: "Maintain a complete workpaper file supporting every number in the report. Every exhibit should be traceable to a source document. Quantify each normalization adjustment.", rationale: "In litigation or a FINRA/IRS review, you will be required to produce workpapers. Incomplete documentation is professionally and legally dangerous." },
    { slug: "control-vs-minority", title: "Level of Value Matters — Know What You Are Valuing", body: "Controlling interests command a premium over minority interests. Non-marketable interests are discounted relative to marketable interests. The analysis must reflect the specific interest being valued, not the enterprise as a whole.", rationale: "Applying enterprise-level multiples to a minority non-marketable interest without appropriate discounts materially overstates value." },
    { slug: "sources-reliability", title: "Assess Source Reliability", body: "Not all data sources are equal. Audited financials are more reliable than management-prepared statements. Public data from SEC filings is more reliable than private transaction databases. Document your assessment of source reliability.", rationale: "Using unreliable data without disclosure violates USPAP competency requirements and exposes the conclusion to challenge." },
    { slug: "professional-skepticism", title: "Exercise Professional Skepticism", body: "Question management representations. Request supporting documentation for unusual items. Do not accept projections at face value without analyzing historical accuracy and market conditions.", rationale: "The appraiser's objectivity and skepticism protect the credibility of the conclusion. Accepting management's narrative without scrutiny is a red flag to reviewers." },
    { slug: "engagement-scope", title: "Define Scope Before You Start", body: "The engagement letter must define the purpose, function, standard of value, premise of value, effective date, and interest being valued. Scope creep and ambiguity create liability.", rationale: "Unclear scope leads to disputes about what the appraiser was asked to do and whether they did it correctly." },
    { slug: "minority-discount-logic", title: "Understand the DLOM-Discount Rate Interaction", body: "The discount rate in a DCF already reflects some illiquidity for small companies. DLOM must not double-count illiquidity already embedded in the discount rate. Document the interaction explicitly.", rationale: "Double-counting is one of the most common errors in business valuation. The IRS, courts, and peer reviewers all watch for it." },
    { slug: "growth-rate-discipline", title: "Growth Rate Discipline in Terminal Value", body: "The long-term sustainable growth rate in a terminal value calculation must be supportable — typically at or below long-term GDP growth (2-3%). An unsupported high growth rate inflates value mechanically.", rationale: "A 1% change in the terminal growth rate can swing value by 15-25%. This is the single most leveraged assumption in a DCF and receives intense scrutiny." },
    { slug: "client-independence", title: "Client Pressure Does Not Change Value", body: "The appraiser's conclusion must be independent of client pressure to reach a predetermined value. If a client challenges the conclusion for business reasons, the appropriate response is to review the analysis, not to capitulate.", rationale: "Advocacy for a predetermined conclusion violates USPAP ethics and constitutes appraiser bias." },
  ];

  for (const p of principles) {
    const pid = nanoid();
    await db.run(
      `INSERT OR IGNORE INTO valuation_principles
       (id, workspace_id, scope, title, slug, body, rationale, review_status, is_seed, is_readonly, clonable, created_at, updated_at, created_by)
       VALUES (?, ?, 'global', ?, ?, ?, ?, 'approved', 1, 1, 1, ?, ?, 'system')`,
      [pid, null, p.title, p.slug, p.body, p.rationale, ts, ts]
    );
  }

  // ── Anti-Patterns ─────────────────────────────────────────────────────────────
  const antipatterns = [
    { slug: "zero-owner-comp", title: "Adjusting Owner Compensation to Zero", description: "Normalizing owner compensation to $0 instead of market rate.", whyItMatters: "Inflates normalized earnings by the full owner salary. A hypothetical buyer would need to hire a replacement manager at market wages.", warningSigns: "Owner compensation adjustment line shows credit equal to full reported salary with no market-rate replacement cost.", howToFix: "Research market compensation using BLS OES, PAS/Abbott-Langer, or RCM studies. Adjust to market rate, not to zero." },
    { slug: "stale-comps", title: "Using Stale Guideline Companies or Transactions", description: "Relying on GPC multiples or GTC data that is more than 2-3 years old without acknowledging market changes.", whyItMatters: "Valuation multiples are time-sensitive. Using 2020 multiples in 2024 ignores market compression or expansion.", warningSigns: "Transaction database search returns results older than 3 years; GPC multiples from a prior year report.", howToFix: "Filter transaction databases to the most recent comparable period. Acknowledge market changes in the report when older data must be used." },
    { slug: "hindsight-bias", title: "Using Hindsight Information", description: "Incorporating events that occurred after the valuation date that were not known or knowable as of that date.", whyItMatters: "USPAP prohibits hindsight. Using subsequent events inflates or deflates value improperly and can invalidate the conclusion.", warningSigns: "Projections reference a customer won after the valuation date; a lease signed post-date is included in the asset approach.", howToFix: "Apply a strict cut-off: only use information known or knowable as of the effective date. Document this discipline in the limiting conditions." },
    { slug: "double-counting-dlom", title: "Double-Counting Illiquidity in DLOM and Discount Rate", description: "Applying a high company-specific risk premium for illiquidity in the discount rate AND a full DLOM on top.", whyItMatters: "Overstates the total discount and understates value, exposing the appraiser to challenge from opposing counsel.", warningSigns: "CSRP includes an explicit 'marketability' or 'liquidity' component AND a separate DLOM of 30%+ is applied.", howToFix: "If illiquidity is captured in the CSRP, reduce the DLOM accordingly and document the interaction. Or apply only one of the two adjustments." },
    { slug: "mechanical-averaging", title: "Mechanically Averaging Multiple Approach Indications", description: "Weighting all valuation methods equally (e.g., 1/3, 1/3, 1/3) without regard to data quality or appropriateness.", whyItMatters: "Mechanical averaging suggests the appraiser failed to exercise professional judgment and produces an unsupported conclusion.", warningSigns: "Reconciliation section states 'equal weight was given to each method' with no explanation.", howToFix: "Assess each method's appropriateness, data quality, and applicability. Document the reasoning for the weight assigned to each." },
    { slug: "unsupported-growth-rate", title: "Using an Unsupported High Terminal Growth Rate", description: "Applying a terminal growth rate of 4-6% in a DCF without supporting evidence.", whyItMatters: "The terminal value represents 70-80% of DCF value in many cases. A 1% increase in growth rate can increase value by 20%+.", warningSigns: "Terminal growth rate exceeds long-term GDP growth or industry forecasts without specific justification.", howToFix: "Anchor to long-term GDP or industry growth forecasts. Disclose and support any growth rate above 3% with specific company evidence." },
    { slug: "ignoring-cap-table", title: "Ignoring Preferred Stock Rights in 409A / Option Valuations", description: "Valuing common stock without modeling the full impact of liquidation preferences, participation rights, and anti-dilution provisions.", whyItMatters: "Preferred stock preferences can absorb most or all of enterprise value in downside scenarios, dramatically reducing common stock value.", warningSigns: "Cap table shows multiple preferred rounds with 1x+ liquidation preferences, but common stock value is close to preferred stock value.", howToFix: "Use the Option Pricing Method or PWERM with full modeling of all equity class preferences in the waterfall." },
    { slug: "no-working-capital-analysis", title: "Ignoring Working Capital Normalization", description: "Failing to analyze whether the subject company's working capital is at a normal level as of the valuation date.", whyItMatters: "Excess or deficit working capital affects the economic value available to the buyer. An operating business requires normal working capital.", warningSigns: "Balance sheet shows unusually high or low receivables/payables but no WC adjustment is made in the asset approach or DCF.", howToFix: "Calculate average normalized working capital and compare to the actual balance as of the valuation date. Adjust enterprise value accordingly." },
    { slug: "accepting-projections-uncritically", title: "Accepting Management Projections Without Scrutiny", description: "Using management's financial projections in a DCF without comparing them to historical accuracy or market data.", whyItMatters: "Management projections are inherently optimistic. Unscrutinized projections produce inflated DCF values.", warningSigns: "Projections show 20%+ revenue growth with no market or historical support; prior years' projections vs. actuals comparison is absent.", howToFix: "Compare prior projections to actuals. Benchmark growth rates against industry. Sensitize the model to more conservative scenarios." },
    { slug: "book-value-without-adjustment", title: "Using Book Value Without Adjustment in Asset Approach", description: "Presenting book value of equity as the asset-approach indication without adjusting assets and liabilities to fair market value.", whyItMatters: "Book value reflects historical cost, not current market value. Equipment, real estate, and intangibles may have values materially different from book.", warningSigns: "Asset approach section shows balance sheet equity without any FMV adjustments or intangible asset discussion.", howToFix: "Adjust each balance sheet item to FMV. Separately identify and value intangible assets. Apply deferred taxes to built-in gains." },
    { slug: "no-dlom-analysis", title: "Applying DLOM Without Analysis (Rule of Thumb)", description: "Applying a 20-25% DLOM as a rule of thumb without empirical support or company-specific analysis.", whyItMatters: "DLOM must be supportable. Courts and the IRS reject unsupported percentage applications as arbitrary.", warningSigns: "Report states '20% discount applied consistent with industry practice' with no citation to empirical studies or Mandelbaum analysis.", howToFix: "Cite empirical studies. Analyze Mandelbaum factors. Quantify the expected cost and time to achieve liquidity. Document the conclusion." },
    { slug: "wrong-rfr", title: "Using the Wrong Risk-Free Rate Tenor", description: "Applying a 3-month T-bill rate as the risk-free rate in a WACC/build-up calculation for a long-term investment.", whyItMatters: "The risk-free rate should match the investment horizon. Private company valuations are long-term investments, requiring the 20-year Treasury yield.", warningSigns: "Build-up method shows a risk-free rate below 2% in a normal rate environment, suggesting a short-term instrument was used.", howToFix: "Use the 20-year U.S. Treasury bond yield as of the valuation date (Fed H.15 release) for going-concern valuations." },
    { slug: "no-marketability-discount-gcm", title: "Forgetting DLOM When Using GPC Multiples", description: "Applying guideline public company multiples to a private company subject without applying a discount for lack of marketability.", whyItMatters: "GPC multiples reflect freely traded, marketable securities. A private company interest is not freely traded and is worth less.", warningSigns: "GPC method produces an indicated value and no DLOM adjustment is made before reconciliation.", howToFix: "Always apply DLOM to GPC-derived indications for non-controlling, non-marketable interests in private companies." },
  ];

  for (const ap of antipatterns) {
    const apid = nanoid();
    await db.run(
      `INSERT OR IGNORE INTO valuation_antipatterns
       (id, workspace_id, scope, title, slug, description, why_it_matters, warning_signs, how_to_fix, review_status, is_seed, is_readonly, clonable, created_at, updated_at, created_by)
       VALUES (?, ?, 'global', ?, ?, ?, ?, ?, ?, 'approved', 1, 1, 1, ?, ?, 'system')`,
      [apid, null, ap.title, ap.slug, ap.description, ap.whyItMatters, ap.warningSigns, ap.howToFix, ts, ts]
    );
  }

  // ── Reasoning Templates ───────────────────────────────────────────────────────
  const templates = [
    {
      slug: "wacc-memo", title: "WACC Development Memo",
      useCase: "income_approach",
      promptScaffold: `## WACC Development Memo — [Company Name] — [Valuation Date]

### Risk-Free Rate
- Source: Federal Reserve H.15, 20-Year Treasury Constant Maturity
- Rate as of [Date]: [X.X]%

### Equity Risk Premium (ERP)
- Source: [Duff & Phelps / Damodaran]
- Selected ERP: [X.X]%

### Beta
- Source: [Duff & Phelps, Bloomberg, Damodaran]
- Industry/Unlevered Beta: [X.Xx]
- Capital Structure Assumption: [D/E ratio]
- Relevered Beta: [X.Xx]

### Size Premium
- Source: Duff & Phelps CRSP Decile [X] / Size Study
- Size Premium: [X.X]%

### Company-Specific Risk Premium (CSRP)
- Considered factors: management depth, customer concentration, geographic diversification, revenue predictability, access to capital
- Selected CSRP: [X.X]%

### Cost of Equity
= Rf + (ERP × Beta) + Size Premium + CSRP = [X.X]%

### Cost of Debt
- Marginal pre-tax cost: [X.X]%
- Tax rate: [X.X]%
- After-tax cost of debt: [X.X]%

### Capital Structure
- Equity weight: [XX]%
- Debt weight: [XX]%

### WACC
= (Cost of Equity × Equity%) + (After-tax Kd × Debt%) = **[X.X]%**

### Reasonableness Check
- Industry average WACC from [source]: [range]
- Selected WACC is [above/below] the industry average because [reason]`,
    },
    {
      slug: "income-approach-narrative", title: "Income Approach Narrative",
      useCase: "income_approach",
      promptScaffold: `## Income Approach — [Company Name] — [Valuation Date]

### Overview
[Brief 2-3 sentence description of why the income approach is appropriate for this engagement.]

### Methodology Selection
We applied the [Discounted Cash Flow / Capitalization of Earnings] method because [reason].

### Normalization Summary
| Adjustment | Amount | Rationale |
|---|---|---|
| Owner Compensation | $[X] | Adjusted to market rate of $[X] per [source] |
| Non-recurring [item] | $[X] | [Occurred once because...] |
| Related-party rent | $[X] | Adjusted to market rent per [source] |

**Normalized EBITDA / SDE: $[X]**

### Projection Period (DCF only)
[Table of projected years with key assumptions]

### Discount Rate / Capitalization Rate
- Discount rate: [X.X]% (see WACC memo)
- Long-term growth rate: [X.X]% — supported by [GDP forecast / industry projection]
- Capitalization rate (cap method only): [X.X]% ([DR] minus [g])

### Terminal Value
- Method: [Gordon Growth / Exit Multiple]
- Assumptions: [describe]

### Indicated Value (Minority, Marketable Basis)
$[X,XXX,XXX]

### Adjustments
- Discount for Lack of Marketability: [X]% = $(X)
- [Other adjustments]

### Indicated Value (Non-Controlling, Non-Marketable)
$[X,XXX,XXX]`,
    },
    {
      slug: "dlom-memo", title: "DLOM Analysis Memo",
      useCase: "dlom_memo",
      promptScaffold: `## Discount for Lack of Marketability (DLOM) Analysis
### Company: [Name] | Date: [Valuation Date]

### Applicable Level of Value
Starting point: [Controlling / Minority, Marketable] indication from [Income / Market approach]
Interest being valued: [X]% non-controlling, non-marketable interest

### Empirical Data Review

**Restricted Stock Studies:**
| Study | Median Discount | Notes |
|---|---|---|
| Stout Restricted Stock Study | [X]% | n=[X] transactions |
| Columbia Financial Advisors | [X]% | [date range] |
| Pluris DLOM Database | [X]% | [notes] |

**Pre-IPO Studies:**
| Study | Median Discount | Notes |
|---|---|---|
| Emory Pre-IPO | [X]% | |

### Mandelbaum Factor Analysis
1. Private vs. public sales: [analysis]
2. Financial information access: [analysis]
3. Covenants of the subject interest: [analysis]
4. Transfer restrictions: [analysis]
5. Prospects of liquidity: [analysis]
6. Number of shareholders: [analysis]
7. Dividend policy: [analysis]
8. Business operating history: [analysis]

### Quantitative Models (optional)
- Finnerty model: [X]%
- Chaffee put option: [X]%

### Selected DLOM: **[X]%**
[2-3 sentences explaining the selection relative to empirical data and Mandelbaum analysis]`,
    },
    {
      slug: "normalization-schedule", title: "Normalization Adjustment Schedule",
      useCase: "normalization_schedule",
      promptScaffold: `## Normalization Adjustment Schedule
### [Company Name] | For the Years Ended [Date Range]

| Adjustment | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Notes |
|---|---|---|---|---|---|---|
| **Reported Revenue** | | | | | | |
| Non-recurring revenue | | | | | | Describe |
| **Normalized Revenue** | | | | | | |
| **Reported EBITDA** | | | | | | |
| **Expense Adjustments:** | | | | | | |
| Owner compensation (to market) | | | | | | Source: [BLS/RCM] |
| Officer life insurance (personal) | | | | | | |
| Personal auto / travel | | | | | | |
| Non-recurring legal / settlement | | | | | | |
| Related-party rent (to market) | | | | | | |
| Non-recurring [other] | | | | | | |
| **Total Adjustments** | | | | | | |
| **Normalized EBITDA** | | | | | | |
| Less: D&A | | | | | | |
| **Normalized EBIT** | | | | | | |
| Less: Taxes (at [X]%) | | | | | | |
| **Normalized NOPAT** | | | | | | |
| Plus: D&A | | | | | | |
| Less: Capex | | | | | | |
| Less: ΔWorking Capital | | | | | | |
| **Normalized Free Cash Flow** | | | | | | |

### Owner Compensation Analysis
- Reported owner compensation: $[X]
- Market rate (source: [BLS OES / RCM / PAS]): $[X]
- Adjustment: $[X] ([increase / decrease])`,
    },
    {
      slug: "market-approach-gpc-memo", title: "GPC Selection & Multiple Application Memo",
      useCase: "market_approach_gpc",
      promptScaffold: `## Guideline Public Company Method
### [Company Name] | Valuation Date: [Date]

### Search Criteria
- SIC Code(s): [XXXX]
- Revenue range: $[X]M to $[X]M
- Geographic focus: [US / Global]
- Database: [Capital IQ / Bloomberg]
- Initial universe: [N] companies
- Companies eliminated: [N] (reasons: [size, different product, non-comparable operations])
- Final guideline set: [N] companies

### Guideline Company Summary
| Company | Ticker | Revenue | EBITDA | EBITDA Margin | EV/EBITDA | EV/Revenue |
|---|---|---|---|---|---|---|
| [Company 1] | | | | | | |
| [Company 2] | | | | | | |
| Median | | | | | | |
| Mean | | | | | | |

### Multiple Selection
| Multiple | Low | Median | High | Selected | Rationale |
|---|---|---|---|---|---|
| EV/EBITDA (LTM) | | | | | |
| EV/EBITDA (NTM) | | | | | |
| EV/Revenue | | | | | |

Selected multiple rationale: [Discuss subject company's relative size, margin, growth, and risk vs. guideline set]

### Indicated Value (Controlling, Marketable Basis)
EBITDA × Selected Multiple = $[X,XXX,XXX]

### Adjustments
- Less: Discount for lack of control: [X]% = $(X) [if applicable]
- Less: DLOM: [X]% = $(X)

### Indicated Value (Non-controlling, Non-marketable Basis)
$[X,XXX,XXX]`,
    },
    {
      slug: "reviewer-response-template", title: "Reviewer / IRS Challenge Response",
      useCase: "reviewer_response",
      promptScaffold: `## Response to Reviewer Comments
### Report: [Title] | Date: [Original Date] | Reviewer: [Name/Entity]

---

### Comment 1: [Summarize the reviewer's comment]

**Our Response:**
[Address the comment directly. Cite USPAP, BVS, empirical data, or professional standards as appropriate. If the comment has merit, acknowledge it and explain the correction.]

**Supporting Authority:**
- [Citation 1]
- [Citation 2]

---

### Comment 2: [Summarize]

**Our Response:**
[...]

---

### Summary
[Brief closing paragraph confirming the revised conclusion (if any) and reaffirming the independence and integrity of the analysis.]

**Revised Indicated Value (if applicable):** $[X,XXX,XXX]`,
    },
    {
      slug: "engagement-letter-scope", title: "Engagement Letter — Scope Section",
      useCase: "engagement_letter_scope",
      promptScaffold: `## Scope of Engagement

### Purpose of the Valuation
This engagement has been undertaken for the purpose of [gift/estate tax planning / ESOP / financial reporting / shareholder dispute / transaction / other]. The valuation is intended for use by [client] and is not to be relied upon by any other party for any other purpose.

### Standard of Value
The applicable standard of value is [Fair Market Value / Fair Value / Investment Value], as defined by [IRC / State statute / ASA standards / other].

**Fair Market Value definition (if applicable):** "The price at which property would change hands between a willing buyer and a willing seller, neither being under any compulsion to buy or sell, and both having reasonable knowledge of the relevant facts." (Rev. Rul. 59-60)

### Premise of Value
The applicable premise of value is [going concern / liquidation / orderly disposition].

### Interest to Be Valued
[X]% [controlling / minority] [voting / non-voting] interest in [Company Name].

### Effective Date of Value
[Month Day, Year]

### Intended Users
This report is intended for use solely by [Client Name] and [co-intended users, e.g., their legal counsel, the IRS, etc.].

### Scope Limitations
[List any scope limitations, e.g., "Management-prepared financial statements were provided. An audit was not performed."]

### Deliverable
[Summary Report / Detailed Report / Calculation of Value / Consulting Analysis]`,
    },
  ];

  for (const t of templates) {
    const tid = nanoid();
    await db.run(
      `INSERT OR IGNORE INTO reasoning_templates
       (id, workspace_id, scope, title, slug, use_case, prompt_scaffold, review_status, is_seed, is_readonly, clonable, created_at, updated_at, created_by)
       VALUES (?, ?, 'global', ?, ?, ?, ?, 'approved', 1, 1, 1, ?, ?, 'system')`,
      [tid, null, t.title, t.slug, t.useCase, t.promptScaffold, ts, ts]
    );
  }

  // ── Q&A Items ─────────────────────────────────────────────────────────────────
  const qaItems = [
    {
      question: "What is the difference between discount rate and capitalization rate?",
      answerScaffold: "Discount rate is used in a multi-period DCF to convert projected future cash flows to present value. Capitalization rate is used in the capitalization of earnings method and equals the discount rate minus the long-term sustainable growth rate. Cap rate = DR - g. If DR = 18% and g = 3%, then cap rate = 15%.",
      difficulty: "intermediate", audience: "analyst",
    },
    {
      question: "When is the income approach more reliable than the market approach?",
      answerScaffold: "The income approach is more reliable when: (1) the subject has a strong earnings history and predictable cash flows; (2) there are few or no comparable public companies or transactions; (3) the business has significant intangible value not reflected in asset-based methods. The market approach is preferred when there are robust, truly comparable public companies or recent arm's length transactions.",
      difficulty: "intermediate", audience: "analyst",
    },
    {
      question: "What are the Mandelbaum factors used for?",
      answerScaffold: "The Mandelbaum factors (from Mandelbaum v. Commissioner, T.C. Memo 1995-255) are used to quantify the DLOM for closely held stock. The 9 factors include: (1) private vs. public sales of subject stock, (2) financial statement access, (3) dividend policy, (4) nature of company/history, (5) management/key person risk, (6) redemption policy, (7) cost of IPO, (8) amount of discount for blockage or transfer restrictions, (9) applicable pool of buyers. Courts use these factors to assess whether the selected DLOM is reasonable.",
      difficulty: "advanced", audience: "analyst",
    },
    {
      question: "What is the build-up method for developing a discount rate?",
      answerScaffold: "The build-up method derives the equity discount rate by adding risk premiums to a risk-free rate: Risk-Free Rate + Equity Risk Premium + Size Premium + Company-Specific Risk Premium (CSRP). The risk-free rate is the 20-year Treasury yield. ERP is from Duff & Phelps or Damodaran. The size premium comes from the CRSP/D&P study. CSRP captures unique risks not captured by the other components (customer concentration, key person, single product, etc.).",
      difficulty: "intermediate", audience: "analyst",
    },
    {
      question: "What is DLOM and why is it applied?",
      answerScaffold: "DLOM (Discount for Lack of Marketability) is applied to reflect the fact that a non-marketable interest cannot be quickly and easily converted to cash. Publicly traded stocks are the benchmark — they are freely tradeable, so private company interests are worth less. Empirical support comes from restricted stock studies (shares subject to Rule 144 resale restrictions) and pre-IPO studies. DLOM is typically 15-35% depending on company-specific factors.",
      difficulty: "beginner", audience: "analyst",
    },
    {
      question: "What does 'normalizing' financial statements mean in business valuation?",
      answerScaffold: "Normalization adjustments restate the historical financial statements of a closely held business to reflect the earnings a hypothetical arm's-length buyer would expect. Key adjustments: (1) Owner compensation to market rate — not zero; (2) Non-recurring items removed (lawsuits, one-time sales); (3) Personal expenses through the business removed; (4) Related-party rents adjusted to market; (5) Accounting method differences (LIFO/FIFO, accelerated depreciation).",
      difficulty: "beginner", audience: "analyst",
    },
    {
      question: "What is the difference between FMV, Fair Value, and Investment Value?",
      answerScaffold: "Fair Market Value (FMV): Price between a hypothetical willing buyer and seller, both with reasonable knowledge, no compulsion. Used for tax, ESOP, and most business valuation purposes. | Fair Value: A statutory standard used in shareholder dissent/oppression litigation and financial reporting (ASC 820). Differs from FMV — may not allow minority/marketability discounts. | Investment Value: Value to a specific investor based on their unique circumstances, synergies, or required return. Different from FMV which uses a hypothetical market standard.",
      difficulty: "intermediate", audience: "analyst",
    },
    {
      question: "Why does the terminal value represent such a large portion of DCF value?",
      answerScaffold: "The terminal value captures all cash flows beyond the explicit projection period. For most stable businesses, the terminal value represents 60-80% of total DCF value. This is because: (1) cash flows extend indefinitely into the future; (2) the Gordon Growth Model captures a perpetuity; (3) the discount rate shrinks near-term cash flows more than terminal value. This is why the terminal growth rate assumption is the highest-sensitivity input in a DCF.",
      difficulty: "intermediate", audience: "analyst",
    },
    {
      question: "What evidence is required for the market approach – guideline transaction method?",
      answerScaffold: "Required evidence: (1) Transaction databases — Done Deals (BVR), PitchBook, Capital IQ Transactions, Mergerstat; (2) Documentation of search criteria (SIC code, revenue range, date range, industry); (3) Documentation of why eliminated companies were excluded; (4) Source of financial data (press releases, SEC 8-K filings for public targets); (5) Documentation of whether the transaction was asset or stock sale; (6) Note on whether purchase price included earnouts or contingent consideration.",
      difficulty: "intermediate", audience: "analyst",
    },
    {
      question: "How do liquidation preferences affect 409A common stock value?",
      answerScaffold: "In a startup's capital structure, preferred stockholders receive their liquidation preference before common stockholders receive anything. If total enterprise value is less than the total liquidation preference, common stock could be worth $0. The Option Pricing Method (OPM) models this by treating equity as a series of call options at different strike prices (breakpoints). The difference between adjacent breakpoints determines what value accrues to each class. This is why startups often have a significant 'common stock discount' versus the latest preferred round price.",
      difficulty: "advanced", audience: "analyst",
    },
  ];

  for (const qa of qaItems) {
    const qaid = nanoid();
    await db.run(
      `INSERT OR IGNORE INTO qa_items
       (id, workspace_id, question, answer_scaffold, difficulty, audience, review_status, is_seed, is_readonly, clonable, created_at, updated_at, created_by)
       VALUES (?, 'ws_default', ?, ?, ?, ?, 'approved', 1, 1, 1, ?, ?, 'system')`,
      [qaid, qa.question, qa.answerScaffold, qa.difficulty, qa.audience, ts, ts]
    );
  }

  // ── Lessons Learned ───────────────────────────────────────────────────────────
  const lessons = [
    {
      title: "Always Verify Owner Compensation Against a Published Source",
      lesson: "Never assume owner compensation is 'reasonable' without comparing it to a published salary study. A $400K salary for a $2M revenue business is likely inflated and will be challenged.",
      context: "Income approach — normalization",
      futureChecklistPrompt: "Have I obtained a compensation survey (BLS, RCM, PAS) and documented the market rate in the workpapers?",
      mistakeAvoided: "Failing to normalize owner compensation leads to understated normalized earnings and understated value.",
    },
    {
      title: "Terminal Value Sensitivity Must Always Be Shown",
      lesson: "Always run a sensitivity table showing how value changes with ±1% changes in the discount rate and terminal growth rate. This proves you understand the model's key drivers and builds credibility.",
      context: "Income approach — DCF",
      futureChecklistPrompt: "Have I included a sensitivity table for discount rate and terminal growth rate in the workpapers and/or report?",
      mistakeAvoided: "Reviewers and opposing experts always run sensitivity — showing it proactively demonstrates analytical rigor.",
    },
    {
      title: "Document Why You Excluded an Approach",
      lesson: "If you exclude the asset approach from an operating company valuation, document the reason explicitly. 'Not appropriate for a going-concern service business' is not sufficient — explain why asset value is less than going-concern value.",
      context: "Approach selection — reconciliation",
      futureChecklistPrompt: "Does my report contain a specific, reasoned explanation for each approach that was excluded or given zero weight?",
      mistakeAvoided: "IRS challenges and opposing experts focus on unexplained exclusions as evidence of cherry-picking.",
    },
    {
      title: "Check the Risk-Free Rate Source on Every Engagement",
      lesson: "The 20-year Treasury yield changes daily. Always pull the H.15 release from the Federal Reserve on or close to the effective date of value — do not use a 'standard' rate from a prior engagement.",
      context: "Discount rate development — WACC / build-up",
      futureChecklistPrompt: "Have I pulled the Federal Reserve H.15 release for the 20-year CMT yield on or near the valuation date and saved it in the workpapers?",
      mistakeAvoided: "Using a stale risk-free rate from a prior engagement can under- or over-state the discount rate by 50-100+ basis points.",
    },
    {
      title: "Reconcile Your GPC Multiples to the Subject's Financial Profile",
      lesson: "When selecting multiples from guideline public companies, always document how the subject compares to the guideline set on key metrics (margin, size, growth). If the subject is significantly smaller, explain why you're using the median vs. a lower quartile multiple.",
      context: "Market approach — GPC",
      futureChecklistPrompt: "Have I explicitly compared the subject company's key metrics to the guideline set and justified the selected multiple within that range?",
      mistakeAvoided: "Selecting the median without discussion of company-specific differences invites challenge from opposing counsel.",
    },
    {
      title: "Identify All Off-Balance-Sheet Liabilities in the Asset Approach",
      lesson: "In asset approach valuations, always ask management about contingent liabilities, environmental obligations, pending litigation, and operating lease obligations not on the balance sheet. These reduce FMV.",
      context: "Asset approach — NAV",
      futureChecklistPrompt: "Did I include a representation letter or management Q&A documenting off-balance-sheet liabilities?",
      mistakeAvoided: "Understating liabilities overstates asset value and exposes the firm to professional liability if a hidden obligation materializes.",
    },
    {
      title: "In ESOP Valuations, Document Your Independence Every Year",
      lesson: "ESOP trustees rely on an 'independent appraiser.' Any financial relationship with the plan, the company, or the selling shareholders must be disclosed or eliminated. Renew your independence analysis annually.",
      context: "ESOP — engagement setup",
      futureChecklistPrompt: "Have I completed an independence checklist for this ESOP engagement and documented it in the workpaper file?",
      mistakeAvoided: "DOL investigations of ESOP valuations focus heavily on appraiser independence. Undisclosed conflicts are career-ending.",
    },
  ];

  for (const l of lessons) {
    const lid = nanoid();
    await db.run(
      `INSERT OR IGNORE INTO lessons_learned
       (id, workspace_id, title, lesson, context, future_checklist_prompt, mistake_avoided, review_status, is_seed, is_readonly, clonable, created_at, updated_at, created_by)
       VALUES (?, 'ws_default', ?, ?, ?, ?, ?, 'approved', 1, 1, 1, ?, ?, 'system')`,
      [lid, l.title, l.lesson, l.context, l.futureChecklistPrompt, l.mistakeAvoided, ts, ts]
    );
  }

  // ── Dordt GSU 2025 Reference Case ─────────────────────────────────────────────
  const dordtExists = await db.query("SELECT id FROM reference_cases WHERE case_id = 'dordt_gsu_2025'");
  if (dordtExists.rows.length === 0) {
    const rcId = nanoid();
    await db.run(
      `INSERT INTO reference_cases (id, case_id, title, description, source_label, is_seed, is_readonly, clonable, created_at, updated_at)
       VALUES (?, 'dordt_gsu_2025', ?, ?, ?, 1, 1, 0, ?, ?)`,
      [rcId,
       "Dordt University — Grossenburg Surveying & Design (GSU 2025)",
       "Business valuation of Grossenburg Surveying & Design, a regional civil engineering and surveying firm. Prepared for the Dordt University Business Valuation Report (BVR) Competition, 2025. Applies income, market, and asset approaches under Fair Market Value standard.",
       "Dordt University BVR Competition 2025",
       ts, ts]
    );

    // Artifacts
    const artifacts = [
      {
        artifactType: "playbook_note",
        title: "Engagement Overview — GSU 2025",
        body: `# Grossenburg Surveying & Design — Engagement Overview

## Company Description
Grossenburg Surveying & Design (GSU) is a regional civil engineering and land surveying firm operating in the Upper Midwest. The company provides surveying, site design, and civil engineering services primarily to municipal, agricultural, and commercial clients.

## Standard of Value
Fair Market Value — "the price at which property would change hands between a willing buyer and a willing seller, neither being under any compulsion to buy or sell, and both having reasonable knowledge of the relevant facts." (Rev. Rul. 59-60)

## Premise of Value
Going concern

## Interest Valued
100% controlling interest (equity value)

## Effective Date
December 31, 2024

## Approaches Applied
1. Income Approach — Capitalization of Earnings method
2. Market Approach — Guideline Transaction method (Done Deals)
3. Asset Approach — Adjusted Net Asset Value (corroborative)

## Key Engagement Facts
- Revenue: ~$3.2M LTM
- EBITDA Margin: ~28% (pre-normalization)
- Owner-operator is nearing retirement; key man risk is significant
- Two senior engineers are capable of transitioning into leadership
- No long-term debt; strong balance sheet
- Highly local customer base with some geographic concentration risk`,
        sourceNote: "Dordt University BVR Competition 2025 — case materials",
      },
      {
        artifactType: "normalization_schedule",
        title: "GSU 2025 — Normalization Adjustments",
        body: `# Normalization Adjustments — Grossenburg Surveying & Design
## For the Years Ended December 31, 2020–2024

| Adjustment | 2020 | 2021 | 2022 | 2023 | 2024 |
|---|---|---|---|---|---|
| Reported Revenue | $2,850K | $3,050K | $3,180K | $3,250K | $3,200K |
| **Reported EBITDA** | $720K | $810K | $870K | $920K | $900K |
| Owner comp adjustment (to market $180K) | +$45K | +$45K | +$45K | +$35K | +$35K |
| Personal vehicle expense | +$18K | +$18K | +$18K | +$18K | +$18K |
| Non-recurring legal settlement | — | — | +$42K | — | — |
| Related-party building rent (to market) | +$12K | +$12K | +$12K | +$12K | +$12K |
| **Normalized EBITDA** | **$795K** | **$885K** | **$987K** | **$985K** | **$965K** |
| Normalized EBITDA Margin | 27.9% | 29.0% | 31.0% | 30.3% | 30.2% |

**Notes:**
- Owner compensation adjusted to $180K/year per BLS OES SOC 17-1021 (Civil Engineers, Upper Midwest, median salary) plus reasonable benefits load
- Building is owned by owner's family LLC; rent adjusted to comparable commercial lease rates in the local market
- Legal settlement in 2022 relates to a boundary dispute that has been fully resolved — non-recurring`,
        sourceNote: "Constructed from competition case materials — illustrative",
      },
      {
        artifactType: "approach_summary",
        title: "GSU 2025 — Valuation Conclusion",
        body: `# Valuation Summary — Grossenburg Surveying & Design
## Fair Market Value as of December 31, 2024

### Income Approach — Capitalization of Earnings
- Normalized Earnings Base (weighted avg EBITDA): $964K
- Less: D&A: $(42K)
- Less: Capex: $(38K)
- Normalized Free Cash Flow: $884K
- Capitalization Rate: 18.5% (discount rate 22.5% minus growth 4.0%)
- Indicated Enterprise Value (Minority, Marketable): **$4,779K**

**Discount Rate Development:**
- Risk-Free Rate (20-yr Treasury, 12/31/24): 4.6%
- ERP (Duff & Phelps 2024): 5.5%
- Beta (Unlevered, Engineering Services): 0.92
- Size Premium (CRSP Decile 10): 5.8%
- CSRP (Key man risk, geographic concentration): 6.6%
- **Discount Rate: 22.5%**

### Market Approach — Guideline Transactions
- Database: Done Deals (BVR)
- SIC 8711 / 8713 — Engineering and Surveying
- Date range: 2019–2024
- Transactions reviewed: 23 | Selected: 8
- Selected EBITDA Multiple: 4.5x
- Applied to Normalized EBITDA ($964K): **$4,338K**

### Reconciliation
| Approach | Indicated Value | Weight |
|---|---|---|
| Income — Cap of Earnings | $4,779K | 60% |
| Market — GTC | $4,338K | 40% |
| **Weighted Indication** | **$4,605K** | |

### DLOM Application
- Selected DLOM: 22%
- Supported by restricted stock studies and Mandelbaum factor analysis
- **Post-DLOM Indication**: $3,592K

### Final Conclusion
**Fair Market Value (Controlling, Non-Marketable): $3,600,000**
(Rounded to nearest $100,000)`,
        sourceNote: "Constructed from competition case materials — illustrative",
      },
      {
        artifactType: "reviewer_qa",
        title: "GSU 2025 — Anticipated Reviewer Questions",
        body: `# Anticipated Reviewer Questions — GSU 2025

**Q: Why was the asset approach given zero weight?**
A: The asset approach was considered and corroborated the going-concern value is materially higher than adjusted net asset value (~$1.8M). As a professional services firm, GSU's value is substantially derived from its client relationships, reputation, and assembled workforce — intangibles not reflected in balance sheet assets. The income and market approaches better capture this going-concern value.

**Q: Is a 22% discount rate reasonable for an engineering firm?**
A: Yes, for a company of this size and profile. The 22.5% rate is composed of: 4.6% risk-free rate + 5.1% levered ERP + 5.8% size premium (CRSP decile 10, ~$3.5M enterprise value) + 6.6% CSRP (key man concentration in the owner, limited geographic diversification, client concentration with 3 clients representing 35% of revenue). Industry checks: engineering firm acquisitions in Done Deals reflected implied cap rates of 17-23% on SDE, consistent with our selected rate.

**Q: Why was a DLOM applied to a controlling interest?**
A: The 22% DLOM reflects the lack of ready market for a private company interest in a small professional services firm. While a controlling interest has superior marketability relative to a minority interest, no ready market exists for a $3.5M engineering firm — a sale requires finding a specific buyer willing to complete due diligence, financing the acquisition, and accepting key man transition risk. Restricted stock studies (median ~28%) and the Mandelbaum factors support a discount in the 20-25% range.

**Q: How was owner compensation market rate determined?**
A: BLS Occupational Employment Statistics, SOC Code 17-1021 (Civil Engineers), West North Central region, 75th percentile annual wage of approximately $145,000. Adding a management premium for CEO/principal responsibilities in a firm of this size brings the adjusted rate to $180,000, consistent with RCM Capital Markets data for small professional services firm operators in the Upper Midwest.`,
        sourceNote: "Constructed from competition case materials — illustrative",
      },
    ];

    for (const art of artifacts) {
      const artId = nanoid();
      await db.run(
        `INSERT INTO reference_case_artifacts
         (id, case_id, artifact_type, title, body, source_note, is_seed, is_readonly, clonable, review_status, created_at, updated_at)
         VALUES (?, 'dordt_gsu_2025', ?, ?, ?, ?, 1, 1, 0, 'approved', ?, ?)`,
        [artId, art.artifactType, art.title, art.body, art.sourceNote, ts, ts]
      );
    }
  }

  console.log("[init-db] Knowledge content seeded successfully");
}
