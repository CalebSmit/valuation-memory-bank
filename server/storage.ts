import { db } from "./db";
import { eq, like, or, and, desc, asc, inArray, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  users, workspaces, workspaceMemberships, projects,
  methodologyPlaybooks, decisionFrameworks, valuationPrinciples,
  valuationAntipatterns, reasoningTemplates, referenceCases,
  referenceCaseArtifacts, assumptions, sources, evidenceLinks,
  externalModelReferences, supportMemos, qaItems, notes,
  lessonsLearned, tags, tagLinks, favorites, activityLog,
  aiTasks, files, reportSectionTemplates, projectReportSections, projectSections,
  type User, type InsertUser,
  type Workspace, type InsertWorkspace,
  type WorkspaceMembership, type InsertWorkspaceMembership,
  type Project, type InsertProject,
  type Playbook, type InsertPlaybook,
  type Framework, type InsertFramework,
  type Principle, type InsertPrinciple,
  type Antipattern, type InsertAntipattern,
  type Template, type InsertTemplate,
  type ReferenceCase, type InsertReferenceCase,
  type ReferenceArtifact, type InsertReferenceArtifact,
  type Assumption, type InsertAssumption,
  type Source, type InsertSource,
  type EvidenceLink, type InsertEvidenceLink,
  type ExternalModelRef, type InsertExternalModelRef,
  type SupportMemo, type InsertSupportMemo,
  type QaItem, type InsertQaItem,
  type Note, type InsertNote,
  type Lesson, type InsertLesson,
  type Tag, type InsertTag,
  type TagLink, type InsertTagLink,
  type Favorite, type InsertFavorite,
  type ActivityLog, type InsertActivityLog,
  type AiTask, type InsertAiTask,
  type File, type InsertFile,
  type ReportSectionTemplate, type InsertReportSectionTemplate,
  type ProjectReportSection, type InsertProjectReportSection,
  type ProjectSection, type InsertProjectSection,
} from "../shared/schema";

// Helper
function now() { return new Date().toISOString(); }
function id() { return nanoid(); }

export interface IStorage {
  // Users
  getUser(id: string): User | undefined;
  getUserByEmail(email: string): User | undefined;
  createUser(data: InsertUser): User;
  updateUser(id: string, data: Partial<InsertUser>): User | undefined;

  // Workspaces
  getWorkspaces(): Workspace[];
  getWorkspace(id: string): Workspace | undefined;
  createWorkspace(data: InsertWorkspace): Workspace;
  updateWorkspace(id: string, data: Partial<InsertWorkspace>): Workspace | undefined;
  deleteWorkspace(id: string): boolean;

  // Workspace memberships
  getWorkspaceMembers(workspaceId: string): WorkspaceMembership[];
  addWorkspaceMember(data: InsertWorkspaceMembership): WorkspaceMembership;
  updateWorkspaceMember(id: string, data: Partial<InsertWorkspaceMembership>): WorkspaceMembership | undefined;
  removeWorkspaceMember(id: string): boolean;

  // Projects
  getProjects(workspaceId?: string): Project[];
  getProject(id: string): Project | undefined;
  createProject(data: InsertProject): Project;
  updateProject(id: string, data: Partial<InsertProject>): Project | undefined;
  deleteProject(id: string): boolean;

  // Playbooks
  getPlaybooks(workspaceId?: string, scope?: string): Playbook[];
  getPlaybook(id: string): Playbook | undefined;
  createPlaybook(data: InsertPlaybook): Playbook;
  updatePlaybook(id: string, data: Partial<InsertPlaybook>): Playbook | undefined;
  deletePlaybook(id: string): boolean;
  clonePlaybook(id: string, workspaceId: string, projectId?: string, newTitle?: string): Playbook;

  // Frameworks
  getFrameworks(workspaceId?: string): Framework[];
  getFramework(id: string): Framework | undefined;
  createFramework(data: InsertFramework): Framework;
  updateFramework(id: string, data: Partial<InsertFramework>): Framework | undefined;
  deleteFramework(id: string): boolean;
  cloneFramework(id: string, workspaceId: string): Framework;

  // Principles
  getPrinciples(workspaceId?: string): Principle[];
  getPrinciple(id: string): Principle | undefined;
  createPrinciple(data: InsertPrinciple): Principle;
  updatePrinciple(id: string, data: Partial<InsertPrinciple>): Principle | undefined;
  deletePrinciple(id: string): boolean;
  clonePrinciple(id: string, workspaceId: string): Principle;

  // Antipatterns
  getAntipatterns(workspaceId?: string): Antipattern[];
  getAntipattern(id: string): Antipattern | undefined;
  createAntipattern(data: InsertAntipattern): Antipattern;
  updateAntipattern(id: string, data: Partial<InsertAntipattern>): Antipattern | undefined;
  deleteAntipattern(id: string): boolean;
  cloneAntipattern(id: string, workspaceId: string): Antipattern;

  // Templates
  getTemplates(workspaceId?: string): Template[];
  getTemplate(id: string): Template | undefined;
  createTemplate(data: InsertTemplate): Template;
  updateTemplate(id: string, data: Partial<InsertTemplate>): Template | undefined;
  deleteTemplate(id: string): boolean;
  cloneTemplate(id: string, workspaceId: string): Template;

  // Reference Cases
  getReferenceCases(): ReferenceCase[];
  getReferenceCase(caseId: string): ReferenceCase | undefined;
  createReferenceCase(data: InsertReferenceCase): ReferenceCase;

  // Reference Artifacts
  getReferenceArtifacts(caseId: string): ReferenceArtifact[];
  getReferenceArtifact(id: string): ReferenceArtifact | undefined;
  createReferenceArtifact(data: InsertReferenceArtifact): ReferenceArtifact;
  cloneReferenceArtifact(id: string, workspaceId: string, projectId?: string): SupportMemo;

  // Assumptions
  getAssumptions(workspaceId?: string, projectId?: string): Assumption[];
  getAssumption(id: string): Assumption | undefined;
  createAssumption(data: InsertAssumption): Assumption;
  updateAssumption(id: string, data: Partial<InsertAssumption>): Assumption | undefined;
  deleteAssumption(id: string): boolean;

  // Sources
  getSources(workspaceId?: string, projectId?: string): Source[];
  getSource(id: string): Source | undefined;
  createSource(data: InsertSource): Source;
  updateSource(id: string, data: Partial<InsertSource>): Source | undefined;
  deleteSource(id: string): boolean;

  // Evidence Links
  getEvidenceLinks(targetEntityType?: string, targetEntityId?: string): EvidenceLink[];
  getEvidenceLink(id: string): EvidenceLink | undefined;
  createEvidenceLink(data: InsertEvidenceLink): EvidenceLink;
  updateEvidenceLink(id: string, data: Partial<InsertEvidenceLink>): EvidenceLink | undefined;
  deleteEvidenceLink(id: string): boolean;

  // External Model References
  getExternalModelRefs(workspaceId?: string, projectId?: string): ExternalModelRef[];
  getExternalModelRef(id: string): ExternalModelRef | undefined;
  createExternalModelRef(data: InsertExternalModelRef): ExternalModelRef;
  updateExternalModelRef(id: string, data: Partial<InsertExternalModelRef>): ExternalModelRef | undefined;
  deleteExternalModelRef(id: string): boolean;

  // Support Memos
  getSupportMemos(workspaceId?: string, projectId?: string, memoType?: string): SupportMemo[];
  getSupportMemo(id: string): SupportMemo | undefined;
  createSupportMemo(data: InsertSupportMemo): SupportMemo;
  updateSupportMemo(id: string, data: Partial<InsertSupportMemo>): SupportMemo | undefined;
  deleteSupportMemo(id: string): boolean;
  cloneSupportMemo(id: string, workspaceId: string, projectId?: string): SupportMemo;

  // QA Items
  getQaItems(workspaceId?: string, projectId?: string, caseId?: string): QaItem[];
  getQaItem(id: string): QaItem | undefined;
  createQaItem(data: InsertQaItem): QaItem;
  updateQaItem(id: string, data: Partial<InsertQaItem>): QaItem | undefined;
  deleteQaItem(id: string): boolean;
  cloneQaItem(id: string, workspaceId: string): QaItem;

  // Notes
  getNotes(workspaceId?: string, projectId?: string, entityType?: string, entityId?: string): Note[];
  getNote(id: string): Note | undefined;
  createNote(data: InsertNote): Note;
  updateNote(id: string, data: Partial<InsertNote>): Note | undefined;
  deleteNote(id: string): boolean;

  // Lessons
  getLessons(workspaceId?: string, projectId?: string, caseId?: string): Lesson[];
  getLesson(id: string): Lesson | undefined;
  createLesson(data: InsertLesson): Lesson;
  updateLesson(id: string, data: Partial<InsertLesson>): Lesson | undefined;
  deleteLesson(id: string): boolean;
  cloneLesson(id: string, workspaceId: string): Lesson;

  // Tags
  getTags(workspaceId?: string): Tag[];
  getTag(id: string): Tag | undefined;
  createTag(data: InsertTag): Tag;
  updateTag(id: string, data: Partial<InsertTag>): Tag | undefined;
  deleteTag(id: string): boolean;
  getTagLinks(entityType?: string, entityId?: string): TagLink[];
  createTagLink(data: InsertTagLink): TagLink;
  deleteTagLink(id: string): boolean;

  // Favorites
  getFavorites(userId: string, workspaceId?: string): Favorite[];
  createFavorite(data: InsertFavorite): Favorite;
  deleteFavorite(id: string): boolean;
  deleteFavoriteByEntity(userId: string, entityType: string, entityId: string): boolean;

  // Activity Log
  getActivityLog(workspaceId?: string, projectId?: string, entityType?: string, entityId?: string): ActivityLog[];
  createActivityLog(data: InsertActivityLog): ActivityLog;

  // AI Tasks
  getAiTasks(workspaceId?: string, projectId?: string): AiTask[];
  createAiTask(data: InsertAiTask): AiTask;
  updateAiTask(id: string, data: Partial<InsertAiTask>): AiTask | undefined;

  // Files
  getFiles(workspaceId?: string, projectId?: string): File[];
  getFile(id: string): File | undefined;
  createFile(data: InsertFile): File;
  updateFile(id: string, data: Partial<InsertFile>): File | undefined;
  deleteFile(id: string): boolean;

  // Report section templates (read-only catalog)
  getReportSectionTemplates(): ReportSectionTemplate[];
  getReportSectionTemplate(slug: string): ReportSectionTemplate | undefined;

  // Project report sections (per-project narrative + linked items)
  getProjectReportSections(projectId: string): ProjectReportSection[];
  getProjectReportSection(projectId: string, templateSlug: string): ProjectReportSection | undefined;
  upsertProjectReportSection(data: InsertProjectReportSection): ProjectReportSection;
  deleteProjectReportSection(projectId: string, templateSlug: string): boolean;
  getProjectReportProgress(projectId: string): { totalSections: number; counts: Record<string, number> };

  // Project Sections
  getProjectSections(projectId: string): ProjectSection[];
  createProjectSection(data: InsertProjectSection): ProjectSection;
  updateProjectSection(id: string, data: Partial<InsertProjectSection>): ProjectSection | undefined;
  deleteProjectSection(id: string): boolean;
  reorderProjectSections(projectId: string, orderedIds: string[]): void;

  // Search
  search(q: string, workspaceId?: string, projectId?: string, type?: string, includeReferenceCases?: boolean): SearchResult[];
}

export interface SearchResult {
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
}

export class DatabaseStorage implements IStorage {
  // Users
  getUser(id: string) { return db.select().from(users).where(eq(users.id, id)).get(); }
  getUserByEmail(email: string) { return db.select().from(users).where(eq(users.email, email)).get(); }
  createUser(data: InsertUser) {
    return db.insert(users).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateUser(userId: string, data: Partial<InsertUser>) {
    return db.update(users).set({ ...data, updatedAt: now() }).where(eq(users.id, userId)).returning().get();
  }

  // Workspaces
  getWorkspaces() { return db.select().from(workspaces).orderBy(asc(workspaces.name)).all(); }
  getWorkspace(wsId: string) { return db.select().from(workspaces).where(eq(workspaces.id, wsId)).get(); }
  createWorkspace(data: InsertWorkspace) {
    return db.insert(workspaces).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateWorkspace(wsId: string, data: Partial<InsertWorkspace>) {
    return db.update(workspaces).set({ ...data, updatedAt: now() }).where(eq(workspaces.id, wsId)).returning().get();
  }
  deleteWorkspace(wsId: string) {
    db.delete(workspaces).where(eq(workspaces.id, wsId)).run();
    return true;
  }

  // Workspace memberships
  getWorkspaceMembers(workspaceId: string) {
    return db.select().from(workspaceMemberships).where(eq(workspaceMemberships.workspaceId, workspaceId)).all();
  }
  addWorkspaceMember(data: InsertWorkspaceMembership) {
    return db.insert(workspaceMemberships).values({ ...data, id: id(), createdAt: now() }).returning().get()!;
  }
  updateWorkspaceMember(membershipId: string, data: Partial<InsertWorkspaceMembership>) {
    return db.update(workspaceMemberships).set(data).where(eq(workspaceMemberships.id, membershipId)).returning().get();
  }
  removeWorkspaceMember(membershipId: string) {
    db.delete(workspaceMemberships).where(eq(workspaceMemberships.id, membershipId)).run();
    return true;
  }

  // Projects
  getProjects(workspaceId?: string) {
    if (workspaceId) {
      return db.select().from(projects).where(eq(projects.workspaceId, workspaceId)).orderBy(desc(projects.updatedAt)).all();
    }
    return db.select().from(projects).orderBy(desc(projects.updatedAt)).all();
  }
  getProject(projectId: string) { return db.select().from(projects).where(eq(projects.id, projectId)).get(); }
  createProject(data: InsertProject) {
    return db.insert(projects).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateProject(projectId: string, data: Partial<InsertProject>) {
    return db.update(projects).set({ ...data, updatedAt: now() }).where(eq(projects.id, projectId)).returning().get();
  }
  deleteProject(projectId: string) {
    db.delete(projects).where(eq(projects.id, projectId)).run();
    return true;
  }

  // Playbooks
  getPlaybooks(workspaceId?: string, scope?: string) {
    let q = db.select().from(methodologyPlaybooks);
    if (workspaceId && scope) {
      return q.where(or(and(eq(methodologyPlaybooks.workspaceId, workspaceId), eq(methodologyPlaybooks.scope, scope)), eq(methodologyPlaybooks.scope, "global_seed"))).orderBy(asc(methodologyPlaybooks.title)).all();
    }
    return q.orderBy(asc(methodologyPlaybooks.title)).all();
  }
  getPlaybook(pbId: string) { return db.select().from(methodologyPlaybooks).where(eq(methodologyPlaybooks.id, pbId)).get(); }
  createPlaybook(data: InsertPlaybook) {
    return db.insert(methodologyPlaybooks).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updatePlaybook(pbId: string, data: Partial<InsertPlaybook>) {
    const pb = this.getPlaybook(pbId);
    if (pb?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(methodologyPlaybooks).set({ ...data, updatedAt: now() }).where(eq(methodologyPlaybooks.id, pbId)).returning().get();
  }
  deletePlaybook(pbId: string) {
    const pb = this.getPlaybook(pbId);
    if (pb?.isReadonly) throw new Error("Cannot delete read-only record");
    db.delete(methodologyPlaybooks).where(eq(methodologyPlaybooks.id, pbId)).run();
    return true;
  }
  clonePlaybook(pbId: string, workspaceId: string, projectId?: string, newTitle?: string) {
    const pb = this.getPlaybook(pbId);
    if (!pb) throw new Error("Playbook not found");
    if (!pb.clonable) throw new Error("Playbook is not clonable");
    const newId = id();
    return db.insert(methodologyPlaybooks).values({
      ...pb, id: newId, workspaceId, scope: "workspace",
      title: newTitle ?? pb.title,
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "playbook", clonedFromId: pbId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // Frameworks
  getFrameworks(workspaceId?: string) {
    return db.select().from(decisionFrameworks).orderBy(asc(decisionFrameworks.title)).all();
  }
  getFramework(fwId: string) { return db.select().from(decisionFrameworks).where(eq(decisionFrameworks.id, fwId)).get(); }
  createFramework(data: InsertFramework) {
    return db.insert(decisionFrameworks).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateFramework(fwId: string, data: Partial<InsertFramework>) {
    const fw = this.getFramework(fwId);
    if (fw?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(decisionFrameworks).set({ ...data, updatedAt: now() }).where(eq(decisionFrameworks.id, fwId)).returning().get();
  }
  deleteFramework(fwId: string) {
    const fw = this.getFramework(fwId);
    if (fw?.isReadonly) throw new Error("Cannot delete read-only record");
    db.delete(decisionFrameworks).where(eq(decisionFrameworks.id, fwId)).run();
    return true;
  }
  cloneFramework(fwId: string, workspaceId: string) {
    const fw = this.getFramework(fwId);
    if (!fw) throw new Error("Framework not found");
    if (!fw.clonable) throw new Error("Framework is not clonable");
    return db.insert(decisionFrameworks).values({
      ...fw, id: id(), workspaceId, scope: "workspace",
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "framework", clonedFromId: fwId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // Principles
  getPrinciples(workspaceId?: string) { return db.select().from(valuationPrinciples).orderBy(asc(valuationPrinciples.title)).all(); }
  getPrinciple(pId: string) { return db.select().from(valuationPrinciples).where(eq(valuationPrinciples.id, pId)).get(); }
  createPrinciple(data: InsertPrinciple) {
    return db.insert(valuationPrinciples).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updatePrinciple(pId: string, data: Partial<InsertPrinciple>) {
    const p = this.getPrinciple(pId);
    if (p?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(valuationPrinciples).set({ ...data, updatedAt: now() }).where(eq(valuationPrinciples.id, pId)).returning().get();
  }
  deletePrinciple(pId: string) {
    const p = this.getPrinciple(pId);
    if (p?.isReadonly) throw new Error("Cannot delete read-only record");
    db.delete(valuationPrinciples).where(eq(valuationPrinciples.id, pId)).run();
    return true;
  }
  clonePrinciple(pId: string, workspaceId: string) {
    const p = this.getPrinciple(pId);
    if (!p) throw new Error("Principle not found");
    if (!p.clonable) throw new Error("Principle is not clonable");
    return db.insert(valuationPrinciples).values({
      ...p, id: id(), workspaceId, scope: "workspace",
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "principle", clonedFromId: pId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // Antipatterns
  getAntipatterns(workspaceId?: string) { return db.select().from(valuationAntipatterns).orderBy(asc(valuationAntipatterns.title)).all(); }
  getAntipattern(aId: string) { return db.select().from(valuationAntipatterns).where(eq(valuationAntipatterns.id, aId)).get(); }
  createAntipattern(data: InsertAntipattern) {
    return db.insert(valuationAntipatterns).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateAntipattern(aId: string, data: Partial<InsertAntipattern>) {
    const a = this.getAntipattern(aId);
    if (a?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(valuationAntipatterns).set({ ...data, updatedAt: now() }).where(eq(valuationAntipatterns.id, aId)).returning().get();
  }
  deleteAntipattern(aId: string) {
    const a = this.getAntipattern(aId);
    if (a?.isReadonly) throw new Error("Cannot delete read-only record");
    db.delete(valuationAntipatterns).where(eq(valuationAntipatterns.id, aId)).run();
    return true;
  }
  cloneAntipattern(aId: string, workspaceId: string) {
    const a = this.getAntipattern(aId);
    if (!a) throw new Error("Antipattern not found");
    if (!a.clonable) throw new Error("Antipattern is not clonable");
    return db.insert(valuationAntipatterns).values({
      ...a, id: id(), workspaceId, scope: "workspace",
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "antipattern", clonedFromId: aId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // Templates
  getTemplates(workspaceId?: string) { return db.select().from(reasoningTemplates).orderBy(asc(reasoningTemplates.title)).all(); }
  getTemplate(tId: string) { return db.select().from(reasoningTemplates).where(eq(reasoningTemplates.id, tId)).get(); }
  createTemplate(data: InsertTemplate) {
    return db.insert(reasoningTemplates).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateTemplate(tId: string, data: Partial<InsertTemplate>) {
    const t = this.getTemplate(tId);
    if (t?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(reasoningTemplates).set({ ...data, updatedAt: now() }).where(eq(reasoningTemplates.id, tId)).returning().get();
  }
  deleteTemplate(tId: string) {
    const t = this.getTemplate(tId);
    if (t?.isReadonly) throw new Error("Cannot delete read-only record");
    db.delete(reasoningTemplates).where(eq(reasoningTemplates.id, tId)).run();
    return true;
  }
  cloneTemplate(tId: string, workspaceId: string) {
    const t = this.getTemplate(tId);
    if (!t) throw new Error("Template not found");
    if (!t.clonable) throw new Error("Template is not clonable");
    return db.insert(reasoningTemplates).values({
      ...t, id: id(), workspaceId, scope: "workspace",
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "template", clonedFromId: tId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // Reference Cases
  getReferenceCases() { return db.select().from(referenceCases).orderBy(asc(referenceCases.title)).all(); }
  getReferenceCase(cId: string) { return db.select().from(referenceCases).where(eq(referenceCases.caseId, cId)).get(); }
  createReferenceCase(data: InsertReferenceCase) {
    return db.insert(referenceCases).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }

  // Reference Artifacts
  getReferenceArtifacts(cId: string) {
    return db.select().from(referenceCaseArtifacts).where(eq(referenceCaseArtifacts.caseId, cId)).orderBy(asc(referenceCaseArtifacts.title)).all();
  }
  getReferenceArtifact(artId: string) { return db.select().from(referenceCaseArtifacts).where(eq(referenceCaseArtifacts.id, artId)).get(); }
  createReferenceArtifact(data: InsertReferenceArtifact) {
    return db.insert(referenceCaseArtifacts).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  cloneReferenceArtifact(artId: string, workspaceId: string, projectId?: string) {
    const art = this.getReferenceArtifact(artId);
    if (!art) throw new Error("Artifact not found");
    if (!art.clonable) throw new Error("Artifact is not clonable");
    return db.insert(supportMemos).values({
      id: id(), workspaceId, projectId: projectId ?? null,
      memoType: art.artifactType,
      title: `[Cloned from ${art.caseId}] ${art.title}`,
      body: art.body,
      linkedPlaybookId: null, linkedFrameworkId: null, linkedTemplateId: null,
      linkedAssumptions: null, linkedSources: null, linkedExternalModelReference: null,
      reviewStatus: "draft",
      tags: null,
      caseId: art.caseId,
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "reference_artifact", clonedFromId: artId,
      createdAt: now(), updatedAt: now(), createdBy: null,
    }).returning().get()!;
  }

  // Assumptions
  getAssumptions(workspaceId?: string, projectId?: string) {
    if (workspaceId && projectId) return db.select().from(assumptions).where(and(eq(assumptions.workspaceId, workspaceId), eq(assumptions.projectId, projectId))).orderBy(desc(assumptions.updatedAt)).all();
    if (workspaceId) return db.select().from(assumptions).where(eq(assumptions.workspaceId, workspaceId)).orderBy(desc(assumptions.updatedAt)).all();
    return db.select().from(assumptions).orderBy(desc(assumptions.updatedAt)).all();
  }
  getAssumption(aId: string) { return db.select().from(assumptions).where(eq(assumptions.id, aId)).get(); }
  createAssumption(data: InsertAssumption) {
    return db.insert(assumptions).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateAssumption(aId: string, data: Partial<InsertAssumption>) {
    const a = this.getAssumption(aId);
    if (a?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(assumptions).set({ ...data, updatedAt: now() }).where(eq(assumptions.id, aId)).returning().get();
  }
  deleteAssumption(aId: string) {
    db.delete(assumptions).where(eq(assumptions.id, aId)).run();
    return true;
  }

  // Sources
  getSources(workspaceId?: string, projectId?: string) {
    if (workspaceId && projectId) return db.select().from(sources).where(and(eq(sources.workspaceId, workspaceId), eq(sources.projectId, projectId))).orderBy(desc(sources.updatedAt)).all();
    if (workspaceId) return db.select().from(sources).where(eq(sources.workspaceId, workspaceId)).orderBy(desc(sources.updatedAt)).all();
    return db.select().from(sources).orderBy(desc(sources.updatedAt)).all();
  }
  getSource(sId: string) { return db.select().from(sources).where(eq(sources.id, sId)).get(); }
  createSource(data: InsertSource) {
    return db.insert(sources).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateSource(sId: string, data: Partial<InsertSource>) {
    const s = this.getSource(sId);
    if (s?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(sources).set({ ...data, updatedAt: now() }).where(eq(sources.id, sId)).returning().get();
  }
  deleteSource(sId: string) {
    db.delete(sources).where(eq(sources.id, sId)).run();
    return true;
  }

  // Evidence Links
  getEvidenceLinks(targetEntityType?: string, targetEntityId?: string) {
    if (targetEntityType && targetEntityId) {
      return db.select().from(evidenceLinks).where(and(eq(evidenceLinks.targetEntityType, targetEntityType), eq(evidenceLinks.targetEntityId, targetEntityId))).all();
    }
    return db.select().from(evidenceLinks).all();
  }
  getEvidenceLink(elId: string) { return db.select().from(evidenceLinks).where(eq(evidenceLinks.id, elId)).get(); }
  createEvidenceLink(data: InsertEvidenceLink) {
    return db.insert(evidenceLinks).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateEvidenceLink(elId: string, data: Partial<InsertEvidenceLink>) {
    return db.update(evidenceLinks).set({ ...data, updatedAt: now() }).where(eq(evidenceLinks.id, elId)).returning().get();
  }
  deleteEvidenceLink(elId: string) {
    db.delete(evidenceLinks).where(eq(evidenceLinks.id, elId)).run();
    return true;
  }

  // External Model References
  getExternalModelRefs(workspaceId?: string, projectId?: string) {
    if (workspaceId && projectId) return db.select().from(externalModelReferences).where(and(eq(externalModelReferences.workspaceId, workspaceId), eq(externalModelReferences.projectId, projectId))).orderBy(desc(externalModelReferences.updatedAt)).all();
    if (workspaceId) return db.select().from(externalModelReferences).where(eq(externalModelReferences.workspaceId, workspaceId)).orderBy(desc(externalModelReferences.updatedAt)).all();
    return db.select().from(externalModelReferences).orderBy(desc(externalModelReferences.updatedAt)).all();
  }
  getExternalModelRef(emrId: string) { return db.select().from(externalModelReferences).where(eq(externalModelReferences.id, emrId)).get(); }
  createExternalModelRef(data: InsertExternalModelRef) {
    return db.insert(externalModelReferences).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateExternalModelRef(emrId: string, data: Partial<InsertExternalModelRef>) {
    return db.update(externalModelReferences).set({ ...data, updatedAt: now() }).where(eq(externalModelReferences.id, emrId)).returning().get();
  }
  deleteExternalModelRef(emrId: string) {
    db.delete(externalModelReferences).where(eq(externalModelReferences.id, emrId)).run();
    return true;
  }

  // Support Memos
  getSupportMemos(workspaceId?: string, projectId?: string, memoType?: string) {
    let all = db.select().from(supportMemos).orderBy(desc(supportMemos.updatedAt)).all();
    if (workspaceId) all = all.filter(m => m.workspaceId === workspaceId);
    if (projectId) all = all.filter(m => m.projectId === projectId);
    if (memoType) all = all.filter(m => m.memoType === memoType);
    return all;
  }
  getSupportMemo(mId: string) { return db.select().from(supportMemos).where(eq(supportMemos.id, mId)).get(); }
  createSupportMemo(data: InsertSupportMemo) {
    return db.insert(supportMemos).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateSupportMemo(mId: string, data: Partial<InsertSupportMemo>) {
    const m = this.getSupportMemo(mId);
    if (m?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(supportMemos).set({ ...data, updatedAt: now() }).where(eq(supportMemos.id, mId)).returning().get();
  }
  deleteSupportMemo(mId: string) {
    const m = this.getSupportMemo(mId);
    if (m?.isReadonly) throw new Error("Cannot delete read-only record");
    db.delete(supportMemos).where(eq(supportMemos.id, mId)).run();
    return true;
  }
  cloneSupportMemo(mId: string, workspaceId: string, projectId?: string) {
    const m = this.getSupportMemo(mId);
    if (!m) throw new Error("Support memo not found");
    if (!m.clonable) throw new Error("Support memo is not clonable");
    return db.insert(supportMemos).values({
      ...m, id: id(), workspaceId, projectId: projectId ?? m.projectId,
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "support_memo", clonedFromId: mId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // QA Items
  getQaItems(workspaceId?: string, projectId?: string, caseId?: string) {
    let all = db.select().from(qaItems).orderBy(desc(qaItems.updatedAt)).all();
    if (workspaceId) all = all.filter(q => q.workspaceId === workspaceId);
    if (projectId) all = all.filter(q => q.projectId === projectId);
    if (caseId) all = all.filter(q => q.caseId === caseId);
    return all;
  }
  getQaItem(qId: string) { return db.select().from(qaItems).where(eq(qaItems.id, qId)).get(); }
  createQaItem(data: InsertQaItem) {
    return db.insert(qaItems).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateQaItem(qId: string, data: Partial<InsertQaItem>) {
    const q = this.getQaItem(qId);
    if (q?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(qaItems).set({ ...data, updatedAt: now() }).where(eq(qaItems.id, qId)).returning().get();
  }
  deleteQaItem(qId: string) {
    db.delete(qaItems).where(eq(qaItems.id, qId)).run();
    return true;
  }
  cloneQaItem(qId: string, workspaceId: string) {
    const q = this.getQaItem(qId);
    if (!q) throw new Error("Q&A item not found");
    if (!q.clonable) throw new Error("Q&A item is not clonable");
    return db.insert(qaItems).values({
      ...q, id: id(), workspaceId,
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "qa_item", clonedFromId: qId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // Notes
  getNotes(workspaceId?: string, projectId?: string, entityType?: string, entityId?: string) {
    let all = db.select().from(notes).orderBy(desc(notes.updatedAt)).all();
    if (workspaceId) all = all.filter(n => n.workspaceId === workspaceId);
    if (projectId) all = all.filter(n => n.projectId === projectId);
    if (entityType) all = all.filter(n => n.entityType === entityType);
    if (entityId) all = all.filter(n => n.entityId === entityId);
    return all;
  }
  getNote(nId: string) { return db.select().from(notes).where(eq(notes.id, nId)).get(); }
  createNote(data: InsertNote) {
    return db.insert(notes).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateNote(nId: string, data: Partial<InsertNote>) {
    return db.update(notes).set({ ...data, updatedAt: now() }).where(eq(notes.id, nId)).returning().get();
  }
  deleteNote(nId: string) {
    db.delete(notes).where(eq(notes.id, nId)).run();
    return true;
  }

  // Lessons
  getLessons(workspaceId?: string, projectId?: string, caseId?: string) {
    let all = db.select().from(lessonsLearned).orderBy(desc(lessonsLearned.updatedAt)).all();
    if (workspaceId) all = all.filter(l => l.workspaceId === workspaceId);
    if (projectId) all = all.filter(l => l.projectId === projectId);
    if (caseId) all = all.filter(l => l.caseId === caseId);
    return all;
  }
  getLesson(lId: string) { return db.select().from(lessonsLearned).where(eq(lessonsLearned.id, lId)).get(); }
  createLesson(data: InsertLesson) {
    return db.insert(lessonsLearned).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateLesson(lId: string, data: Partial<InsertLesson>) {
    const l = this.getLesson(lId);
    if (l?.isReadonly) throw new Error("Cannot edit read-only record");
    return db.update(lessonsLearned).set({ ...data, updatedAt: now() }).where(eq(lessonsLearned.id, lId)).returning().get();
  }
  deleteLesson(lId: string) {
    db.delete(lessonsLearned).where(eq(lessonsLearned.id, lId)).run();
    return true;
  }
  cloneLesson(lId: string, workspaceId: string) {
    const l = this.getLesson(lId);
    if (!l) throw new Error("Lesson not found");
    if (!l.clonable) throw new Error("Lesson is not clonable");
    return db.insert(lessonsLearned).values({
      ...l, id: id(), workspaceId,
      isSeed: false, isReadonly: false, clonable: true,
      clonedFromType: "lesson", clonedFromId: lId,
      reviewStatus: "draft", createdAt: now(), updatedAt: now(),
    }).returning().get()!;
  }

  // Tags
  getTags(workspaceId?: string) {
    let all = db.select().from(tags).orderBy(asc(tags.name)).all();
    if (workspaceId) all = all.filter(t => t.workspaceId === workspaceId || t.workspaceId === null);
    return all;
  }
  getTag(tId: string) { return db.select().from(tags).where(eq(tags.id, tId)).get(); }
  createTag(data: InsertTag) {
    return db.insert(tags).values({ ...data, id: id(), createdAt: now() }).returning().get()!;
  }
  updateTag(tId: string, data: Partial<InsertTag>) {
    return db.update(tags).set(data).where(eq(tags.id, tId)).returning().get();
  }
  deleteTag(tId: string) {
    db.delete(tags).where(eq(tags.id, tId)).run();
    return true;
  }
  getTagLinks(entityType?: string, entityId?: string) {
    if (entityType && entityId) {
      return db.select().from(tagLinks).where(and(eq(tagLinks.entityType, entityType), eq(tagLinks.entityId, entityId))).all();
    }
    return db.select().from(tagLinks).all();
  }
  createTagLink(data: InsertTagLink) {
    return db.insert(tagLinks).values({ ...data, id: id(), createdAt: now() }).returning().get()!;
  }
  deleteTagLink(tlId: string) {
    db.delete(tagLinks).where(eq(tagLinks.id, tlId)).run();
    return true;
  }

  // Favorites
  getFavorites(userId: string, workspaceId?: string) {
    let all = db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt)).all();
    if (workspaceId) all = all.filter(f => f.workspaceId === workspaceId);
    return all;
  }
  createFavorite(data: InsertFavorite) {
    return db.insert(favorites).values({ ...data, id: id(), createdAt: now() }).returning().get()!;
  }
  deleteFavorite(fId: string) {
    db.delete(favorites).where(eq(favorites.id, fId)).run();
    return true;
  }
  deleteFavoriteByEntity(userId: string, entityType: string, entityId: string) {
    db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.entityType, entityType), eq(favorites.entityId, entityId))).run();
    return true;
  }

  // Activity Log
  getActivityLog(workspaceId?: string, projectId?: string, entityType?: string, entityId?: string) {
    let all = db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).all();
    if (workspaceId) all = all.filter(a => a.workspaceId === workspaceId);
    if (projectId) all = all.filter(a => a.projectId === projectId);
    if (entityType) all = all.filter(a => a.entityType === entityType);
    if (entityId) all = all.filter(a => a.entityId === entityId);
    return all.slice(0, 100);
  }
  createActivityLog(data: InsertActivityLog) {
    return db.insert(activityLog).values({ ...data, id: id(), createdAt: now() }).returning().get()!;
  }

  // AI Tasks
  getAiTasks(workspaceId?: string, projectId?: string) {
    let all = db.select().from(aiTasks).orderBy(desc(aiTasks.createdAt)).all();
    if (workspaceId) all = all.filter(t => t.workspaceId === workspaceId);
    if (projectId) all = all.filter(t => t.projectId === projectId);
    return all;
  }
  createAiTask(data: InsertAiTask) {
    return db.insert(aiTasks).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateAiTask(taskId: string, data: Partial<InsertAiTask>) {
    return db.update(aiTasks).set({ ...data, updatedAt: now() }).where(eq(aiTasks.id, taskId)).returning().get();
  }

  // Files
  getFiles(workspaceId?: string, projectId?: string) {
    let all = db.select().from(files).orderBy(desc(files.updatedAt)).all();
    if (workspaceId) all = all.filter(f => f.workspaceId === workspaceId);
    if (projectId) all = all.filter(f => f.projectId === projectId);
    return all;
  }
  getFile(fId: string) { return db.select().from(files).where(eq(files.id, fId)).get(); }
  createFile(data: InsertFile) {
    return db.insert(files).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateFile(fId: string, data: Partial<InsertFile>) {
    return db.update(files).set({ ...data, updatedAt: now() }).where(eq(files.id, fId)).returning().get();
  }
  deleteFile(fId: string) {
    db.delete(files).where(eq(files.id, fId)).run();
    return true;
  }

  // Report section templates (read-only seed catalog)
  getReportSectionTemplates() {
    return db.select().from(reportSectionTemplates).orderBy(asc(reportSectionTemplates.defaultOrder)).all();
  }
  getReportSectionTemplate(slug: string) {
    return db.select().from(reportSectionTemplates).where(eq(reportSectionTemplates.slug, slug)).get();
  }

  // Project report sections
  getProjectReportSections(projectId: string) {
    return db.select().from(projectReportSections)
      .where(eq(projectReportSections.projectId, projectId))
      .all();
  }
  getProjectReportSection(projectId: string, templateSlug: string) {
    return db.select().from(projectReportSections)
      .where(and(
        eq(projectReportSections.projectId, projectId),
        eq(projectReportSections.templateSlug, templateSlug),
      ))
      .get();
  }
  upsertProjectReportSection(data: InsertProjectReportSection) {
    const existing = this.getProjectReportSection(data.projectId, data.templateSlug);
    if (existing) {
      return db.update(projectReportSections)
        .set({ ...data, updatedAt: now() })
        .where(eq(projectReportSections.id, existing.id))
        .returning().get()!;
    }
    return db.insert(projectReportSections)
      .values({ ...data, id: id(), createdAt: now(), updatedAt: now() })
      .returning().get()!;
  }
  deleteProjectReportSection(projectId: string, templateSlug: string) {
    const existing = this.getProjectReportSection(projectId, templateSlug);
    if (!existing) return false;
    db.delete(projectReportSections).where(eq(projectReportSections.id, existing.id)).run();
    return true;
  }
  getProjectReportProgress(projectId: string) {
    const totalSections = db.select().from(reportSectionTemplates).all().length;
    const sections = this.getProjectReportSections(projectId);
    const counts: Record<string, number> = {
      not_started: 0, in_progress: 0, drafted: 0, reviewed: 0, final: 0,
    };
    for (const s of sections) {
      counts[s.status] = (counts[s.status] ?? 0) + 1;
    }
    // Untouched sections are implicitly not_started — fold those in.
    counts.not_started = (counts.not_started ?? 0) + (totalSections - sections.length);
    return { totalSections, counts };
  }

  // Project Sections
  getProjectSections(projectId: string) {
    return db.select().from(projectSections)
      .where(eq(projectSections.projectId, projectId))
      .orderBy(asc(projectSections.sortOrder))
      .all();
  }
  createProjectSection(data: InsertProjectSection) {
    return db.insert(projectSections).values({ ...data, id: id(), createdAt: now(), updatedAt: now() }).returning().get()!;
  }
  updateProjectSection(sId: string, data: Partial<InsertProjectSection>) {
    return db.update(projectSections).set({ ...data, updatedAt: now() }).where(eq(projectSections.id, sId)).returning().get();
  }
  deleteProjectSection(sId: string) {
    const existing = db.select().from(projectSections).where(eq(projectSections.id, sId)).get();
    if (!existing) return false;
    db.delete(projectSections).where(eq(projectSections.id, sId)).run();
    return true;
  }
  reorderProjectSections(projectId: string, orderedIds: string[]) {
    for (let i = 0; i < orderedIds.length; i++) {
      db.update(projectSections)
        .set({ sortOrder: i, updatedAt: now() })
        .where(and(eq(projectSections.id, orderedIds[i]), eq(projectSections.projectId, projectId)))
        .run();
    }
  }

  // Search
  search(q: string, workspaceId?: string, projectId?: string, type?: string, includeReferenceCases?: boolean): SearchResult[] {
    const results: SearchResult[] = [];
    const pattern = `%${q}%`;

    const addResults = (items: any[], itemType: string, urlPrefix: string) => {
      for (const item of items) {
        const titleMatch = item.title && item.title.toLowerCase().includes(q.toLowerCase());
        const bodyMatch = (item.body || item.purpose || item.description || item.lesson || item.question || item.statedAssumptionText || "").toLowerCase().includes(q.toLowerCase());
        if (titleMatch || bodyMatch) {
          const bodyField = item.body || item.purpose || item.description || item.lesson || item.question || item.statedAssumptionText || "";
          results.push({
            id: item.id,
            type: itemType,
            title: item.title || item.question || item.name || "",
            snippet: bodyField.substring(0, 150),
            workspaceId: item.workspaceId,
            projectId: item.projectId,
            caseId: item.caseId,
            tags: [],
            reviewStatus: item.reviewStatus,
            url: `/${urlPrefix}/${item.id}`,
          });
        }
      }
    };

    if (!type || type === "playbook") addResults(this.getPlaybooks(workspaceId), "playbook", "playbooks");
    if (!type || type === "framework") addResults(this.getFrameworks(workspaceId), "framework", "frameworks");
    if (!type || type === "principle") addResults(this.getPrinciples(workspaceId), "principle", "principles");
    if (!type || type === "antipattern") addResults(this.getAntipatterns(workspaceId), "antipattern", "anti-patterns");
    if (!type || type === "template") addResults(this.getTemplates(workspaceId), "template", "reasoning-templates");
    if (!type || type === "project") addResults(this.getProjects(workspaceId), "project", "projects");
    if (!type || type === "assumption") addResults(this.getAssumptions(workspaceId, projectId), "assumption", "assumptions");
    if (!type || type === "source") addResults(this.getSources(workspaceId, projectId), "source", "sources");
    if (!type || type === "support_memo") addResults(this.getSupportMemos(workspaceId, projectId), "support_memo", "support-memos");
    if (!type || type === "qa_item") addResults(this.getQaItems(workspaceId, projectId), "qa_item", "qa");
    if (!type || type === "note") addResults(this.getNotes(workspaceId, projectId), "note", "notes");
    if (!type || type === "lesson") addResults(this.getLessons(workspaceId, projectId), "lesson", "lessons");

    if (includeReferenceCases) {
      const cases = this.getReferenceCases().filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || (c.description || "").toLowerCase().includes(q.toLowerCase()));
      for (const c of cases) {
        results.push({ id: c.id, type: "reference_case", title: c.title, snippet: c.description?.substring(0, 150) || "", caseId: c.caseId, tags: [], url: `/reference-cases/${c.caseId}` });
      }
      const allArtifacts = this.getReferenceCases().flatMap(c => this.getReferenceArtifacts(c.caseId));
      addResults(allArtifacts, "reference_artifact", "reference-artifacts");
    }

    return results.slice(0, 50);
  }
}

export const storage = new DatabaseStorage();
