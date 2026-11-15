---
description: Plan and build a new feature end to end
argument-hint: <feature description>
---
Feature: $ARGUMENTS
1. Check it against PRD.md (in scope? a non-goal?). If out of scope, say so and stop.
2. List affected layers: DB/RLS, server action, query, UI, tests, copy.
3. Plan, then implement following CLAUDE.md and DESIGN_SYSTEM.md.
4. Add it to ROADMAP.md if missing; run lint, typecheck, tests; commit.
