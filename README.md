# Valuation Memory Bank v1.2

> A knowledge-management tool for business valuation analysts. Captures assumptions, methodology, sources, external model references, and institutional reasoning across engagements — not a calculator.

---

## Overview

Valuation Memory Bank is a structured knowledge repository for business valuation professionals. It is **not a DCF engine, WACC calculator, or any other computation tool**. All calculations happen outside the app (Excel, Google Sheets, firm models). This app stores the *reasoning, methodology, sources, and assumptions* that support those calculations.

**What it stores:**
- Engagement projects (metadata only — no formulas)
- Assumptions with evidence links and review status
- External model references (SharePoint/cloud links, not the models themselves)
- Methodology playbooks, frameworks, valuation principles, and anti-patterns
- Reasoning templates with AI placeholder drafting
- Reference cases (Dordt GSU 2025 as the seed example)
- Q&A banks, support memos, notes, lessons learned

**What it does NOT do:**
- DCF, WACC, DLOM, market approach, asset approach calculations
- Sensitivity analysis or scenario modeling
- Formula evaluation or financial modeling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui |
| Backend | Express.js + TypeScript |
| ORM | Drizzle ORM |
| Database | SQLite (local) / Cloudflare D1 (production) |
| Auth | Mock auth (MVP) — configurable |
| Testing | Vitest + supertest |

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/CalebSmit/valuation-memory-bank.git
cd valuation-memory-bank

# 2. Install dependencies
npm install

# 3. Copy environment config
cp .env.example .env

# 4. Seed the database (creates local.db with all seed content)
npx tsx scripts/seed.ts

# 5. Start the development server
npm run dev
# → App available at http://localhost:5000
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Express + Vite on port 5000) |
| `npm run build` | Build for production (frontend + server bundle) |
| `npm start` | Start production server from dist/ |
| `npm test` | Run all 37 API integration tests |
| `npm run check` | TypeScript type check (zero errors) |
| `npx tsx scripts/seed.ts` | Seed/re-seed the local SQLite database |

---

## Testing

```bash
# Run all tests (37 tests, all should pass)
npm test

# Run with verbose output
npx vitest run --reporter=verbose
```

Tests cover:
- Auth / mock user
- Workspace CRUD
- Project CRUD (blank project, no Dordt)
- Playbook seed, read-only enforcement, clone
- Frameworks, Principles, Anti-Patterns
- Reference Cases — Dordt isolation (caseId = `dordt_gsu_2025`)
- No calculator routes (9 forbidden routes return 404)
- Search
- Assumptions, External Model References, Support Memos
- Reasoning Templates + AI placeholder

---

## Database

The MVP uses SQLite via `better-sqlite3`. The database file is `local.db` in the project root.

```bash
# Wipe and re-seed from scratch
rm local.db && npx tsx scripts/seed.ts
```

**Seed content:**
- 13 methodology playbooks (global, read-only, clonable)
- 9 decision frameworks
- 10 valuation principles
- 13 anti-patterns
- 14 reasoning templates
- 10 Q&A prompts
- **1 reference case: Dordt GSU 2025** (`case_id = dordt_gsu_2025`)
- 8 reference case artifacts (all read-only, clonable)
- 15 tags (including `case_id:dordt_gsu_2025`)

---

## Dordt GSU 2025 Reference Case

Dordt University Graduate School of Business (2025) is seeded as the single reference case. It exists **only** in the `reference_cases` table with `case_id = dordt_gsu_2025`.

**Constraints enforced:**
- Dordt NEVER appears in `projects` — it is not a project, it is a reference case
- All Dordt artifacts carry `caseId = dordt_gsu_2025`
- All Dordt records are `isReadonly = true`, `isSeed = true`, `clonable = true`
- Users can clone any Dordt artifact into a workspace project
- The "New Project" form creates a blank project with no Dordt linkage

---

## API Reference

All endpoints are prefixed with `/api/`. No live AI is required in MVP.

### Authentication
```
GET /api/me            → Mock demo user (user_demo)
PATCH /api/me/profile  → Update profile
```

### Workspaces
```
GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:id
PATCH  /api/workspaces/:id
DELETE /api/workspaces/:id
```

### Projects (metadata-only, no formulas)
```
GET    /api/projects?workspaceId=
POST   /api/projects        ← { title, entityName, engagementType, reviewStatus, workspaceId }
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/dashboard
```

**Field mapping** (API ↔ DB):
| API field | DB column |
|-----------|-----------|
| `title` | `name` |
| `entityName` | `subject_company_label` |
| `engagementType` | `assignment_type` |
| `reviewStatus` | `status` |
| `description` | `notes` |

### Methodology
```
GET  /api/playbooks
POST /api/playbooks
POST /api/playbooks/:id/clone  ← { targetWorkspaceId, newTitle }
GET  /api/frameworks
GET  /api/principles
GET  /api/anti-patterns
GET  /api/reasoning-templates
POST /api/reasoning-templates/:id/draft-placeholder  ← AI placeholder
```

### Reference Cases
```
GET  /api/reference-cases
GET  /api/reference-cases/:caseId               ← dordt_gsu_2025
GET  /api/reference-cases/:caseId/artifacts
POST /api/reference-artifacts/:id/clone
```

### Knowledge Items
```
POST /api/assumptions              ← { title, body, assumptionType, workspaceId, projectId }
POST /api/sources
POST /api/external-model-references  ← { title, modelType, storageLocation, workspaceId, projectId }
POST /api/support-memos
POST /api/qa
POST /api/notes
POST /api/lessons
```

### Utility
```
GET /api/search?q=&workspaceId=&includeReferenceCases=true
GET /api/tags
GET /api/favorites
GET /api/activity
```

### Forbidden (404 — no calculator routes)
```
/api/dcf, /api/wacc, /api/income-calculator, /api/wacc-calculator,
/api/dlom-calculator, /api/sensitivity, /api/scenarios, /api/fcff, /api/formula
```

---

## Deployment

### Cloudflare Pages (GitHub Auto-Deploy from `main`)

1. **Push to GitHub** — ensure `main` branch is up to date
2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create Application
   - Connect GitHub → select `CalebSmit/valuation-memory-bank`
   - Build settings:
     - **Framework preset:** None
     - **Build command:** `npm run build`
     - **Build output directory:** `dist/public`
     - **Root directory:** `/` (project root)
3. **Environment variables** (in Cloudflare Pages settings):
   ```
   NODE_ENV=production
   AUTH_ENABLED=false
   AI_ENABLED=false
   ```
4. **D1 Database** (for persistent storage in production):
   ```bash
   # Create D1 database
   wrangler d1 create valuation-memory-bank
   # Note the database_id and update wrangler.toml
   # Run seed SQL against D1
   wrangler d1 execute valuation-memory-bank --file=./scripts/schema.sql
   ```
5. **Auto-deploy:** Every push to `main` triggers a new build and deployment automatically.

### Self-Hosted (VPS / Render / Railway)

```bash
# Build
npm run build

# Start production server
NODE_ENV=production node dist/index.cjs
# → Serves on port 5000
```

---

## Project Structure

```
valuation-memory-bank/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── components/        # Shared UI components
│       │   ├── Sidebar.tsx
│       │   ├── TopNav.tsx
│       │   ├── ReviewStatusBadge.tsx
│       │   ├── EmptyState.tsx
│       │   ├── CloneModal.tsx
│       │   ├── TagPills.tsx
│       │   ├── MarkdownViewer.tsx
│       │   └── ReadOnlyBanner.tsx
│       ├── pages/             # 20+ route pages
│       │   ├── Dashboard.tsx
│       │   ├── Projects.tsx
│       │   ├── ProjectDetail.tsx
│       │   ├── Playbooks.tsx
│       │   ├── PlaybookDetail.tsx
│       │   ├── Frameworks.tsx
│       │   ├── FrameworkDetail.tsx
│       │   ├── Principles.tsx
│       │   ├── Antipatterns.tsx
│       │   ├── Templates.tsx
│       │   ├── TemplateDetail.tsx
│       │   ├── ReferenceCases.tsx
│       │   ├── ReferenceCaseDetail.tsx
│       │   ├── Sources.tsx
│       │   ├── QA.tsx
│       │   ├── Notes.tsx
│       │   ├── Lessons.tsx
│       │   ├── Search.tsx
│       │   ├── Workspaces.tsx
│       │   └── Settings.tsx
│       └── lib/
│           ├── api.ts
│           ├── workspace-context.tsx
│           └── queryClient.ts
├── server/                    # Express backend
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # All API routes (with field mapping)
│   ├── storage.ts             # Drizzle storage interface
│   └── db.ts                  # SQLite connection
├── shared/
│   └── schema.ts              # Drizzle schema (563 lines)
├── scripts/
│   └── seed.ts                # Full seed (1739 lines)
├── tests/
│   └── api.test.ts            # 37 integration tests
├── docs/
│   └── valuation-memory-bank-prd-v1.2-final.md
├── dist/                      # Production build output
├── .env.example
├── wrangler.toml              # Cloudflare Pages config
└── README.md
```

---

## PRD

The full PRD is at [`docs/valuation-memory-bank-prd-v1.2-final.md`](./docs/valuation-memory-bank-prd-v1.2-final.md).

---

## License

Private — for internal firm use only.
