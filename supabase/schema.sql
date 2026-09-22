-- Singular robotics market map
-- Run this once in the Supabase SQL editor.

create table if not exists public.companies (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  url              text default '',
  category         text not null default 'applications',
  vertical         text default '',
  country          text default '',
  description      text default '',
  met              text not null default 'none' check (met in ('augustin','team','none')),
  met_by           text default '',
  met_date         date,
  total_raised     text default '',
  last_round       text default '',
  last_round_size  text default '',
  last_round_date  text default '',
  lead_investors   text default '',
  notes            text default '',
  source           text default 'manual',
  pbid             text default '',
  pb_confidence    text default 'not_checked',
  pb_country       text default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists companies_category_idx on public.companies (category);
create index if not exists companies_met_idx      on public.companies (met);

alter table public.companies enable row level security;

-- Anyone with the page can read the map.
drop policy if exists "public read" on public.companies;
create policy "public read" on public.companies for select using (true);

-- Writes go through the server API using the service-role key, which bypasses RLS.
-- No insert/update policy is granted to the anon key on purpose.

create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists companies_touch on public.companies;
create trigger companies_touch before update on public.companies
  for each row execute function public.touch_updated_at();
