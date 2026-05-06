import { type Express, Request, Response } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertWorkspaceSchema, insertProjectSchema, insertPlaybookSchema,
  insertFrameworkSchema, insertPrincipleSchema, insertAntipatternsSchema,
  insertTemplateSchema, insertReferenceCaseSchema, insertReferenceArtifactSchema,
  insertAssumptionSchema, insertSourceSchema, insertEvidenceLinkSchema,
  insertExternalModelRefSchema, insertSupportMemoSchema, insertQaItemSchema,
  insertNoteSchema, insertLessonSchema, insertTagSchema, insertTagLinkSchema,
  insertFavoriteSchema, insertAiTaskSchema, insertFileSchema,
  insertProjectReportSectionSchema,
} from "../shared/schema";

// Mock auth: always return a local demo user
const MOCK_USER = { id: "user_demo", email: "demo@valuation-memory-bank.local", name: "Demo Analyst", role: "analyst" };

function logActivity(opts: { workspaceId?: string; projectId?: string; action: string; entityType: string; entityId: string; metadata?: any }) {
  try {
    storage.createActivityLog({
      workspaceId: opts.workspaceId ?? null,
      projectId: opts.projectId ?? null,
      actorId: MOCK_USER.id,
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId,
      metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
    });
  } catch {}
}

function parseBody<T>(schema: z.ZodType<T>, body: unknown): { data: T } | { error: string } {
  const result = schema.safeParse(body);
  if (!result.success) return { error: result.error.message };
  return { data: result.data };
}

// ─── Field mapping helpers ───────────────────────────────────────────────────
// The DB uses column names (name, subjectCompanyLabel, assignmentType, status, notes).
// The PRD API contract uses (title, entityName, engagementType, reviewStatus, description).
// These helpers translate between the two so the frontend and tests use PRD names throughout.

function fromProjectBody(body: Record<string, any>): Record<string, any> {
  const mapped: Record<string, any> = { ...body };
  if ('title' in body) { mapped.name = body.title; delete mapped.title; }
  if ('entityName' in body) { mapped.subjectCompanyLabel = body.entityName; delete mapped.entityName; }
  if ('engagementType' in body) { mapped.assignmentType = body.engagementType; delete mapped.engagementType; }
  if ('reviewStatus' in body) { mapped.status = body.reviewStatus; delete mapped.reviewStatus; }
  if ('description' in body) { mapped.notes = body.description; delete mapped.description; }
  // clientName has no direct DB column — fold into notes if notes not already set
  if ('clientName' in body) { delete mapped.clientName; }
  return mapped;
}

function toProjectResponse(proj: Record<string, any>): Record<string, any> {
  if (!proj) return proj;
  const out: Record<string, any> = { ...proj };
  out.title = proj.name;
  out.entityName = proj.subjectCompanyLabel ?? null;
  out.engagementType = proj.assignmentType ?? null;
  out.reviewStatus = proj.status ?? null;
  out.description = proj.notes ?? null;
  return out;
}

function fromAssumptionBody(body: Record<string, any>): Record<string, any> {
  const mapped: Record<string, any> = { ...body };
  if ('title' in body) { mapped.name = body.title; delete mapped.title; }
  if ('body' in body) { mapped.statedAssumptionText = body.body; delete mapped.body; }
  if ('assumptionType' in body) { mapped.category = body.assumptionType; delete mapped.assumptionType; }
  return mapped;
}

function toAssumptionResponse(a: Record<string, any>): Record<string, any> {
  if (!a) return a;
  const out: Record<string, any> = { ...a };
  out.title = a.name;
  out.body = a.statedAssumptionText ?? null;
  out.assumptionType = a.category ?? null;
  return out;
}

function fromExternalModelBody(body: Record<string, any>): Record<string, any> {
  const mapped: Record<string, any> = { ...body };
  if ('storageLocation' in body) { mapped.fileOrUrlReference = body.storageLocation; delete mapped.storageLocation; }
  return mapped;
}

// Report sections: client sends arrays for linked IDs and external links;
// DB stores them as JSON-encoded text. These helpers serialize/deserialize.
const REPORT_SECTION_ARRAY_FIELDS = [
  "linkedSourceIds",
  "linkedAssumptionIds",
  "linkedExternalModelIds",
  "linkedSupportMemoIds",
  "linkedFileIds",
  "externalLinks",
] as const;

function fromReportSectionBody(body: Record<string, any>): Record<string, any> {
  const mapped: Record<string, any> = { ...body };
  for (const field of REPORT_SECTION_ARRAY_FIELDS) {
    if (field in mapped && mapped[field] !== null && typeof mapped[field] !== "string") {
      mapped[field] = JSON.stringify(mapped[field]);
    }
  }
  return mapped;
}

function toReportSectionResponse(section: Record<string, any>): Record<string, any> {
  if (!section) return section;
  const out: Record<string, any> = { ...section };
  for (const field of REPORT_SECTION_ARRAY_FIELDS) {
    if (typeof out[field] === "string" && out[field].length > 0) {
      try { out[field] = JSON.parse(out[field]); }
      catch { out[field] = []; }
    } else if (out[field] == null) {
      out[field] = [];
    }
  }
  return out;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {

  // ─── Auth / Me ──────────────────────────────────────────────────────────────
  app.get("/api/me", (req, res) => {
    let user = storage.getUser(MOCK_USER.id);
    if (!user) {
      user = storage.createUser(MOCK_USER);
    }
    res.json(user);
  });

  app.patch("/api/me/profile", (req, res) => {
    const user = storage.updateUser(MOCK_USER.id, req.body);
    res.json(user);
  });

  // ─── Workspaces ─────────────────────────────────────────────────────────────
  app.get("/api/workspaces", (req, res) => {
    res.json(storage.getWorkspaces());
  });
  app.post("/api/workspaces", (req, res) => {
    const parsed = parseBody(insertWorkspaceSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const ws = storage.createWorkspace(parsed.data);
    logActivity({ workspaceId: ws.id, action: "created", entityType: "workspace", entityId: ws.id });
    res.status(201).json(ws);
  });
  app.get("/api/workspaces/:id", (req, res) => {
    const ws = storage.getWorkspace(req.params.id);
    if (!ws) return res.status(404).json({ error: "Not found" });
    res.json(ws);
  });
  app.patch("/api/workspaces/:id", (req, res) => {
    const ws = storage.updateWorkspace(req.params.id, req.body);
    if (!ws) return res.status(404).json({ error: "Not found" });
    logActivity({ workspaceId: req.params.id, action: "updated", entityType: "workspace", entityId: req.params.id });
    res.json(ws);
  });
  app.delete("/api/workspaces/:id", (req, res) => {
    storage.deleteWorkspace(req.params.id);
    res.json({ success: true });
  });
  app.get("/api/workspaces/:id/members", (req, res) => {
    res.json(storage.getWorkspaceMembers(req.params.id));
  });
  app.post("/api/workspaces/:id/members", (req, res) => {
    const member = storage.addWorkspaceMember({ workspaceId: req.params.id, ...req.body });
    res.status(201).json(member);
  });
  app.patch("/api/workspaces/:id/members/:membershipId", (req, res) => {
    const m = storage.updateWorkspaceMember(req.params.membershipId, req.body);
    res.json(m);
  });
  app.delete("/api/workspaces/:id/members/:membershipId", (req, res) => {
    storage.removeWorkspaceMember(req.params.membershipId);
    res.json({ success: true });
  });

  // ─── Projects ───────────────────────────────────────────────────────────────
  app.get("/api/projects", (req, res) => {
    res.json(storage.getProjects(req.query.workspaceId as string).map(toProjectResponse));
  });
  app.post("/api/projects", (req, res) => {
    const mapped = fromProjectBody(req.body);
    const parsed = parseBody(insertProjectSchema, mapped);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const proj = storage.createProject({ ...parsed.data, createdBy: MOCK_USER.id, updatedBy: MOCK_USER.id });
    logActivity({ workspaceId: proj.workspaceId, projectId: proj.id, action: "created", entityType: "project", entityId: proj.id });
    res.status(201).json(toProjectResponse(proj as any));
  });
  app.get("/api/projects/:id", (req, res) => {
    const proj = storage.getProject(req.params.id);
    if (!proj) return res.status(404).json({ error: "Not found" });
    res.json(toProjectResponse(proj as any));
  });
  app.patch("/api/projects/:id", (req, res) => {
    const mapped = fromProjectBody(req.body);
    const proj = storage.updateProject(req.params.id, { ...mapped, updatedBy: MOCK_USER.id } as any);
    if (!proj) return res.status(404).json({ error: "Not found" });
    logActivity({ workspaceId: proj.workspaceId, projectId: proj.id, action: "updated", entityType: "project", entityId: proj.id });
    res.json(toProjectResponse(proj as any));
  });
  app.delete("/api/projects/:id", (req, res) => {
    storage.deleteProject(req.params.id);
    res.json({ success: true });
  });
  app.get("/api/projects/:id/dashboard", (req, res) => {
    const proj = storage.getProject(req.params.id);
    if (!proj) return res.status(404).json({ error: "Not found" });
    const assumptions = storage.getAssumptions(proj.workspaceId, proj.id).map(toAssumptionResponse);
    const sources = storage.getSources(proj.workspaceId, proj.id);
    const externalModels = storage.getExternalModelRefs(proj.workspaceId, proj.id);
    const memos = storage.getSupportMemos(proj.workspaceId, proj.id);
    const qa = storage.getQaItems(proj.workspaceId, proj.id);
    const notesList = storage.getNotes(proj.workspaceId, proj.id);
    const lessons = storage.getLessons(proj.workspaceId, proj.id);
    res.json({ project: toProjectResponse(proj as any), assumptions, sources, externalModels, memos, qa, notes: notesList, lessons });
  });

  // ─── Playbooks ──────────────────────────────────────────────────────────────
  app.get("/api/playbooks", (req, res) => {
    res.json(storage.getPlaybooks(req.query.workspaceId as string, req.query.scope as string));
  });
  app.post("/api/playbooks", (req, res) => {
    const parsed = parseBody(insertPlaybookSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const pb = storage.createPlaybook({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: pb.workspaceId ?? undefined, action: "created", entityType: "playbook", entityId: pb.id });
    res.status(201).json(pb);
  });
  app.get("/api/playbooks/:id", (req, res) => {
    const pb = storage.getPlaybook(req.params.id);
    if (!pb) return res.status(404).json({ error: "Not found" });
    res.json(pb);
  });
  app.patch("/api/playbooks/:id", (req, res) => {
    try {
      const pb = storage.updatePlaybook(req.params.id, req.body);
      if (!pb) return res.status(404).json({ error: "Not found" });
      logActivity({ action: "updated", entityType: "playbook", entityId: req.params.id });
      res.json(pb);
    } catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/playbooks/:id", (req, res) => {
    try {
      storage.deletePlaybook(req.params.id);
      res.json({ success: true });
    } catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.post("/api/playbooks/:id/clone", (req, res) => {
    // Accept both workspaceId and targetWorkspaceId (alias) for flexibility
    const workspaceId = req.body.workspaceId ?? req.body.targetWorkspaceId;
    const { projectId, newTitle } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.clonePlaybook(req.params.id, workspaceId, projectId, newTitle);
    logActivity({ workspaceId, action: "cloned", entityType: "playbook", entityId: clone.id, metadata: { clonedFrom: req.params.id } });
    res.status(201).json(clone);
  });

  // ─── Frameworks ─────────────────────────────────────────────────────────────
  app.get("/api/frameworks", (req, res) => { res.json(storage.getFrameworks(req.query.workspaceId as string)); });
  app.post("/api/frameworks", (req, res) => {
    const parsed = parseBody(insertFrameworkSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const fw = storage.createFramework({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ action: "created", entityType: "framework", entityId: fw.id });
    res.status(201).json(fw);
  });
  app.get("/api/frameworks/:id", (req, res) => {
    const fw = storage.getFramework(req.params.id);
    if (!fw) return res.status(404).json({ error: "Not found" });
    res.json(fw);
  });
  app.patch("/api/frameworks/:id", (req, res) => {
    try {
      const fw = storage.updateFramework(req.params.id, req.body);
      if (!fw) return res.status(404).json({ error: "Not found" });
      res.json(fw);
    } catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/frameworks/:id", (req, res) => {
    try { storage.deleteFramework(req.params.id); res.json({ success: true }); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.post("/api/frameworks/:id/clone", (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.cloneFramework(req.params.id, workspaceId);
    logActivity({ workspaceId, action: "cloned", entityType: "framework", entityId: clone.id });
    res.status(201).json(clone);
  });

  // ─── Principles ─────────────────────────────────────────────────────────────
  app.get("/api/principles", (req, res) => { res.json(storage.getPrinciples(req.query.workspaceId as string)); });
  app.post("/api/principles", (req, res) => {
    const parsed = parseBody(insertPrincipleSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const p = storage.createPrinciple({ ...parsed.data, createdBy: MOCK_USER.id });
    res.status(201).json(p);
  });
  app.get("/api/principles/:id", (req, res) => {
    const p = storage.getPrinciple(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  });
  app.patch("/api/principles/:id", (req, res) => {
    try { const p = storage.updatePrinciple(req.params.id, req.body); res.json(p); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/principles/:id", (req, res) => {
    try { storage.deletePrinciple(req.params.id); res.json({ success: true }); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.post("/api/principles/:id/clone", (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.clonePrinciple(req.params.id, workspaceId);
    logActivity({ workspaceId, action: "cloned", entityType: "principle", entityId: clone.id });
    res.status(201).json(clone);
  });

  // ─── Anti-Patterns ──────────────────────────────────────────────────────────
  app.get("/api/anti-patterns", (req, res) => { res.json(storage.getAntipatterns()); });
  app.post("/api/anti-patterns", (req, res) => {
    const parsed = parseBody(insertAntipatternsSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const a = storage.createAntipattern({ ...parsed.data, createdBy: MOCK_USER.id });
    res.status(201).json(a);
  });
  app.get("/api/anti-patterns/:id", (req, res) => {
    const a = storage.getAntipattern(req.params.id);
    if (!a) return res.status(404).json({ error: "Not found" });
    res.json(a);
  });
  app.patch("/api/anti-patterns/:id", (req, res) => {
    try { const a = storage.updateAntipattern(req.params.id, req.body); res.json(a); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/anti-patterns/:id", (req, res) => {
    try { storage.deleteAntipattern(req.params.id); res.json({ success: true }); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.post("/api/anti-patterns/:id/clone", (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.cloneAntipattern(req.params.id, workspaceId);
    logActivity({ workspaceId, action: "cloned", entityType: "antipattern", entityId: clone.id });
    res.status(201).json(clone);
  });

  // ─── Reasoning Templates ─────────────────────────────────────────────────────
  app.get("/api/reasoning-templates", (req, res) => { res.json(storage.getTemplates(req.query.workspaceId as string)); });
  app.post("/api/reasoning-templates", (req, res) => {
    const parsed = parseBody(insertTemplateSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const t = storage.createTemplate({ ...parsed.data, createdBy: MOCK_USER.id });
    res.status(201).json(t);
  });
  app.get("/api/reasoning-templates/:id", (req, res) => {
    const t = storage.getTemplate(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  });
  app.patch("/api/reasoning-templates/:id", (req, res) => {
    try { const t = storage.updateTemplate(req.params.id, req.body); res.json(t); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/reasoning-templates/:id", (req, res) => {
    try { storage.deleteTemplate(req.params.id); res.json({ success: true }); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.post("/api/reasoning-templates/:id/clone", (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.cloneTemplate(req.params.id, workspaceId);
    logActivity({ workspaceId, action: "cloned", entityType: "template", entityId: clone.id });
    res.status(201).json(clone);
  });
  app.post("/api/reasoning-templates/:id/draft-placeholder", (req, res) => {
    // AI placeholder: creates a mock ai_tasks row
    const t = storage.getTemplate(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    const task = storage.createAiTask({
      workspaceId: req.body.workspaceId ?? null,
      projectId: req.body.projectId ?? null,
      taskType: "draft",
      status: "placeholder",
      promptVersion: "v1",
      inputReferences: JSON.stringify({ templateId: req.params.id }),
      outputPreview: "AI drafting is not enabled in MVP. Configure AI_ENABLED=true and connect an AI provider to enable live drafting.",
    });
    // Return 200 (not 201) — this is a placeholder action, not resource creation
    res.status(200).json({ message: "AI placeholder created. Live AI requires AI_ENABLED=true.", draft: task.outputPreview, task });
  });

  // ─── Reference Cases ─────────────────────────────────────────────────────────
  app.get("/api/reference-cases", (req, res) => { res.json(storage.getReferenceCases()); });
  app.post("/api/reference-cases", (req, res) => {
    const parsed = parseBody(insertReferenceCaseSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const rc = storage.createReferenceCase(parsed.data);
    res.status(201).json(rc);
  });
  app.get("/api/reference-cases/:caseId", (req, res) => {
    const rc = storage.getReferenceCase(req.params.caseId);
    if (!rc) return res.status(404).json({ error: "Not found" });
    res.json(rc);
  });
  app.patch("/api/reference-cases/:caseId", (req, res) => {
    res.status(403).json({ error: "Reference cases are read-only" });
  });
  app.get("/api/reference-cases/:caseId/artifacts", (req, res) => {
    res.json(storage.getReferenceArtifacts(req.params.caseId));
  });
  app.post("/api/reference-cases/:caseId/artifacts", (req, res) => {
    const parsed = parseBody(insertReferenceArtifactSchema, { ...req.body, caseId: req.params.caseId });
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const art = storage.createReferenceArtifact(parsed.data);
    res.status(201).json(art);
  });
  app.get("/api/reference-artifacts/:id", (req, res) => {
    const art = storage.getReferenceArtifact(req.params.id);
    if (!art) return res.status(404).json({ error: "Not found" });
    res.json(art);
  });
  app.patch("/api/reference-artifacts/:id", (req, res) => {
    res.status(403).json({ error: "Reference artifacts are read-only" });
  });
  app.post("/api/reference-artifacts/:id/clone", (req, res) => {
    const { workspaceId, projectId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.cloneReferenceArtifact(req.params.id, workspaceId, projectId);
    logActivity({ workspaceId, action: "cloned", entityType: "reference_artifact", entityId: clone.id, metadata: { clonedFrom: req.params.id } });
    res.status(201).json(clone);
  });

  // ─── Assumptions ────────────────────────────────────────────────────────────
  app.get("/api/assumptions", (req, res) => {
    res.json(storage.getAssumptions(req.query.workspaceId as string, req.query.projectId as string).map(toAssumptionResponse));
  });
  app.post("/api/assumptions", (req, res) => {
    const mapped = fromAssumptionBody(req.body);
    const parsed = parseBody(insertAssumptionSchema, mapped);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const a = storage.createAssumption({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: a.workspaceId, projectId: a.projectId ?? undefined, action: "created", entityType: "assumption", entityId: a.id });
    res.status(201).json(toAssumptionResponse(a as any));
  });
  app.get("/api/assumptions/:id", (req, res) => {
    const a = storage.getAssumption(req.params.id);
    if (!a) return res.status(404).json({ error: "Not found" });
    res.json(toAssumptionResponse(a as any));
  });
  app.patch("/api/assumptions/:id", (req, res) => {
    try { const a = storage.updateAssumption(req.params.id, fromAssumptionBody(req.body) as any); res.json(toAssumptionResponse(a as any)); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/assumptions/:id", (req, res) => {
    storage.deleteAssumption(req.params.id);
    res.json({ success: true });
  });

  // ─── Sources ────────────────────────────────────────────────────────────────
  app.get("/api/sources", (req, res) => {
    res.json(storage.getSources(req.query.workspaceId as string, req.query.projectId as string));
  });
  app.post("/api/sources", (req, res) => {
    const parsed = parseBody(insertSourceSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const s = storage.createSource({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: s.workspaceId, projectId: s.projectId ?? undefined, action: "created", entityType: "source", entityId: s.id });
    res.status(201).json(s);
  });
  app.get("/api/sources/:id", (req, res) => {
    const s = storage.getSource(req.params.id);
    if (!s) return res.status(404).json({ error: "Not found" });
    res.json(s);
  });
  app.patch("/api/sources/:id", (req, res) => {
    try { const s = storage.updateSource(req.params.id, req.body); res.json(s); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/sources/:id", (req, res) => {
    storage.deleteSource(req.params.id);
    res.json({ success: true });
  });

  // ─── Evidence Links ──────────────────────────────────────────────────────────
  app.get("/api/evidence-links", (req, res) => {
    res.json(storage.getEvidenceLinks(req.query.targetType as string, req.query.targetId as string));
  });
  app.post("/api/evidence-links", (req, res) => {
    const parsed = parseBody(insertEvidenceLinkSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const el = storage.createEvidenceLink({ ...parsed.data, createdBy: MOCK_USER.id });
    res.status(201).json(el);
  });
  app.get("/api/evidence-links/:id", (req, res) => {
    const el = storage.getEvidenceLink(req.params.id);
    if (!el) return res.status(404).json({ error: "Not found" });
    res.json(el);
  });
  app.patch("/api/evidence-links/:id", (req, res) => {
    const el = storage.updateEvidenceLink(req.params.id, req.body);
    res.json(el);
  });
  app.delete("/api/evidence-links/:id", (req, res) => {
    storage.deleteEvidenceLink(req.params.id);
    res.json({ success: true });
  });

  // ─── External Model References ───────────────────────────────────────────────
  app.get("/api/external-model-references", (req, res) => {
    res.json(storage.getExternalModelRefs(req.query.workspaceId as string, req.query.projectId as string));
  });
  app.post("/api/external-model-references", (req, res) => {
    const mapped = fromExternalModelBody(req.body);
    const parsed = parseBody(insertExternalModelRefSchema, mapped);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const emr = storage.createExternalModelRef({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: emr.workspaceId, projectId: emr.projectId ?? undefined, action: "created", entityType: "external_model_reference", entityId: emr.id });
    res.status(201).json(emr);
  });
  app.get("/api/external-model-references/:id", (req, res) => {
    const emr = storage.getExternalModelRef(req.params.id);
    if (!emr) return res.status(404).json({ error: "Not found" });
    res.json(emr);
  });
  app.patch("/api/external-model-references/:id", (req, res) => {
    const emr = storage.updateExternalModelRef(req.params.id, req.body);
    res.json(emr);
  });
  app.delete("/api/external-model-references/:id", (req, res) => {
    storage.deleteExternalModelRef(req.params.id);
    res.json({ success: true });
  });

  // ─── Support Memos ──────────────────────────────────────────────────────────
  app.get("/api/support-memos", (req, res) => {
    res.json(storage.getSupportMemos(req.query.workspaceId as string, req.query.projectId as string, req.query.memoType as string));
  });
  app.post("/api/support-memos", (req, res) => {
    const parsed = parseBody(insertSupportMemoSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const memo = storage.createSupportMemo({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: memo.workspaceId, projectId: memo.projectId ?? undefined, action: "created", entityType: "support_memo", entityId: memo.id });
    res.status(201).json(memo);
  });
  app.get("/api/support-memos/:id", (req, res) => {
    const memo = storage.getSupportMemo(req.params.id);
    if (!memo) return res.status(404).json({ error: "Not found" });
    res.json(memo);
  });
  app.patch("/api/support-memos/:id", (req, res) => {
    try { const memo = storage.updateSupportMemo(req.params.id, req.body); res.json(memo); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/support-memos/:id", (req, res) => {
    try { storage.deleteSupportMemo(req.params.id); res.json({ success: true }); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.post("/api/support-memos/:id/clone", (req, res) => {
    const { workspaceId, projectId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.cloneSupportMemo(req.params.id, workspaceId, projectId);
    logActivity({ workspaceId, action: "cloned", entityType: "support_memo", entityId: clone.id });
    res.status(201).json(clone);
  });

  // ─── Q&A ───────────────────────────────────────────────────────────────────
  app.get("/api/qa", (req, res) => {
    res.json(storage.getQaItems(req.query.workspaceId as string, req.query.projectId as string, req.query.caseId as string));
  });
  app.post("/api/qa", (req, res) => {
    const parsed = parseBody(insertQaItemSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const qa = storage.createQaItem({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: qa.workspaceId ?? undefined, projectId: qa.projectId ?? undefined, action: "created", entityType: "qa_item", entityId: qa.id });
    res.status(201).json(qa);
  });
  app.get("/api/qa/:id", (req, res) => {
    const qa = storage.getQaItem(req.params.id);
    if (!qa) return res.status(404).json({ error: "Not found" });
    res.json(qa);
  });
  app.patch("/api/qa/:id", (req, res) => {
    try { const qa = storage.updateQaItem(req.params.id, req.body); res.json(qa); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/qa/:id", (req, res) => {
    storage.deleteQaItem(req.params.id);
    res.json({ success: true });
  });
  app.post("/api/qa/:id/clone", (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.cloneQaItem(req.params.id, workspaceId);
    logActivity({ workspaceId, action: "cloned", entityType: "qa_item", entityId: clone.id });
    res.status(201).json(clone);
  });

  // ─── Notes ──────────────────────────────────────────────────────────────────
  app.get("/api/notes", (req, res) => {
    res.json(storage.getNotes(req.query.workspaceId as string, req.query.projectId as string, req.query.entityType as string, req.query.entityId as string));
  });
  app.post("/api/notes", (req, res) => {
    const parsed = parseBody(insertNoteSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const note = storage.createNote({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: note.workspaceId ?? undefined, projectId: note.projectId ?? undefined, action: "created", entityType: "note", entityId: note.id });
    res.status(201).json(note);
  });
  app.get("/api/notes/:id", (req, res) => {
    const note = storage.getNote(req.params.id);
    if (!note) return res.status(404).json({ error: "Not found" });
    res.json(note);
  });
  app.patch("/api/notes/:id", (req, res) => {
    const note = storage.updateNote(req.params.id, req.body);
    res.json(note);
  });
  app.delete("/api/notes/:id", (req, res) => {
    storage.deleteNote(req.params.id);
    res.json({ success: true });
  });

  // ─── Lessons ────────────────────────────────────────────────────────────────
  app.get("/api/lessons", (req, res) => {
    res.json(storage.getLessons(req.query.workspaceId as string, req.query.projectId as string, req.query.caseId as string));
  });
  app.post("/api/lessons", (req, res) => {
    const parsed = parseBody(insertLessonSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const lesson = storage.createLesson({ ...parsed.data, createdBy: MOCK_USER.id });
    logActivity({ workspaceId: lesson.workspaceId ?? undefined, projectId: lesson.projectId ?? undefined, action: "created", entityType: "lesson", entityId: lesson.id });
    res.status(201).json(lesson);
  });
  app.get("/api/lessons/:id", (req, res) => {
    const lesson = storage.getLesson(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Not found" });
    res.json(lesson);
  });
  app.patch("/api/lessons/:id", (req, res) => {
    try { const lesson = storage.updateLesson(req.params.id, req.body); res.json(lesson); }
    catch (e: any) { res.status(403).json({ error: e.message }); }
  });
  app.delete("/api/lessons/:id", (req, res) => {
    storage.deleteLesson(req.params.id);
    res.json({ success: true });
  });
  app.post("/api/lessons/:id/clone", (req, res) => {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
    const clone = storage.cloneLesson(req.params.id, workspaceId);
    res.status(201).json(clone);
  });

  // ─── Tags ───────────────────────────────────────────────────────────────────
  app.get("/api/tags", (req, res) => { res.json(storage.getTags(req.query.workspaceId as string)); });
  app.post("/api/tags", (req, res) => {
    const parsed = parseBody(insertTagSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const tag = storage.createTag(parsed.data);
    res.status(201).json(tag);
  });
  app.patch("/api/tags/:id", (req, res) => {
    const tag = storage.updateTag(req.params.id, req.body);
    res.json(tag);
  });
  app.delete("/api/tags/:id", (req, res) => {
    storage.deleteTag(req.params.id);
    res.json({ success: true });
  });
  app.get("/api/tag-links", (req, res) => {
    res.json(storage.getTagLinks(req.query.entityType as string, req.query.entityId as string));
  });
  app.post("/api/tag-links", (req, res) => {
    const parsed = parseBody(insertTagLinkSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const tl = storage.createTagLink(parsed.data);
    res.status(201).json(tl);
  });
  app.delete("/api/tag-links/:id", (req, res) => {
    storage.deleteTagLink(req.params.id);
    res.json({ success: true });
  });

  // ─── Favorites ──────────────────────────────────────────────────────────────
  app.get("/api/favorites", (req, res) => {
    res.json(storage.getFavorites(MOCK_USER.id, req.query.workspaceId as string));
  });
  app.post("/api/favorites", (req, res) => {
    const parsed = parseBody(insertFavoriteSchema, { ...req.body, userId: MOCK_USER.id });
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const fav = storage.createFavorite(parsed.data);
    res.status(201).json(fav);
  });
  app.delete("/api/favorites/:id", (req, res) => {
    storage.deleteFavorite(req.params.id);
    res.json({ success: true });
  });
  app.delete("/api/favorites/entity/:entityType/:entityId", (req, res) => {
    storage.deleteFavoriteByEntity(MOCK_USER.id, req.params.entityType, req.params.entityId);
    res.json({ success: true });
  });

  // ─── Search ─────────────────────────────────────────────────────────────────
  app.get("/api/search", (req, res) => {
    const q = (req.query.q as string) || "";
    if (!q.trim()) return res.json([]);
    const results = storage.search(
      q,
      req.query.workspaceId as string,
      req.query.projectId as string,
      req.query.type as string,
      req.query.includeReferenceCases === "true"
    );
    res.json(results);
  });

  // ─── Activity ───────────────────────────────────────────────────────────────
  app.get("/api/activity", (req, res) => {
    res.json(storage.getActivityLog(
      req.query.workspaceId as string,
      req.query.projectId as string,
      req.query.entityType as string,
      req.query.entityId as string
    ));
  });

  // ─── Files ──────────────────────────────────────────────────────────────────
  app.get("/api/files", (req, res) => {
    res.json(storage.getFiles(req.query.workspaceId as string, req.query.projectId as string));
  });
  app.post("/api/files", (req, res) => {
    const parsed = parseBody(insertFileSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const file = storage.createFile({ ...parsed.data, createdBy: MOCK_USER.id });
    res.status(201).json(file);
  });
  app.get("/api/files/:id", (req, res) => {
    const file = storage.getFile(req.params.id);
    if (!file) return res.status(404).json({ error: "Not found" });
    res.json(file);
  });
  app.patch("/api/files/:id", (req, res) => {
    const file = storage.updateFile(req.params.id, req.body);
    res.json(file);
  });
  app.delete("/api/files/:id", (req, res) => {
    storage.deleteFile(req.params.id);
    res.json({ success: true });
  });

  // ─── Report Sections (outline) ──────────────────────────────────────────────
  // Catalog of canonical section templates (read-only seed data).
  app.get("/api/report-section-templates", (req, res) => {
    res.json(storage.getReportSectionTemplates());
  });

  // Per-project section content. Lazy-creates rows on upsert.
  app.get("/api/projects/:projectId/report-sections", (req, res) => {
    const proj = storage.getProject(req.params.projectId);
    if (!proj) return res.status(404).json({ error: "Project not found" });
    const sections = storage.getProjectReportSections(proj.id);
    res.json(sections.map(toReportSectionResponse));
  });

  app.get("/api/projects/:projectId/report-sections/:slug", (req, res) => {
    const proj = storage.getProject(req.params.projectId);
    if (!proj) return res.status(404).json({ error: "Project not found" });
    const tpl = storage.getReportSectionTemplate(req.params.slug);
    if (!tpl) return res.status(404).json({ error: "Section template not found" });
    const section = storage.getProjectReportSection(proj.id, req.params.slug);
    res.json(section ? toReportSectionResponse(section) : null);
  });

  app.put("/api/projects/:projectId/report-sections/:slug", (req, res) => {
    const proj = storage.getProject(req.params.projectId);
    if (!proj) return res.status(404).json({ error: "Project not found" });
    const tpl = storage.getReportSectionTemplate(req.params.slug);
    if (!tpl) return res.status(404).json({ error: "Section template not found" });
    const merged = fromReportSectionBody({
      ...req.body,
      workspaceId: proj.workspaceId,
      projectId: proj.id,
      templateSlug: tpl.slug,
    });
    const parsed = parseBody(insertProjectReportSectionSchema, merged);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const existing = storage.getProjectReportSection(proj.id, tpl.slug);
    const saved = storage.upsertProjectReportSection({
      ...parsed.data,
      createdBy: existing?.createdBy ?? MOCK_USER.id,
      updatedBy: MOCK_USER.id,
    });
    logActivity({
      workspaceId: proj.workspaceId,
      projectId: proj.id,
      action: existing ? "updated" : "created",
      entityType: "report_section",
      entityId: saved.id,
      metadata: { slug: tpl.slug },
    });
    res.status(existing ? 200 : 201).json(toReportSectionResponse(saved));
  });

  app.delete("/api/projects/:projectId/report-sections/:slug", (req, res) => {
    const proj = storage.getProject(req.params.projectId);
    if (!proj) return res.status(404).json({ error: "Project not found" });
    const ok = storage.deleteProjectReportSection(proj.id, req.params.slug);
    if (!ok) return res.status(404).json({ error: "Section content not found" });
    res.json({ success: true });
  });

  app.get("/api/projects/:projectId/report-progress", (req, res) => {
    const proj = storage.getProject(req.params.projectId);
    if (!proj) return res.status(404).json({ error: "Project not found" });
    res.json(storage.getProjectReportProgress(proj.id));
  });

  // ─── AI Tasks ───────────────────────────────────────────────────────────────
  app.get("/api/ai-tasks", (req, res) => {
    res.json(storage.getAiTasks(req.query.workspaceId as string, req.query.projectId as string));
  });
  app.post("/api/ai-tasks", (req, res) => {
    const parsed = parseBody(insertAiTaskSchema, req.body);
    if ("error" in parsed) return res.status(400).json({ error: parsed.error });
    const task = storage.createAiTask(parsed.data);
    res.status(201).json(task);
  });
  app.patch("/api/ai-tasks/:id", (req, res) => {
    const task = storage.updateAiTask(req.params.id, req.body);
    res.json(task);
  });

}

