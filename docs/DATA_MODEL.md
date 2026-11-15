# Data Model (Postgres / Supabase)

All tables: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, RLS ENABLED.

## profiles (1:1 with auth.users)
handle (unique citext, 3–20), display_name, avatar_url, bio (≤280), country (ISO-2), is_admin bool default false, is_suspended bool default false.
RLS: public SELECT (safe columns only); owner UPDATE; created by trigger on signup.

## contact_methods (PRIVATE)
user_id, type enum(email, phone, telegram, whatsapp, instagram, x, linkedin, url), value.
RLS: owner only.

## tasks
owner_id, title, description, category enum, tags text[], location_mode enum(remote, in_person), city, country, compensation_type enum(none, paid, swap), amount numeric null, currency null, deadline timestamptz null, helpers_needed int default 1 (1–5), status enum(open, in_progress, done, closed, expired, hidden), updated_at.
RLS: public SELECT where status <> 'hidden'; owner INSERT/UPDATE/DELETE own; admin may hide.
Indexes: (status, created_at desc), category, country, GIN(tags), full-text on title+description.

## offers
task_id, helper_id, message (≤500), proposed_amount null, status enum(pending, accepted, declined, withdrawn, connected).
Unique: one active offer per (task_id, helper_id). Trigger blocks helper = task owner.
RLS: SELECT/UPDATE only helper or task owner. INSERT by authenticated, non-owner, non-blocked, non-suspended.
Transitions: pending→accepted|declined|withdrawn; accepted→connected|withdrawn. Enforce in a DB function.

## connections
offer_id (unique), task_id, owner_id, helper_id. RLS: SELECT only the two parties.

## connection_shares
connection_id, user_id (sharer), type, value (snapshot of chosen contact).
RLS: SELECT only connection parties; INSERT only by sharer at confirm time.

## blocks
blocker_id, blocked_id. RLS: blocker only.

## reports
reporter_id, target_type enum(task, user, offer), target_id, reason enum, details, status enum(open, reviewed, actioned).
RLS: INSERT any authenticated; SELECT/UPDATE admin only.

## DB functions (security definer, fixed search_path)
- `handle_new_user()` trigger → create profile.
- `accept_offer(offer_id)`, `confirm_offer(offer_id, contact_method_ids[])` → atomically create connection + shares + update task status.
- `expire_tasks()` via pg_cron, or check on read.

## Seed data
~5 users, ~30 tasks across categories/countries, offers in each status, one completed connection.

## Categories
Writing & translation · Design & creative · Tech & coding · Tutoring & learning · Errands & local help · Home & repair · Admin & research · Health & wellness (non-medical) · Events & community · Other
