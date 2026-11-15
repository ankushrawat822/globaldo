# Roadmap — tick `[x]` when done. Always work on the first unchecked item.

## M0 — Foundation
- [x] Init Next.js 15...TS strict + Tailwind + shadcn/ui + ESLint + Prettier + Vitest
- [x] Scripts: dev...int, typecheck, test, build
- [x] Supabase local setup...nv handling, lib/supabase/*, middleware
- [x] Design tokens...onts, base layout (Header/Footer)

## M1 — Auth & profiles
- [x] Migration: profiles + trigger; RLS + tests
- [x] Login (magic link + Google), callback, onboarding
- [x] Settings: edit profile, delete account
- [x] Public profile `/u/[handle]`

## M2 — Tasks (public read)
- [x] Migration: tasks + indexes + RLS; seed data
- [x] Home feed: search, filters, sort, pagination, skeletons, empty state
- [x] Task detail page + OG tags
- [x] Post / edit / close / reopen / delete task (validation, rate limit, contact detection)
- [x] My tasks page

## M3 — Offers & mutual connection
- [x] Migration: offers, connections, connection_shares, contact_methods + RLS + DB functions
- [x] Contact methods UI
- [x] Login gate on "Offer help"; send offer
- [x] Owner inbox: accept / decline
- [x] Helper "My offers": confirm (choose contacts) / withdraw
- [x] Connection detail with revealed contacts
- [x] Task status updates + expiry
- [ ] RLS leak tests + Playwright happy path

## M4 — Trust & safety
- [x] Report flow, block user
- [x] Admin queue: hide task, suspend user
- [x] Terms, Privacy, Community guidelines, How it works

## M5 — Polish & launch
- [x] SEO: sitemap, robots, metadata
- [ ] Accessibility + Lighthouse pass
- [x] Security headers, npm audit
- [ ] Deploy to Vercel + Supabase prod

## Backlog (v2): see PRD §6
