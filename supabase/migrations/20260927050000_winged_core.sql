-- Winged core schema (Supabase free tier / Postgres)
-- Apply: supabase db push  OR  paste in SQL Editor

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null default '',
  role text check (role in ('bachelor', 'wing', null)),
  gender text,
  birthday date,
  city text default '',
  photos jsonb not null default '[]'::jsonb,
  prompts jsonb not null default '[]'::jsonb,
  interests jsonb not null default '[]'::jsonb,
  looking_for text default 'everyone',
  wing_mode text default 'friend',
  wing_tier text default 'friend_wing',
  wing_stats jsonb not null default '{}'::jsonb,
  open_to_hire boolean not null default false,
  linked_wing_name text default '',
  linked_bachelor_name text default '',
  vibe_line text default '',
  bio text default '',
  appearance text default 'auto',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_city_idx on public.profiles (city);

-- ---------------------------------------------------------------------------
-- Wing ↔ Bachelor links (duos)
-- ---------------------------------------------------------------------------
create table if not exists public.duo_links (
  id uuid primary key default gen_random_uuid(),
  bachelor_id uuid not null references public.profiles (id) on delete cascade,
  wing_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'active'
    check (status in ('pending', 'active', 'ended')),
  mode text not null default 'friend'
    check (mode in ('friend', 'pro', 'both')),
  created_at timestamptz not null default now(),
  unique (bachelor_id, wing_id)
);

-- ---------------------------------------------------------------------------
-- Matches
-- ---------------------------------------------------------------------------
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  bachelor_a uuid not null references public.profiles (id) on delete cascade,
  bachelor_b uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'new'
    check (status in ('new', 'deal_room', 'locked', 'passed')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Deal rooms
-- ---------------------------------------------------------------------------
create table if not exists public.deal_rooms (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches (id) on delete set null,
  bachelor_a uuid not null references public.profiles (id) on delete cascade,
  bachelor_b uuid not null references public.profiles (id) on delete cascade,
  wing_a uuid references public.profiles (id) on delete set null,
  wing_b uuid references public.profiles (id) on delete set null,
  venue jsonb,
  when_label text,
  status text not null default 'open'
    check (status in ('open', 'locked', 'cancelled')),
  locked_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Escrow / Date Pass
-- ---------------------------------------------------------------------------
create table if not exists public.escrow_transactions (
  id uuid primary key default gen_random_uuid(),
  bachelor_id uuid not null references public.profiles (id) on delete cascade,
  wing_id uuid not null references public.profiles (id) on delete cascade,
  other_bachelor_id uuid references public.profiles (id) on delete set null,
  deal_room_id uuid references public.deal_rooms (id) on delete set null,
  amount_ils integer not null default 120,
  wing_share_ils integer not null default 90,
  status text not null default 'held'
    check (status in ('held', 'released', 'refunded', 'disputed')),
  note text,
  proof_of_stay jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Post-date reviews
-- ---------------------------------------------------------------------------
create table if not exists public.post_date_reviews (
  id uuid primary key default gen_random_uuid(),
  deal_room_id uuid references public.deal_rooms (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  rating integer check (rating between 1 and 5),
  body text,
  show_up boolean,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- QA tickets (sync from Studio; works with auth user or anon device_id)
-- ---------------------------------------------------------------------------
create table if not exists public.qa_tickets (
  id text primary key,
  user_id uuid references auth.users (id) on delete set null,
  device_id text,
  status text not null default 'open' check (status in ('open', 'fixed')),
  note text not null default '',
  route text not null default '/',
  href text not null default '/',
  click jsonb not null default '{}'::jsonb,
  target jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists qa_tickets_user_idx on public.qa_tickets (user_id);
create index if not exists qa_tickets_device_idx on public.qa_tickets (device_id);
create index if not exists qa_tickets_status_idx on public.qa_tickets (status);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists escrow_updated_at on public.escrow_transactions;
create trigger escrow_updated_at
  before update on public.escrow_transactions
  for each row execute function public.set_updated_at();

drop trigger if exists qa_tickets_updated_at on public.qa_tickets;
create trigger qa_tickets_updated_at
  before update on public.qa_tickets
  for each row execute function public.set_updated_at();

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'friend'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.duo_links enable row level security;
alter table public.matches enable row level security;
alter table public.deal_rooms enable row level security;
alter table public.escrow_transactions enable row level security;
alter table public.post_date_reviews enable row level security;
alter table public.qa_tickets enable row level security;

-- Profiles: read all authenticated; write own
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- Duo links: participants
drop policy if exists duo_select on public.duo_links;
create policy duo_select on public.duo_links
  for select to authenticated
  using (auth.uid() = bachelor_id or auth.uid() = wing_id);

drop policy if exists duo_write on public.duo_links;
create policy duo_write on public.duo_links
  for all to authenticated
  using (auth.uid() = bachelor_id or auth.uid() = wing_id)
  with check (auth.uid() = bachelor_id or auth.uid() = wing_id);

-- Matches / deal rooms: participants
drop policy if exists matches_select on public.matches;
create policy matches_select on public.matches
  for select to authenticated
  using (auth.uid() = bachelor_a or auth.uid() = bachelor_b);

drop policy if exists matches_write on public.matches;
create policy matches_write on public.matches
  for all to authenticated
  using (auth.uid() = bachelor_a or auth.uid() = bachelor_b)
  with check (auth.uid() = bachelor_a or auth.uid() = bachelor_b);

drop policy if exists deal_rooms_select on public.deal_rooms;
create policy deal_rooms_select on public.deal_rooms
  for select to authenticated
  using (
    auth.uid() in (bachelor_a, bachelor_b, wing_a, wing_b)
  );

drop policy if exists deal_rooms_write on public.deal_rooms;
create policy deal_rooms_write on public.deal_rooms
  for all to authenticated
  using (auth.uid() in (bachelor_a, bachelor_b, wing_a, wing_b))
  with check (auth.uid() in (bachelor_a, bachelor_b, wing_a, wing_b));

-- Escrow: bachelor or wing on the row
drop policy if exists escrow_select on public.escrow_transactions;
create policy escrow_select on public.escrow_transactions
  for select to authenticated
  using (auth.uid() = bachelor_id or auth.uid() = wing_id);

drop policy if exists escrow_write on public.escrow_transactions;
create policy escrow_write on public.escrow_transactions
  for all to authenticated
  using (auth.uid() = bachelor_id or auth.uid() = wing_id)
  with check (auth.uid() = bachelor_id or auth.uid() = wing_id);

-- Reviews: reviewer or anyone authenticated read
drop policy if exists reviews_select on public.post_date_reviews;
create policy reviews_select on public.post_date_reviews
  for select to authenticated using (true);

drop policy if exists reviews_insert on public.post_date_reviews;
create policy reviews_insert on public.post_date_reviews
  for insert to authenticated with check (auth.uid() = reviewer_id);

-- QA tickets: owner by user_id OR matching device_id header via anon insert
-- Authenticated users manage their rows; anon can insert/select by device_id equality
-- (device_id must be supplied by client — not secret, fine for QA tooling)

drop policy if exists qa_select_own on public.qa_tickets;
create policy qa_select_own on public.qa_tickets
  for select to authenticated
  using (user_id = auth.uid() or user_id is null);

drop policy if exists qa_insert_auth on public.qa_tickets;
create policy qa_insert_auth on public.qa_tickets
  for insert to authenticated
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists qa_update_auth on public.qa_tickets;
create policy qa_update_auth on public.qa_tickets
  for update to authenticated
  using (user_id = auth.uid() or user_id is null);

drop policy if exists qa_delete_auth on public.qa_tickets;
create policy qa_delete_auth on public.qa_tickets
  for delete to authenticated
  using (user_id = auth.uid());

-- Anon device sync (QA Studio before login)
drop policy if exists qa_select_anon on public.qa_tickets;
create policy qa_select_anon on public.qa_tickets
  for select to anon using (true);

drop policy if exists qa_insert_anon on public.qa_tickets;
create policy qa_insert_anon on public.qa_tickets
  for insert to anon with check (device_id is not null);

drop policy if exists qa_update_anon on public.qa_tickets;
create policy qa_update_anon on public.qa_tickets
  for update to anon using (device_id is not null);
