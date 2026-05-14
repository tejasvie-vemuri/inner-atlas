-- ============================================================
-- Inner Atlas — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- FRAMEWORKS (seeded from app — read-only for users)
-- ============================================================
create table if not exists frameworks (
  id text primary key,
  thinker text not null check (thinker in ('brene_brown', 'oprah', 'huberman', 'diary_of_ceo')),
  title text not null,
  summary text not null,
  full_description text not null,
  category text not null,
  tags text[] not null default '{}',
  source text not null,
  prompt text not null,
  created_at timestamptz not null default now()
);

alter table frameworks enable row level security;
create policy "frameworks_public_read" on frameworks
  for select using (true);

-- ============================================================
-- JOURNAL ENTRIES (user-owned)
-- ============================================================
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  framework_id text references frameworks(id),
  prompt_text text not null,
  content text not null default '',
  created_at timestamptz not null default now()
);

alter table journal_entries enable row level security;

create policy "journal_user_select" on journal_entries
  for select using (auth.uid() = user_id);

create policy "journal_user_insert" on journal_entries
  for insert with check (auth.uid() = user_id);

create policy "journal_user_update" on journal_entries
  for update using (auth.uid() = user_id);

create policy "journal_user_delete" on journal_entries
  for delete using (auth.uid() = user_id);

-- ============================================================
-- NOTES (user-owned)
-- ============================================================
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled',
  content text not null default '',
  tags text[] not null default '{}',
  linked_framework_id text references frameworks(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table notes enable row level security;

create policy "notes_user_select" on notes
  for select using (auth.uid() = user_id);

create policy "notes_user_insert" on notes
  for insert with check (auth.uid() = user_id);

create policy "notes_user_update" on notes
  for update using (auth.uid() = user_id);

create policy "notes_user_delete" on notes
  for delete using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger notes_updated_at
  before update on notes
  for each row execute procedure update_updated_at();
