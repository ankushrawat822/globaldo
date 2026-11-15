# Product Requirements — GlobalDo

## 1. Vision
A global, public board of to-dos. People post what they need done; others who can do it offer to help. If both sides agree, they connect.

## 2. Users
- **Visitor** (no account): browse, search, filter, view task details and public profiles.
- **Member** (account): everything above + post tasks, make offers, manage their tasks/offers, connect.
- **Admin** (flag on profile): review reports, hide tasks, suspend users.

## 3. Core flow
1. Owner posts a Task (public).
2. Helper (logged in) sends an Offer with a short message.
3. Owner sees offers, **accepts** or declines one (default: one helper per task; up to 5 if configured).
4. Helper gets "accepted" status and must **confirm**. Either side may withdraw before confirming.
5. On confirm → Connection created. Each side's chosen contact method(s) are revealed to the other.
6. Owner marks task done (or it expires/closes). Both can see history in "My connections".

Mutual consent rule: contacts are revealed only when owner accepted AND helper confirmed. Each user chooses WHICH contact method(s) to share per connection.

## 4. Features (MVP — keep light)
### Public (no login)
- Home: live task feed as the hero, search, filters, sort.
- Filters: category, status (open default), remote/in-person, country, compensation (free/paid/swap), deadline.
- Sort: newest, deadline soonest.
- Task detail page (shareable URL, OpenGraph tags).
- Public profile: display name, avatar, bio, country, tasks posted, completed count. NO contact info.
- Pages: About / How it works, Terms, Privacy, Community guidelines.
- Login prompt appears only when a visitor tries to make an offer or post.

### Auth
- Supabase Auth: email magic link + Google OAuth. No passwords.
- Onboarding: unique handle, display name, country, optional bio/avatar.
- Settings: edit profile, manage contact methods, delete account (hard-deletes personal data).

### Tasks
- Create / edit / close / reopen / delete (own tasks).
- Fields: title (≤120), description (≤2000, markdown-lite), category, tags (≤5), location mode (remote | in-person + city/country), compensation (none | paid + amount + currency | swap), deadline (optional), helpers needed (1–5).
- Status: open → in_progress (when ≥1 connection) → done | closed | expired (auto at deadline).
- Rate limit: max 5 new tasks/day per user.

### Offers & connections
- Make offer: message (≤500), optional proposed price. One active offer per user per task. Cannot offer on own task.
- Owner inbox per task: list offers, view helper's public profile, accept/decline.
- Helper "My offers": pending | accepted | declined | withdrawn | connected.
- Confirm & choose contacts to share → Connection.
- Connection page: counterpart's shared contacts + task summary. Visible only to the two parties.
- Contact methods (private): email, phone, Telegram, WhatsApp, Instagram, X, LinkedIn, other URL.

### Trust & safety (minimum viable)
- Report task/user/offer with reason → admin queue.
- Block user (blocked users can't offer on your tasks).
- Soft-detect emails/phones/links in public text (titles/descriptions) and reject with a helpful message.
- Admin page: list reports, hide task, suspend user.
- Community guidelines list prohibited content (illegal, adult, harassment, spam, scams).

## 5. Non-goals (v1)
Payments/escrow, in-app chat, ratings/reviews, email/push notifications, mobile apps, multi-language UI, AI matching, teams/orgs.

## 6. Nice-to-have (v2 backlog)
Email notifications, ratings after completion, saved searches, bookmarks, i18n, image attachments, verified badges.

## 7. Success criteria
- A visitor sees live tasks in <5s, no login.
- Full flow (post → offer → accept → confirm → contacts visible) works end to end.
- No contact data leaks from any public endpoint (verified by tests).
- Lighthouse ≥ 90 performance/accessibility on home and task pages.
- Runs on free tiers (Vercel + Supabase).

## 8. Open questions (ask the owner before building the related feature)
- Project name & domain? Admin emails?
- Multiple helpers per task in MVP, or single only?
- Moderate before publish, or publish then moderate?
