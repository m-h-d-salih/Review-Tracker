-- ============================================================
-- Intern Review Tracker - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  intern_name text not null,
  type        text not null check (type in ('review', 'session', 'group_session', 'group_project')),
  advisor_name text not null,
  review_date date not null default current_date,
  notes       text,
  created_at  timestamptz default now()
);

-- Index for fast month/year filtering
create index if not exists reviews_date_idx on reviews (review_date);

-- Enable Row Level Security (optional but recommended)
alter table reviews enable row level security;

-- Policy: allow all authenticated users full access (adjust as needed)
create policy "Allow all" on reviews
  for all using (true) with check (true);
