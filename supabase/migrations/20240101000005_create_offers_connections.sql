-- Create contact_methods table (PRIVATE)
create table if not exists contact_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('email', 'phone', 'telegram', 'whatsapp', 'instagram', 'x', 'linkedin', 'url')),
  value text not null,
  created_at timestamptz default now(),
  unique(user_id, type, value)
);

-- Enable RLS
alter table contact_methods enable row level security;

-- Owner can select/insert/update/delete their own contact methods
create policy "Users can manage own contact methods"
  on contact_methods for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create offers table
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks on delete cascade not null,
  helper_id uuid references auth.users on delete cascade not null,
  message text not null check (length(message) <= 500),
  proposed_amount numeric(12, 2),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'withdrawn', 'connected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(task_id, helper_id)
);

-- Enable RLS
alter table offers enable row level security;

-- Helper or task owner can view
create policy "Helper or owner can view offer"
  on offers for select
  using (
    auth.uid() = helper_id or
    exists (select 1 from tasks where id = task_id and owner_id = auth.uid())
  );

-- Authenticated non-owner can insert (with checks in DB function)
create policy "Authenticated can create offer"
  on offers for insert
  with check (auth.uid() = helper_id);

-- Helper can update own offer (withdraw), owner can accept/decline
create policy "Helper can update own offer"
  on offers for update
  using (auth.uid() = helper_id);

-- Helper can delete own offer (withdraw before accept)
create policy "Helper can delete own offer"
  on offers for delete
  using (auth.uid() = helper_id and status = 'pending');

-- Trigger to update updated_at
create trigger update_offers_updated_at
  before update on offers
  for each row
  execute function update_updated_at_column();

-- Create connections table
create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references offers on delete cascade not null unique,
  task_id uuid references tasks on delete cascade not null,
  owner_id uuid references auth.users on delete cascade not null,
  helper_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table connections enable row level security;

-- Only the two parties can view
create policy "Parties can view connection"
  on connections for select
  using (auth.uid() = owner_id or auth.uid() = helper_id);

-- Create connection_shares table (snapshots of chosen contacts)
create table if not exists connection_shares (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references connections on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('email', 'phone', 'telegram', 'whatsapp', 'instagram', 'x', 'linkedin', 'url')),
  value text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table connection_shares enable row level security;

-- Only connection parties can view shares
create policy "Parties can view connection shares"
  on connection_shares for select
  using (
    exists (
      select 1 from connections
      where id = connection_id
      and (owner_id = auth.uid() or helper_id = auth.uid())
    )
  );

-- Sharer can insert at confirm time
create policy "Sharer can insert shares"
  on connection_shares for insert
  with check (auth.uid() = user_id);

-- Trigger function to prevent offering on own task
create or replace function prevent_self_offer()
returns trigger as $$
begin
  if exists (select 1 from tasks where id = new.task_id and owner_id = new.helper_id) then
    raise exception 'Cannot offer on your own task';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger prevent_self_offer_trigger
  before insert on offers
  for each row
  execute function prevent_self_offer();

-- Trigger function to prevent suspended/blocked users from offering
create or replace function validate_offerer()
returns trigger as $$
declare
  v_blocked boolean;
  v_suspended boolean;
begin
  -- Check if helper is suspended
  select is_suspended into v_suspended from profiles where id = new.helper_id;
  if v_suspended then
    raise exception 'Suspended users cannot make offers';
  end if;

  -- Check if helper is blocked by task owner
  select exists(
    select 1 from blocks
    where blocker_id = (select owner_id from tasks where id = new.task_id)
    and blocked_id = new.helper_id
  ) into v_blocked;
  if v_blocked then
    raise exception 'You are blocked by this task owner';
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger validate_offerer_trigger
  before insert on offers
  for each row
  execute function validate_offerer();

-- DB Function: accept_offer (owner accepts, moves to 'accepted')
create or replace function accept_offer(p_offer_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_offer offers%rowtype;
  v_task tasks%rowtype;
begin
  -- Get offer with task owner check
  select o.*, t.owner_id, t.status as task_status
  into v_offer
  from offers o
  join tasks t on t.id = o.task_id
  where o.id = p_offer_id;

  if not found then
    raise exception 'Offer not found';
  end if;

  if v_offer.owner_id != auth.uid() then
    raise exception 'Only task owner can accept offers';
  end if;

  if v_offer.status != 'pending' then
    raise exception 'Offer is not pending';
  end if;

  if v_task.task_status = 'hidden' then
    raise exception 'Task is hidden';
  end if;

  -- Update offer status
  update offers
  set status = 'accepted', updated_at = now()
  where id = p_offer_id;

  -- Update task status if first accepted offer
  if v_task.task_status = 'open' then
    update tasks
    set status = 'in_progress', updated_at = now()
    where id = v_offer.task_id;
  end if;
end;
$$;

-- DB Function: confirm_offer (helper confirms, creates connection + shares)
create or replace function confirm_offer(p_offer_id uuid, p_contact_method_ids uuid[])
returns void
language plpgsql
security definer
as $$
declare
  v_offer offers%rowtype;
  v_connection_id uuid;
  v_task tasks%rowtype;
  v_contact contact_methods%rowtype;
begin
  -- Get offer
  select o.*, t.owner_id, t.status as task_status
  into v_offer
  from offers o
  join tasks t on t.id = o.task_id
  where o.id = p_offer_id;

  if not found then
    raise exception 'Offer not found';
  end if;

  if v_offer.helper_id != auth.uid() then
    raise exception 'Only helper can confirm';
  end if;

  if v_offer.status not in ('accepted', 'pending') then
    raise exception 'Offer must be accepted or pending to confirm';
  end if;

  if v_task.task_status = 'hidden' then
    raise exception 'Task is hidden';
  end if;

  -- Create connection
  insert into connections (offer_id, task_id, owner_id, helper_id)
  values (v_offer.id, v_offer.task_id, v_offer.owner_id, v_offer.helper_id)
  returning id into v_connection_id;

  -- Insert chosen contact shares
  for v_contact in
    select * from contact_methods
    where id = any(p_contact_method_ids) and user_id = auth.uid()
  loop
    insert into connection_shares (connection_id, user_id, type, value)
    values (v_connection_id, v_contact.user_id, v_contact.type, v_contact.value);
  end loop;

  -- Update offer status
  update offers
  set status = 'connected', updated_at = now()
  where id = p_offer_id;

  -- Update task status
  update tasks
  set status = 'in_progress', updated_at = now()
  where id = v_offer.task_id;
end;
$$;

-- DB Function: decline_offer
create or replace function decline_offer(p_offer_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_offer offers%rowtype;
begin
  select o.*, t.owner_id
  into v_offer
  from offers o
  join tasks t on t.id = o.task_id
  where o.id = p_offer_id;

  if not found then
    raise exception 'Offer not found';
  end if;

  if v_offer.owner_id != auth.uid() then
    raise exception 'Only task owner can decline offers';
  end if;

  if v_offer.status != 'pending' then
    raise exception 'Offer is not pending';
  end if;

  update offers
  set status = 'declined', updated_at = now()
  where id = p_offer_id;
end;
$$;

-- DB Function: withdraw_offer
create or replace function withdraw_offer(p_offer_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_offer offers%rowtype;
begin
  select * into v_offer from offers where id = p_offer_id;

  if not found then
    raise exception 'Offer not found';
  end if;

  if v_offer.helper_id != auth.uid() then
    raise exception 'Only helper can withdraw offer';
  end if;

  if v_offer.status not in ('pending', 'accepted') then
    raise exception 'Offer cannot be withdrawn';
  end if;

  update offers
  set status = 'withdrawn', updated_at = now()
  where id = p_offer_id;
end;
$$;

-- Indexes
create index idx_offers_task_id on offers (task_id);
create index idx_offers_helper_id on offers (helper_id);
create index idx_offers_status on offers (status);
create index idx_connections_task_id on connections (task_id);
create index idx_connections_owner_id on connections (owner_id);
create index idx_connections_helper_id on connections (helper_id);
create index idx_connection_shares_connection_id on connection_shares (connection_id);
create index idx_contact_methods_user_id on contact_methods (user_id);