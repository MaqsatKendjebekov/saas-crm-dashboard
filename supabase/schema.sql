create extension if not exists pgcrypto;

create table if not exists public.customers (
  id text primary key,
  name text not null,
  company text not null,
  owner text not null,
  plan text not null,
  status text not null,
  arr integer not null default 0,
  health text not null,
  last_activity date not null,
  contacts integer not null default 0,
  region text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.deals (
  id text primary key,
  company text not null,
  title text not null,
  stage text not null,
  value integer not null default 0,
  owner text not null,
  due_date date not null,
  probability integer not null default 0,
  type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  customer text not null,
  assignee text not null,
  priority text not null,
  status text not null,
  due_date date not null,
  lane text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id text primary key,
  company text not null,
  amount integer not null default 0,
  due_date date not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity (
  id text primary key,
  actor text not null,
  text text not null,
  time text not null,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;
alter table public.invoices enable row level security;
alter table public.activity enable row level security;

drop policy if exists "auth can read customers" on public.customers;
drop policy if exists "auth can manage customers" on public.customers;
create policy "auth can read customers" on public.customers for select to authenticated using (true);
create policy "auth can manage customers" on public.customers for all to authenticated using (true) with check (true);

drop policy if exists "auth can read deals" on public.deals;
drop policy if exists "auth can manage deals" on public.deals;
create policy "auth can read deals" on public.deals for select to authenticated using (true);
create policy "auth can manage deals" on public.deals for all to authenticated using (true) with check (true);

drop policy if exists "auth can read tasks" on public.tasks;
drop policy if exists "auth can manage tasks" on public.tasks;
create policy "auth can read tasks" on public.tasks for select to authenticated using (true);
create policy "auth can manage tasks" on public.tasks for all to authenticated using (true) with check (true);

drop policy if exists "auth can read invoices" on public.invoices;
drop policy if exists "auth can manage invoices" on public.invoices;
create policy "auth can read invoices" on public.invoices for select to authenticated using (true);
create policy "auth can manage invoices" on public.invoices for all to authenticated using (true) with check (true);

drop policy if exists "auth can read activity" on public.activity;
drop policy if exists "auth can manage activity" on public.activity;
create policy "auth can read activity" on public.activity for select to authenticated using (true);
create policy "auth can manage activity" on public.activity for all to authenticated using (true) with check (true);

insert into public.customers (id, name, company, owner, plan, status, arr, health, last_activity, contacts, region, notes) values
('c-101', 'Northstar Labs', 'Northstar Labs', 'Elena Torres', 'Growth', 'Customer', 24000, 'Strong', '2026-06-03', 14, 'US East', 'Expanded into three teams after onboarding success.'),
('c-102', 'Aster Retail', 'Aster Retail', 'Niko Bell', 'Enterprise', 'Customer', 52000, 'Watch', '2026-06-04', 21, 'EU', 'Asking for custom permissions and advanced exports.'),
('c-103', 'Luma Freight', 'Luma Freight', 'Jade Carter', 'Starter', 'Qualified', 9600, 'Warm', '2026-06-01', 6, 'US West', 'Pilot team active, waiting on billing approval.'),
('c-104', 'Orbit Education', 'Orbit Education', 'Miles Nguyen', 'Growth', 'New', 14000, 'Warm', '2026-05-29', 8, 'APAC', 'Inbound lead from webinar funnel.'),
('c-105', 'Beacon Capital', 'Beacon Capital', 'Ava Patel', 'Enterprise', 'Customer', 68000, 'Strong', '2026-06-02', 19, 'US East', 'Power users are asking for AI summaries.'),
('c-106', 'Delta Health', 'Delta Health', 'Owen Reed', 'Growth', 'Churned', 18000, 'Critical', '2026-05-24', 11, 'Canada', 'Left after implementation delays on their side.')
on conflict (id) do nothing;

insert into public.deals (id, company, title, stage, value, owner, due_date, probability, type) values
('d-201', 'Northstar Labs', 'Ops Expansion', 'Discovery', 12000, 'Elena Torres', '2026-06-10', 48, 'Expansion'),
('d-202', 'Aster Retail', 'Global Rollout', 'Proposal', 31000, 'Niko Bell', '2026-06-07', 72, 'Upsell'),
('d-203', 'Orbit Education', 'Initial Pilot', 'Qualified', 9000, 'Miles Nguyen', '2026-06-13', 34, 'New Biz'),
('d-204', 'Beacon Capital', 'AI Workspace Add-on', 'Negotiation', 22000, 'Ava Patel', '2026-06-06', 81, 'Expansion'),
('d-205', 'Luma Freight', 'Dispatch Team Trial', 'Discovery', 6000, 'Jade Carter', '2026-06-15', 25, 'Pilot'),
('d-206', 'Nova Ventures', 'Portfolio Rollup', 'Proposal', 44000, 'Elena Torres', '2026-06-16', 66, 'Enterprise'),
('d-207', 'Cinder Mobility', 'Renewal Rescue', 'Negotiation', 18000, 'Ava Patel', '2026-06-09', 59, 'Renewal')
on conflict (id) do nothing;

insert into public.tasks (id, title, customer, assignee, priority, status, due_date, lane) values
('t-301', 'Review enterprise security questionnaire', 'Aster Retail', 'Niko Bell', 'High', 'In Progress', '2026-06-06', 'Today'),
('t-302', 'Prepare onboarding summary for Northstar', 'Northstar Labs', 'Elena Torres', 'Medium', 'Open', '2026-06-07', 'This Week'),
('t-303', 'Collect usage metrics for Beacon renewal', 'Beacon Capital', 'Ava Patel', 'High', 'Blocked', '2026-06-05', 'Today'),
('t-304', 'Book implementation call with Luma Freight', 'Luma Freight', 'Jade Carter', 'Low', 'Open', '2026-06-10', 'This Week'),
('t-305', 'Audit overdue invoices and send reminders', 'Multiple', 'Mina Ross', 'Medium', 'Done', '2026-06-04', 'Completed'),
('t-306', 'Design demo script for Orbit webinar', 'Orbit Education', 'Miles Nguyen', 'Low', 'In Progress', '2026-06-08', 'This Week')
on conflict (id) do nothing;

insert into public.invoices (id, company, amount, due_date, status) values
('inv-401', 'Northstar Labs', 3600, '2026-06-11', 'Paid'),
('inv-402', 'Aster Retail', 8200, '2026-06-06', 'Pending'),
('inv-403', 'Beacon Capital', 11400, '2026-06-03', 'Overdue'),
('inv-404', 'Orbit Education', 1800, '2026-06-18', 'Pending'),
('inv-405', 'Luma Freight', 1200, '2026-06-01', 'Paid')
on conflict (id) do nothing;

insert into public.activity (id, actor, text, time) values
('a-501', 'Elena Torres', 'Closed expansion notes with Northstar and scheduled the rollout workshop.', '12 min ago'),
('a-502', 'Ava Patel', 'Tagged Beacon renewal as at-risk after support escalations.', '39 min ago'),
('a-503', 'Mina Ross', 'Recovered two invoices and cleared $9.4k in pending revenue.', '1 hr ago'),
('a-504', 'Miles Nguyen', 'Added demo notes for Orbit Education webinar flow.', '2 hr ago')
on conflict (id) do nothing;
