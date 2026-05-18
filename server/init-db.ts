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
    );

    CREATE TABLE IF NOT EXISTS decision_frameworks (
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
    );

    CREATE TABLE IF NOT EXISTS valuation_principles (
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
    );

    CREATE TABLE IF NOT EXISTS valuation_antipatterns (
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
    );

    CREATE TABLE IF NOT EXISTS reasoning_templates (
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
    );

    CREATE TABLE IF NOT EXISTS reference_cases (
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
    );

    CREATE TABLE IF NOT EXISTS reference_case_artifacts (
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
    );

    CREATE TABLE IF NOT EXISTS assumptions (
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
    );

    CREATE TABLE IF NOT EXISTS sources (
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
    );

    CREATE TABLE IF NOT EXISTS evidence_links (
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
    );

    CREATE TABLE IF NOT EXISTS external_model_references (
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
    );

    CREATE TABLE IF NOT EXISTS support_memos (
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
    );

    CREATE TABLE IF NOT EXISTS qa_items (
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
    );

    CREATE TABLE IF NOT EXISTS notes (
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
    );

    CREATE TABLE IF NOT EXISTS lessons_learned (
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
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      color TEXT,
      is_seed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tag_links (
      id TEXT PRIMARY KEY,
      tag_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      workspace_id TEXT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      actor_id TEXT,
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
      prompt_version TEXT,
      input_references TEXT,
      output_preview TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS files (
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
    );

    CREATE TABLE IF NOT EXISTS project_sections (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      section_type TEXT NOT NULL DEFAULT 'custom',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
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
    // projects
    ["projects", "created_by TEXT"],
    ["projects", "updated_by TEXT"],
    // methodology_playbooks — new schema columns
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
    // decision_frameworks — new schema columns
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
    // valuation_principles — new schema columns
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
    // valuation_antipatterns — new schema columns
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
    // reasoning_templates — new schema columns
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
    // reference_cases — new schema columns
    ["reference_cases", "description TEXT"],
    ["reference_cases", "source_label TEXT"],
    ["reference_cases", "is_seed INTEGER DEFAULT 0"],
    ["reference_cases", "is_readonly INTEGER DEFAULT 0"],
    ["reference_cases", "clonable INTEGER DEFAULT 0"],
    // reference_case_artifacts — new schema columns
    ["reference_case_artifacts", "body TEXT"],
    ["reference_case_artifacts", "source_note TEXT"],
    ["reference_case_artifacts", "artifact_metadata TEXT"],
    ["reference_case_artifacts", "is_seed INTEGER DEFAULT 0"],
    ["reference_case_artifacts", "is_readonly INTEGER DEFAULT 0"],
    ["reference_case_artifacts", "clonable INTEGER DEFAULT 1"],
    ["reference_case_artifacts", "review_status TEXT DEFAULT 'draft'"],
    ["reference_case_artifacts", "updated_at TEXT NOT NULL DEFAULT ''"],
    // assumptions — new schema columns
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
    // sources — new schema columns
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
    // evidence_links — new schema columns
    ["evidence_links", "target_entity_type TEXT NOT NULL DEFAULT ''"],
    ["evidence_links", "target_entity_id TEXT NOT NULL DEFAULT ''"],
    ["evidence_links", "support_type TEXT"],
    ["evidence_links", "relevance_note TEXT"],
    ["evidence_links", "strength_rating TEXT"],
    ["evidence_links", "page_section_reference TEXT"],
    ["evidence_links", "quote_or_paraphrase_note TEXT"],
    ["evidence_links", "created_by TEXT"],
    ["evidence_links", "updated_at TEXT NOT NULL DEFAULT ''"],
    // external_model_references — new schema columns
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
    // support_memos — new schema columns
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
    // qa_items — new schema columns
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
    // notes — new schema columns
    ["notes", "project_id TEXT"],
    ["notes", "entity_type TEXT"],
    ["notes", "entity_id TEXT"],
    ["notes", "visibility TEXT DEFAULT 'private'"],
    ["notes", "tags TEXT"],
    ["notes", "is_favorite INTEGER DEFAULT 0"],
    ["notes", "review_status TEXT DEFAULT 'draft'"],
    ["notes", "created_by TEXT"],
    // lessons_learned — new schema columns
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
    // tags — new schema columns
    ["tags", "slug TEXT NOT NULL DEFAULT ''"],
    ["tags", "is_seed INTEGER DEFAULT 0"],
    // tag_links — rename columns (add new, old ones ignored by Drizzle)
    ["tag_links", "entity_type TEXT NOT NULL DEFAULT ''"],
    ["tag_links", "entity_id TEXT NOT NULL DEFAULT ''"],
    // favorites — new schema columns
    ["favorites", "entity_type TEXT NOT NULL DEFAULT ''"],
    ["favorites", "entity_id TEXT NOT NULL DEFAULT ''"],
    // activity_log — rename actor column
    ["activity_log", "actor_id TEXT"],
    // ai_tasks — new schema columns
    ["ai_tasks", "prompt_version TEXT"],
    ["ai_tasks", "input_references TEXT"],
    ["ai_tasks", "output_preview TEXT"],
    // files — new schema columns
    ["files", "title TEXT NOT NULL DEFAULT ''"],
    ["files", "file_name TEXT NOT NULL DEFAULT ''"],
    ["files", "storage_mode TEXT"],
    ["files", "url_or_path TEXT"],
    ["files", "notes TEXT"],
    ["files", "created_by TEXT"],
    // project_report_sections
    ["project_report_sections", "created_by TEXT"],
    ["project_report_sections", "updated_by TEXT"],
    ["project_report_sections", "linked_file_ids TEXT"],
    ["project_report_sections", "review_status TEXT DEFAULT 'draft'"],
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
