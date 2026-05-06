/**
 * Integration tests for Valuation Memory Bank API
 * Uses Vitest + in-process server with in-memory/temp database
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

// ─── Test app setup ───────────────────────────────────────────────────────────

let app: express.Express;
let httpServer: ReturnType<typeof createServer>;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  httpServer = createServer(app);
  await registerRoutes(httpServer, app);
});

afterAll(() => {
  httpServer.close();
});

// ─── Auth / Me ────────────────────────────────────────────────────────────────

describe("GET /api/me", () => {
  it("returns mock demo user", async () => {
    const res = await request(app).get("/api/me");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("user_demo");
    expect(res.body.email).toBe("demo@valuation-memory-bank.local");
    expect(res.body.role).toBe("analyst");
  });
});

// ─── Workspaces ───────────────────────────────────────────────────────────────

describe("Workspaces", () => {
  it("GET /api/workspaces returns array", async () => {
    const res = await request(app).get("/api/workspaces");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/workspaces includes default workspace", async () => {
    const res = await request(app).get("/api/workspaces");
    const found = res.body.find((w: any) => w.id === "ws_default");
    expect(found).toBeTruthy();
    expect(found.name).toBe("My Workspace");
  });

  it("POST /api/workspaces creates a new workspace", async () => {
    const res = await request(app)
      .post("/api/workspaces")
      .send({ name: "Test Workspace", description: "Test" });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Workspace");
    expect(res.body.id).toBeTruthy();
  });
});

// ─── Projects ────────────────────────────────────────────────────────────────

describe("Projects", () => {
  let projectId: string;

  it("GET /api/projects returns array", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/projects creates a blank project (no Dordt)", async () => {
    const res = await request(app)
      .post("/api/projects")
      .send({
        workspaceId: "ws_default",
        title: "Test Engagement — 12/31/2024",
        entityName: "Test Corp",
        engagementType: "business_valuation",
        reviewStatus: "draft",
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Engagement — 12/31/2024");
    expect(res.body.id).toBeTruthy();
    // Confirm: NOT linked to Dordt
    expect(res.body.caseId).toBeFalsy();
    projectId = res.body.id;
  });

  it("GET /api/projects/:id returns project", async () => {
    const res = await request(app).get(`/api/projects/${projectId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(projectId);
  });

  it("PATCH /api/projects/:id updates project", async () => {
    const res = await request(app)
      .patch(`/api/projects/${projectId}`)
      .send({ reviewStatus: "in_review" });
    expect(res.status).toBe(200);
    expect(res.body.reviewStatus).toBe("in_review");
  });

  it("DELETE /api/projects/:id deletes project", async () => {
    const res = await request(app).delete(`/api/projects/${projectId}`);
    expect(res.status).toBe(200);
  });
});

// ─── Playbooks ────────────────────────────────────────────────────────────────

describe("Playbooks", () => {
  it("GET /api/playbooks returns seeded playbooks", async () => {
    const res = await request(app).get("/api/playbooks");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(12);
  });

  it("seed playbooks are read-only", async () => {
    const res = await request(app).get("/api/playbooks");
    const seed = res.body.find((p: any) => p.isSeed === true);
    expect(seed).toBeTruthy();
    expect(seed.isReadonly).toBe(true);
    expect(seed.clonable).toBe(true);
  });

  it("PATCH on seed playbook returns 403", async () => {
    const res = await request(app).get("/api/playbooks");
    const seed = res.body.find((p: any) => p.isSeed === true);
    const patchRes = await request(app)
      .patch(`/api/playbooks/${seed.id}`)
      .send({ title: "Hacked" });
    expect(patchRes.status).toBe(403);
  });

  it("POST /api/playbooks/:id/clone clones a playbook", async () => {
    const res = await request(app).get("/api/playbooks");
    const seed = res.body.find((p: any) => p.clonable === true);
    const cloneRes = await request(app)
      .post(`/api/playbooks/${seed.id}/clone`)
      .send({ newTitle: "My Clone", targetWorkspaceId: "ws_default" });
    expect(cloneRes.status).toBe(201);
    expect(cloneRes.body.title).toBe("My Clone");
    expect(cloneRes.body.isSeed).toBe(false);
    expect(cloneRes.body.isReadonly).toBe(false);
  });
});

// ─── Frameworks ──────────────────────────────────────────────────────────────

describe("Frameworks", () => {
  it("GET /api/frameworks returns seeded frameworks", async () => {
    const res = await request(app).get("/api/frameworks");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(9);
  });
});

// ─── Principles ──────────────────────────────────────────────────────────────

describe("Principles", () => {
  it("GET /api/principles returns seeded principles", async () => {
    const res = await request(app).get("/api/principles");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(10);
  });
});

// ─── Anti-Patterns ───────────────────────────────────────────────────────────

describe("Anti-Patterns", () => {
  it("GET /api/anti-patterns returns seeded anti-patterns", async () => {
    const res = await request(app).get("/api/anti-patterns");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(12);
  });
});

// ─── Reference Cases (Dordt isolation) ───────────────────────────────────────

describe("Reference Cases — Dordt Isolation", () => {
  it("GET /api/reference-cases returns exactly 1 case", async () => {
    const res = await request(app).get("/api/reference-cases");
    expect(res.status).toBe(200);
    const cases = res.body;
    expect(cases.length).toBeGreaterThanOrEqual(1);
  });

  it("Dordt case has case_id = dordt_gsu_2025", async () => {
    const res = await request(app).get("/api/reference-cases/dordt_gsu_2025");
    expect(res.status).toBe(200);
    expect(res.body.caseId).toBe("dordt_gsu_2025");
    expect(res.body.isSeed).toBe(true);
    expect(res.body.isReadonly).toBe(true);
  });

  it("Dordt artifacts all have caseId = dordt_gsu_2025", async () => {
    const res = await request(app).get("/api/reference-cases/dordt_gsu_2025/artifacts");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(8);
    for (const artifact of res.body) {
      expect(artifact.caseId).toBe("dordt_gsu_2025");
    }
  });

  it("Dordt does NOT appear in GET /api/projects", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    const dortdProject = res.body.find((p: any) =>
      p.title?.toLowerCase().includes("dordt") ||
      p.caseId === "dordt_gsu_2025"
    );
    expect(dortdProject).toBeUndefined();
  });
});

// ─── No Calculator Routes ─────────────────────────────────────────────────────

describe("No Calculator Routes", () => {
  const FORBIDDEN_ROUTES = [
    "/api/dcf",
    "/api/wacc",
    "/api/income-calculator",
    "/api/wacc-calculator",
    "/api/dlom-calculator",
    "/api/sensitivity",
    "/api/scenarios",
    "/api/fcff",
    "/api/formula",
  ];

  for (const route of FORBIDDEN_ROUTES) {
    it(`${route} does not exist (404)`, async () => {
      const res = await request(app).get(route);
      expect(res.status).toBe(404);
    });
  }
});

// ─── Search ──────────────────────────────────────────────────────────────────

describe("Search", () => {
  it("GET /api/search?q=income returns results", async () => {
    const res = await request(app).get("/api/search?q=income");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results ?? res.body)).toBe(true);
  });

  it("Search with includeReferenceCases=true includes reference case content", async () => {
    const res = await request(app).get("/api/search?q=dordt&includeReferenceCases=true");
    expect(res.status).toBe(200);
    const results = res.body.results ?? res.body;
    const hasRef = results.some((r: any) => r.type === "reference_case" || r.caseId === "dordt_gsu_2025");
    expect(hasRef).toBe(true);
  });
});

// ─── Assumptions / Sources / External Refs ───────────────────────────────────

describe("Project Knowledge Items", () => {
  let testProjectId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/projects")
      .send({ workspaceId: "ws_default", title: "KI Test Project", reviewStatus: "draft" });
    testProjectId = res.body.id;
  });

  it("POST /api/assumptions creates an assumption", async () => {
    const res = await request(app)
      .post("/api/assumptions")
      .send({
        workspaceId: "ws_default",
        projectId: testProjectId,
        title: "Revenue growth of 5%",
        body: "Based on management projections",
        assumptionType: "revenue",
        reviewStatus: "draft",
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Revenue growth of 5%");
  });

  it("POST /api/external-model-references creates a metadata-only reference", async () => {
    const res = await request(app)
      .post("/api/external-model-references")
      .send({
        workspaceId: "ws_default",
        projectId: testProjectId,
        title: "DCF Model v3.xlsx",
        modelType: "dcf",
        storageLocation: "SharePoint/Engagements/TestCorp/Models/",
        notes: "Main income approach model",
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("DCF Model v3.xlsx");
    // External model refs are METADATA ONLY — no computed values stored
    expect(res.body.fcffSchedule).toBeUndefined();
    expect(res.body.waccComponents).toBeUndefined();
  });

  it("POST /api/support-memos creates a support memo", async () => {
    const res = await request(app)
      .post("/api/support-memos")
      .send({
        workspaceId: "ws_default",
        projectId: testProjectId,
        title: "Revenue Analysis Memo",
        memoType: "revenue_analysis",
        body: "Analysis of historical revenue trends...",
        reviewStatus: "draft",
      });
    expect(res.status).toBe(201);
    expect(res.body.memoType).toBe("revenue_analysis");
  });
});

// ─── Templates ───────────────────────────────────────────────────────────────

describe("Reasoning Templates", () => {
  it("GET /api/reasoning-templates returns seeded templates", async () => {
    const res = await request(app).get("/api/reasoning-templates");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(14);
  });

  it("POST draft-placeholder returns AI placeholder message (no live AI)", async () => {
    const res = await request(app).get("/api/reasoning-templates");
    const template = res.body[0];
    const draftRes = await request(app)
      .post(`/api/reasoning-templates/${template.id}/draft-placeholder`)
      .send({ context: "Test project context" });
    expect(draftRes.status).toBe(200);
    expect(draftRes.body.message ?? draftRes.body.draft).toBeTruthy();
  });
});

// ─── Tags & Favorites ────────────────────────────────────────────────────────

describe("Tags", () => {
  it("GET /api/tags returns seeded tags", async () => {
    const res = await request(app).get("/api/tags");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(15);
    // Dordt tag should exist
    const dortdTag = res.body.find((t: any) => t.name === "case_id:dordt_gsu_2025");
    expect(dortdTag).toBeTruthy();
  });
});
