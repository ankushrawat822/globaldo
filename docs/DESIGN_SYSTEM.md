# Design System

Feel: a calm, trustworthy public noticeboard — human, practical, a little warm. Not a generic SaaS template. Avoid cliché defaults: cream + terracotta, black + neon accent, identical rounded gradient cards, ALL-CAPS eyebrows above headings, 01/02/03 markers on non-sequences, "→" on every button.

## Concept
Tasks read like notes pinned to a board: compact rows with a clear left status marker, not heavy tiles. The one memorable element is the live feed as the home hero (no marketing wall).

## Tokens (CSS variables in globals.css, mapped in Tailwind)
- `--paper`  #F7F8F5  background
- `--ink`    #1D2A27  text
- `--pine`   #1F5C4D  primary / links
- `--sun`    #F2B63D  highlight (open marker, offers) — sparingly
- `--stone`  #DDE2DC  borders
- `--danger` #B3392F  errors
Derive dark mode; verify ≥4.5:1 contrast on every pair.

## Type
- Headings: Fraunces (600–700). Body/UI: Inter (400/500/600).
- Scale: 14 / 16 / 18 / 22 / 28 / 40. Body line-height 1.55, max ~70ch.
- Sentence case. No letter-spaced all-caps labels.

## Layout
- Mobile-first, container max 1100px, 8px grid, left-aligned text.
- Feed: one column on mobile; list + sticky filters ≥1024px.
- Radius: 6px inputs/buttons, 10px task rows, pill only for tags.
- No default shadows; 1px `--stone` borders. Elevation only for popovers/dialogs.

## Components (shadcn/ui base)
Button · Input/Textarea/Select · Tag · StatusBadge · TaskRow · TaskDetail · OfferCard · ContactReveal · EmptyState · Skeleton · Toast · Dialog · Pagination · FilterBar.
Status: open = sun marker · in_progress = pine · done = stone + check · closed/expired = muted.

## Motion
User-triggered only (press, dialog, toast, list update) plus one subtle feed reveal on load. Respect `prefers-reduced-motion`.

## Accessibility floor
Visible focus, labelled inputs, 44px targets, semantic HTML, alt text, keyboard-operable dialogs, color never the only signal.

## Voice
Plain, active, specific. Buttons say what happens: "Post task", "Send offer", "Confirm and share contacts"; the toast repeats the verb: "Task posted". Errors state what happened and how to fix it, no apologies. Empty states invite action: "No tasks match. Clear filters or post your own." Login gate: "Sign in to offer help. It takes about 10 seconds."

## Screens
Home feed · Task detail · Post task · My tasks (offers inbox) · My offers · Connection detail · Profile · Settings/contacts · Login · Admin reports · How it works.
