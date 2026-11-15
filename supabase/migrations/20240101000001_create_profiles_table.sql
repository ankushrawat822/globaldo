-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  handle citext unique not null check (length(handle) >= 3 and length(handle) <= 20),
  display_name text not null check (length(display_name) > 0),
  avatar_url text,
  bio text check (char_length(bio) <= 280),
  country char(2) references countries(iso2) on delete set null default 'US',
  is_admin boolean default false not null,
  is_suspended boolean default false not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create profiles are safe for public select (non-sensitive columns)
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Owner can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Trigger to update updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

-- Trigger to create profile on user signup
create function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, handle, display_name, country, is_admin, is_suspended)
    values (new.id, new.user_metadata->>'handle', new.user_metadata->>'display_name', new.user_metadata->>'country', false, false);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();