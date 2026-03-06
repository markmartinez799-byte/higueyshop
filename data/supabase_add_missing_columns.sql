-- higüeyshop: agregar columnas faltantes a tabla existente productos
-- Ejecutar en Supabase SQL Editor.
-- No borra datos actuales.

-- 1) Asegurar columnas base actuales (por si falta alguna)
alter table if exists public.productos
  add column if not exists nombre text,
  add column if not exists precio numeric,
  add column if not exists imagen text,
  add column if not exists descripcion text;

-- 2) Agregar columnas faltantes para funcionalidades completas
alter table if exists public.productos
  add column if not exists precio_anterior numeric(12,2),
  add column if not exists imagenes jsonb,
  add column if not exists video text,
  add column if not exists categoria text,
  add column if not exists rating numeric(3,2),
  add column if not exists ventas integer,
  add column if not exists resena text;

-- 3) Completar datos por defecto/migración desde columnas existentes
update public.productos
set
  precio_anterior = coalesce(precio_anterior, precio, 0),
  imagenes = coalesce(imagenes, case when imagen is not null and imagen <> '' then jsonb_build_array(imagen) else '[]'::jsonb end),
  video = coalesce(video, ''),
  categoria = coalesce(nullif(categoria, ''), 'General'),
  rating = coalesce(rating, 4.5),
  ventas = coalesce(ventas, 0),
  descripcion = coalesce(descripcion, ''),
  resena = coalesce(resena, '')
where true;

-- 4) Endurecer nullabilidad donde aplica
alter table if exists public.productos
  alter column precio set default 0,
  alter column precio_anterior set default 0,
  alter column imagenes set default '[]'::jsonb,
  alter column video set default '',
  alter column categoria set default 'General',
  alter column rating set default 4.5,
  alter column ventas set default 0,
  alter column descripcion set default '',
  alter column resena set default '';

-- Intentar NOT NULL solo si no rompe datos
do $$
begin
  begin
    alter table public.productos alter column precio set not null;
  exception when others then
    null;
  end;
  begin
    alter table public.productos alter column precio_anterior set not null;
  exception when others then
    null;
  end;
  begin
    alter table public.productos alter column imagenes set not null;
  exception when others then
    null;
  end;
  begin
    alter table public.productos alter column categoria set not null;
  exception when others then
    null;
  end;
  begin
    alter table public.productos alter column rating set not null;
  exception when others then
    null;
  end;
  begin
    alter table public.productos alter column ventas set not null;
  exception when others then
    null;
  end;
end $$;

-- 5) Índices útiles
create index if not exists idx_productos_categoria on public.productos (categoria);

-- 6) Tabla de reseñas separada (recomendada)
create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  producto_id bigint not null references public.productos(id) on delete cascade,
  nombre text not null default 'Cliente',
  texto text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  foto text not null default '',
  approvals integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_resenas_producto_id on public.resenas (producto_id);
create index if not exists idx_resenas_created_at on public.resenas (created_at desc);

-- 6.1) Agregar columnas de rastreo a pedidos si la tabla ya existe
alter table if exists public.pedidos
  add column if not exists tracking_code text,
  add column if not exists tracking_status text not null default 'pendiente',
  add column if not exists tracking_history jsonb not null default '[]'::jsonb;

create unique index if not exists idx_pedidos_tracking_code on public.pedidos (tracking_code);

-- 7) RLS básico para lecturas públicas y escritura autenticada
alter table if exists public.productos enable row level security;
alter table if exists public.resenas enable row level security;

drop policy if exists "productos_select_public" on public.productos;
drop policy if exists "productos_insert_auth" on public.productos;
drop policy if exists "productos_update_auth" on public.productos;
drop policy if exists "productos_delete_auth" on public.productos;

drop policy if exists "resenas_select_public" on public.resenas;
drop policy if exists "resenas_insert_auth" on public.resenas;
drop policy if exists "resenas_update_auth" on public.resenas;
drop policy if exists "resenas_delete_auth" on public.resenas;

create policy "productos_select_public"
on public.productos for select
to anon, authenticated
using (true);

create policy "productos_insert_auth"
on public.productos for insert
to authenticated
with check (true);

create policy "productos_update_auth"
on public.productos for update
to authenticated
using (true)
with check (true);

create policy "productos_delete_auth"
on public.productos for delete
to authenticated
using (true);

create policy "resenas_select_public"
on public.resenas for select
to anon, authenticated
using (true);

create policy "resenas_insert_auth"
on public.resenas for insert
to authenticated
with check (true);

create policy "resenas_update_auth"
on public.resenas for update
to authenticated
using (true)
with check (true);

create policy "resenas_delete_auth"
on public.resenas for delete
to authenticated
using (true);
