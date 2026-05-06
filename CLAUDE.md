# Claude Code — Valuation Memory Bank

## Repository
- **GitHub:** https://github.com/CalebSmit/valuation-memory-bank
- **Primary branch:** `main`
- **Local clone path:** `c:/Users/Caleb/OneDrive - Dordt University/Desktop/Chartwell Valuation Memory Book`
- **Live deploy:** Cloudflare Pages — auto-deploys from `main` on every push
- **Self-update:** This file should be revised whenever the repository's tech stack, scripts, structure, deploy targets, or constraints meaningfully change. Re-read `README.md`, `package.json`, `wrangler.toml`, and `docs/` if anything in those files looks newer than what is documented here, and update this CLAUDE.md in the same commit as the change.

---

## GitHub Sync Protocol — MANDATORY for every code-change request

Always treat `main` as the source of truth. Local files and the working directory may be stale; do **NOT** assume they match the remote.

### Before making any code change

1. **Pull latest from GitHub:**
   ```bash
   git fetch origin main
   git pull --ff-only origin main
   ```
   Or, if the local clone is missing:
   ```bash
   git clone https://github.com/CalebSmit/valuation-memory-bank.git
   cd valuation-memory-bank
   ```

2. **Verify clean working tree:**
   ```bash
   git status
   ```
   If there are uncommitted changes or untracked files, surface them to the user before overwriting.

3. **Read latest source from disk after the pull.** Never edit based on in-context memory of what files used to look like.

### After making code changes

1. **Run the verification suite locally** (see Build & Test Workflow below). Do not push red builds.
2. **Stage only intended files:**
   ```bash
   git add <specific paths>
   ```
   Never use `git add -A` or `git add .` — be explicit. The repo contains `local.db`, `.env`, and other artifacts that must not be committed.
3. **Commit with a conventional-commits message:**
   ```bash
   git commit -m "type: description"
   ```
   Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`
4. **Push to remote:**
   ```bash
   git push origin main
   ```
5. **Verify changes are live:**
   - Confirm the push succeeded (no error messages).
   - For user-facing changes, confirm the new Cloudflare Pages build succeeded and the deployed app reflects the change.

This applies to **every** code-change request, even small ones. Do not skip the pull; do not skip the push. If skipped, the next session will inherit stale state.

---

## Project Overview

**Valuation Memory Bank** is a knowledge-management tool for business valuation analysts. It captures assumptions, methodology, sources, external model references, and institutional reasoning across engagements.

> **It is NOT a calculator.** No DCF, WACC, DLOM, market-approach, asset-approach, sensitivity, or scenario logic lives in this repo. All numerical work happens in Excel / Google Sheets / firm models. This app stores the *reasoning* that supports those calculations.

There are 9 forbidden API routes (`/api/dcf`, `/api/wacc`, `/api/income-calculator`, `/api/wacc-calculator`, `/api/dlom-calculator`, `/api/sensitivity`, `/api/scenarios`, `/api/fcff`, `/api/formula`) that must always return 404. A test asserts this — do not "helpfully" add a calculator endpoint.

---

## Tech Stack

| Layer    | Technology                                                |
|----------|-----------------------------------------------------------|
| Frontend | React 18 + TypeScript + Vite + wouter (router)            |
| UI       | Tailwind CSS + shadcn/ui (Radix primitives) + lucide-react |
| Backend  | Express 5 + TypeScript (tsx in dev, esbuild bundle in prod) |
| ORM      | Drizzle ORM + drizzle-zod                                  |
| Database | SQLite via `better-sqlite3` (local) / Cloudflare D1 (prod) |
| Auth     | Mock auth in MVP (Passport scaffolding present, not wired) |
| Testing  | Vitest + supertest                                         |
| Deploy   | Cloudflare Pages (auto from `main`); Render fallback (`render.yaml`) |

Node `>=20.0.0`, npm `>=9.0.0` (see `engines` in `package.json`).

---

## Project Structure

```
valuation-memory-bank/
├── client/src/              # React frontend (Vite)
│   ├── components/          # Shared UI (Sidebar, TopNav, CloneModal, ReportOutline/, ...)
│   ├── pages/               # 20+ route pages (Dashboard, Projects, Playbooks, ...)
│   └── lib/                 # api.ts, workspace-context.tsx, queryClient.ts
├── server/                  # Express backend
│   ├── index.ts             # Server entry
│   ├── routes.ts            # All API routes (with API ↔ DB field mapping)
│   ├── storage.ts           # Drizzle storage interface
│   └── db.ts                # SQLite connection
├── shared/
│   ├── schema.ts            # Drizzle schema — single source of truth
│   └── report-section-template-data.ts  # Canonical valuation report outline (~117 sections)
├── scripts/
│   └── seed.ts              # Full seed
├── script/
│   └── build.ts             # Production build orchestrator (called by `npm run build`)
├── tests/
│   └── api.test.ts          # 37 integration tests (supertest)
├── docs/
│   └── valuation-memory-bank-prd-v1.2-final.md   # PRD — read before scope decisions
├── dist/                    # Build output (gitignored in spirit; check .gitignore)
├── .env.example             # Copy to .env for local dev
├── drizzle.config.ts
├── wrangler.toml            # Cloudflare Pages config
├── render.yaml              # Render deploy fallback
├── vite.config.ts / vitest.config.ts / tailwind.config.ts / tsconfig.json
└── package.json
```

---

## Build & Test Workflow

Run from the project root.

| Command                    | Purpose                                                       |
|----------------------------|---------------------------------------------------------------|
| `npm install`              | Install dependencies                                          |
| `npx tsx scripts/seed.ts`  | Seed/re-seed `local.db` (run once after clone, or to reset)   |
| `npm run dev`              | Dev server (Express + Vite) on http://localhost:5000          |
| `npm run check`            | TypeScript type check — must be 0 errors                      |
| `npm test`                 | Run all 37 Vitest + supertest API integration tests           |
| `npm run build`            | Production build (frontend via Vite + server bundle via esbuild) |
| `npm start`                | Run the production bundle from `dist/`                        |
| `npm run db:push`          | Apply Drizzle schema changes                                  |
| `npm run rebuild:sqlite`   | Rebuild `better-sqlite3` against current Node (after Node upgrades) |

### Required pre-push verification (in order)
1. `npm run check` — zero TypeScript errors
2. `npm test` — all 37 tests passing
3. `npm run build` — production build succeeds

If any step fails, fix the root cause before pushing. Do not bypass with `--no-verify`.

### Reset the local database
```bash
rm local.db && npx tsx scripts/seed.ts
```

---

## Key Constraints & Guidelines

### Domain rules (do not violate)
- **No calculator code, ever.** No DCF/WACC/DLOM/sensitivity/scenario/FCFF/formula endpoints, helpers, or UI. The 9 forbidden routes must keep returning 404 — `tests/api.test.ts` enforces this.
- **Dordt GSU 2025 is a *reference case*, not a project.** It lives only in the `reference_cases` table with `case_id = dordt_gsu_2025`. It must never appear in `projects`. All Dordt artifacts are `isReadonly = true`, `isSeed = true`, `clonable = true`. The "New Project" form creates a blank project with no Dordt linkage.
- **Reference cases are read-only and clonable.** Users clone Dordt artifacts into their own workspace projects; the originals are never mutated.

### API contract
- All endpoints under `/api/`.
- Project field mapping (API ↔ DB) — preserve exactly:
  | API field         | DB column                  |
  |-------------------|----------------------------|
  | `title`           | `name`                     |
  | `entityName`      | `subject_company_label`    |
  | `engagementType`  | `assignment_type`          |
  | `reviewStatus`    | `status`                   |
  | `description`     | `notes`                    |
- Schema lives in `shared/schema.ts` — change it there, then update `server/routes.ts`, `server/storage.ts`, the seed script, and tests in the same commit. Run `npm run db:push` if you change the schema.

### Report Outline feature
Each project has a structured outline of ~117 standard valuation report sections (3-level hierarchy: Part → Section → Subsection). Sections are containers for narrative + linked entities (sources, assumptions, external models, support memos, files) and ad-hoc external links — **never numerical calculations**.

- **Canonical list:** `shared/report-section-template-data.ts`. Slugs are stable IDs; renaming breaks `project_report_sections.template_slug` foreign references. To add a section, append a new entry with a fresh slug; to remove, leave the slug in place and remove from the seed list (orphan content rows persist).
- **Tables:** `report_section_templates` (read-only seeded catalog) and `project_report_sections` (per-project content, lazily created on first edit).
- **Routes:**
  - `GET /api/report-section-templates`
  - `GET /api/projects/:projectId/report-sections`
  - `GET /api/projects/:projectId/report-sections/:slug`
  - `PUT /api/projects/:projectId/report-sections/:slug` (upsert)
  - `DELETE /api/projects/:projectId/report-sections/:slug`
  - `GET /api/projects/:projectId/report-progress`
- **UI:** `client/src/components/ReportOutline/` (orchestrator + tree + section cards + linked-items picker). Mounted as the first tab on `ProjectDetail`.

### Coding conventions
- TypeScript everywhere; prefer Drizzle + zod for validation at the boundary.
- Immutability by default — don't mutate inputs; return new objects.
- Small, focused files (200–400 lines typical, 800 max).
- Validate user input at API boundaries with zod schemas (`drizzle-zod` for DB-derived shapes).
- Never hardcode secrets. `.env` is gitignored; `.env.example` is the source of truth for required vars.

### Files that must never be committed
`local.db`, `.env`, anything under `dist/` that isn't intentionally tracked, editor/OS junk. Always `git status` and stage by path.

---

## Deployment Notes

- **Cloudflare Pages** auto-builds and deploys on every push to `main` (build command `npm run build`, output `dist/public`). After pushing user-facing changes, verify the new build appears in the Cloudflare dashboard and the live app reflects the change.
- **Cloudflare D1** is the production database. Schema changes require running the schema SQL against D1 via `wrangler d1 execute`.
- **Render** (`render.yaml`) is configured as a fallback host.
- Required production env vars: `NODE_ENV=production`, `AUTH_ENABLED=false`, `AI_ENABLED=false` (MVP — no live AI).

---

## Common Mistakes — Do Not Do These

- **Skipping `git pull` before editing:** edits land on stale source; merge conflicts on push.
- **Forgetting to `git push` after changes:** local edits diverge from GitHub; users see stale version on Cloudflare.
- **Using `git add -A` or `git add .`:** accidentally commits `local.db`, `.env`, or unrelated files.
- **Skipping `npm run check` / `npm test` / `npm run build` before pushing:** broken code triggers a failed Cloudflare deploy.
- **Editing based on memory of old code:** changes target the wrong lines or miss new code. Always re-read after pull.
- **Adding a "small" calculator helper:** violates the core product constraint; will fail the forbidden-routes test.
- **Treating Dordt as a project or mutating its seeded artifacts:** breaks reference-case isolation and the seed contract.
- **Changing the API ↔ DB field mapping without updating routes, storage, seed, and tests together:** silent data corruption.
