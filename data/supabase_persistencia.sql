-- Ejecuta este script en el SQL Editor de Supabase.

create table if not exists public.cliente_estado (
  user_id uuid primary key references auth.users(id) on delete cascade,
  carrito jsonb not null default '[]'::jsonb,
  metodo_pago text not null default '',
  instant_checkout_item jsonb,
  filtros jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  cliente text not null,
  canal text not null default 'manual',
  metodo_pago text not null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  envio numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  tracking_code text unique,
  tracking_status text not null default 'pendiente',
  tracking_history jsonb not null default '[]'::jsonb,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);

alter table public.cliente_estado enable row level security;
alter table public.pedidos enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'cliente_estado' and policyname = 'cliente_estado_select_own'
  ) then
    create policy cliente_estado_select_own
      on public.cliente_estado
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'cliente_estado' and policyname = 'cliente_estado_upsert_own'
  ) then
    create policy cliente_estado_upsert_own
      on public.cliente_estado
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'cliente_estado' and policyname = 'cliente_estado_update_own'
  ) then
    create policy cliente_estado_update_own
      on public.cliente_estado
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'pedidos' and policyname = 'pedidos_select_own'
  ) then
    create policy pedidos_select_own
      on public.pedidos
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'pedidos' and policyname = 'pedidos_insert_own'
  ) then
    create policy pedidos_insert_own
      on public.pedidos
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;
