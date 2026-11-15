-- Create blocks table
create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references auth.users on delete cascade not null,
  blocked_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

-- Enable RLS
alter table blocks enable row level security;

-- Blocker can manage their own blocks
create policy "Users can manage own blocks"
  on blocks for all
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);

-- Create reports table
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users on delete cascade not null,
  target_type text not null check (target_type in ('task', 'user', 'offer')),
  target_id uuid not null,
  reason text not null check (reason in ('spam', 'harassment', 'illegal', 'adult', 'scam', 'other')),
  details text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'actioned')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table reports enable row level security;

-- Anyone authenticated can insert
create policy "Authenticated can report"
  on reports for insert
  with check (auth.uid() = reporter_id);

-- Admins can select/update
create policy "Admins can view reports"
  on reports for select
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update reports"
  on reports for update
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Indexes
create index idx_blocks_blocker_id on blocks (blocker_id);
create index idx_blocks_blocked_id on blocks (blocked_id);
create index idx_reports_reporter_id on reports (reporter_id);
create index idx_reports_target on reports (target_type, target_id);
create index idx_reports_status on reports (status);