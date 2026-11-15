# GlobalDo — Project Memory

A public, global to-do board. Anyone can browse tasks without an account. Logged-in users can post tasks and offer to help on others' tasks. Contact details are shared ONLY after both sides mutually consent.

Read before any non-trivial work: @docs/PRD.md · @docs/ARCHITECTURE.md · @docs/DATA_MODEL.md · @docs/DESIGN_SYSTEM.md · @docs/SECURITY.md
Current work queue: @docs/ROADMAP.md (always pick the next unchecked item; tick it when done)

## Stack (do not add dependencies without asking)
Next.js 15 (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui · Supabase (Postgres + Auth + RLS) · Zod · Vitest · Playwright (smoke only) · Deploy: Vercel

## Commands
- `npm run dev` — dev server
- `npm run lint` / `npm run typecheck` / `npm test` — must all pass before finishing any task
- `npm run build` — run before declaring a milestone done
- `npx supabase db reset` — re-apply migrations + seed locally
- `npx supabase gen types typescript --local > src/types/database.ts` — after every schema change

## Vocabulary (use exactly these terms in code, DB, and UI)
- **Task** — a to-do someone posts. **Owner** — the poster.
- **Offer** — a helper's request to do a task. **Helper** — the person offering.
- **Connection** — created when owner accepts AND helper confirms. Only then are contacts revealed.
Never use "bid" in code or UI.

## Architecture rules
- Server Components by default; `"use client"` only for interactivity.
- Mutations = Server Actions in `src/server/actions/*`, validated with Zod schemas from `src/lib/validation/*`.
- Reads = functions in `src/server/queries/*`. No DB calls inside components.
- Authorization is enforced by Supabase RLS first, server-side checks second. Never trust the client.
- Contact info lives in `contact_methods` and must NEVER be selectable by anyone except its owner and, via the `connections` flow, the connected counterpart.
- Public pages must work with no session. Auth required only for: post task, make offer, manage offers, profile, connections.

## Code style
- Small files (<200 lines), named exports, feature folders: `src/features/{tasks,offers,connections,profile}`.
- No `any`. No unused code. No commented-out code. No TODO without a ROADMAP entry.
- Every form: Zod validation, loading state, error state, success toast.
- Every list: empty state + loading skeleton + pagination (cursor or page).
- Copy: sentence case, plain verbs, errors say what happened and how to fix it. See DESIGN_SYSTEM.md.

## Workflow (follow every time)
1. Plan first for anything touching >2 files: state the plan in ≤8 bullets, then wait/proceed.
2. Implement the smallest vertical slice (DB → action → UI → test).
3. Run lint + typecheck + test. Fix before reporting.
4. Update ROADMAP.md checkbox. Commit with a conventional message (`feat:`, `fix:`, `chore:`).
5. If a requirement is ambiguous, ask ONE concise question instead of guessing.

## Do NOT
- Build payments, chat, escrow, ratings, notifications beyond email-free in-app status (see PRD "Non-goals").
- Store secrets in code. Use `.env.local`; keep `.env.example` current.
- Expose emails/phones/handles in any public query, page, or API response.
- Disable RLS, skip validation, or weaken a security rule to "make it work".
- Add heavy libraries (state managers, ORMs, UI kits besides shadcn). Keep it light.

## Slash commands & agents available
`/next-task` `/new-feature` `/db-change` `/review` · agents: `security-reviewer`, `ui-reviewer`
