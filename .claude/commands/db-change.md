---
description: Make a safe database change
argument-hint: <what to change>
---
Change: $ARGUMENTS
1. Create a new timestamped migration in supabase/migrations (never edit old ones).
2. Add/adjust RLS policies and indexes. Update docs/DATA_MODEL.md.
3. Run `npx supabase db reset`, then regenerate types into src/types/database.ts.
4. Add/update RLS tests proving anonymous and non-party users cannot read private data.
5. Fix type errors. Summarize policy changes.
