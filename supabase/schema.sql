create extension if not exists pgcrypto;

create table if not exists public.customers (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
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
  user_id uuid not null references auth.users(id) on delete cascade,
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
  user_id uuid not null references auth.users(id) on delete cascade,
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
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  amount integer not null default 0,
  due_date date not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  actor text not null,
  text text not null,
  time text not null,
  created_at timestamptz not null default now()
);

alter table public.customers add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.deals add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.tasks add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.invoices add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.activity add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists customers_user_id_idx on public.customers(user_id);
create index if not exists deals_user_id_idx on public.deals(user_id);
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists invoices_user_id_idx on public.invoices(user_id);
create index if not exists activity_user_id_idx on public.activity(user_id);

alter table public.customers enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;
alter table public.invoices enable row level security;
alter table public.activity enable row level security;

drop policy if exists "auth can read customers" on public.customers;
drop policy if exists "auth can manage customers" on public.customers;
drop policy if exists "customers_select_own" on public.customers;
drop policy if exists "customers_insert_own" on public.customers;
drop policy if exists "customers_update_own" on public.customers;
drop policy if exists "customers_delete_own" on public.customers;
create policy "customers_select_own" on public.customers for select to authenticated using (auth.uid() = user_id);
create policy "customers_insert_own" on public.customers for insert to authenticated with check (auth.uid() = user_id);
create policy "customers_update_own" on public.customers for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "customers_delete_own" on public.customers for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "auth can read deals" on public.deals;
drop policy if exists "auth can manage deals" on public.deals;
drop policy if exists "deals_select_own" on public.deals;
drop policy if exists "deals_insert_own" on public.deals;
drop policy if exists "deals_update_own" on public.deals;
drop policy if exists "deals_delete_own" on public.deals;
create policy "deals_select_own" on public.deals for select to authenticated using (auth.uid() = user_id);
create policy "deals_insert_own" on public.deals for insert to authenticated with check (auth.uid() = user_id);
create policy "deals_update_own" on public.deals for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "deals_delete_own" on public.deals for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "auth can read tasks" on public.tasks;
drop policy if exists "auth can manage tasks" on public.tasks;
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_select_own" on public.tasks for select to authenticated using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert to authenticated with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "auth can read invoices" on public.invoices;
drop policy if exists "auth can manage invoices" on public.invoices;
drop policy if exists "invoices_select_own" on public.invoices;
drop policy if exists "invoices_insert_own" on public.invoices;
drop policy if exists "invoices_update_own" on public.invoices;
drop policy if exists "invoices_delete_own" on public.invoices;
create policy "invoices_select_own" on public.invoices for select to authenticated using (auth.uid() = user_id);
create policy "invoices_insert_own" on public.invoices for insert to authenticated with check (auth.uid() = user_id);
create policy "invoices_update_own" on public.invoices for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "invoices_delete_own" on public.invoices for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "auth can read activity" on public.activity;
drop policy if exists "auth can manage activity" on public.activity;
drop policy if exists "activity_select_own" on public.activity;
drop policy if exists "activity_insert_own" on public.activity;
drop policy if exists "activity_update_own" on public.activity;
drop policy if exists "activity_delete_own" on public.activity;
create policy "activity_select_own" on public.activity for select to authenticated using (auth.uid() = user_id);
create policy "activity_insert_own" on public.activity for insert to authenticated with check (auth.uid() = user_id);
create policy "activity_update_own" on public.activity for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "activity_delete_own" on public.activity for delete to authenticated using (auth.uid() = user_id);

delete from public.activity where user_id is null;
delete from public.invoices where user_id is null;
delete from public.tasks where user_id is null;
delete from public.deals where user_id is null;
delete from public.customers where user_id is null;

alter table public.customers alter column user_id set not null;
alter table public.deals alter column user_id set not null;
alter table public.tasks alter column user_id set not null;
alter table public.invoices alter column user_id set not null;
alter table public.activity alter column user_id set not null;
