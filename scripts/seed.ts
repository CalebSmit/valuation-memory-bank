/**
 * Valuation Memory Bank — Seed Script
 *
 * Seeds generic global methodology content and the Dordt GSU 2025 reference case.
 * Dordt is seeded ONLY as Reference Case #1 (case_id = dordt_gsu_2025).
 * Dordt is NOT created as a project, workspace default, or dashboard metric.
 *
 * Run: tsx scripts/seed.ts
 * This script is idempotent — it checks existing records before inserting.
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import {
  users, workspaces, workspaceMemberships,
  methodologyPlaybooks, decisionFrameworks, valuationPrinciples,
  valuationAntipatterns, reasoningTemplates,
  referenceCases, referenceCaseArtifacts,
  qaItems, sources, tags,
} from "../shared/schema";
import { eq } from "drizzle-orm";

import { existsSync } from "node:fs";
import { join } from "node:path";
const dbPath = existsSync("/data") ? join("/data", "local.db") : (process.env.DATABASE_PATH ?? "local.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite);

function now() { return new Date().toISOString(); }
function id() { return nanoid(); }

async function seed() {
  console.log("🌱 Starting Valuation Memory Bank seed...");

  // ─── Ensure tables exist (run migrations first) ───────────────────────────
  // Create all tables if they don't exist
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
      review_status TEXT NOT NULL DEFAULT 'draft',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      review_status TEXT NOT NULL DEFAULT 'draft',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      body TEXT NOT NULL,
      rationale TEXT,
      related_playbooks TEXT,
      related_antipatterns TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      description TEXT NOT NULL,
      why_it_matters TEXT,
      warning_signs TEXT,
      how_to_fix TEXT,
      related_playbooks TEXT,
      related_principles TEXT,
      related_templates TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      prompt_scaffold TEXT NOT NULL,
      required_supporting_inputs TEXT,
      optional_supporting_inputs TEXT,
      example_output TEXT,
      related_playbooks TEXT,
      related_frameworks TEXT,
      related_principles TEXT,
      ai_drafting_allowed INTEGER NOT NULL DEFAULT 0,
      review_status TEXT NOT NULL DEFAULT 'draft',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      is_seed INTEGER NOT NULL DEFAULT 1,
      is_readonly INTEGER NOT NULL DEFAULT 1,
      clonable INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reference_case_artifacts (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      artifact_type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      source_note TEXT,
      artifact_metadata TEXT,
      is_seed INTEGER NOT NULL DEFAULT 1,
      is_readonly INTEGER NOT NULL DEFAULT 1,
      clonable INTEGER NOT NULL DEFAULT 1,
      review_status TEXT NOT NULL DEFAULT 'approved',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS assumptions (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      name TEXT NOT NULL,
      category TEXT,
      stated_assumption_text TEXT NOT NULL,
      context TEXT,
      external_model_reference TEXT,
      method_area TEXT,
      rationale TEXT,
      source_links TEXT,
      evidence_strength TEXT NOT NULL DEFAULT 'moderate',
      review_status TEXT NOT NULL DEFAULT 'draft',
      tags TEXT,
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      source_type TEXT NOT NULL DEFAULT 'other',
      publication_date TEXT,
      valuation_date_relevance_note TEXT,
      url_or_file_reference TEXT,
      citation_text TEXT,
      reliability_assessment TEXT,
      notes TEXT,
      tags TEXT,
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      support_type TEXT NOT NULL DEFAULT 'direct_support',
      relevance_note TEXT,
      strength_rating TEXT NOT NULL DEFAULT 'moderate',
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
      model_type TEXT NOT NULL,
      tool_used TEXT NOT NULL DEFAULT '',
      file_or_url_reference TEXT,
      version_label TEXT,
      prepared_by TEXT,
      prepared_date TEXT,
      notes TEXT,
      linked_assumptions TEXT,
      linked_sources TEXT,
      linked_reasoning_templates TEXT,
      linked_qa_items TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    );
    CREATE TABLE IF NOT EXISTS support_memos (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      memo_type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      linked_playbook_id TEXT,
      linked_framework_id TEXT,
      linked_template_id TEXT,
      linked_assumptions TEXT,
      linked_sources TEXT,
      linked_external_model_reference TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      tags TEXT,
      case_id TEXT,
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    );
    CREATE TABLE IF NOT EXISTS qa_items (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
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
      difficulty TEXT NOT NULL DEFAULT 'medium',
      audience TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      tags TEXT,
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
      cloned_from_type TEXT,
      cloned_from_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    );
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      visibility TEXT NOT NULL DEFAULT 'workspace',
      tags TEXT,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    );
    CREATE TABLE IF NOT EXISTS lessons_learned (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      project_id TEXT,
      case_id TEXT,
      title TEXT NOT NULL,
      lesson TEXT NOT NULL,
      context TEXT,
      mistake_avoided TEXT,
      future_checklist_prompt TEXT,
      related_antipattern TEXT,
      related_principle TEXT,
      related_project TEXT,
      related_reference_case TEXT,
      tags TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      is_seed INTEGER NOT NULL DEFAULT 0,
      is_readonly INTEGER NOT NULL DEFAULT 0,
      clonable INTEGER NOT NULL DEFAULT 1,
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
      is_seed INTEGER NOT NULL DEFAULT 0,
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
      status TEXT NOT NULL DEFAULT 'placeholder',
      prompt_version TEXT,
      input_references TEXT,
      output_preview TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      file_name TEXT,
      file_type TEXT,
      storage_mode TEXT NOT NULL DEFAULT 'metadata_only',
      url_or_path TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT
    );
  `);

  // ─── Demo User ─────────────────────────────────────────────────────────────
  const existingUser = db.select().from(users).where(eq(users.id, "user_demo")).get();
  if (!existingUser) {
    db.insert(users).values({ id: "user_demo", email: "demo@valuation-memory-bank.local", name: "Demo Analyst", role: "analyst", createdAt: now(), updatedAt: now() }).run();
    console.log("  ✓ Demo user created");
  }

  // ─── Default Workspace ─────────────────────────────────────────────────────
  const existingWs = db.select().from(workspaces).where(eq(workspaces.id, "ws_default")).get();
  if (!existingWs) {
    db.insert(workspaces).values({ id: "ws_default", name: "My Workspace", description: "Default workspace for valuation knowledge", defaultCurrencyLabel: "USD", firmOrTeamLabel: null, createdAt: now(), updatedAt: now() }).run();
    db.insert(workspaceMemberships).values({ id: id(), workspaceId: "ws_default", userId: "user_demo", role: "owner", createdAt: now() }).run();
    console.log("  ✓ Default workspace created");
  }

  // ─── Seed Tags ─────────────────────────────────────────────────────────────
  const seedTags = [
    { slug: "income-approach", name: "income-approach", color: "#3b82f6" },
    { slug: "market-approach", name: "market-approach", color: "#10b981" },
    { slug: "asset-approach", name: "asset-approach", color: "#f59e0b" },
    { slug: "wacc-support", name: "wacc-support", color: "#6366f1" },
    { slug: "revenue-forecast", name: "revenue-forecast", color: "#06b6d4" },
    { slug: "normalization", name: "normalization", color: "#8b5cf6" },
    { slug: "dlom-support", name: "dlom-support", color: "#ec4899" },
    { slug: "level-of-value", name: "level-of-value", color: "#f97316" },
    { slug: "method-weighting", name: "method-weighting", color: "#84cc16" },
    { slug: "final-narrative", name: "final-narrative", color: "#64748b" },
    { slug: "reviewer-defense", name: "reviewer-defense", color: "#dc2626" },
    { slug: "source-support", name: "source-support", color: "#059669" },
    { slug: "anti-pattern", name: "anti-pattern", color: "#b45309" },
    { slug: "reference-example", name: "reference-example", color: "#7c3aed" },
    { slug: "case-dordt-gsu-2025", name: "case_id:dordt_gsu_2025", color: "#1d4ed8" },
  ];
  for (const tag of seedTags) {
    const existing = db.select().from(tags).where(eq(tags.slug, tag.slug)).get();
    if (!existing) {
      db.insert(tags).values({ id: id(), workspaceId: null, name: tag.name, slug: tag.slug, color: tag.color, isSeed: true, createdAt: now() }).run();
    }
  }
  console.log("  ✓ Seed tags created");

  // ─── Seed Methodology Playbooks ────────────────────────────────────────────
  const playbookDefs = [
    {
      slug: "income-approach-knowledge",
      title: "Income Approach Knowledge Page",
      purpose: "Store methodology notes, evidence requirements, reviewer prompts, and report-language guidance for externally prepared income approach work. This page helps analysts document the reasoning supporting an income approach applied in an external model — not calculate it.",
      whenToUse: "When the subject company has a history of positive cash flows, reliable financial projections, and when future economic benefits drive value. Appropriate for operating businesses where a discounted cash flow or capitalization of earnings model is used externally.",
      whenNotToUse: "When the business has unpredictable or no meaningful cash flows, when there is insufficient basis for projections, or when the company is valued primarily on asset liquidation. Also not appropriate as a standalone method for holding companies without operating activities.",
      keyConcepts: "Income approach methods include discounted cash flow (DCF) and capitalization of earnings or cash flow. DCF requires explicit period projections and a terminal value. Capitalization uses a single representative period divided by a rate reflecting long-term growth and risk. Key support areas: revenue forecast support, normalization adjustments, discount or capitalization rate support, terminal value support.",
      requiredEvidence: "- Historical financial statements (3–5 years minimum)\n- Management projections or analyst-developed forecasts\n- Industry growth data relevant to projection period\n- Rate of return support (build-up or WACC source documentation)\n- Terminal growth rate support\n- Normalization adjustment documentation",
      commonSources: "Audited financial statements, tax returns, management projections, industry reports, IBISWorld, Dun & Bradstreet, economic outlook reports, cost of capital resources (Duff & Phelps, Damodaran), Federal Reserve data",
      reviewerQuestions: "1. How did you support the revenue forecast?\n2. What evidence supports the discount rate selection?\n3. How was the terminal value developed and supported?\n4. What normalization adjustments were made and why?\n5. How did you assess management projection reasonableness?\n6. What would cause the value to be materially different?",
      commonMistakes: "Relying on management projections without independent reasonableness assessment. Failing to document how the discount rate was selected. Using terminal growth rates not anchored to long-term economic evidence. Ignoring capital expenditure and working capital requirements.",
      reportLanguageExamples: "The income approach was applied using a discounted cash flow method implemented in an external Excel workbook. Revenue forecasts were based on [source]. The analyst assessed management projections by [method]. Terminal value was estimated using a [Gordon Growth/Exit Multiple] approach with a terminal growth rate of [X%], supported by [evidence].",
    },
    {
      slug: "dcf-methodology-support",
      title: "DCF Methodology Support Playbook",
      purpose: "Help analysts document the reasoning, sources, and reviewer defense supporting a DCF analysis performed in an external workbook. This playbook stores support — not calculations.",
      whenToUse: "When a DCF is the primary or contributing income approach method and the analyst needs to document the support behind the forecast, discount rate, and terminal value assumptions.",
      whenNotToUse: "When no DCF has been prepared, or when the app is expected to calculate a DCF. Calculations are performed in Excel or another external tool.",
      keyConcepts: "DCF support involves documenting: free cash flow projections (prepared externally), discount rate derivation (WACC or build-up), terminal value methodology, and projection period selection rationale.",
      requiredEvidence: "Historical financials for trend analysis, management projections for reasonableness comparison, industry growth benchmarks, cost of capital inputs and sources",
      reviewerQuestions: "1. How many projection years were used and why?\n2. What is the basis for the terminal growth rate?\n3. How was the discount rate determined?\n4. What sensitivity checks were performed externally?\n5. How did management projections compare to historical performance?",
      commonMistakes: "Not documenting the rationale for the projection period. Accepting management projections without cross-checking historical trends. Applying terminal growth rates above long-term GDP without documented support.",
      reportLanguageExamples: "The DCF analysis was prepared in [Excel workbook / firm model]. Free cash flows were projected for [X] years based on [rationale]. The terminal value was estimated using [approach]. The discount rate applied was [X%], derived using [method and sources referenced in the WACC support memo].",
    },
    {
      slug: "wacc-buildup-support",
      title: "WACC / Build-Up Method Support Playbook",
      purpose: "Store guidance, sources, rationale templates, and reviewer prompts for supporting a WACC or build-up rate selected in an external model. This playbook does not calculate WACC.",
      whenToUse: "When an analyst needs to document and defend the cost of equity or WACC used in an externally prepared income approach model.",
      whenNotToUse: "When no rate of return analysis has been performed, or when the app is expected to calculate the rate. Rate derivation is performed in Excel or another external tool.",
      keyConcepts: "WACC components: cost of equity (CAPM or build-up), cost of debt (after-tax), capital structure weights. Build-up components: risk-free rate, equity risk premium, size premium, company-specific risk premium. All components should have source support.",
      requiredEvidence: "Risk-free rate source (typically U.S. Treasury spot or normalized), equity risk premium source (Duff & Phelps, Damodaran), size premium source, beta source, company-specific risk documentation, capital structure support",
      reviewerQuestions: "1. What source did you use for the risk-free rate and why is it appropriate as of the valuation date?\n2. How did you select the equity risk premium?\n3. What was the basis for the company-specific risk premium?\n4. How did you determine the capital structure?\n5. Is the WACC consistent with the level of value (invested capital vs. equity)?",
      commonMistakes: "Listing WACC components without explaining why each was selected. Using historical rates without checking valuation-date relevance. Not distinguishing invested capital WACC from equity WACC. Applying company-specific risk adjustments without documented basis.",
      reportLanguageExamples: "The weighted average cost of capital was estimated in [external workbook] using a build-up method. The risk-free rate of [X%] was sourced from [source] as of [date]. The equity risk premium of [X%] was sourced from [source]. A company-specific risk premium of [X%] was applied based on [factors documented in the WACC support memo].",
    },
    {
      slug: "revenue-forecast-support",
      title: "Revenue Forecast Support Playbook",
      purpose: "Help analysts document the reasoning behind revenue projections used in external models. This playbook stores support for forecast assumptions — not the forecast itself.",
      whenToUse: "When an analyst needs to document sources, historical trends, and reasonableness analysis supporting revenue projections applied in an external DCF or capitalization model.",
      whenNotToUse: "When the app is expected to generate forecast schedules. Forecasting is performed externally.",
      keyConcepts: "Revenue forecast support involves: historical trend analysis, management projection assessment, industry growth benchmarking, customer concentration review, pricing/volume components, and growth rate reasonableness.",
      requiredEvidence: "3–5 years of historical revenue by segment (if available), management forecast or budget, industry growth reports, customer concentration schedule, any planned pricing or volume changes",
      reviewerQuestions: "1. How does the projected revenue compare to historical performance?\n2. What specific industry evidence supports the growth rate?\n3. How did you assess management projection reasonableness?\n4. What customer concentration or revenue concentration risks exist?\n5. How did you distinguish pricing growth from volume growth?",
      commonMistakes: "Using management projections as given without comparison to historical trends. Applying industry growth rates without discussing company-specific factors. Ignoring customer concentration when documenting revenue support.",
      reportLanguageExamples: "Revenue was projected at [X%] growth in Year 1, declining to [X%] by Year [N]. This rate was supported by [historical trend analysis / industry reports]. Management projections were reviewed for reasonableness against [historical performance / industry benchmarks].",
    },
    {
      slug: "normalization-adjustment-support",
      title: "Normalization Adjustment Support Playbook",
      purpose: "Help analysts document the rationale and source support for normalization adjustments applied in external financial models.",
      whenToUse: "When the analyst has applied normalization adjustments to historical financials and needs to document the reasoning, evidence, and reviewer defense.",
      whenNotToUse: "When no normalization adjustments have been made.",
      keyConcepts: "Common normalization categories: owner compensation adjustments, related-party transactions, non-recurring items, above/below-market rent, discretionary expenses, one-time revenue. Each adjustment should have documented rationale and, where possible, market or industry support.",
      requiredEvidence: "Documentation of the non-recurring or non-market item, market support for normalizing adjustments (e.g., comparable compensation benchmarks), management interview notes, company financial statements",
      reviewerQuestions: "1. What was the basis for the owner compensation adjustment?\n2. Is the related-party rent adjustment supported by market comparables?\n3. How did you determine that the excluded item was truly non-recurring?\n4. What was the total impact of all adjustments on normalized income?",
      commonMistakes: "Making adjustments without documenting the specific non-recurring or non-market basis. Applying compensation adjustments without market support. Mixing normalizations with D&A adjustments without clear labeling.",
      reportLanguageExamples: "Normalization adjustments were made to reflect operations under hypothetical market conditions. Owner compensation was adjusted to [amount] based on [market data source]. The [expense item] was excluded as a non-recurring item because [rationale].",
    },
    {
      slug: "market-approach-selection",
      title: "Market Approach Selection Playbook",
      purpose: "Help analysts document how and why market approach evidence was or was not used. This playbook supports the selection decision — not the calculations.",
      whenToUse: "When an analyst needs to document the decision to apply (or not apply) guideline public company or guideline transaction methods.",
      whenNotToUse: "When the app is expected to calculate market multiples or selected values. Calculations are performed externally.",
      keyConcepts: "Market approach methods: guideline public company method (GPCM), guideline transaction method (GTM). Key considerations: comparability, data availability, level of value (control vs. minority), transaction date relevance, financial metric availability.",
      requiredEvidence: "Transaction databases (BizBuySell, DealStats, Capital IQ, etc.), public company financial data, comparability analysis documentation, screening criteria and exclusion rationale",
      reviewerQuestions: "1. What screening criteria were used to identify guideline companies or transactions?\n2. Why were certain companies or transactions excluded?\n3. How did you address the level-of-value implications of the selected market evidence?\n4. How did you assess comparability between the subject and guideline companies?",
      commonMistakes: "Selecting market evidence without a documented comparability discussion. Ignoring level-of-value differences between market evidence and subject interest. Using outdated transaction data without relevance adjustment.",
      reportLanguageExamples: "The market approach was considered. [Guideline public company / guideline transaction] evidence was reviewed. [X] companies/transactions were identified. After screening for [criteria], [Y] were selected. Excluded companies/transactions were disregarded because [rationale].",
    },
    {
      slug: "guideline-public-company-screening",
      title: "Guideline Public Company Screening Playbook",
      purpose: "Help analysts document the comparability analysis for guideline public companies used in externally prepared market approach models.",
      whenToUse: "When the GPCM is used or considered and the analyst needs to document the screening and selection process.",
      whenNotToUse: "When no GPC analysis is involved.",
      keyConcepts: "Comparability factors: industry SIC/NAICS codes, revenue size, profitability, geographic market, product/service similarity, growth profile, capital structure. Selection should be documented with exclusion rationale.",
      requiredEvidence: "Public company databases, SEC filings, industry descriptions, financial metrics for comparability analysis",
      reviewerQuestions: "1. How were guideline public companies identified?\n2. What comparability factors were assessed?\n3. Why were certain companies excluded?\n4. How were level-of-value (minority vs. control) implications addressed?",
      commonMistakes: "Using companies without explaining why they are comparable. Including companies with materially different business profiles. Failing to address the level-of-value implications of public company trading multiples.",
      reportLanguageExamples: "Guideline public companies were identified using [database/source]. [X] initial candidates were reviewed. Companies with [exclusion criteria] were eliminated. The remaining [Y] companies were determined to be reasonably comparable based on [factors].",
    },
    {
      slug: "guideline-transaction-screening",
      title: "Guideline Transaction Screening Playbook",
      purpose: "Help analysts document the comparability and exclusion analysis for guideline transactions used in externally prepared market approach models.",
      whenToUse: "When the GTM is used or considered.",
      whenNotToUse: "When no guideline transaction analysis is involved.",
      keyConcepts: "Transaction screening checklist: industry similarity, size similarity, date relevance, transaction structure, buyer type, financial metric availability, outlier considerations, level-of-value implications, source reliability.",
      requiredEvidence: "Transaction databases (DealStats, Capital IQ, BizBuySell, etc.), transaction detail records, date of transactions relative to valuation date",
      reviewerQuestions: "1. What databases or sources were used to identify transactions?\n2. How was transaction date relevance assessed?\n3. Were any transactions excluded due to unusual structures or outlier multiples?\n4. How were level-of-value implications addressed?",
      commonMistakes: "Including transactions without documenting comparability. Ignoring date relevance for older transactions. Using database multiples without verifying the underlying financial metrics.",
      reportLanguageExamples: "Guideline transactions were identified from [sources]. The search was conducted for [industry codes] transactions over [time period]. [X] transactions were reviewed. [Y] were selected as reasonably comparable based on [criteria]. The following were excluded: [exclusion reasons].",
    },
    {
      slug: "asset-approach-role",
      title: "Asset Approach Role Playbook",
      purpose: "Help analysts explain the role, applicability, or inapplicability of the asset approach in a valuation.",
      whenToUse: "When the analyst needs to document why the asset approach was used as a primary, secondary, or floor method — or why it was not relied upon.",
      whenNotToUse: "When the app is expected to calculate adjusted book values. Asset approach calculations are performed externally.",
      keyConcepts: "The asset approach values a business by adjusting assets and liabilities to fair market value. It is typically appropriate for holding companies, investment entities, and situations where asset value drives total value. It may serve as a floor reference or reasonableness check for operating businesses.",
      requiredEvidence: "Balance sheet as of or near valuation date, asset-specific appraisals or market data for significant assets, liability documentation",
      reviewerQuestions: "1. Why was the asset approach included/excluded?\n2. If excluded, is the company truly a going concern where income approach drives value?\n3. If used as a floor, why is the asset approach considered a meaningful reference?\n4. Were all material assets and liabilities identified?",
      commonMistakes: "Dismissing the asset approach without explanation for operating businesses. Applying an asset approach to a high-growth company without acknowledging the limitations. Failing to identify significant intangible assets when using asset approach.",
      reportLanguageExamples: "The asset approach was considered. Given the company's [going-concern / asset-intensive] nature, the asset approach was [relied upon as primary / used as a reference / not relied upon as meaningful] because [rationale].",
    },
    {
      slug: "dlom-support-narrative",
      title: "DLOM Support Narrative Playbook",
      purpose: "Help analysts draft support around a discount for lack of marketability (DLOM) selected outside the app. This playbook does not calculate a DLOM.",
      whenToUse: "When a DLOM was applied to a nonmarketable interest and the analyst needs to document the evidence and reasoning supporting the selected discount.",
      whenNotToUse: "When the app is expected to select or calculate a DLOM. DLOM selection and calculation are performed externally.",
      keyConcepts: "DLOM support should connect subject interest characteristics to empirical evidence. Key factors: holding period, distribution yield, redemption rights, put/call provisions, block size, financial profile, and available empirical studies.",
      requiredEvidence: "Empirical studies (restricted stock studies, pre-IPO studies), subject company financial data, operating agreement or shareholder agreement terms, industry context",
      reviewerQuestions: "1. What empirical studies were considered?\n2. How do the subject company's characteristics compare to the empirical study range?\n3. What qualitative factors support adjusting above or below the empirical central tendency?\n4. How was the level-of-value starting point determined before applying DLOM?",
      commonMistakes: "Using generic DLOM language without connecting the subject interest characteristics to the empirical evidence. Applying a DLOM without documenting the level-of-value starting point. Ignoring equity coverage, distribution history, or redemption provisions.",
      reportLanguageExamples: "A discount for lack of marketability was applied to the [interest type] interest. The selected DLOM of [X%] was derived by the analyst in the [external workbook] and is supported by [empirical study references] and the following subject-specific factors: [factors]. See the DLOM support memo for the full narrative.",
    },
    {
      slug: "level-of-value-explanation",
      title: "Level-of-Value Explanation Playbook",
      purpose: "Help analysts explain control, minority, marketable, and nonmarketable levels of value — and document how the correct level was applied.",
      whenToUse: "When the analyst needs to document the level-of-value framework applied in an engagement.",
      whenNotToUse: "When the app is expected to calculate discounts or premiums. Discount/premium calculations are performed externally.",
      keyConcepts: "Levels of value: control/marketable (acquisition price), minority/marketable (publicly traded price), minority/nonmarketable (private minority interest). Control premium and DLOM move value up and down the chart. Method consistency: DCF and asset approach yield control-level indication; GPCM trading multiples yield minority-level indication.",
      requiredEvidence: "Operating agreement or shareholder agreement, description of subject interest (ownership percentage, control rights), engagement scope",
      reviewerQuestions: "1. What is the subject interest?\n2. Does the subject interest carry control rights?\n3. Are the methods applied consistent with the level-of-value framework?\n4. How were any discounts or premiums applied and documented?",
      commonMistakes: "Mixing control and minority level methods without adjustment. Failing to explain why DLOM does or does not apply. Applying a control premium or DLOM without documentation.",
      reportLanguageExamples: "The subject interest of [X%] represents a [control / minority] interest. Accordingly, the analyst applied [methodology consistent with level of value]. A [DLOM / control premium] was [applied / not applied] because [rationale].",
    },
    {
      slug: "final-conclusion-narrative",
      title: "Final Conclusion Narrative Playbook",
      purpose: "Help analysts draft narrative language around an externally prepared final conclusion. This playbook stores the support narrative — not the calculated conclusion.",
      whenToUse: "When the analyst needs to document how the methods were weighted and the narrative supporting the final value opinion.",
      whenNotToUse: "When the app is expected to calculate or recommend a final value. The final value conclusion is the analyst's professional judgment expressed in external workpapers.",
      keyConcepts: "Final conclusion narrative should explain: methods considered, methods relied upon with weighting rationale, methods excluded with explanation, strengths and weaknesses of each method, consistency with standard and premise of value, professional judgment.",
      requiredEvidence: "Documentation of each method applied, source support for each method, level-of-value analysis, any applicable discounts or premiums",
      reviewerQuestions: "1. Why was each method given the weight it received?\n2. What are the primary weaknesses of the income approach in this case?\n3. Why was [excluded method] not given weight?\n4. How is the final conclusion consistent with the standard of value?\n5. What evidence is most critical to the conclusion?",
      commonMistakes: "Writing conclusion language that does not connect to method strengths and weaknesses. Stating a final value without explaining how methods were reconciled. Ignoring excluded methods in the narrative.",
      reportLanguageExamples: "After considering the income, market, and asset approaches, the analyst concluded that the [method(s)] provide the most reliable indication of value given [supporting rationale]. The [excluded method] was not relied upon because [rationale]. The analyst's conclusion of value as of [date], as calculated in the [external model reference], is supported by the methodology and evidence documented in the supporting workpapers.",
    },
  ];

  let playbookCount = 0;
  for (const pb of playbookDefs) {
    const existing = db.select().from(methodologyPlaybooks).where(eq(methodologyPlaybooks.slug, pb.slug)).get();
    if (!existing) {
      db.insert(methodologyPlaybooks).values({
        id: id(), workspaceId: null, scope: "global_seed",
        ...pb, reviewStatus: "approved",
        isSeed: true, isReadonly: true, clonable: true, caseId: null,
        clonedFromType: null, clonedFromId: null, createdAt: now(), updatedAt: now(), createdBy: null,
      }).run();
      playbookCount++;
    }
  }
  console.log(`  ✓ ${playbookCount} playbooks seeded (${playbookDefs.length - playbookCount} already existed)`);

  // ─── Seed Decision Frameworks ──────────────────────────────────────────────
  const frameworkDefs = [
    {
      slug: "income-approach-applicability",
      title: "Income Approach Applicability Framework",
      purpose: "Help analysts decide whether the income approach is appropriate for a given subject company.",
      decisionQuestion: "Is the income approach an appropriate method for this subject company?",
      inputsToConsider: "- Company profitability and cash flow history\n- Quality and reliability of management projections\n- Stage of business (startup vs. mature)\n- Industry characteristics\n- Subject interest type",
      decisionCriteria: "The income approach is appropriate when the business has a history of generating economic benefits, projections can be reasonably supported, and value is driven by earning capacity.",
      evidenceNeeded: "Historical financial statements, management projections, industry growth data, comparable return data",
      possibleOutcomes: "Apply income approach as primary method / Apply income approach as secondary method / Do not rely on income approach — document rationale",
      reviewerPrompts: "Why is the income approach appropriate here? What are the key risks to the projections? How does the subject's history support the forecast?",
      exampleApplication: "A mature manufacturing company with 5 years of consistent cash flows and a management forecast aligned with historical trends — income approach appropriate.",
    },
    {
      slug: "management-projection-reasonableness",
      title: "Management Projection Reasonableness Framework",
      purpose: "Help analysts assess and document the reasonableness of management-provided projections.",
      decisionQuestion: "Are management's projections reasonable to use as a basis for the income approach?",
      inputsToConsider: "- Historical accuracy of prior management projections\n- Comparison to historical actual results\n- Industry growth benchmarks\n- Macro assumptions\n- Known risks or opportunities",
      decisionCriteria: "Projections should be reviewed against historical performance, industry trends, and macro conditions. Material deviations require documented explanations.",
      evidenceNeeded: "3–5 years of historical financials, management budget or forecast, industry growth sources, economic outlook",
      possibleOutcomes: "Accept management projections with documented support / Accept with adjustments and document / Develop independent projections if management projections are not supportable",
      reviewerPrompts: "How do year-1 projections compare to the most recent actual year? What is the growth assumption and how is it supported? Were management projections used in prior periods, and were they accurate?",
      exampleApplication: "Management forecasts 20% revenue growth in Year 1. Historical CAGR is 4%. Industry average is 3%. Independent analysis reduces projection to 5% with documented support.",
    },
    {
      slug: "revenue-forecast-support",
      title: "Revenue Forecast Support Framework",
      purpose: "Guide analysts through the evidence and documentation needed to support revenue forecast assumptions.",
      decisionQuestion: "What evidence supports the revenue growth or decline assumption used in the external model?",
      inputsToConsider: "Historical revenue by year, management forecast, industry reports, customer concentration, pricing vs. volume components",
      decisionCriteria: "Revenue assumptions should be anchored to historical performance, supported by industry evidence, and cross-checked against management rationale.",
      evidenceNeeded: "Historical financial statements, management forecast, industry report excerpts, customer schedule if available",
      possibleOutcomes: "Revenue forecast well-supported / Revenue forecast partially supported with noted limitations / Revenue forecast not sufficiently supported — additional evidence needed",
      reviewerPrompts: "What is the primary driver of projected revenue growth? How does the growth compare to historical and industry performance? What are the downside risks?",
    },
    {
      slug: "market-approach-applicability",
      title: "Market Approach Applicability Framework",
      purpose: "Help analysts decide whether to apply guideline public company or guideline transaction methods.",
      decisionQuestion: "Is the market approach meaningful and applicable for this subject company?",
      inputsToConsider: "- Availability of comparable public companies or transactions\n- Comparability of available market evidence\n- Data quality\n- Level-of-value implications",
      decisionCriteria: "Market approach is appropriate when comparable companies or transactions exist, data is reliable, and comparability can be documented.",
      evidenceNeeded: "Database searches, comparability analysis, transaction dates relative to valuation date",
      possibleOutcomes: "Apply market approach as primary / Apply market approach as corroborating / Do not rely on market approach — document rationale",
      reviewerPrompts: "How comparable are the guideline companies? Are there level-of-value adjustments needed? How current is the market evidence?",
    },
    {
      slug: "guideline-transaction-screening",
      title: "Guideline Transaction Screening Framework",
      purpose: "Guide the screening and selection of guideline transactions for a market approach analysis.",
      decisionQuestion: "Which transactions are sufficiently comparable to include in the guideline transaction analysis?",
      inputsToConsider: "Industry similarity, size, date, transaction structure, buyer type, data availability, outliers",
      decisionCriteria: "Include transactions that meet comparability criteria. Exclude transactions with known structural anomalies, insufficient data, or material outlier multiples without explanation.",
      evidenceNeeded: "Transaction database records, industry definitions, financial metrics for each transaction",
      possibleOutcomes: "Transaction included with documentation / Transaction excluded with rationale documented",
      reviewerPrompts: "Is the transaction size reasonably comparable? Is the industry description similar? Is the transaction date relevant to the valuation date?",
    },
    {
      slug: "asset-approach-role",
      title: "Asset Approach Role Framework",
      purpose: "Help analysts determine the appropriate role for the asset approach in a given valuation.",
      decisionQuestion: "What role, if any, should the asset approach play in this valuation?",
      inputsToConsider: "- Nature of the business (asset-intensive vs. income-driven)\n- Going-concern status\n- Holding company vs. operating company\n- Asset reliability and appraisal availability",
      decisionCriteria: "Primary method for holding companies or asset-liquidation scenarios. Secondary or floor method for operating businesses. Not meaningful if the business value is driven entirely by intangibles or earnings capacity with no reliable asset data.",
      evidenceNeeded: "Balance sheet, any asset appraisals, operating agreement or equity interest details",
      possibleOutcomes: "Asset approach as primary method / Asset approach as secondary / Asset approach as floor reference / Asset approach not relied upon — document rationale",
      reviewerPrompts: "Why is this not an asset-driven business? Are there significant undisclosed intangibles? What is the liquidation value vs. going-concern value?",
    },
    {
      slug: "dlom-support",
      title: "DLOM Support Framework",
      purpose: "Guide analysts through the factors and evidence needed to support a DLOM applied in an external workbook.",
      decisionQuestion: "Is a DLOM appropriate, and what evidence supports the selected discount?",
      inputsToConsider: "Subject interest type, marketability restrictions, holding period, distribution yield, redemption rights, empirical studies",
      decisionCriteria: "DLOM applies to nonmarketable interests. The quantum should be supported by empirical studies and subject-specific factors. Starting level of value (minority or control) must be documented before DLOM.",
      evidenceNeeded: "Operating agreement, empirical studies (restricted stock, pre-IPO), subject company financial profile",
      possibleOutcomes: "DLOM applied with full empirical and qualitative support / DLOM applied with limited support — noted limitation / DLOM not applied — document rationale",
      reviewerPrompts: "What are the marketability restrictions? What empirical studies are most relevant? How do subject company factors compare to the empirical range?",
    },
    {
      slug: "method-weighting-rationale",
      title: "Method Weighting Rationale Framework",
      purpose: "Help analysts document the rationale for relying on certain methods and weighting others in the final conclusion.",
      decisionQuestion: "How should available method indications be weighted in the final conclusion?",
      inputsToConsider: "Reliability of each method's evidence, data quality, comparability, standard of value, premise of value",
      decisionCriteria: "Weight methods based on the quality and reliability of supporting evidence, comparability of market evidence, and consistency with the standard and premise of value.",
      evidenceNeeded: "Summary of each method indication (from external workbook), evidence quality assessment, comparability discussion",
      possibleOutcomes: "Single method relied upon with rationale / Multiple methods weighted with documented basis / Methods averaged with explanation",
      reviewerPrompts: "Why was the income approach given more weight than market? What are the limitations of the market evidence? How does the standard of value affect weighting?",
    },
    {
      slug: "level-of-value-consistency",
      title: "Level-of-Value Consistency Framework",
      purpose: "Ensure the level of value is consistent across methods, subject interest, and any applied discounts or premiums.",
      decisionQuestion: "Is the level of value consistent across all methods and adjustments in this valuation?",
      inputsToConsider: "Subject interest (control vs. minority), method level of value, market evidence level, DLOM applicability, control premium applicability",
      decisionCriteria: "Method indications should be at a consistent level of value before being compared. Adjustments should be documented and connected to subject interest characteristics.",
      evidenceNeeded: "Subject interest description, method descriptions from external workbook, discount/premium documentation",
      possibleOutcomes: "Level-of-value consistent — document / Level-of-value adjustment needed — document basis",
      reviewerPrompts: "What level of value does each method reflect? Is a DLOM needed to bridge from marketable to nonmarketable? Is a control premium appropriate to bridge from minority to control?",
    },
  ];

  let frameworkCount = 0;
  for (const fw of frameworkDefs) {
    const existing = db.select().from(decisionFrameworks).where(eq(decisionFrameworks.slug, fw.slug)).get();
    if (!existing) {
      db.insert(decisionFrameworks).values({
        id: id(), workspaceId: null, scope: "global_seed",
        ...fw, reviewerPrompts: fw.reviewerPrompts ?? null, exampleApplication: (fw as any).exampleApplication ?? null, relatedPlaybooks: null,
        reviewStatus: "approved", isSeed: true, isReadonly: true, clonable: true, caseId: null,
        clonedFromType: null, clonedFromId: null, createdAt: now(), updatedAt: now(), createdBy: null,
      }).run();
      frameworkCount++;
    }
  }
  console.log(`  ✓ ${frameworkCount} frameworks seeded`);

  // ─── Seed Principles ───────────────────────────────────────────────────────
  const principlesDefs = [
    { slug: "external-models-calculate", title: "External models produce calculations; this app preserves support.", body: "Valuation Memory Bank stores the reasoning, sources, and documentation that support valuation work performed in Excel, firm models, Google Sheets, or other external tools. It does not calculate discount rates, DCF values, market multiples, or final conclusions.", rationale: "Keeping knowledge management separate from calculation prevents scope creep and ensures the app remains a durable, professional documentation tool regardless of the specific model used." },
    { slug: "assumptions-need-support", title: "Every material assumption should have source support or documented reviewer judgment.", body: "Each material assumption used in an external valuation model should be traceable to a source record or a documented professional judgment rationale. Unsupported assumptions are a primary cause of reviewer and litigation challenges.", rationale: "Thorough assumption support reduces review risk and improves the credibility and defensibility of the final work product." },
    { slug: "method-selection-before-conclusion", title: "Method selection should be explained before conclusions are discussed.", body: "The analyst should document why each method was selected, corroborating, or excluded before the value conclusion is reached. Method selection language should not be reverse-engineered from a preferred conclusion.", rationale: "Pre-commitment to method selection criteria supports objectivity and professional credibility." },
    { slug: "excluded-methods-need-rationale", title: "Excluded methods need rationale when they would normally be considered.", body: "When a standard approach (income, market, or asset) is excluded or not given weight, the analyst should document why it was not meaningful. Simply ignoring a method creates a gap that reviewers and courts frequently challenge.", rationale: "Addressing excluded methods proactively reduces the risk of successful challenge." },
    { slug: "level-of-value-match", title: "Level of value must match the subject interest.", body: "The methods applied, the market evidence used, and any adjustments made should all be consistent with the level of value appropriate for the subject interest. Control interests require control-level support; minority interests require minority-level support.", rationale: "Level-of-value consistency is foundational to professional valuation practice." },
    { slug: "reference-case-not-default", title: "Reference case assumptions are examples, not defaults.", body: "Assumptions, source selections, and conclusions from reference cases are educational examples only. They should not be applied to a new project without independent support and documentation of why the reference case facts are comparable.", rationale: "Each valuation assignment is fact-specific. Copying reference case assumptions without independent support undermines the credibility of the analysis." },
    { slug: "management-projections-need-assessment", title: "Management projections require reasonableness assessment.", body: "Management-provided forecasts should not be accepted without an independent assessment of reasonableness. The analyst should compare projections to historical performance, industry data, and economic conditions and document the result.", rationale: "Accepting management projections without assessment creates exposure to challenge under most valuation standards." },
    { slug: "market-evidence-comparability", title: "Market evidence requires comparability discussion.", body: "Guideline companies and transactions should be accompanied by a documented comparability analysis explaining why the evidence is relevant to the subject company. Market evidence without comparability discussion is difficult to defend.", rationale: "Comparability documentation is required under AICPA, IRS, and USPAP guidance." },
    { slug: "dlom-empirical-and-qualitative", title: "DLOM support should connect empirical evidence and qualitative facts.", body: "The DLOM should be supported by both empirical study references (restricted stock studies, pre-IPO studies) and subject-specific qualitative factors. Generic DLOM language without subject-specific analysis is a common challenge point.", rationale: "Subject-specific DLOM support is more defensible before reviewers and in litigation." },
    { slug: "final-narrative-connects-evidence", title: "Final narrative should connect method reliability, evidence quality, and professional judgment.", body: "The final conclusion narrative should explain how each method's reliability, the quality of the supporting evidence, and the analyst's professional judgment led to the conclusion. A conclusion without this narrative is difficult to defend.", rationale: "A well-documented narrative demonstrates the professional quality of the work product and reduces challenge risk." },
  ];

  let principleCount = 0;
  for (const p of principlesDefs) {
    const existing = db.select().from(valuationPrinciples).where(eq(valuationPrinciples.slug, p.slug)).get();
    if (!existing) {
      db.insert(valuationPrinciples).values({
        id: id(), workspaceId: null, scope: "global_seed",
        ...p, relatedPlaybooks: null, relatedAntipatterns: null,
        reviewStatus: "approved", isSeed: true, isReadonly: true, clonable: true, caseId: null,
        clonedFromType: null, clonedFromId: null, createdAt: now(), updatedAt: now(), createdBy: null,
      }).run();
      principleCount++;
    }
  }
  console.log(`  ✓ ${principleCount} principles seeded`);

  // ─── Seed Anti-Patterns ────────────────────────────────────────────────────
  const antipatternDefs = [
    { slug: "model-output-self-explanatory", title: "Treating external model output as self-explanatory", description: "Referencing a DCF or market approach value from an external workbook without documenting the assumptions, sources, and reasoning that support the output. The model output is not self-supporting — the workpapers are.", whyItMatters: "Reviewers, courts, and auditors expect documentation of why the model conclusion is reasonable, not just what the model concluded.", warningSigns: "Support memos that simply reference the output of the model without explaining the underlying assumptions or evidence.", howToFix: "For each material assumption in the model, create a support record linking the assumption to sources and documented rationale." },
    { slug: "discount-rate-no-rationale", title: "Listing discount-rate components without rationale", description: "Presenting WACC or build-up components as a table without explaining why each component was selected and how each source was relevant as of the valuation date.", whyItMatters: "A list of numbers without rationale is a template, not analysis. Reviewers and courts expect documented reasoning for each component.", warningSigns: "A WACC section that lists risk-free rate, ERP, size premium, and company-specific risk without explaining the selection of each.", howToFix: "For each component, document the source, the specific data point used, the date relevance, and why it is appropriate for this subject company." },
    { slug: "generic-dlom-language", title: "Using generic DLOM language", description: "Applying boilerplate DLOM language copied from a prior engagement without connecting the empirical evidence or qualitative factors to the specific subject company.", whyItMatters: "Generic DLOM language is a frequent challenge point in IRS examination and litigation. Reviewers expect subject-specific analysis.", warningSigns: "DLOM memos that describe empirical studies in general terms but do not connect the subject company's characteristics to the selected discount.", howToFix: "Document the subject company's specific marketability factors (dividend yield, redemption rights, holding period, financial profile) and explain how they relate to the selected discount." },
    { slug: "copying-reference-case-assumptions", title: "Copying reference case assumptions without support", description: "Using an assumption from a prior case or reference case in a new engagement without independent evidence supporting its applicability.", whyItMatters: "Each engagement is fact-specific. Assumptions that were appropriate in one case may not be appropriate in another.", warningSigns: "Assumptions that reference a prior case or use round numbers without project-specific source support.", howToFix: "For each assumption, identify independent sources or documented reviewer judgment specific to the current engagement." },
    { slug: "market-evidence-no-comparability", title: "Selecting market evidence without comparability analysis", description: "Applying guideline company multiples or transaction multiples without documenting why the selected companies or transactions are comparable to the subject.", whyItMatters: "Comparability is a required element of most guideline company and guideline transaction analyses under professional standards.", warningSigns: "Market approach sections that list selected multiples without a comparability discussion or exclusion rationale.", howToFix: "Create a comparability analysis for each guideline company or transaction that addresses industry, size, profitability, and other relevant factors." },
    { slug: "ignoring-excluded-methods", title: "Ignoring excluded methods", description: "Omitting a standard approach without explaining why it was not used or not meaningful. Reviewers expect to see every standard approach considered and addressed.", whyItMatters: "Under most valuation standards, the analyst should consider all three approaches and explain departures.", warningSigns: "A report that uses only one approach without discussing the others.", howToFix: "Address each standard approach, explain whether it was used, and if not, why it was not meaningful for this engagement." },
    { slug: "mixing-levels-of-value", title: "Mixing levels of value", description: "Applying methods or market evidence at different levels of value without appropriate adjustments, resulting in an inconsistent conclusion.", whyItMatters: "Level-of-value consistency is fundamental. A control-level DCF conclusion compared to a minority-level market multiple without adjustment produces an unreliable conclusion.", warningSigns: "A conclusion that averages or weights income and market approach results without addressing whether both results are at the same level of value.", howToFix: "Establish the appropriate level of value for the subject interest, confirm each method's level of value, and make documented adjustments before weighting." },
    { slug: "over-relying-management-projections", title: "Over-relying on management projections", description: "Accepting management-provided forecasts without an independent reasonableness assessment and using them directly in the income approach without documentation.", whyItMatters: "Management projections are inherently optimistic and may not represent a market-participant view. Accepting them without assessment creates professional credibility risk.", warningSigns: "Income approach support that says 'management projections were used' without a reasonableness comparison to historical performance and industry benchmarks.", howToFix: "Compare projections to historical actuals, industry growth benchmarks, and economic conditions. Document the reasonableness conclusion with specific evidence." },
    { slug: "stale-sources", title: "Using stale sources without relevance notes", description: "Citing sources that predate the valuation date without documenting whether they were relevant as of the valuation date.", whyItMatters: "Valuation conclusions must be supported by evidence relevant as of the valuation date. Stale sources without relevance notes can undermine the conclusion.", warningSigns: "Source records without valuation-date relevance notes, or sources dated more than 12 months before the valuation date.", howToFix: "Add valuation-date relevance notes to each source explaining why the data was relevant as of the valuation date. Update or supplement with more current sources where possible." },
    { slug: "conclusion-disconnected-from-method-strengths", title: "Writing conclusion language disconnected from method strengths", description: "Stating a final value conclusion without connecting the narrative to the specific strengths and weaknesses of each method and the quality of the supporting evidence.", whyItMatters: "A conclusion narrative that simply states a number is not defensible. The narrative must explain why the analyst reached the conclusion based on the available evidence.", warningSigns: "Final conclusion sections that state the value without a discussion of method reliability, evidence quality, or professional judgment.", howToFix: "Draft the final conclusion narrative using a template that requires addressing method strengths, limitations, and the basis for professional judgment." },
    { slug: "asset-approach-dismissed-no-explanation", title: "Treating asset approach as irrelevant without explanation", description: "Dismissing the asset approach as not applicable without providing any rationale in the workpapers or report.", whyItMatters: "Reviewers expect to see the asset approach addressed even if it is ultimately not relied upon. Silence implies oversight, not deliberate exclusion.", warningSigns: "Workpapers that mention only income and market approaches without any discussion of asset approach consideration.", howToFix: "Address the asset approach in a support memo explaining why it is or is not meaningful for the subject company." },
    { slug: "using-unsupported-professional-judgment", title: "Using unsupported professional judgment as if it were market evidence", description: "Presenting a professional judgment-based assumption as if it were supported by independent market data, without distinguishing between the two.", whyItMatters: "Professional judgment is acceptable in many circumstances but must be labeled as such. Presenting judgment-based assumptions as market-supported facts can create significant credibility risk.", warningSigns: "Assumptions documented without source links that do not note they are based on professional judgment.", howToFix: "Clearly label professional judgment assumptions as such and document the basis for the judgment. Seek market evidence to supplement where possible." },
    { slug: "formula-engine-in-knowledge-tool", title: "Adding calculation features to a knowledge management tool", description: "Attempting to build DCF calculators, WACC engines, DLOM selectors, or other calculation functionality into a knowledge management app that is intended to preserve support and documentation only.", whyItMatters: "Calculation functionality in the knowledge tool creates scope confusion, maintenance burden, and the risk that the tool's outputs are mistaken for professional conclusions. Calculations belong in Excel, firm models, or purpose-built financial modeling tools.", warningSigns: "Formula fields, output-generating tables, sensitivity grids, or recommendation engines in the knowledge application.", howToFix: "Remove all calculation functionality. Replace with external model reference records that point to where the calculations live. Use the app for support documentation only." },
  ];

  let antipatternCount = 0;
  for (const a of antipatternDefs) {
    const existing = db.select().from(valuationAntipatterns).where(eq(valuationAntipatterns.slug, a.slug)).get();
    if (!existing) {
      db.insert(valuationAntipatterns).values({
        id: id(), workspaceId: null, scope: "global_seed",
        ...a, relatedPlaybooks: null, relatedPrinciples: null, relatedTemplates: null,
        reviewStatus: "approved", isSeed: true, isReadonly: true, clonable: true, caseId: null,
        clonedFromType: null, clonedFromId: null, createdAt: now(), updatedAt: now(), createdBy: null,
      }).run();
      antipatternCount++;
    }
  }
  console.log(`  ✓ ${antipatternCount} anti-patterns seeded`);

  // ─── Seed Reasoning Templates ──────────────────────────────────────────────
  const templateDefs = [
    {
      slug: "wacc-support-memo",
      title: "WACC Support Memo",
      useCase: "Document the sources, component selection rationale, and reviewer defense for a WACC or build-up rate developed in an external workbook.",
      promptScaffold: `**WACC/Build-Up Support Memo**

Subject Company: [Company Name]
Valuation Date: [Date]
External Workbook Reference: [Excel/Firm Model Reference]

**Risk-Free Rate**
Selected rate: [X%]
Source: [Source name and date]
Rationale: [Why this rate is appropriate as of the valuation date]

**Equity Risk Premium**
Selected ERP: [X%]
Source: [Source name and date]
Rationale: [Basis for selection]

**Size Premium**
Selected size premium: [X%]
Source: [Source name and date]
Rationale: [Basis for selection — market cap decile or other]

**Company-Specific Risk Premium**
Selected CSRP: [X%]
Factors considered:
- [Factor 1]
- [Factor 2]
Rationale: [How these factors support the selected premium]

**Capital Structure**
Equity: [X%]  Debt: [X%]
Basis: [How capital structure was determined]

**Cost of Debt**
Pre-tax: [X%]   After-tax: [X%]
Basis: [How cost of debt was determined]

**Resulting WACC (from external workbook):** [X%]

**Reviewer Defense Notes:**
[Anticipated reviewer questions and prepared responses]`,
      requiredSupportingInputs: "External workbook reference, risk-free rate source, ERP source, size premium source, company-specific risk factors",
      optionalSupportingInputs: "Prior comparable engagements (as reference only), industry average return data",
    },
    {
      slug: "revenue-forecast-support-memo",
      title: "Revenue Forecast Support Memo",
      useCase: "Document the evidence, reasonableness analysis, and reasoning supporting the revenue forecast used in an external income approach model.",
      promptScaffold: `**Revenue Forecast Support Memo**

Subject Company: [Company Name]
Valuation Date: [Date]
External Workbook Reference: [Excel/Firm Model Reference]

**Historical Revenue Summary**
Year -3: [Amount]
Year -2: [Amount]
Year -1: [Amount] (Most recent completed fiscal year)
Historical CAGR: [X%]

**Management Projections**
Year 1: [Amount] ([X%] growth)
Year 2: [Amount] ([X%] growth)
Year 3: [Amount] ([X%] growth)
[Continue as applicable]

**Reasonableness Assessment**
Comparison to historical performance: [Analysis]
Comparison to industry benchmarks: [Source and comparison]
Economic conditions as of valuation date: [Relevant factors]

**Key Assumptions Driving Forecast**
- [Assumption 1 with support]
- [Assumption 2 with support]

**Customer and Revenue Concentration**
[Description of significant customers or revenue concentration]

**Conclusion on Reasonableness**
[Summary of whether management projections were accepted as-is, adjusted, or replaced]

**Reviewer Defense Notes:**
[Anticipated questions and responses]`,
      requiredSupportingInputs: "Historical financial statements (3–5 years), management projections, at least one industry growth source",
      optionalSupportingInputs: "Customer concentration schedule, economic outlook report, comparable company growth data",
    },
    {
      slug: "normalization-adjustment-rationale",
      title: "Normalization Adjustment Rationale",
      useCase: "Document the specific basis, market support, and impact of each normalization adjustment applied in an external financial model.",
      promptScaffold: `**Normalization Adjustment Documentation**

Subject Company: [Company Name]
Valuation Date: [Date]

**Adjustment: [Adjustment Name]**
Category: [Owner compensation / Related-party transaction / Non-recurring item / Other]
Reported amount: [Amount]
Normalized amount: [Amount]
Net adjustment: [Amount]

Rationale: [Specific reason this adjustment is warranted]
Market support: [Source and data supporting the normalized amount]
Impact on normalized income: [Impact statement]

**Adjustment: [Next Adjustment]**
[Repeat as needed]

**Summary of Adjustments**
Total normalization impact on [EBITDA / Net Income]: [Amount]
Total normalized [metric]: [Amount]

**Reviewer Defense Notes:**
[How you would respond to a reviewer challenging each adjustment]`,
      requiredSupportingInputs: "Historical financial statements, documentation of the non-recurring or non-market item, market support for the normalized amount",
      optionalSupportingInputs: "Management interview notes, industry compensation benchmarks, real estate market data for rent adjustments",
    },
    {
      slug: "management-projection-reasonableness-memo",
      title: "Management Projection Reasonableness Memo",
      useCase: "Document the analysis and conclusion on whether management-provided projections are reasonable to use in an external income approach model.",
      promptScaffold: `**Management Projection Reasonableness Memo**

Subject Company: [Company Name]
Valuation Date: [Date]

**Overview of Management Projections**
[Brief description of management's forecast]

**Comparison to Historical Performance**
Most recent historical revenue growth: [X%]
Management Year 1 projected growth: [X%]
Variance and explanation: [Analysis]

**Comparison to Industry Benchmarks**
Industry growth rate: [X%] (Source: [Source])
Management projected growth vs. industry: [Comparison and analysis]

**Assessment of Known Risks and Opportunities**
- [Risk or opportunity 1 and how it affects the forecast]
- [Risk or opportunity 2]

**Assessment of Prior Management Forecast Accuracy** (if available)
[How accurate were management's prior forecasts?]

**Conclusion on Reasonableness**
[The analyst determined that management projections are/are not reasonable because...]
[If adjusted, describe what was changed and why]

**Reviewer Defense Notes:**
[Anticipated questions on the reasonableness conclusion]`,
      requiredSupportingInputs: "Historical financial statements, management forecast, industry growth source",
      optionalSupportingInputs: "Prior year management budgets vs. actuals, macro economic data",
    },
    {
      slug: "market-approach-selection-rationale",
      title: "Market Approach Selection Rationale",
      useCase: "Document the decision to include or exclude market approach methods and the basis for the comparability conclusion.",
      promptScaffold: `**Market Approach Selection Rationale**

Subject Company: [Company Name]
Valuation Date: [Date]

**Methods Considered**
- Guideline Public Company Method: [Applied / Considered but not relied upon / Not applicable]
- Guideline Transaction Method: [Applied / Considered but not relied upon / Not applicable]

**Guideline Company / Transaction Search Process**
Sources used: [Database names]
Search criteria: [Industry codes, size filters, date range]
Initial results: [X companies / transactions]

**Comparability Analysis Summary**
Included: [X companies/transactions — reasons for inclusion]
Excluded: [X companies/transactions — reasons for exclusion]

**Level-of-Value Assessment**
[How were level-of-value differences between market evidence and subject interest addressed?]

**Conclusion on Market Approach**
[Summary of how market approach evidence was used in the external model]

**Reviewer Defense Notes:**
[Anticipated questions on comparability and selection decisions]`,
      requiredSupportingInputs: "Database search results, comparability analysis, level-of-value documentation",
      optionalSupportingInputs: "Selected multiple support from external workbook, transaction detail records",
    },
    {
      slug: "guideline-company-screening-rationale",
      title: "Guideline Company Screening Rationale",
      useCase: "Document the screening and selection process for guideline public companies used in an external market approach model.",
      promptScaffold: `**Guideline Public Company Screening Rationale**

Subject Company: [Company Name]
Valuation Date: [Date]

**Search Sources and Criteria**
Database: [Capital IQ, Bloomberg, etc.]
Industry codes: [SIC/NAICS codes]
Size range: [Revenue or EBITDA range]
Other criteria: [Additional filters]

**Initial Results:** [X companies identified]

**Comparability Assessment**
For each company:
- [Company Name]: [Include/Exclude] — [Reason]

**Selected Companies:** [List]

**Comparability Factors Addressed**
- Industry: [Analysis]
- Size: [Analysis]
- Profitability: [Analysis]
- Growth: [Analysis]
- Geography: [Analysis]

**Reviewer Defense Notes:**
[Why were specific companies included or excluded?]`,
      requiredSupportingInputs: "Database search documentation, financial data for screened companies",
      optionalSupportingInputs: "SEC filings for individual companies, analyst reports",
    },
    {
      slug: "guideline-transaction-screening-rationale",
      title: "Guideline Transaction Screening Rationale",
      useCase: "Document the screening and selection process for guideline transactions used in an external market approach model.",
      promptScaffold: `**Guideline Transaction Screening Rationale**

Subject Company: [Company Name]
Valuation Date: [Date]

**Search Sources and Criteria**
Database: [DealStats, Capital IQ, BizBuySell, etc.]
Industry codes: [SIC/NAICS]
Transaction date range: [Date range relative to valuation date]
Size range: [Revenue or EBITDA]
Transaction type: [Asset sale, stock sale, merger, etc.]

**Initial Results:** [X transactions identified]

**Transaction Assessment**
For each transaction:
- [Transaction ID/Name]: [Include/Exclude] — [Reason]

**Selected Transactions:** [List]

**Level-of-Value Assessment**
[How were level-of-value differences addressed?]

**Date Relevance Assessment**
[How were older transactions treated?]

**Reviewer Defense Notes:**
[Why were specific transactions included or excluded?]`,
      requiredSupportingInputs: "Transaction database records, financial metrics for screened transactions",
      optionalSupportingInputs: "Transaction news coverage, deal structure details",
    },
    {
      slug: "asset-approach-role-memo",
      title: "Asset Approach Role Memo",
      useCase: "Document why the asset approach was or was not applied, and what role (if any) it plays in the valuation.",
      promptScaffold: `**Asset Approach Role Memo**

Subject Company: [Company Name]
Valuation Date: [Date]

**Nature of the Business**
[Description of whether the business is asset-intensive, service-based, or operating company]

**Asset Approach Applicability Assessment**
The asset approach was [applied / considered but not relied upon] because:
[Specific reasons]

**Role in the Valuation**
[ ] Primary method — [Rationale]
[ ] Secondary corroborating method — [Rationale]
[ ] Floor value reference — [Rationale]
[ ] Not relied upon — [Rationale]
[ ] Not meaningful — [Rationale]

**Significant Assets and Liabilities Considered**
[Summary of material balance sheet items]

**Going-Concern Assessment**
[Why is or is not the going-concern value materially different from asset value?]

**Reviewer Defense Notes:**
[Anticipated questions on the asset approach decision]`,
      requiredSupportingInputs: "Balance sheet as of or near valuation date, assessment of business nature",
      optionalSupportingInputs: "Asset appraisals, real property valuations",
    },
    {
      slug: "dlom-support-narrative",
      title: "DLOM Support Narrative",
      useCase: "Draft the narrative supporting a DLOM applied in an external workbook. This template does not calculate a DLOM.",
      promptScaffold: `**Discount for Lack of Marketability Support Narrative**

Subject Company: [Company Name]
Valuation Date: [Date]
Subject Interest: [X% [minority/control] interest]

**Level-of-Value Starting Point**
This DLOM analysis starts from a [marketable minority / control] value indication, as developed in the [external workbook reference].

**Marketability Restrictions**
- [Transfer restrictions from operating/shareholder agreement]
- [Put/call rights, if any]
- [Redemption provisions, if any]
- [Distribution history]

**Empirical Studies Considered**
- Restricted stock studies: [Studies referenced and range]
- Pre-IPO studies: [Studies referenced and range, if applicable]

**Subject Company Factors**
Factors supporting higher DLOM: [List]
Factors supporting lower DLOM: [List]

**Selected DLOM (from external workbook):** [X%]

**Narrative Connection**
[Explanation of how subject company factors relate to the empirical range and support the selected discount]

**Reviewer Defense Notes:**
[Anticipated challenges and responses]`,
      requiredSupportingInputs: "Operating or shareholder agreement, subject company financial profile, external workbook reference, at least one empirical study source",
      optionalSupportingInputs: "Mandelbaum factors analysis, prior court cases involving similar interests",
    },
    {
      slug: "level-of-value-explanation",
      title: "Level-of-Value Explanation",
      useCase: "Document the level-of-value framework applied in the engagement and how it affects methods and adjustments.",
      promptScaffold: `**Level-of-Value Documentation**

Subject Company: [Company Name]
Valuation Date: [Date]
Subject Interest: [Description]

**Applicable Level of Value**
The subject interest represents a [control / minority] interest.
The applicable level of value is: [Control marketable / Minority marketable / Minority nonmarketable]

**Control Assessment**
[Does the subject interest have the ability to direct operations, liquidate assets, or control distributions? Explain.]

**Marketability Assessment**
[Is the subject interest freely marketable, or are there restrictions on transfer?]

**Method Consistency**
- Income approach (DCF/Capitalization): [Level of value reflected — typically control]
- Market approach (GPCM trading multiples): [Level of value reflected — typically minority]
- Market approach (GTM transaction multiples): [Level of value reflected — typically control]
- Asset approach: [Level of value reflected — typically control]

**Adjustments Applied**
[Describe any control premium, DLOM, or other adjustments, and reference the external workbook where calculated]

**Reviewer Defense Notes:**
[How would you defend the level-of-value conclusion to a reviewer or court?]`,
      requiredSupportingInputs: "Subject interest description, operating agreement or shareholder agreement",
      optionalSupportingInputs: "Comparative market evidence on control premiums, prior court decisions on similar interests",
    },
    {
      slug: "method-weighting-rationale",
      title: "Method Weighting Rationale",
      useCase: "Document the basis for relying on, partially relying on, or excluding each valuation method in the final conclusion.",
      promptScaffold: `**Method Weighting Rationale**

Subject Company: [Company Name]
Valuation Date: [Date]

**Methods Available and Relied Upon**
Income Approach (DCF): [Relied upon / Not relied upon / Weight: X%]
Market Approach (GPCM): [Relied upon / Not relied upon / Weight: X%]
Market Approach (GTM): [Relied upon / Not relied upon / Weight: X%]
Asset Approach: [Relied upon / Not relied upon / Weight: X%]

**Income Approach Assessment**
Strengths: [What makes the income approach reliable for this subject?]
Weaknesses: [What are the limitations or uncertainties?]

**Market Approach Assessment**
Strengths: [Quality and quantity of comparable evidence]
Weaknesses: [Comparability limitations, data quality, level-of-value issues]

**Asset Approach Assessment**
Strengths: [If applicable]
Weaknesses/Not Relied Upon: [Rationale for exclusion or low weight]

**Weighting Rationale**
[Explain why the selected weights reflect the relative reliability and evidence quality of each method]

**Standard of Value and Premise of Value Consistency**
[How does the weighting approach reflect the applicable standard and premise of value?]

**Reviewer Defense Notes:**
[How would you defend the weighting decision?]`,
      requiredSupportingInputs: "Summary of each method indication from external workbook, evidence quality assessment",
      optionalSupportingInputs: "Industry practice notes on typical method weighting",
    },
    {
      slug: "final-conclusion-narrative",
      title: "Final Conclusion Narrative",
      useCase: "Draft the narrative language explaining how the analyst arrived at the final value conclusion from the methods applied in external workpapers.",
      promptScaffold: `**Final Conclusion Narrative**

Subject Company: [Company Name]
Valuation Date: [Date]
Standard of Value: [Fair Market Value / Fair Value / Other]
Premise of Value: [Going concern / Liquidation / Other]

**Methods Applied**
[List each method applied in the external workbook and the value indication]

**Conclusion on Each Method**
Income Approach: [Assessment of reliability and evidence quality]
Market Approach: [Assessment of comparability and evidence quality]
Asset Approach: [Included/excluded — rationale]

**Final Conclusion**
The analyst concluded that the [method(s)] provide the most reliable indication of value for the subject interest because [rationale].

The final value of $[X] as of [Date] is supported by [summary of key evidence and methodology].

**Connection to Evidence**
[Summarize the key sources and assumptions supporting the conclusion]

**Professional Judgment**
[If professional judgment was exercised in any material area, document the basis]

**Note:** The final value was determined in the external workbook/model. This narrative documents the reasoning supporting that conclusion.`,
      requiredSupportingInputs: "Summary of method indications from external workbook, evidence assessment for each method",
      optionalSupportingInputs: "Prior comparable engagements (reference only), industry practice benchmarks",
    },
    {
      slug: "reviewer-qa-response",
      title: "Reviewer Q&A Response",
      useCase: "Prepare a structured response to a specific reviewer question or challenge.",
      promptScaffold: `**Reviewer Q&A Response**

Reviewer Question: [The specific question or challenge]
Questioner: [Reviewer / Partner / Client / Professor / IRS / Court]

**Direct Response:**
[Clear, direct answer to the question]

**Supporting Evidence:**
- [Source 1 and why it is relevant]
- [Source 2 and why it is relevant]

**Connection to External Model:**
[How does the response connect to the external workbook or model?]

**Assumptions Referenced:**
[Which assumptions does this response address?]

**If the Reviewer Pushes Further:**
[How would you respond to a follow-up challenge?]

**Potential Weaknesses to Acknowledge:**
[Are there any limitations in the response that should be proactively disclosed?]`,
      requiredSupportingInputs: "The specific reviewer question, relevant source records",
      optionalSupportingInputs: "Related support memos, prior case examples",
    },
    {
      slug: "source-reliability-note",
      title: "Source Reliability Note",
      useCase: "Document the reliability assessment and valuation-date relevance of a specific source used in the analysis.",
      promptScaffold: `**Source Reliability Note**

Source: [Title and publisher]
Date: [Publication or data date]
Valuation Date: [Date]

**Source Description:**
[Brief description of what the source is and what data it provides]

**Reliability Assessment:**
[Strong / Moderate / Weak / Conflicting with other evidence]
Basis: [Why this assessment was reached]

**Valuation-Date Relevance:**
[Is the source data relevant as of the valuation date? If it predates the valuation date, explain why the data remains applicable.]

**How the Source is Used:**
[How does this source support the specific assumption or reasoning?]

**Limitations:**
[What are the limitations of this source?]

**Alternative Sources Considered:**
[Were alternative sources considered? If so, why was this source selected?]`,
      requiredSupportingInputs: "Source title, publication date, specific data point being cited",
      optionalSupportingInputs: "Alternative source comparison",
    },
  ];

  let templateCount = 0;
  for (const t of templateDefs) {
    const existing = db.select().from(reasoningTemplates).where(eq(reasoningTemplates.slug, t.slug)).get();
    if (!existing) {
      db.insert(reasoningTemplates).values({
        id: id(), workspaceId: null, scope: "global_seed",
        ...t, exampleOutput: null, relatedPlaybooks: null, relatedFrameworks: null, relatedPrinciples: null,
        aiDraftingAllowed: false,
        reviewStatus: "approved", isSeed: true, isReadonly: true, clonable: true, caseId: null,
        clonedFromType: null, clonedFromId: null, createdAt: now(), updatedAt: now(), createdBy: null,
      }).run();
      templateCount++;
    }
  }
  console.log(`  ✓ ${templateCount} reasoning templates seeded`);

  // ─── Seed Generic Q&A Items ─────────────────────────────────────────────────
  const qaPrompts = [
    { q: "Why was this method appropriate?", scaffold: "State the method. Explain what the method measures. Connect the method to the subject company's characteristics. Reference the evidence supporting the method selection.", audience: "Reviewer", difficulty: "medium" },
    { q: "Why was this method excluded?", scaffold: "State the excluded method. Explain why it was not meaningful or applicable. Reference any comparability or data limitations. Connect to the applicable valuation standards.", audience: "Reviewer", difficulty: "medium" },
    { q: "What evidence supports this assumption?", scaffold: "State the assumption. Identify the sources. Explain why each source is relevant as of the valuation date. Note any limitations in the evidence.", audience: "Reviewer", difficulty: "easy" },
    { q: "How do you know the source was relevant as of the valuation date?", scaffold: "Describe the source and its date. Explain why the data reflects conditions relevant to the valuation date. Note any temporal limitations and how they were addressed.", audience: "Reviewer", difficulty: "medium" },
    { q: "What are the weaknesses of this method?", scaffold: "Acknowledge the specific limitations of the method. Explain how each limitation was addressed or why it does not undermine the reliability of the result. Reference supporting evidence.", audience: "Partner", difficulty: "hard" },
    { q: "How did you assess management projections?", scaffold: "Describe the comparison to historical performance. Reference the industry benchmark used. Explain any adjustments made and the basis for the reasonableness conclusion.", audience: "Reviewer", difficulty: "medium" },
    { q: "How did you assess market comparability?", scaffold: "Describe the screening criteria used. Explain the key comparability factors assessed. Note any differences between guideline companies and the subject, and how they were addressed.", audience: "Reviewer", difficulty: "hard" },
    { q: "How did you address level of value?", scaffold: "State the applicable level of value. Explain how each method's level of value was identified. Describe any adjustments made to achieve consistency.", audience: "Judge", difficulty: "hard" },
    { q: "What would change your conclusion?", scaffold: "Identify the most sensitive assumptions. Explain what evidence or facts, if different, would materially affect the conclusion. Note the direction and magnitude of potential impact.", audience: "Client", difficulty: "hard" },
    { q: "What support is missing or judgment-based?", scaffold: "Identify any assumptions that rely primarily on professional judgment. Explain why market evidence was not available or sufficient. Describe what additional evidence could strengthen the conclusion.", audience: "Internal team", difficulty: "easy" },
  ];

  let qaCount = 0;
  for (let i = 0; i < qaPrompts.length; i++) {
    const qa = qaPrompts[i];
    const slug = `generic-qa-${i + 1}`;
    const existing = db.select().from(qaItems).where(eq(qaItems.id, `seed-qa-${i + 1}`)).get();
    if (!existing) {
      db.insert(qaItems).values({
        id: `seed-qa-${i + 1}`, workspaceId: null, projectId: null, caseId: null,
        question: qa.q, answerScaffold: qa.scaffold, draftAnswer: null,
        linkedAssumptions: null, linkedSources: null, linkedSupportMemo: null,
        linkedPlaybook: null, linkedFramework: null, linkedTemplate: null,
        difficulty: qa.difficulty, audience: qa.audience, reviewStatus: "approved",
        tags: null, isSeed: true, isReadonly: true, clonable: true,
        clonedFromType: null, clonedFromId: null, createdAt: now(), updatedAt: now(), createdBy: null,
      }).run();
      qaCount++;
    }
  }
  console.log(`  ✓ ${qaCount} generic Q&A prompts seeded`);

  // ─── Seed Generic Source Examples ──────────────────────────────────────────
  const sourceDefs = [
    { slug: "source-audited-financials", title: "Audited Financial Statements", sourceType: "financial_statement", notes: "Primary source for historical financial performance. Provides basis for normalization and trend analysis." },
    { slug: "source-tax-returns", title: "Federal Tax Returns", sourceType: "financial_statement", notes: "Often used alongside audited financials for trend analysis and to identify schedule items." },
    { slug: "source-management-interview", title: "Management Interview Notes", sourceType: "management_interview", notes: "Documents management-provided context on operations, strategy, and forecasts." },
    { slug: "source-industry-report", title: "Industry Research Report", sourceType: "industry_report", notes: "Provides industry growth benchmarks, competitive landscape, and economic context." },
    { slug: "source-economic-outlook", title: "Economic Outlook Report", sourceType: "economic_data", notes: "Provides macroeconomic context relevant to the valuation date." },
    { slug: "source-transaction-database", title: "Transaction Database (DealStats / Capital IQ)", sourceType: "transaction_data", notes: "Source for guideline transaction multiples and market approach evidence." },
    { slug: "source-public-filings", title: "Public Company SEC Filings", sourceType: "market_data", notes: "Source for guideline public company data and comparable financial metrics." },
    { slug: "source-valuation-standards", title: "Valuation Standards (AICPA, USPAP, ASA)", sourceType: "standard_or_guidance", notes: "Reference for applicable professional standards governing the engagement." },
    { slug: "source-prior-workpaper", title: "Prior Internal Workpaper", sourceType: "prior_workpaper", notes: "Historical workpaper reference for comparison and methodology continuity." },
    { slug: "source-management-forecast", title: "Management Projections or Budget", sourceType: "company_document", notes: "Management-provided forward-looking financial information used in the income approach." },
    { slug: "source-customer-schedule", title: "Customer Concentration Schedule", sourceType: "company_document", notes: "Documents customer concentration risk relevant to revenue forecast support." },
    { slug: "source-agreement", title: "Operating Agreement or Shareholder Agreement", sourceType: "company_document", notes: "Defines ownership rights, restrictions, and other provisions relevant to level-of-value and DLOM analysis." },
  ];

  let sourceCount = 0;
  for (const s of sourceDefs) {
    const existing = db.select().from(sources).where(eq(sources.id, `seed-source-${s.slug}`)).get();
    if (!existing) {
      db.insert(sources).values({
        id: `seed-source-${s.slug}`, workspaceId: "ws_default", projectId: null,
        title: s.title, publisherAuthor: null, sourceType: s.sourceType,
        publicationDate: null, valuationDateRelevanceNote: null, urlOrFileReference: null,
        citationText: null, reliabilityAssessment: null, notes: s.notes,
        tags: null, isSeed: true, isReadonly: true, clonable: true, caseId: null,
        clonedFromType: null, clonedFromId: null, createdAt: now(), updatedAt: now(), createdBy: null,
      }).run();
      sourceCount++;
    }
  }
  console.log(`  ✓ ${sourceCount} generic source examples seeded`);

  // ─── Seed Dordt GSU 2025 Reference Case ────────────────────────────────────
  // Dordt is ONLY seeded as Reference Case #1 with case_id = dordt_gsu_2025.
  // It is NOT created as a project, workspace, or dashboard default.
  const DORDT_CASE_ID = "dordt_gsu_2025";
  const existingDordt = db.select().from(referenceCases).where(eq(referenceCases.caseId, DORDT_CASE_ID)).get();
  if (!existingDordt) {
    db.insert(referenceCases).values({
      id: `rc-${DORDT_CASE_ID}`,
      caseId: DORDT_CASE_ID,
      title: "Dordt GSU 2025 (Reference Case #1)",
      description: "Reference Case #1: Dordt University GSU 2025 valuation competition case. This case is a teaching example and reference artifact library. It is not a default project or workflow baseline. All artifacts from this case are labeled with case_id = dordt_gsu_2025. Dordt-specific values, assumptions, and conclusions are examples only and must not be applied to new projects without independent support.",
      sourceLabel: "Dordt University GSU 2025 Valuation Competition",
      isSeed: true, isReadonly: true, clonable: false,
      createdAt: now(), updatedAt: now(),
    }).run();
    console.log("  ✓ Dordt GSU 2025 reference case created (case_id = dordt_gsu_2025)");
  }

  // Seed Dordt artifacts — all must have caseId = dordt_gsu_2025
  const dordtArtifacts = [
    {
      id: `rca-dordt-company-profile`,
      artifactType: "company_profile_example",
      title: "[Dordt GSU 2025] Company Profile Example",
      body: `**Reference Case: Dordt GSU 2025 — Company Profile Example**
case_id: dordt_gsu_2025

This is a reference artifact from the Dordt GSU 2025 competition case. It demonstrates how to structure a company profile section for a business valuation report.

**Company Overview**
[Subject company name and business description were provided in the competition case. This artifact illustrates the structure and documentation approach.]

**Industry**
The subject company operated in [industry sector]. Industry characteristics relevant to the valuation included [description of key industry dynamics].

**Historical Financial Summary**
Historical financial performance was summarized over [X] years, including revenue, EBITDA, and net income trends. Normalization adjustments were documented separately.

**Purpose of This Artifact**
This artifact is a teaching example demonstrating the level of detail appropriate for a company profile in a valuation report. Clone and adapt this artifact for your own project with your specific company information.

⚠️ This is a reference example. Do not apply Dordt-specific facts to other projects without independent support.`,
    },
    {
      id: `rca-dordt-income-approach`,
      artifactType: "income_approach_methodology_example",
      title: "[Dordt GSU 2025] Income Approach Methodology Example",
      body: `**Reference Case: Dordt GSU 2025 — Income Approach Methodology Example**
case_id: dordt_gsu_2025

This artifact documents the income approach methodology applied in the Dordt GSU 2025 competition case. It is a teaching example showing the structure and documentation quality expected in a professional income approach analysis.

**Method Applied**
A discounted cash flow (DCF) method was applied. The DCF was prepared in an external Excel workbook. This artifact documents the support and reasoning — not the calculations.

**Projection Period**
[Competition case projection period and rationale documented here]

**Revenue Forecast Support**
Revenue was projected based on [competition case-specific rationale]. Historical revenue trends were analyzed. Management projections were reviewed for reasonableness.

**Discount Rate Support**
A WACC/build-up rate was developed in the external model. The support for each rate component is documented in the WACC support memo artifact.

**Terminal Value**
Terminal value was estimated using [method] in the external model. The terminal growth rate was supported by [evidence type].

**Lessons From This Case**
- Revenue forecast documentation should connect historical trends to projected growth
- Each WACC component requires a source with documented valuation-date relevance
- Terminal growth rate should be anchored to long-term economic data

⚠️ This artifact contains Dordt GSU 2025-specific methodology structure. Clone and adapt for your own project with your specific engagement facts.`,
    },
    {
      id: `rca-dordt-market-approach`,
      artifactType: "market_approach_methodology_example",
      title: "[Dordt GSU 2025] Market Approach Methodology Example",
      body: `**Reference Case: Dordt GSU 2025 — Market Approach Methodology Example**
case_id: dordt_gsu_2025

This artifact documents the market approach methodology from the Dordt GSU 2025 competition case. It is a teaching example.

**Methods Considered**
- Guideline Public Company Method (GPCM): [Applied / Considered]
- Guideline Transaction Method (GTM): [Applied / Considered]

**Transaction Search Process**
Guideline transactions were identified from [database sources used in the competition]. Initial search yielded [X] transactions. Transactions were screened for industry similarity, size, date relevance, and data availability.

**Comparability Analysis**
Selected transactions were assessed for comparability based on [criteria]. Excluded transactions were eliminated for [exclusion reasons].

**Level-of-Value Assessment**
Market evidence was [adjusted / not adjusted] for level-of-value differences with the subject interest.

**Lessons From This Case**
- Document transaction exclusion rationale explicitly
- Address level-of-value differences before applying market multiples
- Validate database multiple calculations when available

⚠️ This artifact contains Dordt GSU 2025-specific market approach structure. Clone and adapt for your own project.`,
    },
    {
      id: `rca-dordt-dlom-example`,
      artifactType: "dlom_narrative_example",
      title: "[Dordt GSU 2025] DLOM Support Narrative Example",
      body: `**Reference Case: Dordt GSU 2025 — DLOM Support Narrative Example**
case_id: dordt_gsu_2025

This artifact documents the discount for lack of marketability (DLOM) support narrative from the Dordt GSU 2025 competition case. It is a teaching example.

**Subject Interest**
The subject interest was [description from competition case — minority/control, percentage].

**Level-of-Value Starting Point**
The DLOM analysis started from [marketable minority / control] value indications developed in the external model.

**Marketability Restrictions**
The subject interest had the following marketability characteristics:
- Transfer restrictions: [Based on competition case documents]
- Distribution provisions: [Based on competition case documents]
- Redemption rights: [If applicable]

**Empirical Studies Referenced**
The following empirical studies were considered in the DLOM analysis:
- [Study type referenced in competition case]
- [Study range and central tendency]

**Subject-Specific Factors**
Factors supporting higher discount: [Competition case factors]
Factors supporting lower discount: [Competition case factors]

**Note on DLOM Selection**
The DLOM was selected in the external Excel workbook. This artifact documents the supporting narrative only. The selected DLOM is a Dordt GSU 2025-specific value and should not be applied to other engagements without independent analysis.

**Lessons From This Case**
- Connect subject-specific factors explicitly to empirical evidence
- Document the starting level of value before applying DLOM
- Address each Mandelbaum factor where relevant

⚠️ This is a reference example. The DLOM selected in this case is Dordt-specific. Do not use it as a benchmark for other engagements.`,
    },
    {
      id: `rca-dordt-reviewer-qa`,
      artifactType: "reviewer_qa_example",
      title: "[Dordt GSU 2025] Reviewer Q&A Example",
      body: `**Reference Case: Dordt GSU 2025 — Reviewer Q&A Example**
case_id: dordt_gsu_2025

This artifact contains example reviewer questions and response frameworks from the Dordt GSU 2025 competition case. These are teaching examples.

**Example Q&A Items**

**Q: Why was the income approach selected as the primary method?**
A (Example): The subject company had [X] years of operating history with consistent cash flows. Management projections were reviewed and found reasonable based on [comparison to historical performance and industry benchmarks]. The income approach reflected the company's earning capacity under market-participant assumptions.

**Q: How was the discount rate supported?**
A (Example): The WACC was developed using [build-up / CAPM] method. Each component was sourced from [sources] as of the valuation date. The company-specific risk premium was based on [documented factors]. Full documentation is in the WACC support memo.

**Q: How did you address level of value?**
A (Example): The subject interest represents a [control/minority] interest. The income approach was applied at [control/minority] level. [Discounts/premiums] were applied to reflect the characteristics of the subject interest. Level-of-value consistency was maintained across all methods.

**Q: What are the weaknesses of the market approach evidence used?**
A (Example): The primary limitation of the market evidence was [comparability issue]. This was addressed by [approach]. The limitations were considered in the weighting decision.

**Lessons From This Case**
- Prepare Q&A responses before the defense, not during
- Each answer should reference specific evidence and sources
- Acknowledge limitations proactively rather than waiting to be challenged

⚠️ These are Dordt GSU 2025-specific example responses. Adapt for your own engagement with your specific facts and evidence.`,
    },
    {
      id: `rca-dordt-lessons-learned`,
      artifactType: "lesson_learned",
      title: "[Dordt GSU 2025] Lessons Learned",
      body: `**Reference Case: Dordt GSU 2025 — Lessons Learned**
case_id: dordt_gsu_2025

This artifact captures lessons learned from the Dordt GSU 2025 competition experience. These lessons are generally applicable to business valuation work.

**Lesson 1: Start with the end narrative**
Draft the final conclusion narrative framework before completing the detailed analysis. This ensures the methodology is designed to support a defensible narrative, not retrofitted to a preferred number.

**Lesson 2: Document source relevance at the time of use**
Source relevance notes are easiest to write when you first use the source. Do not leave them until the report-writing stage.

**Lesson 3: Address excluded methods proactively**
Reviewers will ask about excluded methods. Prepare a concise exclusion rationale for each standard approach, even if it is a single sentence.

**Lesson 4: Distinguish management-provided support from independent evidence**
Keep clear track of which assumptions are management-provided versus independently corroborated. This distinction matters in review and litigation.

**Lesson 5: The external model is not self-documenting**
A well-built Excel model does not document why the assumptions are reasonable. The knowledge workpapers must do that work.

**Lesson 6: Comparability discussion comes before multiples**
Do not state what multiples were selected before explaining why the comparable companies or transactions were comparable. The selection process should be documented in full before the application.

**Future Checklist Prompts**
- Have I addressed all three valuation approaches?
- Does each material assumption have a source or documented judgment?
- Is level-of-value consistent across all methods?
- Have I prepared Q&A for the five most likely reviewer questions?

⚠️ These are general lessons derived from the Dordt GSU 2025 competition. They represent good practice guidance, not case-specific conclusions.`,
    },
    {
      id: `rca-dordt-report-language`,
      artifactType: "report_language_excerpt",
      title: "[Dordt GSU 2025] Report Language Scaffold Examples",
      body: `**Reference Case: Dordt GSU 2025 — Report Language Scaffold Examples**
case_id: dordt_gsu_2025

This artifact contains example report language scaffolds from the Dordt GSU 2025 competition case. These are teaching examples of how to draft professional valuation report language.

**Income Approach Introduction Example**
The income approach to value recognizes that the value of a business enterprise is equal to the present value of its expected future economic benefits. Under this approach, [external model type] was applied to project free cash flows over a [X]-year discrete period, with a terminal value representing continuing operations beyond the forecast period. The analysis was performed in [external workbook reference].

**Market Approach Introduction Example**
The market approach to value is predicated on the principle of substitution — a rational investor would pay no more for a business interest than the price of an equally desirable substitute investment. Guideline [public company / transaction] evidence was reviewed for its comparability to the subject company.

**Final Conclusion Introduction Example**
After applying the income and market approaches as described above, and considering the asset approach, the analyst concluded that the [method(s)] provide the most reliable indication of the fair market value of the subject interest. This conclusion reflects the relative reliability of the available evidence, the quality of the supporting data, and the analyst's professional judgment.

**Note on Usage**
These language scaffolds are starting points. They must be adapted with your specific facts, evidence, and conclusions. Do not use Dordt-specific language in a new engagement without replacement with your specific content.

⚠️ These are reference examples from the Dordt GSU 2025 competition. All company-specific details must be replaced for use in a new engagement.`,
    },
    {
      id: `rca-dordt-regression-fixture`,
      artifactType: "regression_fixture",
      title: "[Dordt GSU 2025] Regression Fixture — Seed Verification",
      body: `**Reference Case: Dordt GSU 2025 — Regression Fixture**
case_id: dordt_gsu_2025

This artifact serves as a regression fixture confirming that the Dordt GSU 2025 reference case was seeded correctly.

**Verification Checks**
- case_id = dordt_gsu_2025: ✓
- Reference case is_seed = true: ✓
- Reference case is_readonly = true: ✓
- Reference case clonable = false: ✓
- All artifacts have case_id = dordt_gsu_2025: ✓
- Dordt is not seeded as a project: ✓
- Dordt is not seeded as a workspace default: ✓
- No Dordt-specific valuation values in generic seed content: ✓

**Expected Behavior**
- Dordt case appears only under /reference-cases
- Dordt artifacts are read-only but clonable
- Cloned Dordt artifacts retain case_id attribution
- Search does not include Dordt by default unless includeReferenceCases=true

**Note**
This fixture is used for automated testing to confirm seed integrity.`,
    },
  ];

  let artifactCount = 0;
  for (const art of dordtArtifacts) {
    const existing = db.select().from(referenceCaseArtifacts).where(eq(referenceCaseArtifacts.id, art.id)).get();
    if (!existing) {
      db.insert(referenceCaseArtifacts).values({
        id: art.id, caseId: DORDT_CASE_ID,
        artifactType: art.artifactType, title: art.title, body: art.body,
        sourceNote: `Source: Dordt University GSU 2025 Competition Case. Reference example only. case_id = ${DORDT_CASE_ID}`,
        artifactMetadata: JSON.stringify({ caseId: DORDT_CASE_ID, isReferenceExample: true }),
        isSeed: true, isReadonly: true, clonable: true,
        reviewStatus: "approved",
        createdAt: now(), updatedAt: now(),
      }).run();
      artifactCount++;
    }
  }
  console.log(`  ✓ ${artifactCount} Dordt reference artifacts seeded (case_id = ${DORDT_CASE_ID})`);

  console.log("\n✅ Seed complete!");
  console.log("\n📋 Summary:");
  console.log(`   Playbooks: ${db.select().from(methodologyPlaybooks).all().length}`);
  console.log(`   Frameworks: ${db.select().from(decisionFrameworks).all().length}`);
  console.log(`   Principles: ${db.select().from(valuationPrinciples).all().length}`);
  console.log(`   Anti-patterns: ${db.select().from(valuationAntipatterns).all().length}`);
  console.log(`   Templates: ${db.select().from(reasoningTemplates).all().length}`);
  console.log(`   Q&A Prompts: ${db.select().from(qaItems).all().length}`);
  console.log(`   Reference Cases: ${db.select().from(referenceCases).all().length}`);
  console.log(`   Reference Artifacts: ${db.select().from(referenceCaseArtifacts).all().length}`);
  console.log(`   Tags: ${db.select().from(tags).all().length}`);
  console.log("\n🔑 Dordt Reference Case: case_id = dordt_gsu_2025 (read-only, not a project)");
  sqlite.close();
}

seed().catch(console.error);
