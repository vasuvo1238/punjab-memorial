-- Punjab Anti-Drug Memorial: visitor interactions.
-- Run this once in the Supabase SQL editor (Dashboard > SQL > New query).
-- Everything visitors send lands as 'pending'. Only approved tributes are ever readable by the public.

create extension if not exists pgcrypto;

-- Messages of remembrance
create table if not exists public.tributes (
  id uuid primary key default gen_random_uuid(),
  person_slug text not null,                       -- a person's slug, or '__all' for everyone
  message text not null check (char_length(message) between 1 and 800),
  signed_as text check (char_length(signed_as) <= 80),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index if not exists tributes_person_status on public.tributes (person_slug, status);

-- Virtual diyas
create table if not exists public.candles (
  id bigserial primary key,
  person_slug text not null check (char_length(person_slug) <= 120),
  created_at timestamptz not null default now()
);
create index if not exists candles_person on public.candles (person_slug);

create or replace view public.candle_counts as
  select person_slug, count(*)::int as total from public.candles group by person_slug;

-- Names visitors believe are missing
create table if not exists public.name_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  village text, district text, date_of_death text,
  what_happened text not null check (char_length(what_happened) <= 3000),
  sources text not null check (char_length(sources) <= 3000),
  relation text,
  status text not null default 'pending' check (status in ('pending', 'added', 'rejected')),
  created_at timestamptz not null default now()
);

-- Contact form
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  message text not null check (char_length(message) <= 4000),
  reach_at text check (char_length(reach_at) <= 160),
  status text not null default 'pending' check (status in ('pending', 'done')),
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.tributes enable row level security;
alter table public.candles enable row level security;
alter table public.name_submissions enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "anyone can send a pending tribute" on public.tributes;
create policy "anyone can send a pending tribute" on public.tributes
  for insert to anon with check (status = 'pending' and reviewed_at is null);
drop policy if exists "anyone can read approved tributes" on public.tributes;
create policy "anyone can read approved tributes" on public.tributes
  for select to anon using (status = 'approved');

drop policy if exists "anyone can light a diya" on public.candles;
create policy "anyone can light a diya" on public.candles for insert to anon with check (true);

drop policy if exists "anyone can submit a name" on public.name_submissions;
create policy "anyone can submit a name" on public.name_submissions
  for insert to anon with check (status = 'pending');

drop policy if exists "anyone can send a contact message" on public.contact_messages;
create policy "anyone can send a contact message" on public.contact_messages
  for insert to anon with check (status = 'pending');

grant select on public.candle_counts to anon;
-- The moderation dashboard uses the service role key on the server, which bypasses RLS.
