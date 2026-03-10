-- Run this in your new Supabase project (SQL Editor) to recreate tables and RLS.
-- Then update your .env and Vercel env vars with the new project URL and anon key.

-- Table for wonder journal entries
create table if not exists public.wonder_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for faster lookups
create index if not exists wonder_entries_user_id_idx on public.wonder_entries(user_id);
create index if not exists wonder_entries_is_public_created_at_idx on public.wonder_entries(is_public, created_at desc);

-- Enable RLS
alter table public.wonder_entries enable row level security;

-- Anyone can read public wonders (for the public board)
create policy "Public wonders are viewable by everyone"
  on public.wonder_entries for select
  using (is_public = true);

-- Users can read their own entries (for the journal)
create policy "Users can read own entries"
  on public.wonder_entries for select
  using (auth.uid() = user_id);

-- Users can insert their own entries
create policy "Users can insert own entries"
  on public.wonder_entries for insert
  with check (auth.uid() = user_id);

-- Users can delete only their own entries
create policy "Users can delete own entries"
  on public.wonder_entries for delete
  using (auth.uid() = user_id);

-- Users can update only their own entries (e.g. to toggle is_public later)
create policy "Users can update own entries"
  on public.wonder_entries for update
  using (auth.uid() = user_id);
