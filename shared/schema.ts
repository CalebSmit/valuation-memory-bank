import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── users ───────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("analyst"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ─── workspaces ──────────────────────────────────────────────────────────────
export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  defaultCurrencyLabel: text("default_currency_label"),
  firmOrTeamLabel: text("firm_or_team_label"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;

// ─── workspace_memberships ───────────────────────────────────────────────────
export const workspaceMemberships = sqliteTable("workspace_memberships", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("editor"),
  createdAt: text("created_at").notNull(),
});
export const insertWorkspaceMembershipSchema = createInsertSchema(workspaceMemberships).omit({ id: true, createdAt: true });
export type InsertWorkspaceMembership = z.infer<typeof insertWorkspaceMembershipSchema>;
export type WorkspaceMembership = typeof workspaceMemberships.$inferSelect;

// ─── projects ────────────────────────────────────────────────────────────────
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  name: text("name").notNull(),
  subjectCompanyLabel: text("subject_company_label"),
  assignmentType: text("assignment_type"),
  industry: text("industry"),
  valuationDate: text("valuation_date"),
  reportDate: text("report_date"),
  standardOfValue: text("standard_of_value"),
  premiseOfValue: text("premise_of_value"),
  subjectInterest: text("subject_interest"),
  levelOfValue: text("level_of_value"),
  intendedUse: text("intended_use"),
  intendedUsers: text("intended_users"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// ─── methodology_playbooks ───────────────────────────────────────────────────
export const methodologyPlaybooks = sqliteTable("methodology_playbooks", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  scope: text("scope").notNull().default("workspace"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  purpose: text("purpose").notNull(),
  whenToUse: text("when_to_use"),
  whenNotToUse: text("when_not_to_use"),
  keyConcepts: text("key_concepts"),
  requiredEvidence: text("required_evidence"),
  commonSources: text("common_sources"),
  reviewerQuestions: text("reviewer_questions"),
  commonMistakes: text("common_mistakes"),
  reportLanguageExamples: text("report_language_examples"),
  reviewStatus: text("review_status").default("draft"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  caseId: text("case_id"),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertPlaybookSchema = createInsertSchema(methodologyPlaybooks).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlaybook = z.infer<typeof insertPlaybookSchema>;
export type Playbook = typeof methodologyPlaybooks.$inferSelect;

// ─── decision_frameworks ─────────────────────────────────────────────────────
export const decisionFrameworks = sqliteTable("decision_frameworks", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  scope: text("scope").notNull().default("workspace"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  purpose: text("purpose").notNull(),
  decisionQuestion: text("decision_question"),
  inputsToConsider: text("inputs_to_consider"),
  decisionCriteria: text("decision_criteria"),
  evidenceNeeded: text("evidence_needed"),
  possibleOutcomes: text("possible_outcomes"),
  reviewerPrompts: text("reviewer_prompts"),
  exampleApplication: text("example_application"),
  relatedPlaybooks: text("related_playbooks"),
  reviewStatus: text("review_status").default("draft"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  caseId: text("case_id"),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertFrameworkSchema = createInsertSchema(decisionFrameworks).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFramework = z.infer<typeof insertFrameworkSchema>;
export type Framework = typeof decisionFrameworks.$inferSelect;

// ─── valuation_principles ────────────────────────────────────────────────────
export const valuationPrinciples = sqliteTable("valuation_principles", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  scope: text("scope").notNull().default("workspace"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  body: text("body"),
  rationale: text("rationale"),
  relatedPlaybooks: text("related_playbooks"),
  relatedAntipatterns: text("related_antipatterns"),
  reviewStatus: text("review_status").default("draft"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  caseId: text("case_id"),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertPrincipleSchema = createInsertSchema(valuationPrinciples).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPrinciple = z.infer<typeof insertPrincipleSchema>;
export type Principle = typeof valuationPrinciples.$inferSelect;

// ─── valuation_antipatterns ──────────────────────────────────────────────────
export const valuationAntipatterns = sqliteTable("valuation_antipatterns", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  scope: text("scope").notNull().default("workspace"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  whyItMatters: text("why_it_matters"),
  warningSigns: text("warning_signs"),
  howToFix: text("how_to_fix"),
  relatedPlaybooks: text("related_playbooks"),
  relatedPrinciples: text("related_principles"),
  relatedTemplates: text("related_templates"),
  reviewStatus: text("review_status").default("draft"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  caseId: text("case_id"),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertAntipatternsSchema = createInsertSchema(valuationAntipatterns).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAntipattern = z.infer<typeof insertAntipatternsSchema>;
export type Antipattern = typeof valuationAntipatterns.$inferSelect;

// ─── reasoning_templates ─────────────────────────────────────────────────────
export const reasoningTemplates = sqliteTable("reasoning_templates", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  scope: text("scope").notNull().default("workspace"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  useCase: text("use_case"),
  promptScaffold: text("prompt_scaffold"),
  requiredSupportingInputs: text("required_supporting_inputs"),
  optionalSupportingInputs: text("optional_supporting_inputs"),
  exampleOutput: text("example_output"),
  relatedPlaybooks: text("related_playbooks"),
  relatedFrameworks: text("related_frameworks"),
  relatedPrinciples: text("related_principles"),
  aiDraftingAllowed: integer("ai_drafting_allowed", { mode: "boolean" }).default(true),
  reviewStatus: text("review_status").default("draft"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  caseId: text("case_id"),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertTemplateSchema = createInsertSchema(reasoningTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof reasoningTemplates.$inferSelect;

// ─── reference_cases ─────────────────────────────────────────────────────────
export const referenceCases = sqliteTable("reference_cases", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  sourceLabel: text("source_label"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertReferenceCaseSchema = createInsertSchema(referenceCases).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertReferenceCase = z.infer<typeof insertReferenceCaseSchema>;
export type ReferenceCase = typeof referenceCases.$inferSelect;

// ─── reference_case_artifacts ─────────────────────────────────────────────────
export const referenceCaseArtifacts = sqliteTable("reference_case_artifacts", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull(),
  artifactType: text("artifact_type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  sourceNote: text("source_note"),
  artifactMetadata: text("artifact_metadata"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  reviewStatus: text("review_status").default("draft"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertReferenceArtifactSchema = createInsertSchema(referenceCaseArtifacts).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertReferenceArtifact = z.infer<typeof insertReferenceArtifactSchema>;
export type ReferenceArtifact = typeof referenceCaseArtifacts.$inferSelect;

// ─── assumptions ─────────────────────────────────────────────────────────────
export const assumptions = sqliteTable("assumptions", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id"),
  name: text("name").notNull(),
  category: text("category"),
  statedAssumptionText: text("stated_assumption_text"),
  context: text("context"),
  externalModelReference: text("external_model_reference"),
  methodArea: text("method_area"),
  rationale: text("rationale"),
  sourceLinks: text("source_links"),
  evidenceStrength: text("evidence_strength").default("moderate"),
  reviewStatus: text("review_status").default("draft"),
  tags: text("tags"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  caseId: text("case_id"),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertAssumptionSchema = createInsertSchema(assumptions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAssumption = z.infer<typeof insertAssumptionSchema>;
export type Assumption = typeof assumptions.$inferSelect;

// ─── sources ─────────────────────────────────────────────────────────────────
export const sources = sqliteTable("sources", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id"),
  title: text("title").notNull(),
  publisherAuthor: text("publisher_author"),
  sourceType: text("source_type"),
  publicationDate: text("publication_date"),
  valuationDateRelevanceNote: text("valuation_date_relevance_note"),
  urlOrFileReference: text("url_or_file_reference"),
  citationText: text("citation_text"),
  reliabilityAssessment: text("reliability_assessment"),
  notes: text("notes"),
  tags: text("tags"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  caseId: text("case_id"),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertSourceSchema = createInsertSchema(sources).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sources.$inferSelect;

// ─── evidence_links ───────────────────────────────────────────────────────────
export const evidenceLinks = sqliteTable("evidence_links", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  targetEntityType: text("target_entity_type").notNull(),
  targetEntityId: text("target_entity_id").notNull(),
  supportType: text("support_type"),
  relevanceNote: text("relevance_note"),
  strengthRating: text("strength_rating"),
  pageSectionReference: text("page_section_reference"),
  quoteOrParaphraseNote: text("quote_or_paraphrase_note"),
  createdBy: text("created_by"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertEvidenceLinkSchema = createInsertSchema(evidenceLinks).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEvidenceLink = z.infer<typeof insertEvidenceLinkSchema>;
export type EvidenceLink = typeof evidenceLinks.$inferSelect;

// ─── external_model_references ───────────────────────────────────────────────
export const externalModelReferences = sqliteTable("external_model_references", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id"),
  title: text("title").notNull(),
  modelType: text("model_type"),
  toolUsed: text("tool_used").default(""),
  fileOrUrlReference: text("file_or_url_reference"),
  versionLabel: text("version_label"),
  preparedBy: text("prepared_by"),
  preparedDate: text("prepared_date"),
  notes: text("notes"),
  linkedAssumptions: text("linked_assumptions"),
  linkedSources: text("linked_sources"),
  linkedReasoningTemplates: text("linked_reasoning_templates"),
  linkedQaItems: text("linked_qa_items"),
  reviewStatus: text("review_status").default("draft"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertExternalModelRefSchema = createInsertSchema(externalModelReferences).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertExternalModelRef = z.infer<typeof insertExternalModelRefSchema>;
export type ExternalModelRef = typeof externalModelReferences.$inferSelect;

// ─── support_memos ───────────────────────────────────────────────────────────
export const supportMemos = sqliteTable("support_memos", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id"),
  memoType: text("memo_type"),
  title: text("title").notNull(),
  body: text("body"),
  linkedPlaybookId: text("linked_playbook_id"),
  linkedFrameworkId: text("linked_framework_id"),
  linkedTemplateId: text("linked_template_id"),
  linkedAssumptions: text("linked_assumptions"),
  linkedSources: text("linked_sources"),
  linkedExternalModelReference: text("linked_external_model_reference"),
  reviewStatus: text("review_status").default("draft"),
  tags: text("tags"),
  caseId: text("case_id"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertSupportMemoSchema = createInsertSchema(supportMemos).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSupportMemo = z.infer<typeof insertSupportMemoSchema>;
export type SupportMemo = typeof supportMemos.$inferSelect;

// ─── qa_items ────────────────────────────────────────────────────────────────
export const qaItems = sqliteTable("qa_items", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id"),
  caseId: text("case_id"),
  question: text("question").notNull(),
  answerScaffold: text("answer_scaffold"),
  draftAnswer: text("draft_answer"),
  linkedAssumptions: text("linked_assumptions"),
  linkedSources: text("linked_sources"),
  linkedSupportMemo: text("linked_support_memo"),
  linkedPlaybook: text("linked_playbook"),
  linkedFramework: text("linked_framework"),
  linkedTemplate: text("linked_template"),
  difficulty: text("difficulty"),
  audience: text("audience"),
  reviewStatus: text("review_status").default("draft"),
  tags: text("tags"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertQaItemSchema = createInsertSchema(qaItems).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertQaItem = z.infer<typeof insertQaItemSchema>;
export type QaItem = typeof qaItems.$inferSelect;

// ─── notes ───────────────────────────────────────────────────────────────────
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id"),
  title: text("title").notNull(),
  body: text("body"),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  visibility: text("visibility").default("private"),
  tags: text("tags"),
  isFavorite: integer("is_favorite", { mode: "boolean" }).default(false),
  reviewStatus: text("review_status").default("draft"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// ─── lessons_learned ─────────────────────────────────────────────────────────
export const lessonsLearned = sqliteTable("lessons_learned", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id"),
  caseId: text("case_id"),
  title: text("title").notNull(),
  lesson: text("lesson"),
  context: text("context"),
  mistakeAvoided: text("mistake_avoided"),
  futureChecklistPrompt: text("future_checklist_prompt"),
  relatedAntipattern: text("related_antipattern"),
  relatedPrinciple: text("related_principle"),
  relatedProject: text("related_project"),
  relatedReferenceCase: text("related_reference_case"),
  tags: text("tags"),
  reviewStatus: text("review_status").default("draft"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(false),
  clonable: integer("clonable", { mode: "boolean" }).default(true),
  clonedFromType: text("cloned_from_type"),
  clonedFromId: text("cloned_from_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertLessonSchema = createInsertSchema(lessonsLearned).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsLearned.$inferSelect;

// ─── tags ─────────────────────────────────────────────────────────────────────
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  color: text("color"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
});
export const insertTagSchema = createInsertSchema(tags).omit({ id: true, createdAt: true });
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// ─── tag_links ────────────────────────────────────────────────────────────────
export const tagLinks = sqliteTable("tag_links", {
  id: text("id").primaryKey(),
  tagId: text("tag_id").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  createdAt: text("created_at").notNull(),
});
export const insertTagLinkSchema = createInsertSchema(tagLinks).omit({ id: true, createdAt: true });
export type InsertTagLink = z.infer<typeof insertTagLinkSchema>;
export type TagLink = typeof tagLinks.$inferSelect;

// ─── favorites ────────────────────────────────────────────────────────────────
export const favorites = sqliteTable("favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  workspaceId: text("workspace_id"),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  createdAt: text("created_at").notNull(),
});
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// ─── activity_log ────────────────────────────────────────────────────────────
export const activityLog = sqliteTable("activity_log", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  projectId: text("project_id"),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  entityTitle: text("entity_title"),
  metadata: text("metadata"),
  createdAt: text("created_at").notNull(),
});
export const insertActivityLogSchema = createInsertSchema(activityLog).omit({ id: true, createdAt: true });
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLog.$inferSelect;

// ─── ai_tasks ─────────────────────────────────────────────────────────────────
export const aiTasks = sqliteTable("ai_tasks", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  projectId: text("project_id"),
  taskType: text("task_type").notNull(),
  status: text("status").notNull().default("pending"),
  promptVersion: text("prompt_version"),
  inputReferences: text("input_references"),
  outputPreview: text("output_preview"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertAiTaskSchema = createInsertSchema(aiTasks).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAiTask = z.infer<typeof insertAiTaskSchema>;
export type AiTask = typeof aiTasks.$inferSelect;

// ─── report_section_templates ─────────────────────────────────────────────────
// Canonical, seed-only catalog of valuation report sections. Three levels:
//   level=1 → Part      (e.g. "Income Approach")
//   level=2 → Section   (e.g. "WACC")
//   level=3 → Subsection (e.g. "Cost of Equity")
// Slug is the stable identifier referenced from project_report_sections.
export const reportSectionTemplates = sqliteTable("report_section_templates", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  parentSlug: text("parent_slug"),
  level: integer("level").notNull(),
  title: text("title").notNull(),
  defaultOrder: integer("default_order").notNull().default(0),
  description: text("description"),
  guidance: text("guidance"),
  isSeed: integer("is_seed", { mode: "boolean" }).default(true),
  isReadonly: integer("is_readonly", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertReportSectionTemplateSchema = createInsertSchema(reportSectionTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertReportSectionTemplate = z.infer<typeof insertReportSectionTemplateSchema>;
export type ReportSectionTemplate = typeof reportSectionTemplates.$inferSelect;

// ─── project_report_sections ──────────────────────────────────────────────────
// Per-project content for a single section (lazily created on first edit).
// Stores narrative + arrays of linked entity IDs (sources, assumptions, models,
// memos, files) and ad-hoc external links.
export const projectReportSections = sqliteTable("project_report_sections", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  projectId: text("project_id").notNull(),
  templateSlug: text("template_slug").notNull(),
  body: text("body"),
  status: text("status").notNull().default("not_started"),
  linkedSourceIds: text("linked_source_ids"),
  linkedAssumptionIds: text("linked_assumption_ids"),
  linkedExternalModelIds: text("linked_external_model_ids"),
  linkedSupportMemoIds: text("linked_support_memo_ids"),
  linkedFileIds: text("linked_file_ids"),
  externalLinks: text("external_links"),
  reviewStatus: text("review_status").default("draft"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
});
export const insertProjectReportSectionSchema = createInsertSchema(projectReportSections).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProjectReportSection = z.infer<typeof insertProjectReportSectionSchema>;
export type ProjectReportSection = typeof projectReportSections.$inferSelect;

// ─── files ────────────────────────────────────────────────────────────────────
export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id"),
  projectId: text("project_id"),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type"),
  storageMode: text("storage_mode"),
  urlOrPath: text("url_or_path"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  createdBy: text("created_by"),
});
export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

// ─── project_sections ────────────────────────────────────────────────────────
export const projectSections = sqliteTable("project_sections", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  workspaceId: text("workspace_id").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  sectionType: text("section_type").notNull().default("custom"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const insertProjectSectionSchema = createInsertSchema(projectSections).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProjectSection = z.infer<typeof insertProjectSectionSchema>;
export type ProjectSection = typeof projectSections.$inferSelect;
