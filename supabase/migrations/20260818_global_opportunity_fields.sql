-- NextMarga Global Opportunity Database
-- Adds geography, lifecycle and verification metadata without breaking existing rows.

alter table public.opportunities
  add column if not exists countries text[] not null default '{}',
  add column if not exists regions text[] not null default '{}',
  add column if not exists opportunity_status text not null default 'active',
  add column if not exists source_type text not null default 'official',
  add column if not exists last_verified_at timestamptz,
  add column if not exists application_url text,
  add column if not exists provider_type text;

create index if not exists opportunities_countries_idx on public.opportunities using gin(countries);
create index if not exists opportunities_regions_idx on public.opportunities using gin(regions);
create index if not exists opportunities_status_idx on public.opportunities(opportunity_status);

alter table public.opportunities drop constraint if exists opportunities_status_check;
alter table public.opportunities add constraint opportunities_status_check
  check (opportunity_status in ('active','upcoming','closed','rolling','seasonal','info_only'));

alter table public.opportunities drop constraint if exists opportunities_source_type_check;
alter table public.opportunities add constraint opportunities_source_type_check
  check (source_type in ('official','government','institution','partner'));

-- Existing verified records are treated as India/global-neutral until their geography is refined.
update public.opportunities
set countries = array['IN']
where cardinality(countries) = 0 and is_verified = true;

update public.opportunities
set last_verified_at = coalesce(last_verified_at, now())
where is_verified = true;
