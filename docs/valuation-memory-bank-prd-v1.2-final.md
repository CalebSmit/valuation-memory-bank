# PRD: Valuation Memory Bank v1.2 Final — Knowledge + Methodology Memory Bank

Version: 1.2 Final  
Status: Build-ready MVP PRD  
Last updated: May 6, 2026  
Primary positioning: Valuation Memory Bank is a valuation knowledge-management product, not a valuation calculator, financial model, or automated valuation conclusion tool.

---

## 1. Product Overview

### 1.1 Product Name

Valuation Memory Bank

### 1.2 Product Description

Valuation Memory Bank is a private, workspace-based knowledge and methodology memory bank for business valuation professionals, finance students, analysts, reviewers, and small teams.

The app helps users preserve, organize, search, reuse, and improve valuation knowledge, methodology reasoning, source support, templates, review defense, Q&A, notes, lessons learned, external model references, and reference case artifacts.

The app does not calculate valuation outputs. Calculations happen outside the app in Excel, separate valuation workbooks, firm models, Google Sheets, or other external tools.

### 1.3 Product Category

Valuation Knowledge + Methodology Memory Bank

### 1.4 Product Summary

Valuation Memory Bank helps users answer questions such as:

- How should I think through this valuation methodology issue?
- Why would a method be appropriate or inappropriate?
- What evidence do I need to support an assumption?
- What sources support this reasoning?
- How should I explain this in a report?
- How should I defend this to a reviewer, judge, partner, professor, or client?
- What lessons have I learned from prior projects or reference cases?
- Which external workbook or model contains the actual calculations?

The app must not answer by producing calculated valuation conclusions, discount rates, DCF outputs, market approach values, DLOM percentages, asset approach values, sensitivity tables, method-weighted values, or final valuation conclusions.

### 1.5 Core Product Principle

Calculations happen outside the app.

Valuation Memory Bank stores the support around valuation work:

- Methodology guidance
- Decision logic
- Assumption rationale
- Source evidence
- Reviewer defense
- Report-language scaffolds
- Reference case examples
- Lessons learned
- Q&A preparation
- External model references
- Links between knowledge records

---

## 2. Product Positioning

### 2.1 Positioning Statement

Valuation Memory Bank is the memory layer for valuation methodology.

It is not the financial model. It is the organized, searchable, reusable body of professional reasoning that surrounds valuation models and workpapers.

### 2.2 Target Outcome

A user should be able to start a new valuation project, open relevant methodology playbooks, reuse reasoning templates, document assumptions and sources, link support to external Excel or Google Sheets models, prepare reviewer Q&A, save lessons learned, and clone useful prior knowledge into future work.

The product should make it easier to preserve judgment and support, not to automate valuation conclusions.

### 2.3 Product Goals

The MVP should prioritize:

- Reusable valuation methodology
- Reasoning frameworks
- Report-language scaffolds
- Reviewer, judge, partner, professor, and client defense
- Source and evidence organization
- Lessons learned
- Reference case artifact libraries
- Searchable knowledge
- Personal and team methodology libraries
- Lightweight project knowledge workspaces
- Clone/copy workflows
- Tags, favorites, and light review status
- External model references
- Optional AI-ready drafting and critique placeholders

### 2.4 Non-Goals

The MVP must explicitly exclude:

- DCF calculator
- WACC calculator
- DLOM calculator
- Market approach calculator
- Asset approach calculator
- Final reconciliation calculator
- Formula engine
- Sensitivity table engine
- Browser-native financial model
- Excel replacement functionality
- Spreadsheet-like modeling environment
- Automated valuation conclusion
- AI-generated final valuation conclusion
- Acceptance criteria requiring exact valuation values to calculate correctly
- Hardcoded Dordt assumptions outside the Dordt reference case artifact library

---

## 3. What This App Is / Is Not

### 3.1 What This App Is

Valuation Memory Bank is:

- A valuation knowledge base
- A methodology library
- A reasoning and report-language workspace
- A source and evidence organizer
- A reference case library
- A reviewer Q&A preparation tool
- A lessons-learned system
- A lightweight project documentation workspace
- A place to preserve judgment, not compute value
- A link hub for external workbooks, models, and supporting documents

### 3.2 What This App Is Not

Valuation Memory Bank is not:

- A valuation calculator
- A financial model
- A DCF engine
- A WACC calculator
- A DLOM calculator
- A market approach calculator
- An asset approach calculator
- A final reconciliation calculator
- A replacement for Excel, Google Sheets, or firm models
- An automated appraisal conclusion tool
- A browser-native valuation model
- A system that produces client-ready valuation opinions without professional review

---

## 4. Users

### 4.1 Primary Users

- Entry-level valuation analysts
- Business valuation interns
- Finance students
- Valuation competition participants
- Senior reviewers and mentors
- Small business valuation teams
- Independent valuation professionals
- Analysts preparing workpapers, memos, or reports

### 4.2 User Jobs

Users need to:

- Find guidance for a valuation method or support issue
- Draft defensible language for a report section
- Understand why a method may or may not be appropriate
- Preserve source support for assumptions
- Link assumptions to evidence
- Reference external Excel models without recreating them
- Prepare for reviewer, judge, partner, professor, or client questions
- Reuse prior methodology and lessons learned
- Clone useful templates, playbooks, and reference artifacts
- Avoid common valuation reasoning mistakes

### 4.3 User Personas

#### Analyst

Needs quick access to playbooks, templates, assumptions, source support, external model references, and reviewer questions while building valuation workpapers in external tools.

#### Reviewer

Needs to inspect reasoning quality, identify missing support, flag anti-patterns, and help analysts improve methodology documentation.

#### Student

Needs teaching examples, reference cases, decision frameworks, Q&A prompts, and report-language scaffolds.

#### Solo Practitioner

Needs a reusable personal methodology library, project notes, source organization, and lightweight review statuses.

---

## 5. MVP Scope

### 5.1 MVP Focus

The MVP is a CRUD-first knowledge-management web app with polished finance SaaS UI.

The app should support:

- Workspaces
- Projects as lightweight knowledge workspaces
- Methodology playbooks
- Decision frameworks
- Valuation principles
- Anti-patterns
- Reasoning templates
- Reference cases
- Reference case artifacts
- Assumption library
- Source library
- Evidence links
- External model references
- Support memos
- Q&A bank
- Notes
- Lessons learned
- Tags
- Favorites
- Search
- Clone/copy workflows
- Light review status
- AI-ready placeholders

### 5.2 Explicitly Out of Scope

The MVP must not include:

- Calculator pages
- Calculation modules
- Formula dependency graphs
- Scenario runs
- Sensitivity grids
- Automatic method weighting
- Automatic value conclusions
- Spreadsheet-like model builders
- Live Excel parsing
- Complex approval workflows
- Real-time collaboration
- Enterprise permission matrices
- Data vendor integrations
- Client portals

---

## 6. Core Modules

### 6.1 Workspace System

Workspaces organize user-created and team-created knowledge.

Requirements:

- User can create a workspace.
- User can switch between workspaces.
- Most records are scoped to a workspace.
- Global seed content can be cloned into a workspace.
- Workspace settings include name, description, default currency label, and optional firm/class/team label.
- MVP permissions can be simple: `owner`, `editor`, `viewer`.
- Local/mock auth is acceptable for MVP if real auth is not configured.

### 6.2 Projects

Projects are lightweight knowledge workspaces tied to a valuation assignment, class case, client matter, or internal training file.

Projects store methodology support, sources, assumptions, notes, Q&A, external model references, support memos, and lessons learned.

Projects do not calculate value.

Example project fields:

- Project name
- Client or subject company label
- Assignment type
- Industry
- Valuation date
- Report date
- Standard of value
- Premise of value
- Subject interest
- Level of value
- Intended use
- Intended users
- Status
- Notes

A user must be able to create a blank project without Dordt content, Dordt defaults, Dordt assumptions, or Dordt workflow steps.

### 6.3 Methodology Playbooks

Playbooks explain how to think through valuation topics. Playbooks should be reusable and cloneable.

Example playbooks:

- Income Approach Knowledge Page
- DCF Methodology Support Playbook
- WACC / Build-Up Method Support Playbook
- Revenue Forecast Support Playbook
- Normalization Adjustment Playbook
- Market Approach Selection Playbook
- Guideline Transaction Screening Playbook
- Guideline Public Company Screening Playbook
- Asset Approach Role Playbook
- DLOM Support Narrative Playbook
- Level-of-Value Explanation Playbook
- Final Conclusion Narrative Playbook

A playbook should include:

- Purpose
- When to use
- When not to use
- Key concepts
- Required evidence
- Common sources
- Reviewer questions
- Common mistakes
- Report-language examples
- Related principles
- Related anti-patterns
- Related reasoning templates
- Related reference case artifacts

Playbooks must not calculate outputs.

### 6.4 Decision Frameworks

Decision frameworks help users make and document methodology choices. Frameworks do not calculate outputs.

Example frameworks:

- Income approach applicability framework
- Market approach applicability framework
- Asset approach role framework
- Revenue forecast support framework
- Normalization adjustment decision framework
- DLOM support framework
- Level-of-value framework
- Method weighting rationale framework
- Management projection reasonableness framework
- Guideline company comparability framework

Framework fields:

- Title
- Purpose
- Decision question
- Inputs to consider
- Decision criteria
- Evidence needed
- Possible outcomes
- Reviewer prompts
- Example application
- Related playbooks/templates

### 6.5 Valuation Principles Library

Principles are concise, reusable valuation reasoning rules.

Examples:

- External models produce calculations; this app preserves support.
- Every material assumption should have source support or documented reviewer judgment.
- Match the level of value to the subject interest being valued.
- Separate management-provided support from independent market evidence.
- Explain why excluded methods were not meaningful.
- Avoid using a reference case assumption as a project assumption without independent support.
- Preserve valuation-date relevance for key evidence.
- Distinguish qualitative support from quantitative model output.
- Tie report language to actual sources and assumptions.
- Document reviewer judgment when empirical support is limited.

Principles can be linked to playbooks, templates, support memos, Q&A, and anti-patterns.

### 6.6 Anti-Patterns Library

Anti-patterns are common mistakes users should avoid.

Examples:

- Treating external model output as self-supporting
- Explaining WACC only by listing components without rationale
- Using generic DLOM language without subject-interest support
- Copying a reference case assumption into a live project without independent evidence
- Selecting market evidence without comparability discussion
- Treating management projections as automatically reasonable
- Failing to explain excluded methods
- Mixing control and minority levels of value
- Using stale sources without valuation-date relevance
- Writing conclusion language that does not connect to method strengths and weaknesses
- Treating an asset approach as irrelevant without explanation
- Over-relying on a method because it produced the preferred answer in an external model

Anti-patterns should include:

- Description
- Why it matters
- Warning signs
- How to fix
- Related playbooks
- Related principles
- Related templates
- Optional reference examples

### 6.7 Reasoning Templates

Reasoning templates help users draft support language. Templates provide scaffolds, not final conclusions.

Example templates:

- WACC support memo scaffold
- Revenue forecast support memo scaffold
- Normalization adjustment rationale
- Market approach selection rationale
- Guideline transaction screening rationale
- DLOM support narrative
- Level-of-value explanation
- Method weighting rationale
- Final conclusion narrative scaffold
- Management projection reasonableness memo
- Asset approach role explanation
- Source reliability explanation
- Reviewer response template
- Report section transition language

Template fields:

- Template name
- Use case
- Prompt scaffold
- Required supporting inputs
- Optional supporting inputs
- Example output
- Related playbooks
- Related frameworks
- Related principles
- AI drafting allowed flag
- Status

Templates must not calculate or recommend values.

### 6.8 Reference Case Library

Reference cases are teaching examples and reusable artifact libraries. They are not default workflows. Users must explicitly open the Reference Case Library to view them.

Reference cases can contain:

- Case metadata
- Example assumptions
- Example sources
- Example support memos
- Example Q&A
- Example report language
- Example lessons learned
- Example methodology artifacts
- Extracted artifacts from decks or reports
- Regression fixtures for seed loading and prompt behavior

### 6.9 Reference Case Artifacts

Reference case artifacts are atomic, searchable items inside a reference case.

Artifact types:

- Company profile example
- Industry outlook example
- Source citation example
- Assumption rationale example
- Income approach methodology example
- Market approach methodology example
- Asset approach methodology example
- DLOM narrative example
- Level-of-value explanation
- Final conclusion narrative example
- Reviewer Q&A example
- Lesson learned
- Report language excerpt
- Template example
- Regression fixture

Artifacts are read-only by default but clonable into a workspace or project.

### 6.10 Assumption Library

Assumptions capture externally developed or analyst-selected assumptions and the reasoning behind them.

The app may store assumption text and support, but it must not calculate with assumptions.

Assumption records should support:

- Name
- Category
- Stated assumption text
- Context
- External model reference
- Method area
- Rationale
- Source links
- Evidence strength
- Review status
- Tags

Example categories:

- Revenue forecast
- Margin expectation
- Normalization adjustment
- Discount rate support
- Company-specific risk discussion
- Market approach selection
- DLOM support
- Level of value
- Asset approach role
- Final conclusion narrative support

### 6.11 Source Library

Sources are reusable evidence records.

Source types:

- Company document
- Management interview
- Financial statement
- Industry report
- Economic data
- Market data
- Transaction data
- Standard or guidance
- Academic article
- Court case
- Prior workpaper
- Web source
- Other

Source fields should include:

- Title
- Publisher/author
- Source type
- Publication date
- Valuation-date relevance note
- URL or file reference
- Citation text
- Reliability assessment
- Notes
- Tags

### 6.12 Evidence Links

Evidence links connect sources to assumptions, support memos, Q&A, notes, lessons, playbooks, templates, or reference artifacts. An evidence link explains why a source supports a piece of reasoning.

Fields:

- Source ID
- Target entity type
- Target entity ID
- Support type
- Relevance note
- Strength rating
- Page/section reference
- Quote or paraphrase note
- Created by

Support types:

- Direct support
- Background context
- Contradictory evidence
- Management-provided support
- Market evidence
- Professional judgment support
- Reviewer-requested support

### 6.13 External Model References

External model references point to Excel files, firm models, cloud documents, or other external tools where actual calculations are performed.

The app does not parse, validate, or recalculate these models in MVP.

Purpose:

- Preserve where the calculation lives.
- Document who prepared it.
- Link model output references to assumptions, sources, templates, Q&A, and support memos.
- Allow report-language and reviewer-defense work to reference the external model without replacing it.

Required fields:

- `id`
- `workspace_id`
- `project_id`
- `title`
- `model_type`
- `tool_used`
- `file_or_url_reference`
- `version_label`
- `prepared_by`
- `prepared_date`
- `notes`
- `linked_assumptions`
- `linked_sources`
- `linked_reasoning_templates`
- `linked_qa_items`
- `review_status`

Example model types:

- DCF workbook
- WACC support workbook
- Market approach workbook
- Asset approach workbook
- DLOM support file
- Final valuation workbook
- Management projection file
- Industry analysis file
- Other

### 6.14 Support Memos

Support memos are project-specific or reusable narratives that document reasoning.

They can link to playbooks, frameworks, templates, assumptions, sources, and external model references.

Required fields:

- `id`
- `workspace_id`
- `project_id`
- `memo_type`
- `title`
- `body`
- `linked_playbook_id`
- `linked_framework_id`
- `linked_template_id`
- `linked_assumptions`
- `linked_sources`
- `linked_external_model_reference`
- `review_status`
- `tags`

Example memo types:

- WACC support memo
- Revenue forecast support memo
- Normalization support memo
- Market approach selection memo
- Guideline transaction screening memo
- Asset approach role memo
- DLOM support memo
- Level-of-value memo
- Method weighting rationale memo
- Final conclusion narrative memo
- Reviewer response memo
- Source reliability memo

Support memos store reasoning, sources, and reviewer defense. They must not calculate values or produce final valuation conclusions.

### 6.15 Q&A Bank

The Q&A bank helps users prepare for reviewers, judges, partners, clients, professors, and oral defense.

Q&A items can be global, workspace-level, project-specific, or reference-case-specific.

Q&A fields:

- Question
- Answer scaffold
- Draft answer
- Linked assumptions
- Linked sources
- Linked support memo
- Linked playbook
- Linked framework
- Linked template
- Difficulty
- Audience
- Status
- Tags

Audience examples:

- Reviewer
- Partner
- Client
- Judge
- IRS
- Court
- Professor
- Internal team

### 6.16 Notes

Notes are flexible text records. They can be attached to a workspace, project, playbook, framework, source, support memo, reference artifact, or external model reference.

Note fields:

- Title
- Body
- Entity link
- Visibility
- Tags
- Favorite flag
- Review status

### 6.17 Lessons Learned

Lessons learned preserve what the user or team should remember for future projects.

Fields:

- Title
- Lesson
- Context
- Mistake avoided
- Future checklist prompt
- Related anti-pattern
- Related principle
- Related project
- Related reference case
- Tags
- Status

### 6.18 Tags

Tags provide flexible organization across all content types.

Requirements:

- Users can create tags.
- Users can apply tags to records.
- Users can filter lists by tags.
- Seed content includes helpful default tags.
- Dordt artifacts must include `case_id = dordt_gsu_2025`.

### 6.19 Favorites

Favorites let users quickly access frequently used assets.

Supported favorite targets:

- Playbooks
- Frameworks
- Principles
- Anti-patterns
- Reasoning templates
- Reference cases
- Reference artifacts
- Projects
- Sources
- Support memos
- External model references
- Q&A items
- Notes
- Lessons learned

### 6.20 Search

Search should work across all major content types. MVP search can use SQLite/D1 text search where practical, with fallback `LIKE` search.

Search requirements:

- Global search page
- Search from sidebar/top bar
- Filter by content type
- Filter by workspace
- Filter by project
- Filter by tag
- Filter by review status
- Filter by reference case
- Show matched title, snippet, type, tags, and linked project/workspace
- Search must include Dordt only when reference cases are included in scope or explicitly filtered

### 6.21 Clone/Copy Workflows

Users can clone seed content, reference artifacts, templates, playbooks, frameworks, and Q&A items.

Clone behavior:

- Original record remains read-only if it is seed/reference content.
- Cloned record becomes editable.
- Clone stores `cloned_from_type` and `cloned_from_id`.
- Clone creates an activity log entry.
- Clone preserves source attribution.
- Clone should not copy Dordt-specific case assumptions into generic project fields without preserving source attribution.
- Clone should ask for target workspace and optional target project when applicable.

### 6.22 Light Review Status

MVP review status is intentionally simple.

Allowed statuses:

- Draft
- In review
- Needs support
- Approved
- Archived

Review status can apply to:

- Playbooks
- Frameworks
- Templates
- Assumptions
- Sources
- Evidence links
- Support memos
- Q&A items
- Notes
- Lessons learned

No enterprise approval workflow is required in MVP.

---

## 7. Methodology Knowledge Pages

### 7.1 Income Approach Knowledge Page

Purpose: store methodology notes, evidence requirements, reviewer prompts, and report-language guidance for externally prepared income approach work.

The page should include:

- When income approach may be appropriate
- Key support areas
- Forecast support questions
- Terminal value support questions
- Discount rate support questions
- Common anti-patterns
- Source examples
- Report-language scaffolds
- External model reference prompts

The page must not calculate DCF value, FCFF, terminal value, or sensitivity outputs.

### 7.2 WACC / Build-Up Method Playbook

Purpose: store guidance, sources, rationale templates, and reviewer prompts for supporting a WACC or build-up rate selected in an external model.

The page should include:

- Evidence users commonly need
- How to explain component selection
- How to discuss company-specific risk
- Common source types
- Reviewer challenge prompts
- Support memo template links
- Anti-patterns

The page must not calculate WACC.

### 7.3 Revenue Forecast Support Playbook

Purpose: help users document the reasoning behind revenue projections used in external models.

The page should include:

- Historical trend support
- Management forecast support
- Industry support
- Customer concentration considerations
- Capacity constraints
- Pricing/volume distinction
- Forecast reasonableness prompts
- Report-language examples

The page must not calculate forecast schedules.

### 7.4 Market Approach Selection Framework

Purpose: help users decide whether and how market approach evidence should be used.

The framework should include:

- Guideline public company considerations
- Guideline transaction considerations
- Comparability factors
- Data availability
- Reliability concerns
- Level-of-value concerns
- Selection rationale prompts
- Exclusion rationale prompts

The framework must not calculate selected multiples or market value.

### 7.5 Guideline Transaction Screening Checklist

Purpose: help users document transaction comparability and exclusion decisions.

Checklist items:

- Industry similarity
- Size similarity
- Date relevance
- Transaction structure
- Buyer type
- Financial metric availability
- Outlier considerations
- Level-of-value implications
- Source reliability

The checklist must not compute transaction multiples.

### 7.6 Asset Approach Role Framework

Purpose: help users explain the role of the asset approach in a valuation.

Possible roles:

- Primary method
- Secondary method
- Floor-value reference
- Reasonableness check
- Not meaningful due to going-concern economics
- Not meaningful due to lack of reliable asset data

The framework must not calculate adjusted book value or asset fair market value.

### 7.7 DLOM Support Narrative Template

Purpose: help users draft support around a DLOM selected outside the app.

The template should include:

- Subject interest context
- Level-of-value bridge
- Marketability restrictions
- Empirical study discussion placeholder
- Qualitative factor discussion
- Reviewer challenge prompts
- Evidence links

The template must not calculate a DLOM.

### 7.8 Level-of-Value Explanation Template

Purpose: help users explain control, minority, marketable, and nonmarketable levels of value.

The template should include:

- Subject interest
- Control rights
- Marketability characteristics
- Method consistency
- Discount/premium ordering discussion
- Reviewer defense prompts

The template must not calculate discounts or premiums.

### 7.9 Method Weighting Rationale Template

Purpose: help users document why one method received more or less reliance in an externally prepared valuation conclusion.

The template should include:

- Reliability of each method
- Source quality
- Company-specific fit
- Data limitations
- Consistency with standard of value
- Final narrative scaffold

The template must not calculate method weights or weighted conclusions.

### 7.10 Final Conclusion Narrative Template

Purpose: help users draft narrative language around an externally prepared final conclusion.

The template should include:

- Methods considered
- Methods relied upon
- Methods excluded
- Strengths and weaknesses
- Level-of-value consistency
- Source support
- Reviewer defense prompts

The template must not calculate, recommend, or generate a final value.

---

## 8. Information Architecture

### 8.1 Global Navigation

- Dashboard
- Workspaces
- Projects
- Playbooks
- Frameworks
- Principles
- Anti-Patterns
- Reasoning Templates
- Reference Cases
- Sources
- Q&A
- Notes
- Lessons
- Search
- Settings

### 8.2 Project Navigation

Inside `/projects/:id`:

- Overview
- Assumptions
- Sources
- Evidence Links
- External Models
- Support Memos
- Q&A
- Notes
- Lessons
- Related Playbooks
- Related Templates
- Activity

### 8.3 Methodology Navigation

Inside playbooks and frameworks:

- Overview
- When to use
- Evidence needed
- Reviewer prompts
- Anti-patterns
- Templates
- Reference examples
- Related sources
- Clone/copy actions

### 8.4 Reference Case Navigation

Inside `/reference-cases/:caseId`:

- Case overview
- Artifacts
- Sources
- Assumptions
- Support memos
- Q&A
- Lessons learned
- Related playbooks
- Clone/copy artifacts

Reference cases are not shown as default projects.

---

## 9. Recommended Technical Stack

### 9.1 Fixed Stack

The build agent should use this stack unless a hard local compatibility issue requires a small documented adjustment:

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI: shadcn/ui
- ORM: Drizzle ORM
- Database: SQLite locally, Cloudflare D1-compatible schema
- Deployment target: Cloudflare Pages
- Auth: local/mock auth placeholder or Clerk-ready structure
- File storage: metadata-only records in MVP; Cloudflare R2 reserved for later
- Search: SQLite/D1 full-text search where available, fallback `LIKE` search for MVP
- Rich text: Markdown textarea for MVP
- Icons: lucide-react
- Forms: react-hook-form + zod
- Tables: simple shadcn tables or TanStack Table if already practical
- Tests: Vitest for unit/integration logic; Playwright optional if time permits

### 9.2 Architecture Principles

- CRUD-first
- Workspace-scoped
- Cloneable seed content
- Read-only seed/reference records
- No calculation engine
- No valuation math dependency graph
- Searchable text everywhere
- Link records through join tables or simple polymorphic links
- Keep MVP deployable without paid vendor data
- Make AI optional and non-blocking
- Store enough metadata for future AI support
- Keep local setup simple

### 9.3 Recommended Folder Structure

Use a clear Next.js App Router structure:

```txt
valuation-memory-bank/
  app/
    api/
      activity/
      ai-tasks/
      anti-patterns/
      assumptions/
      evidence-links/
      external-model-references/
      favorites/
      frameworks/
      lessons/
      me/
      notes/
      playbooks/
      principles/
      projects/
      qa/
      reasoning-templates/
      reference-artifacts/
      reference-cases/
      search/
      sources/
      support-memos/
      tag-links/
      tags/
      workspaces/
    dashboard/
    workspaces/
    projects/
    playbooks/
    frameworks/
    principles/
    anti-patterns/
    reasoning-templates/
    reference-cases/
    sources/
    qa/
    notes/
    lessons/
    search/
    settings/
    layout.tsx
    page.tsx
  components/
    shell/
    dashboard/
    workspace/
    project/
    methodology/
    reference-cases/
    evidence/
    knowledge-capture/
    utility/
    ui/
  db/
    schema.ts
    client.ts
    migrations/
  docs/
    valuation-memory-bank-prd-v1.2-final.md
  lib/
    auth/
    clone/
    constants/
    search/
    validation/
    utils.ts
  scripts/
    seed.ts
    seed-data/
      generic/
      reference-cases/
        dordt-gsu-2025.ts
  tests/
    unit/
    integration/
  public/
  .env.example
  README.md
  drizzle.config.ts
  package.json
  tailwind.config.ts
  tsconfig.json
```

### 9.4 Implementation Priorities

Build in this order:

1. Project scaffold and UI shell.
2. Database schema and Drizzle migrations.
3. Local/mock auth and active workspace handling.
4. Seed script and seed data.
5. Workspace and project CRUD.
6. Core methodology CRUD.
7. Project knowledge CRUD.
8. Tags, favorites, review status.
9. Reference cases and Dordt handling.
10. Clone workflows.
11. Search.
12. AI placeholder UI and `ai_tasks`.
13. Tests, README, deployment notes, GitHub-ready handoff.

---

## 10. Data Model

### 10.1 Shared Conventions

All core tables should include:

- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

Most content tables should include:

- `workspace_id`
- `project_id` nullable where applicable
- `scope`
- `status`
- `review_status`
- `is_seed`
- `is_readonly`
- `clonable`
- `cloned_from_type`
- `cloned_from_id`
- `case_id` nullable where reference-case linkage may exist

Recommended enums:

```ts
type ContentScope = "global_seed" | "workspace" | "project" | "reference_case";

type ReviewStatus =
  | "draft"
  | "in_review"
  | "needs_support"
  | "approved"
  | "archived";

type Visibility = "private" | "workspace" | "global_seed";

type EvidenceStrength =
  | "strong"
  | "moderate"
  | "weak"
  | "unsupported"
  | "conflicting"
  | "management_only"
  | "reviewer_judgment";
```

### 10.2 Core Tables

The MVP schema should include these tables:

- `users`
- `user_profiles`
- `workspaces`
- `workspace_memberships`
- `projects`
- `methodology_playbooks`
- `decision_frameworks`
- `valuation_principles`
- `valuation_antipatterns`
- `reasoning_templates`
- `reference_cases`
- `reference_case_artifacts`
- `assumptions`
- `sources`
- `evidence_links`
- `external_model_references`
- `support_memos`
- `qa_items`
- `notes`
- `lessons_learned`
- `tags`
- `tag_links`
- `favorites`
- `activity_log`
- `ai_tasks`
- `files`

### 10.3 Removed Calculation Tables

Do not create these tables:

- `fcff_schedules`
- `forecast_schedules` as calculation engines
- `wacc_components` as calculation rows
- `sensitivity_cells`
- `final_reconciliations` as calculation chains
- `scenario_runs`
- Any formula/computed field infrastructure tied to valuation math

If method-specific records are needed, use narrative-oriented records such as:

- `method_notes`
- `method_rationales`
- `external_model_references`
- `support_memos`
- `reviewer_defense_items`

### 10.4 Minimum Table Expectations

#### `workspaces`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `name` | text | Required |
| `description` | text nullable | Optional |
| `default_currency_label` | text nullable | Label only, no calculation behavior |
| `firm_or_team_label` | text nullable | Optional |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

#### `projects`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text | Required |
| `name` | text | Required |
| `subject_company_label` | text nullable | Optional |
| `assignment_type` | text nullable | Optional |
| `industry` | text nullable | Optional |
| `valuation_date` | date nullable | Metadata only |
| `report_date` | date nullable | Metadata only |
| `standard_of_value` | text nullable | Optional |
| `premise_of_value` | text nullable | Optional |
| `subject_interest` | text nullable | Optional |
| `level_of_value` | text nullable | Optional |
| `intended_use` | text nullable | Optional |
| `intended_users` | text nullable | Optional |
| `status` | text | Default `active` |
| `notes` | markdown nullable | Optional |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

#### `methodology_playbooks`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text nullable | Null for global seed |
| `scope` | text | `global_seed`, `workspace`, `project`, or `reference_case` |
| `title` | text | Required |
| `slug` | text | Required |
| `purpose` | markdown | Required |
| `when_to_use` | markdown nullable | Optional |
| `when_not_to_use` | markdown nullable | Optional |
| `key_concepts` | markdown nullable | Optional |
| `required_evidence` | markdown nullable | Optional |
| `common_sources` | markdown nullable | Optional |
| `reviewer_questions` | markdown nullable | Optional |
| `common_mistakes` | markdown nullable | Optional |
| `report_language_examples` | markdown nullable | Scaffold examples only |
| `review_status` | text | Required |
| `is_seed` | boolean | Required |
| `is_readonly` | boolean | Required |
| `clonable` | boolean | Required |
| `case_id` | text nullable | Required for reference case content |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

Use comparable fields for `decision_frameworks`, `valuation_principles`, `valuation_antipatterns`, and `reasoning_templates`, adjusted for each content type.

#### `reference_cases`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `case_id` | text | Unique canonical ID |
| `title` | text | Required |
| `description` | markdown nullable | Optional |
| `source_label` | text nullable | Optional |
| `is_seed` | boolean | Required |
| `is_readonly` | boolean | Required |
| `clonable` | boolean | Usually false at case level |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

#### `reference_case_artifacts`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `case_id` | text | Required |
| `artifact_type` | text | Required |
| `title` | text | Required |
| `body` | markdown | Required |
| `source_note` | text nullable | Optional |
| `artifact_metadata` | json/text nullable | Optional |
| `is_seed` | boolean | Required |
| `is_readonly` | boolean | Required |
| `clonable` | boolean | Required |
| `review_status` | text | Default `approved` or `draft` |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

#### `external_model_references`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text | Required |
| `project_id` | text | Required |
| `title` | text | Required |
| `model_type` | text | DCF workbook, market approach workbook, etc. |
| `tool_used` | text | Excel, Google Sheets, firm model, other |
| `file_or_url_reference` | text nullable | Path, filename, URL, or description |
| `version_label` | text nullable | Example: v1, management case, revised |
| `prepared_by` | text nullable | Optional |
| `prepared_date` | date nullable | Optional |
| `notes` | markdown nullable | Optional |
| `review_status` | text | Light review |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

Use linking tables or JSON arrays for linked assumptions, sources, templates, and Q&A. Simpler JSON arrays are acceptable for MVP.

#### `support_memos`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text | Required |
| `project_id` | text nullable | Optional |
| `memo_type` | text | Required |
| `title` | text | Required |
| `body` | markdown | Required |
| `linked_playbook_id` | text nullable | Optional |
| `linked_framework_id` | text nullable | Optional |
| `linked_template_id` | text nullable | Optional |
| `linked_assumptions` | text/json | Array of IDs |
| `linked_sources` | text/json | Array of IDs |
| `linked_external_model_reference` | text nullable | FK external model reference |
| `review_status` | text | Light review |
| `tags` | text/json | Array of tag IDs or slugs |
| `case_id` | text nullable | Reference case linkage if applicable |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

#### `tags`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text nullable | Null for global seed tags |
| `name` | text | Required |
| `slug` | text | Required |
| `color` | text nullable | Optional |
| `is_seed` | boolean | Required |

#### `tag_links`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `tag_id` | text | Required |
| `entity_type` | text | Required |
| `entity_id` | text | Required |

#### `favorites`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `user_id` | text | Required |
| `workspace_id` | text nullable | Optional |
| `entity_type` | text | Required |
| `entity_id` | text | Required |
| `created_at` | timestamp | Required |

#### `activity_log`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text nullable | Optional |
| `project_id` | text nullable | Optional |
| `actor_id` | text nullable | Local/mock user acceptable |
| `action` | text | Example: created, updated, cloned |
| `entity_type` | text | Required |
| `entity_id` | text | Required |
| `metadata` | json/text nullable | Optional |
| `created_at` | timestamp | Required |

#### `ai_tasks`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text nullable | Optional |
| `project_id` | text nullable | Optional |
| `task_type` | text | Draft, critique, summarize, etc. |
| `status` | text | Placeholder/mock status |
| `prompt_version` | text nullable | Optional |
| `input_references` | json/text nullable | Linked records |
| `output_preview` | markdown nullable | Mock or placeholder only |
| `created_at` | timestamp | Required |

#### `files`

| Field | Type | Notes |
|---|---:|---|
| `id` | text | Primary key |
| `workspace_id` | text | Required |
| `project_id` | text nullable | Optional |
| `title` | text | Required |
| `file_name` | text nullable | Metadata only |
| `file_type` | text nullable | Metadata only |
| `storage_mode` | text | Default `metadata_only` |
| `url_or_path` | text nullable | Optional |
| `notes` | markdown nullable | Optional |
| `created_at` | timestamp | Required |
| `updated_at` | timestamp | Required |

The MVP should not upload, parse, or inspect file contents unless implemented as simple metadata-only records.

---

## 11. Relationships

### 11.1 Core Relationships

- A user can belong to many workspaces.
- A workspace has many projects.
- A workspace has many playbooks, frameworks, principles, anti-patterns, templates, sources, assumptions, support memos, Q&A items, notes, and lessons.
- A project can have many assumptions, sources, evidence links, external model references, support memos, Q&A items, notes, and lessons.
- A source can support many targets through evidence links.
- A support memo can link to assumptions, sources, templates, playbooks, frameworks, and external model references.
- A reference case has many reference case artifacts.
- Any tag can link to any supported content entity.
- Any supported content entity can be favorited.

### 11.2 Polymorphic Link Strategy

For MVP, use simple polymorphic fields:

- `entity_type`
- `entity_id`
- `target_type`
- `target_id`

Do not overbuild a graph database.

### 11.3 Clone Strategy

For cloneable records, store:

- `cloned_from_type`
- `cloned_from_id`
- `is_seed = false`
- `is_readonly = false`
- `workspace_id = active workspace`
- `project_id = selected project if applicable`

Reference case clones should preserve source attribution.

For Dordt clones, preserve:

- `cloned_from_type`
- `cloned_from_id`
- `case_id = dordt_gsu_2025` in attribution metadata
- A visible note that the cloned record originated from Reference Case #1

### 11.4 Read-Only Seed Rules

Seed records and reference case artifacts must be protected in the UI and API.

Rules:

- `PATCH` and `DELETE` should reject records where `is_readonly = true`.
- Clone routes should be allowed when `clonable = true`.
- Clones become editable workspace/project records.
- Seed content should not be silently copied into a user project without explicit clone/copy action.

---

## 12. API Routes

Use Next.js App Router route handlers under `/app/api`.

All routes should validate input with zod, enforce read-only rules, return JSON, and create activity log entries for create/update/delete/clone actions where practical.

### 12.1 Auth and Profile

- `GET /api/me`
- `PATCH /api/me/profile`

### 12.2 Workspaces

- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/workspaces/:id`
- `PATCH /api/workspaces/:id`
- `DELETE /api/workspaces/:id`
- `GET /api/workspaces/:id/members`
- `POST /api/workspaces/:id/members`
- `PATCH /api/workspaces/:id/members/:membershipId`
- `DELETE /api/workspaces/:id/members/:membershipId`

### 12.3 Projects

- `GET /api/projects?workspaceId=`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/projects/:id/dashboard`

### 12.4 Methodology Assets

- `GET /api/playbooks?workspaceId=&scope=&tag=`
- `POST /api/playbooks`
- `GET /api/playbooks/:id`
- `PATCH /api/playbooks/:id`
- `DELETE /api/playbooks/:id`
- `POST /api/playbooks/:id/clone`

- `GET /api/frameworks?workspaceId=&scope=&tag=`
- `POST /api/frameworks`
- `GET /api/frameworks/:id`
- `PATCH /api/frameworks/:id`
- `DELETE /api/frameworks/:id`
- `POST /api/frameworks/:id/clone`

- `GET /api/principles?workspaceId=&tag=`
- `POST /api/principles`
- `GET /api/principles/:id`
- `PATCH /api/principles/:id`
- `DELETE /api/principles/:id`
- `POST /api/principles/:id/clone`

- `GET /api/anti-patterns?workspaceId=&tag=`
- `POST /api/anti-patterns`
- `GET /api/anti-patterns/:id`
- `PATCH /api/anti-patterns/:id`
- `DELETE /api/anti-patterns/:id`
- `POST /api/anti-patterns/:id/clone`

- `GET /api/reasoning-templates?workspaceId=&tag=`
- `POST /api/reasoning-templates`
- `GET /api/reasoning-templates/:id`
- `PATCH /api/reasoning-templates/:id`
- `DELETE /api/reasoning-templates/:id`
- `POST /api/reasoning-templates/:id/clone`
- `POST /api/reasoning-templates/:id/draft-placeholder`

The `draft-placeholder` route may create a mock `ai_tasks` row but must not call a live AI provider unless explicitly configured.

### 12.5 Reference Cases

- `GET /api/reference-cases`
- `POST /api/reference-cases`
- `GET /api/reference-cases/:caseId`
- `PATCH /api/reference-cases/:caseId`
- `GET /api/reference-cases/:caseId/artifacts`
- `POST /api/reference-cases/:caseId/artifacts`
- `GET /api/reference-artifacts/:id`
- `PATCH /api/reference-artifacts/:id`
- `POST /api/reference-artifacts/:id/clone`

Seed reference cases should be read-only in the UI and guarded server-side.

### 12.6 Project Knowledge Records

- `GET /api/assumptions?workspaceId=&projectId=&tag=`
- `POST /api/assumptions`
- `GET /api/assumptions/:id`
- `PATCH /api/assumptions/:id`
- `DELETE /api/assumptions/:id`

- `GET /api/sources?workspaceId=&projectId=&tag=`
- `POST /api/sources`
- `GET /api/sources/:id`
- `PATCH /api/sources/:id`
- `DELETE /api/sources/:id`

- `GET /api/evidence-links?workspaceId=&projectId=&targetType=&targetId=`
- `POST /api/evidence-links`
- `GET /api/evidence-links/:id`
- `PATCH /api/evidence-links/:id`
- `DELETE /api/evidence-links/:id`

- `GET /api/external-model-references?workspaceId=&projectId=`
- `POST /api/external-model-references`
- `GET /api/external-model-references/:id`
- `PATCH /api/external-model-references/:id`
- `DELETE /api/external-model-references/:id`

- `GET /api/support-memos?workspaceId=&projectId=&memoType=&tag=`
- `POST /api/support-memos`
- `GET /api/support-memos/:id`
- `PATCH /api/support-memos/:id`
- `DELETE /api/support-memos/:id`
- `POST /api/support-memos/:id/clone`

### 12.7 Q&A, Notes, Lessons

- `GET /api/qa?workspaceId=&projectId=&caseId=&tag=`
- `POST /api/qa`
- `GET /api/qa/:id`
- `PATCH /api/qa/:id`
- `DELETE /api/qa/:id`
- `POST /api/qa/:id/clone`

- `GET /api/notes?workspaceId=&projectId=&entityType=&entityId=`
- `POST /api/notes`
- `GET /api/notes/:id`
- `PATCH /api/notes/:id`
- `DELETE /api/notes/:id`

- `GET /api/lessons?workspaceId=&projectId=&caseId=&tag=`
- `POST /api/lessons`
- `GET /api/lessons/:id`
- `PATCH /api/lessons/:id`
- `DELETE /api/lessons/:id`
- `POST /api/lessons/:id/clone`

### 12.8 Tags, Favorites, Search, Activity, Files

- `GET /api/tags?workspaceId=`
- `POST /api/tags`
- `PATCH /api/tags/:id`
- `DELETE /api/tags/:id`

- `POST /api/tag-links`
- `DELETE /api/tag-links/:id`

- `GET /api/favorites?workspaceId=`
- `POST /api/favorites`
- `DELETE /api/favorites/:id`

- `GET /api/search?q=&workspaceId=&projectId=&type=&tag=&includeReferenceCases=`

- `GET /api/activity?workspaceId=&projectId=&entityType=&entityId=`

- `GET /api/files?workspaceId=&projectId=`
- `POST /api/files`
- `GET /api/files/:id`
- `PATCH /api/files/:id`
- `DELETE /api/files/:id`

Search result shape:

```ts
type SearchResult = {
  id: string;
  type: string;
  title: string;
  snippet: string;
  workspaceId?: string;
  projectId?: string;
  caseId?: string;
  tags: string[];
  reviewStatus?: string;
  url: string;
};
```

---

## 13. Frontend Routes

### 13.1 Required Routes

- `/dashboard`
- `/workspaces`
- `/workspaces/:id`
- `/projects`
- `/projects/:id`
- `/projects/:id/assumptions`
- `/projects/:id/sources`
- `/projects/:id/evidence`
- `/projects/:id/external-models`
- `/projects/:id/support-memos`
- `/projects/:id/qa`
- `/projects/:id/notes`
- `/projects/:id/lessons`
- `/playbooks`
- `/playbooks/:id`
- `/frameworks`
- `/frameworks/:id`
- `/principles`
- `/principles/:id`
- `/anti-patterns`
- `/anti-patterns/:id`
- `/reasoning-templates`
- `/reasoning-templates/:id`
- `/reference-cases`
- `/reference-cases/:caseId`
- `/reference-cases/:caseId/artifacts/:artifactId`
- `/sources`
- `/sources/:id`
- `/qa`
- `/qa/:id`
- `/notes`
- `/notes/:id`
- `/lessons`
- `/lessons/:id`
- `/search`
- `/settings`

### 13.2 Explicitly Forbidden Routes

Do not create routes named:

- `/income-calculator`
- `/wacc-calculator`
- `/market-calculator`
- `/dlom-calculator`
- `/asset-calculator`
- `/reconciliation-calc`
- `/valuation-engine`
- `/sensitivity-grid`
- `/formula-builder`

If method-specific pages are needed, name them as knowledge/support pages:

- `/playbooks/income-approach-knowledge`
- `/playbooks/wacc-build-up-support`
- `/playbooks/dlom-support-narrative`
- `/frameworks/market-approach-selection`
- `/reasoning-templates/final-conclusion-narrative`

---

## 14. Component Map

### 14.1 Shell Components

- `DashboardShell`
- `SidebarNav`
- `TopNav`
- `WorkspaceSwitcher`
- `CommandSearch`
- `Breadcrumbs`
- `EntityHeader`
- `ReviewStatusBadge`
- `TagPills`
- `FavoriteButton`
- `EmptyState`
- `LoadingState`
- `ConfirmDialog`

### 14.2 Dashboard Components

- `DashboardOverview`
- `RecentActivityList`
- `FavoriteRecordsGrid`
- `ProjectStatusCards`
- `KnowledgeCoverageCards`
- `QuickCreateMenu`

### 14.3 Workspace Components

- `WorkspaceList`
- `WorkspaceForm`
- `WorkspaceSettings`
- `WorkspaceMemberList`

### 14.4 Project Components

- `ProjectList`
- `ProjectForm`
- `ProjectKnowledgeDashboard`
- `ProjectOverviewCard`
- `ProjectLinkedAssets`
- `ProjectActivityTimeline`

### 14.5 Methodology Components

- `MethodologyCard`
- `PlaybookEditor`
- `PlaybookViewer`
- `FrameworkEditor`
- `FrameworkViewer`
- `PrincipleCard`
- `PrincipleEditor`
- `AntiPatternCard`
- `AntiPatternEditor`
- `ReasoningTemplateEditor`
- `ReasoningTemplateViewer`
- `TemplateDraftPanel`

### 14.6 Reference Case Components

- `ReferenceCaseBrowser`
- `ReferenceCaseCard`
- `ReferenceCaseDetail`
- `ReferenceArtifactList`
- `ReferenceArtifactViewer`
- `ReferenceCaseBadge`
- `CloneReferenceArtifactModal`

### 14.7 Evidence Components

- `AssumptionEditor`
- `AssumptionList`
- `SourceEditor`
- `SourceList`
- `EvidenceLinker`
- `EvidenceLinkList`
- `EvidenceStrengthBadge`
- `ExternalModelReferenceEditor`
- `ExternalModelReferenceList`
- `SupportMemoEditor`
- `SupportMemoViewer`
- `SupportMemoList`

### 14.8 Knowledge Capture Components

- `QAEditor`
- `QAList`
- `NotesEditor`
- `NotesList`
- `LessonsEditor`
- `LessonsList`

### 14.9 Utility Components

- `TagFilter`
- `TagEditor`
- `SearchResults`
- `CloneRecordModal`
- `LinkedEntityPicker`
- `ReviewStatusSelect`
- `MarkdownEditor`
- `MarkdownViewer`
- `ReadOnlyBanner`

### 14.10 Forbidden Components

Do not create:

- `DCFCalculator`
- `WACCCalculator`
- `DLOMCalculator`
- `MarketApproachCalculator`
- `AssetApproachCalculator`
- `FinalReconciliationCalculator`
- `SensitivityGrid`
- `FormulaBuilder`
- `ValuationEngine`
- `ScenarioRunTable`

---

## 15. UI / UX Requirements

### 15.1 Visual Style

The app should feel like polished professional finance SaaS.

Style direction:

- Clean dashboard layout
- Left sidebar navigation
- Neutral colors with subtle blue, slate, or emerald accents
- Card-based content
- Clear status badges
- Dense but readable tables
- Professional typography
- Minimal visual noise
- Strong empty states
- Fast create/edit flows

### 15.2 Dashboard

The dashboard should show:

- Active workspace
- Recent projects
- Favorite methodology assets
- Recently edited support memos
- Recent notes and lessons
- Quick links to playbooks, templates, sources, and search
- A non-disruptive onboarding note that calculations happen outside the app

The dashboard must not show Dordt-specific values, assumptions, or conclusions as generic dashboard metrics.

### 15.3 Project Page

The project page should make it clear that the project is a knowledge workspace.

Recommended cards:

- Project overview
- Assumption coverage
- Source coverage
- External model references
- Support memos
- Open Q&A
- Notes
- Lessons learned
- Related playbooks/templates

The project page must not contain calculator widgets, valuation output panels, final value cards, or formula-driven result sections.

### 15.4 Reference Case UX

Reference cases should be visibly separated from active projects.

UX requirements:

- Reference cases live only under `/reference-cases`.
- Dordt is not shown as the default project.
- Dordt is not used as onboarding.
- Reference artifacts display a badge: “Reference example — clone before editing.”
- Dordt artifacts display `case_id = dordt_gsu_2025`.
- Users can clone artifacts into their workspace or project.
- Users must actively choose a reference case to view or compare.

### 15.5 Empty States

Empty states should encourage correct behavior.

Examples:

- No external models: “Add a reference to the Excel workbook, Google Sheet, firm model, or external tool where calculations are performed.”
- No support memos: “Create a support memo to document reasoning, sources, and reviewer defense.”
- No sources: “Add sources that support your assumptions and methodology decisions.”
- No assumptions: “Document assumptions selected or developed outside this app, then link them to sources.”
- No reference cases: “Reference cases are examples and teaching artifacts, not default workflows.”

---

## 16. AI Scope

### 16.1 AI Can

Optional AI support may:

- Summarize sources
- Draft reasoning language from supplied sources and assumptions
- Critique support strength
- Identify anti-patterns
- Generate reviewer Q&A
- Suggest related playbooks and templates
- Compare project documentation coverage to a selected reference case
- Suggest missing source support
- Turn notes into lessons learned
- Create first-draft support memo scaffolds

### 16.2 AI Cannot

AI must not:

- Calculate value
- Calculate WACC
- Calculate DLOM
- Calculate DCF outputs
- Calculate market approach value
- Calculate asset approach value
- Create final valuation conclusions
- Invent support
- Replace analyst judgment
- Produce client-ready opinions without review
- Mark records approved
- Use Dordt-specific artifacts as generic assumptions
- Treat reference case values as benchmarks for new projects

### 16.3 AI Governance

AI outputs must:

- Remain draft status until a human accepts or edits them.
- Cite linked sources or say support is missing.
- Return a missing-input response when support is insufficient.
- Avoid unsupported claims.
- Store prompt version and input references in `ai_tasks`.
- Preserve human responsibility for professional judgment.

### 16.4 MVP AI Implementation

MVP can include AI-ready placeholders without live AI calls.

Acceptable MVP implementation:

- `ai_tasks` table
- “Draft with AI” disabled or mock-preview buttons
- Prompt scaffold storage in reasoning templates
- Manual drafting workflow
- Clear TODO comments for provider integration

---

## 17. Seed Strategy

### 17.1 Seed Content Goals

Seed content should make the app useful immediately without making Dordt the product identity.

Required seed content:

- 10+ methodology playbooks
- 8+ decision frameworks
- 10+ valuation principles
- 12+ anti-patterns
- 12+ reasoning templates
- Generic Q&A prompts
- Generic source examples
- Tags
- One reference case: Dordt GSU 2025 under `reference_cases.dordt_gsu_2025`

### 17.2 Seed Script Requirements

The build agent must include a seed script at `scripts/seed.ts`.

The seed script must:

- Create at least one local/mock user if needed.
- Create a sample workspace only if useful for local demo.
- Seed generic global methodology content.
- Seed generic tags.
- Seed Dordt only as Reference Case #1.
- Set `is_seed = true` for seed content.
- Set `is_readonly = true` for seed/reference records.
- Set `clonable = true` for seed content intended to be copied.
- Avoid creating Dordt as a project.
- Avoid using Dordt values as dashboard defaults.
- Be idempotent or safely rerunnable.

### 17.3 Seed Playbooks

Minimum playbooks:

1. Income Approach Knowledge Page
2. DCF Methodology Support Playbook
3. WACC / Build-Up Method Support Playbook
4. Revenue Forecast Support Playbook
5. Normalization Adjustment Support Playbook
6. Market Approach Selection Playbook
7. Guideline Public Company Screening Playbook
8. Guideline Transaction Screening Playbook
9. Asset Approach Role Playbook
10. DLOM Support Narrative Playbook
11. Level-of-Value Explanation Playbook
12. Final Conclusion Narrative Playbook

### 17.4 Seed Decision Frameworks

Minimum frameworks:

1. Income approach applicability framework
2. Management projection reasonableness framework
3. Revenue forecast support framework
4. Market approach applicability framework
5. Guideline transaction screening framework
6. Asset approach role framework
7. DLOM support framework
8. Method weighting rationale framework
9. Level-of-value consistency framework

### 17.5 Seed Principles

Minimum principles:

1. External models produce calculations; this app preserves support.
2. Every material assumption should have source support or documented reviewer judgment.
3. Method selection should be explained before conclusions are discussed.
4. Excluded methods need rationale when they would normally be considered.
5. Level of value must match the subject interest.
6. Reference case assumptions are examples, not defaults.
7. Management projections require reasonableness assessment.
8. Market evidence requires comparability discussion.
9. DLOM support should connect empirical evidence and qualitative facts.
10. Final narrative should connect method reliability, evidence quality, and professional judgment.

### 17.6 Seed Anti-Patterns

Minimum anti-patterns:

1. Treating external model output as self-explanatory
2. Listing discount-rate components without rationale
3. Using generic DLOM language
4. Copying reference case assumptions without support
5. Selecting market evidence without comparability analysis
6. Ignoring excluded methods
7. Mixing levels of value
8. Over-relying on management projections
9. Using stale sources without relevance notes
10. Writing conclusion language disconnected from method strengths
11. Treating asset approach as irrelevant without explanation
12. Using unsupported professional judgment as if it were market evidence

### 17.7 Seed Reasoning Templates

Minimum templates:

1. WACC support memo
2. Revenue forecast support memo
3. Normalization adjustment rationale
4. Management projection reasonableness memo
5. Market approach selection rationale
6. Guideline company screening rationale
7. Guideline transaction screening rationale
8. Asset approach role memo
9. DLOM support narrative
10. Level-of-value explanation
11. Method weighting rationale
12. Final conclusion narrative
13. Reviewer Q&A response
14. Source reliability note

### 17.8 Seed Q&A Prompts

Generic Q&A prompts:

- Why was this method appropriate?
- Why was this method excluded?
- What evidence supports this assumption?
- How do you know the source was relevant as of the valuation date?
- What are the weaknesses of this method?
- How did you assess management projections?
- How did you assess market comparability?
- How did you address level of value?
- What would change your conclusion?
- What support is missing or judgment-based?

### 17.9 Seed Source Examples

Generic source examples:

- Audited financial statements
- Tax returns
- Management interviews
- Industry reports
- Economic outlook reports
- Transaction databases
- Public company filings
- Court cases
- Valuation standards
- Prior internal workpapers
- Company budgets or forecasts
- Customer concentration schedules

### 17.10 Seed Tags

Minimum tags:

- income-approach
- market-approach
- asset-approach
- wacc-support
- revenue-forecast
- normalization
- dlom-support
- level-of-value
- method-weighting
- final-narrative
- reviewer-defense
- source-support
- anti-pattern
- reference-example
- case_id:dordt_gsu_2025

---

## 18. Dordt Reference Case Handling

### 18.1 Canonical Location

The Dordt GSU 2025 material and related artifacts must live only under:

```txt
reference_cases.dordt_gsu_2025
```

The corresponding database record must use:

```txt
case_id = dordt_gsu_2025
```

### 18.2 Dordt Allowed Uses

Dordt may be used only as:

- Reference case
- Teaching example
- Seed artifact library
- Copyable example material
- Source of examples inside playbooks/templates
- Regression fixture for seed loading
- Regression fixture for prompt outputs

### 18.3 Dordt Forbidden Uses

Dordt must not be:

- Product identity
- Default project
- Default workflow
- Onboarding path
- Benchmark users are expected to match
- Source of hardcoded assumptions
- Source of generic dashboard values
- Source of generic valuation methodology defaults
- Source of project creation defaults

### 18.4 Dordt Artifact Rules

Every Dordt artifact must be tagged with:

```txt
case_id = dordt_gsu_2025
```

This applies to:

- Reference case metadata
- Reference artifacts
- Example assumptions
- Example sources
- Example support memos
- Example Q&A
- Example notes
- Example lessons
- Example templates
- Example report language
- Extracted tables
- Regression fixtures

### 18.5 Dordt-Specific Values

Dordt-specific values may remain only inside the Dordt reference case artifact library.

This includes:

- Exact selected multiples
- Exact method weights
- Transaction comps
- Exact Q&A
- Final value
- DCF value
- DLOM
- Case-specific assumptions
- Case-specific conclusions
- Case-specific source excerpts
- Case-specific lessons

No Dordt-specific exact value should appear in generic dashboards, generic seed playbooks, project defaults, template defaults, empty states, or app-level examples unless clearly labeled as a Dordt reference artifact.

### 18.6 Dordt UX Requirements

- Dordt appears in `/reference-cases`.
- Dordt does not appear in `/projects` unless a user manually creates a separate project inspired by it.
- Dordt artifacts are read-only.
- Dordt artifacts are clonable.
- Cloned artifacts become editable copies.
- Cloned artifacts retain attribution to `dordt_gsu_2025`.
- Search can include Dordt only when reference cases are included or explicitly selected.
- The user can create and use a blank project without Dordt.

---

## 19. Search Implementation

### 19.1 MVP Search Requirements

Search should index or query these content types:

- Projects
- Playbooks
- Frameworks
- Principles
- Anti-patterns
- Reasoning templates
- Reference cases
- Reference artifacts
- Assumptions
- Sources
- Evidence links
- External model references
- Support memos
- Q&A items
- Notes
- Lessons learned

### 19.2 Search Behavior

Search should:

- Accept a query string.
- Return matching title and snippet.
- Support filter by type.
- Support filter by workspace.
- Support filter by project.
- Support filter by tag.
- Support filter by review status.
- Support `includeReferenceCases`.
- Exclude reference cases by default unless the user explicitly includes them or searches from the reference case area.

### 19.3 Implementation Option

MVP may implement simple SQL `LIKE` search across title/body fields.

If SQLite FTS or D1-compatible full-text search is straightforward, it may be used, but the app should not depend on complex search infrastructure.

---

## 20. Acceptance Criteria

### 20.1 Workspace

- User can create a workspace.
- User can edit workspace name and description.
- User can switch active workspace.
- User can view workspace-scoped records.
- User can create a project without seeing Dordt by default.

### 20.2 Projects

- User can create, edit, archive, and view projects.
- User can open a project dashboard.
- Project dashboard shows assumptions, sources, external models, support memos, Q&A, notes, and lessons.
- Project page does not include calculator modules.
- Project page clearly treats the project as a knowledge workspace.
- A blank project can exist with no Dordt content.

### 20.3 Playbooks

- User can browse methodology playbooks.
- User can open a playbook detail page.
- User can create, edit, and clone playbooks.
- Seed playbooks are read-only but clonable.
- Playbooks contain methodology guidance, not calculations.

### 20.4 Frameworks

- User can browse decision frameworks.
- User can create, edit, and clone frameworks.
- Frameworks can store decision criteria, evidence needs, outcomes, and reviewer prompts.
- Frameworks do not produce calculated valuation outputs.

### 20.5 Principles and Anti-Patterns

- User can browse principles.
- User can browse anti-patterns.
- User can create, edit, and clone principles and anti-patterns.
- User can link principles and anti-patterns to tags.
- User can use principles and anti-patterns as reviewer-defense and quality-control references.

### 20.6 Reasoning Templates

- User can browse reasoning templates.
- User can create, edit, and clone templates.
- User can use a reasoning template to draft narrative language manually.
- Template detail page shows required supporting inputs.
- Templates do not create final valuation conclusions.

### 20.7 Assumptions and Sources

- User can add assumptions to a project.
- User can add sources to a project.
- User can link assumptions to sources.
- User can rate evidence strength.
- User can add valuation-date relevance notes.
- Assumptions can reference external model records.
- Assumptions are stored as support records, not calculation inputs for an engine.

### 20.8 External Model References

- User can create an external model reference.
- User can specify model type, tool used, version, prepared by, prepared date, and file or URL reference.
- User can link external model references to assumptions, sources, templates, and Q&A.
- App does not parse or recalculate the external model.
- UI explains that calculations happen in the external model.

### 20.9 Support Memos

- User can create a support memo.
- User can select memo type.
- User can link a support memo to assumptions, sources, templates, playbooks, frameworks, and external model references.
- User can set review status.
- Support memos store reasoning, not calculated values.

### 20.10 Q&A, Notes, Lessons

- User can create Q&A items.
- User can link Q&A to assumptions, sources, support memos, templates, and playbooks.
- User can create notes.
- User can create lessons learned.
- User can tag Q&A, notes, and lessons.
- User can favorite Q&A, notes, and lessons.

### 20.11 Reference Cases

- User can browse reference cases only in the Reference Case Library.
- User can open Dordt as Reference Case #1.
- Dordt lives under `reference_cases.dordt_gsu_2025`.
- Every Dordt artifact has `case_id = dordt_gsu_2025`.
- Dordt artifacts are read-only.
- Dordt artifacts are clonable.
- Dordt is not the default project.
- Dordt is not the onboarding path.
- Dordt-specific values appear only inside Dordt reference artifacts.

### 20.12 Tags and Favorites

- User can create tags.
- User can apply tags to supported content types.
- User can filter lists by tag.
- User can favorite supported content records.
- User can view favorites on dashboard.

### 20.13 Search

- User can search across all major content types.
- Search returns title, snippet, type, tags, and link.
- Search can filter by content type.
- Search can filter by workspace and project.
- Search can include or exclude reference cases.
- Search works for Dordt artifacts only when reference cases are included.

### 20.14 Clone Workflows

- User can clone seed playbooks.
- User can clone seed frameworks.
- User can clone reasoning templates.
- User can clone reference artifacts.
- Cloned records are editable.
- Cloned records preserve attribution to the source record.
- Clone actions are recorded in activity log.

### 20.15 AI Placeholder

- AI task table exists.
- Reasoning templates can be marked AI-drafting enabled or disabled.
- UI can show AI placeholder actions.
- AI output, if mocked or later enabled, cannot approve records.
- AI cannot calculate value or produce final valuation conclusions.

### 20.16 No Calculator Acceptance Criteria

The MVP passes only if:

- No DCF calculator exists.
- No WACC calculator exists.
- No DLOM calculator exists.
- No market approach calculator exists.
- No asset approach calculator exists.
- No final reconciliation calculator exists.
- No formula engine exists.
- No sensitivity table engine exists.
- No valuation conclusion engine exists.
- README clearly states calculations happen outside the app.

---

## 21. Test Strategy

### 21.1 Unit Tests

Test:

- Zod schema validation
- CRUD helper functions
- Clone behavior
- Read-only guard behavior
- Tag linking
- Favorite creation/removal
- Search result mapping
- Review status transitions
- External model reference creation
- Support memo linking

### 21.2 Integration Tests

Test flows:

1. Create workspace.
2. Create project.
3. Add assumption.
4. Add source.
5. Link source to assumption.
6. Add external model reference.
7. Create support memo linked to assumption, source, template, and external model.
8. Add Q&A item.
9. Add lesson learned.
10. Search for the support memo.
11. Favorite the support memo.

### 21.3 Reference Case Tests

Test:

- Dordt seed case exists.
- Dordt case ID equals `dordt_gsu_2025`.
- Dordt artifacts all have `case_id = dordt_gsu_2025`.
- Dordt artifacts are read-only.
- Dordt artifacts are clonable.
- Dordt does not appear in project list by default.
- Dordt does not populate generic dashboard values.
- Dordt-specific values are not seeded into generic playbooks except as explicitly labeled reference examples.

### 21.4 Negative Tests

Test that app does not include:

- Calculator routes
- Calculator components
- Calculation-specific API routes
- Formula engine tables
- Sensitivity table tables
- Scenario run tables
- Automated valuation conclusion logic

### 21.5 UI Tests

Test:

- Sidebar route navigation
- Workspace switching
- Project creation modal/page
- Playbook detail page
- Template editor
- Reference case browser
- Reference artifact viewer
- Clone modal
- Search filters
- Tag filters
- Favorite button
- Review status badge

### 21.6 Seed Tests

Test minimum seed counts:

- 10+ playbooks
- 8+ frameworks
- 10+ principles
- 12+ anti-patterns
- 12+ reasoning templates
- Generic Q&A prompts exist
- Generic source examples exist
- Dordt exists only as reference case

---

## 22. Roadmap

### 22.1 MVP: One-Shot Build

Focus:

- Next.js app shell
- Workspace system
- Project knowledge workspace
- CRUD for playbooks, frameworks, principles, anti-patterns, templates
- CRUD for assumptions, sources, evidence links, external model references, support memos
- Q&A, notes, lessons
- Tags and favorites
- Reference case library
- Dordt reference case seed handling
- Search
- Clone workflows
- Light review status
- Polished finance SaaS UI
- README and deployment guide
- GitHub repository handoff
- Cloudflare Pages auto-deploy documentation

### 22.2 Phase 2: Better Knowledge Workflows

Potential additions:

- Rich text editor
- Better source citation formatting
- Source reliability scoring rubric
- Project coverage checklist
- Support memo export to Markdown/DOCX
- Reference case comparison view
- More reference cases
- Standards mapping library
- Reviewer comment threads
- Prompt library for AI-assisted drafting

### 22.3 Phase 3: AI Drafting and Critique

Potential additions:

- Source summarization
- Reasoning language drafting
- Support strength critique
- Anti-pattern detection
- Q&A generation
- Missing support detection
- Coverage comparison to selected reference case
- Lesson extraction from notes
- Human review queue for AI drafts

### 22.4 Phase 4: File and Standards Expansion

Potential additions:

- Real file upload
- Cloudflare R2 storage
- File-to-source linking
- OCR/text extraction
- Standards clause mapping
- Citation manager
- Workpaper binder export
- Team permissions improvements

### 22.5 Explicitly Not on Roadmap

Do not add:

- DCF calculator
- WACC calculator
- DLOM calculator
- Market approach calculator
- Asset approach calculator
- Final reconciliation calculator
- Browser-native financial model
- Automated valuation conclusion engine

---

## 23. Deployment Notes

### 23.1 Local Development

Required:

- Node.js current LTS
- SQLite local database
- Drizzle migrations
- Seed script
- `.env.example`
- README instructions

Recommended scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:seed": "tsx scripts/seed.ts",
  "test": "vitest",
  "lint": "next lint"
}
```

### 23.2 Environment Variables

Example:

```txt
DATABASE_URL=file:./local.db
AUTH_MODE=local
NEXT_PUBLIC_APP_NAME=Valuation Memory Bank
AI_ENABLED=false
FILE_STORAGE_MODE=metadata_only
```

Clerk-ready placeholders:

```txt
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Cloudflare-ready placeholders:

```txt
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_API_TOKEN=
D1_DATABASE_BINDING=DB
R2_BUCKET_NAME=
```

### 23.3 Cloudflare Deployment

Recommended:

- Cloudflare Pages for frontend
- Cloudflare D1 for database
- Cloudflare R2 later for file storage
- Drizzle D1-compatible schema
- File metadata only in MVP

The build agent must choose one realistic Cloudflare deployment strategy and document it clearly in the README.

Acceptable strategies include:

- Next.js on Cloudflare Pages using the current Cloudflare-supported adapter path.
- Next.js static/export-compatible approach only if all required MVP features still work.
- Another Cloudflare Pages-compatible Next.js strategy if documented and locally buildable.

The selected strategy must document:

- Build command
- Output directory
- Required adapter/package if applicable
- `wrangler.toml` if needed
- D1 database binding name
- Migration instructions
- Environment variables
- Known limitations

### 23.4 README Requirements

README must state:

- This app is a valuation knowledge and methodology memory bank.
- This app does not calculate valuation conclusions.
- Calculations happen in Excel, firm models, Google Sheets, or external tools.
- External model references point to where calculations live.
- Dordt is a reference case only.
- Seed content is cloneable and editable after cloning.
- AI features are optional and cannot replace analyst judgment.
- Local setup instructions.
- Database migration instructions.
- Seed instructions.
- Test and lint instructions.
- Cloudflare Pages deployment notes.
- GitHub repository handoff notes.

---

## 24. GitHub Repository Requirements for the Build Agent

This section is written for the future build agent.

When the build agent builds the product, it must create or use a GitHub repository named:

```txt
valuation-memory-bank
```

The build agent must:

- Commit all project files after the build is complete.
- Include the finalized PRD in `/docs/valuation-memory-bank-prd-v1.2-final.md`.
- Include a root `README.md`.
- Include `.env.example`.
- Include database migration files.
- Include seed files/scripts.
- Include basic tests.
- Include deployment notes.
- Use meaningful commits.
- Push the completed MVP to GitHub before final handoff.

Example commands are documentation only. Do not execute them unless the build agent is actively performing the build and the user has authorized repository creation/push.

For a new repository:

```bash
git init
git add .
git commit -m "Initial Valuation Memory Bank MVP"
gh repo create valuation-memory-bank --private --source=. --remote=origin --push
```

If the repository already exists:

```bash
git remote add origin git@github.com:<GITHUB_USERNAME>/valuation-memory-bank.git
git branch -M main
git push -u origin main
```

The build agent or user must replace `<GITHUB_USERNAME>` with the correct GitHub username or organization.

The PRD author must not run these commands during PRD review. These commands are instructions for the eventual build agent only.

---

## 25. Cloudflare Pages + GitHub Auto-Deploy Requirements for the Build Agent

This section is written for the future build agent.

After the completed MVP is pushed to GitHub, Cloudflare Pages should be connected to the GitHub repository so changes pushed to `main` automatically deploy.

Recommended Cloudflare Pages settings:

- Framework preset: Next.js
- Production branch: `main`
- Build command: `npm run build`
- Output directory: document the selected Next.js + Cloudflare deployment strategy
- Environment variables: copy required values from `.env.example`
- D1 database binding: configure if using Cloudflare D1
- Optional R2 binding: reserve for later file uploads if desired
- Preview deployments: enable for pull requests if desired

The repository should include whichever Cloudflare configuration is required by the chosen deployment path, such as:

- `wrangler.toml` if needed
- D1 database binding name
- D1 migration instructions
- Cloudflare Pages deployment notes in README
- Any adapter-specific notes for Next.js on Cloudflare

The build agent must choose one realistic Cloudflare deployment strategy and document it clearly.

The build agent must not leave Cloudflare deployment ambiguous. If Cloudflare cannot be fully configured without user account access, the build agent must provide precise manual steps for the user.

The PRD author must not configure Cloudflare during PRD review. These are instructions for the eventual build agent only.

---

## 26. Instructions for the Build Agent

Build exactly the MVP described in this PRD.

Do:

- Build a working Next.js App Router MVP.
- Use TypeScript, Tailwind, shadcn/ui, Drizzle, and SQLite/D1-compatible schema.
- Prioritize working CRUD, search, tags, links, cloning, seed content, and polished UI.
- Use mock/local auth if real auth is not configured.
- Use metadata-only files in MVP.
- Include AI placeholders but no required live AI integration.
- Make the app run locally first.
- Add Drizzle migrations.
- Add seed script and seed content.
- Run tests and lint.
- Include README and `.env.example`.
- Include this finalized PRD in `/docs/valuation-memory-bank-prd-v1.2-final.md`.
- Push the completed project to GitHub after building.
- Document Cloudflare Pages GitHub auto-deploy setup.
- Provide final handoff instructions.

Do not:

- Add calculators.
- Add valuation engines.
- Add formula engines.
- Add sensitivity grid engines.
- Add browser-native financial modeling.
- Add automated valuation conclusions.
- Add AI-generated final valuation conclusions.
- Overbuild enterprise permissions.
- Add client portals.
- Add real-time collaboration.
- Add data vendor integrations.
- Make Dordt the default project or workflow.

The build agent should prefer a complete, clean, working MVP over speculative architecture.

---

## 27. Final QA Checklist for the Build Agent

Before pushing to GitHub, the future build agent must complete this checklist:

- [ ] Run `npm install`.
- [ ] Run database migrations.
- [ ] Run seed script.
- [ ] Run `npm run build`.
- [ ] Run tests.
- [ ] Run lint.
- [ ] Confirm no calculator routes exist.
- [ ] Confirm no calculator components exist.
- [ ] Confirm no formula engine exists.
- [ ] Confirm no sensitivity table engine exists.
- [ ] Confirm no automated valuation conclusion logic exists.
- [ ] Confirm Dordt is only under reference cases.
- [ ] Confirm every Dordt artifact has `case_id = dordt_gsu_2025`.
- [ ] Confirm user can create a blank project without Dordt.
- [ ] Confirm search works.
- [ ] Confirm clone workflows work.
- [ ] Confirm support memo workflow works.
- [ ] Confirm external model reference workflow works.
- [ ] Confirm seed content is read-only but clonable.
- [ ] Confirm cloned content becomes editable.
- [ ] Confirm README explains calculations happen outside the app.
- [ ] Confirm `.env.example` exists.
- [ ] Confirm database migration files exist.
- [ ] Confirm seed files/scripts exist.
- [ ] Confirm basic tests exist.
- [ ] Confirm Cloudflare deployment notes exist.
- [ ] Confirm the finalized PRD exists at `/docs/valuation-memory-bank-prd-v1.2-final.md`.
- [ ] Commit all completed project files.
- [ ] Push the completed MVP to GitHub.
- [ ] Provide final handoff instructions.

---

## 28. Perplexity Computer Build Readiness Checklist

- [ ] The product is not a calculator.
- [ ] Calculations happen outside the app.
- [ ] The stack is fixed: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Drizzle, SQLite locally, D1-compatible schema.
- [ ] MVP scope is CRUD/search/linking/clone-focused.
- [ ] Seed data requirements are explicit.
- [ ] Dordt is reference-case-only.
- [ ] Dordt canonical location is `reference_cases.dordt_gsu_2025`.
- [ ] Every Dordt artifact must have `case_id = dordt_gsu_2025`.
- [ ] API routes are defined.
- [ ] Frontend routes are defined.
- [ ] Components are defined.
- [ ] Database tables are defined.
- [ ] Acceptance criteria are testable.
- [ ] Test strategy is defined.
- [ ] Deployment path is clear.
- [ ] GitHub repository requirements are clear.
- [ ] The eventual build agent must push the completed app to GitHub after building.
- [ ] The eventual build agent must document Cloudflare Pages GitHub auto-deploy setup.
- [ ] README requirements are clear.
- [ ] `.env.example` requirements are clear.
- [ ] No major missing build decisions remain.
- [ ] The MVP can be built in one pass by Perplexity Computer or another coding agent.

---

## 29. Definition of Done

The MVP is done when:

- The app runs locally from README instructions.
- Database migrations apply cleanly.
- Seed script loads required seed content.
- User can create a workspace.
- User can create a project without Dordt.
- User can browse and clone playbooks.
- User can browse and clone frameworks.
- User can browse principles and anti-patterns.
- User can use reasoning templates.
- User can create assumptions and sources.
- User can link assumptions to sources.
- User can create external model references.
- User can create support memos linked to assumptions, sources, templates, and external models.
- User can create Q&A, notes, and lessons.
- User can tag and favorite records.
- User can search across content.
- User can browse Dordt only in Reference Case Library.
- Dordt artifacts are tagged with `case_id = dordt_gsu_2025`.
- Dordt artifacts are read-only but clonable.
- No calculator routes, components, tables, or APIs exist.
- README clearly explains that calculations happen outside the app.
- Tests pass.
- UI is polished enough to feel like a professional finance SaaS MVP.
- Finalized PRD is saved in `/docs/valuation-memory-bank-prd-v1.2-final.md`.
- Completed project is committed and pushed to GitHub by the build agent.
- Cloudflare Pages GitHub auto-deploy setup is documented.

---

## 30. Developer Implementation Checklist

### 30.1 Build Order

1. Create Next.js App Router project.
2. Install Tailwind CSS and shadcn/ui.
3. Configure Drizzle ORM with SQLite.
4. Implement schema and migrations.
5. Build seed script.
6. Build app shell and sidebar.
7. Build workspace system.
8. Build project CRUD.
9. Build methodology CRUD pages.
10. Build reference case library.
11. Build assumptions, sources, and evidence links.
12. Build external model references.
13. Build support memos.
14. Build Q&A, notes, lessons.
15. Build tags and favorites.
16. Build search.
17. Build clone workflows.
18. Add activity log.
19. Add AI placeholders.
20. Add tests.
21. Add README and deployment notes.
22. Add finalized PRD under `/docs`.
23. Commit and push completed MVP to GitHub.
24. Document Cloudflare Pages GitHub auto-deploy setup.

### 30.2 Minimum Polished UI Pages

Must look finished:

- Dashboard
- Project detail
- Playbook detail
- Template detail/editor
- Reference case detail
- Support memo editor
- Search results

### 30.3 Data Integrity Rules

- Do not allow editing read-only seed records.
- Allow cloning read-only seed records.
- Preserve clone attribution.
- Require workspace ID for workspace-scoped records.
- Require project ID for project-specific external model references.
- Require `case_id` for reference case artifacts.
- Require `case_id = dordt_gsu_2025` for all Dordt artifacts.
- Prevent seed Dordt records from appearing as default project data.
- Never compute valuation outputs.

---

## 31. Appendix A: Removed Calculation Concepts

The following are intentionally removed from scope:

- Forecast schedules as calculation engines
- FCFF schedules
- WACC buildup calculations
- Sensitivity cells
- Selected multiple calculations
- Market value calculations
- Asset fair market value calculations
- DLOM calculations
- Final reconciliation calculations
- Scenario runs
- Formula/computed field infrastructure tied to valuation math
- Acceptance tests for exact Dordt valuation values

Replaced by:

- Income Approach Knowledge Page
- WACC / Build-Up Method Playbook
- Revenue Forecast Support Playbook
- Market Approach Selection Framework
- Guideline Transaction Screening Checklist
- Asset Approach Role Framework
- DLOM Support Narrative Template
- Level-of-Value Explanation Template
- Method Weighting Rationale Template
- Final Conclusion Narrative Template
- External Model References
- Support Memos

---

## 32. Appendix B: Required Language Replacements

Use these product phrases:

- “Methodology records preserve reasoning.”
- “External models produce calculations.”
- “The app stores support, rationale, sources, and reviewer defense.”
- “Support memo”
- “Method rationale”
- “Reference artifact”
- “Externally prepared model output reference”
- “Evidence link”
- “Reviewer defense”
- “Report-language scaffold”

Avoid these phrases:

- “Valuation engine”
- “Calculation chain”
- “Methods produce value indications”
- “Method weighting produces final conclusion”
- “WACC renders as sum”
- “Sensitivity grid”
- “Final value calculation”
- “Browser-native model”

Allowed only inside labeled reference case artifacts when case-specific:

- “DCF value”
- “Final value”
- “Selected multiple”
- “Method weight”
- “DLOM”

---

## 33. Appendix C: Final Self-Check

Before finalizing implementation, verify:

- Are there any calculators left? If yes, remove them.
- Are any Dordt values hardcoded into generic product sections? If yes, move them to reference case artifacts only.
- Can a user create a project without Dordt? Must be yes.
- Can the app be built in one pass? Must be yes.
- Is it clear that calculations happen in external tools? Must be yes.
- Are all Dordt artifacts tagged `case_id = dordt_gsu_2025`? Must be yes.
- Are external model references available for Excel, Google Sheets, firm models, and other tools? Must be yes.
- Are support memos first-class records? Must be yes.
- Does search cover all major knowledge records? Must be yes.
- Does README state the app is not a valuation calculator? Must be yes.
- Does the PRD instruct the future build agent to push the completed app to GitHub after building? Must be yes.
- Does the PRD instruct the future build agent to document Cloudflare auto-deploy from GitHub? Must be yes.
- Is the PRD ready to give to Perplexity Computer? Must be yes.
