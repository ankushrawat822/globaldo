-- Create tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users on delete cascade not null,
  title text not null check (length(title) <= 120),
  description text not null check (length(description) <= 2000),
  category text not null,
  tags text[] default '{}',
  location_mode text not null check (location_mode in ('remote', 'in_person')),
  city text,
  country char(2) references countries(iso2) on delete set null default 'US',
  compensation_type text not null check (compensation_type in ('none', 'paid', 'swap')),
  amount numeric(12, 2),
  currency text default 'USD',
  deadline timestamptz,
  helpers_needed int default 1 check (helpers_needed >= 1 and helpers_needed <= 5),
  status text not null default 'open' check (status in ('open', 'in_progress', 'done', 'closed', 'expired', 'hidden')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table tasks enable row level security;

-- RLS Policies
-- Public can view non-hidden tasks
create policy "Public can view non-hidden tasks"
  on tasks for select
  using (status <> 'hidden');

-- Owners can insert their own tasks
create policy "Users can insert own tasks"
  on tasks for insert
  with check (auth.uid() = owner_id);

-- Owners can update their own tasks
create policy "Users can update own tasks"
  on tasks for update
  using (auth.uid() = owner_id);

-- Owners can delete their own tasks
create policy "Users can delete own tasks"
  on tasks for delete
  using (auth.uid() = owner_id);

-- Admins can hide tasks
create policy "Admins can hide tasks"
  on tasks for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Trigger to update updated_at
create trigger update_tasks_updated_at
  before update on tasks
  for each row
  execute function update_updated_at_column();

-- Indexes
create index idx_tasks_status_created_at on tasks (status, created_at desc);
create index idx_tasks_category on tasks (category);
create index idx_tasks_country on tasks (country);
create index idx_tasks_tags on tasks using gin (tags);
create index idx_tasks_fulltext on tasks using gin (to_tsvector('english', title || ' ' || description));
create index idx_tasks_deadline on tasks (deadline) where deadline is not null;
create index idx_tasks_owner_id on tasks (owner_id);