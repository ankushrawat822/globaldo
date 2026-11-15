# Architecture

## Principles
Light, serverless, few moving parts. Postgres is the source of truth; RLS is the security boundary.

## Folder structure
```
src/
  app/
    (public)/            # /, /tasks/[id], /u/[handle], /about, /terms ...
    (auth)/              # /login, /auth/callback, /onboarding
    (member)/            # /post, /my/tasks, /my/offers, /my/connections, /settings
    admin/               # reports queue (admin only)
    layout.tsx, globals.css, not-found.tsx, error.tsx
  components/ui/         # shadcn primitives
  components/            # shared: Header, Footer, EmptyState, Pagination
  features/
    tasks/ offers/ connections/ profile/ reports/   # components/, schema.ts, types.ts
  server/
    actions/             # Server Actions (mutations)
    queries/             # read functions
    auth.ts              # getUser(), requireUser(), requireAdmin()
  lib/
    supabase/            # server.ts, client.ts, middleware.ts
    validation/          # Zod schemas
    rate-limit.ts  detect-contact.ts  utils.ts
  types/database.ts      # generated
supabase/
  migrations/            # timestamped SQL, one concern per file
  seed.sql
tests/                   # unit (Vitest) + e2e (Playwright)
```

## Data flow
Read: Server Component → `server/queries/*` → Supabase (RLS applies).
Write: Form → Server Action → Zod validate → `requireUser()` → Supabase → `revalidatePath`.

## Auth
Supabase Auth via `@supabase/ssr`. Middleware refreshes session and protects `(member)` and `admin`. Public routes never require a session.

## Contact reveal design
Contacts live in `contact_methods` (RLS: owner only). On confirm, the chosen methods are copied to `connection_shares` (RLS: the two parties only). Nothing else reads contact data.

## Performance
Static/ISR for marketing pages; dynamic feed with cache tags. Paginate (20/page). Index filter columns. `next/image` for images.

## Environments
Local (`supabase start`) → Preview (Vercel + Supabase staging) → Production.

## Testing (keep small)
- Vitest: Zod schemas, contact detection, status transitions, rate limits.
- RLS tests: anonymous can't read contacts; non-parties can't read shares; can't offer on own task.
- Playwright smoke: visitor browse → login gate on offer → full connect flow with seeded users.
