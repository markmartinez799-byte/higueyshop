-- higueyshop: setup de tablas + RLS + seed inicial
-- Ejecuta este archivo en Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Si ya tienes tablas con otro esquema y quieres alinear al proyecto actual,
-- descomenta estas lineas:
-- drop table if exists public.resenas;
-- drop table if exists public.productos;

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  precio numeric(12,2) not null default 0,
  precio_anterior numeric(12,2) not null default 0,
  imagenes jsonb not null default '[]'::jsonb,
  categoria text not null default 'General',
  descripcion text not null default '',
  rating numeric(3,2) not null default 4.0,
  ventas integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  nombre text not null default 'Cliente',
  texto text not null default '',
  rating integer not null check (rating between 1 and 5),
  foto text not null default '',
  approvals integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_productos_created_at on public.productos (created_at desc);
create index if not exists idx_productos_categoria on public.productos (categoria);
create index if not exists idx_resenas_producto_id on public.resenas (producto_id);
create index if not exists idx_resenas_created_at on public.resenas (created_at desc);

alter table public.productos enable row level security;
alter table public.resenas enable row level security;

drop policy if exists "productos_select_public" on public.productos;
drop policy if exists "productos_insert_public" on public.productos;
drop policy if exists "productos_update_public" on public.productos;
drop policy if exists "productos_delete_public" on public.productos;

drop policy if exists "resenas_select_public" on public.resenas;
drop policy if exists "resenas_insert_public" on public.resenas;
drop policy if exists "resenas_update_public" on public.resenas;
drop policy if exists "resenas_delete_public" on public.resenas;

create policy "productos_select_public"
on public.productos for select
to anon, authenticated
using (true);

create policy "productos_insert_public"
on public.productos for insert
to authenticated
with check (true);

create policy "productos_update_public"
on public.productos for update
to authenticated
using (true)
with check (true);

create policy "productos_delete_public"
on public.productos for delete
to authenticated
using (true);

create policy "resenas_select_public"
on public.resenas for select
to anon, authenticated
using (true);

create policy "resenas_insert_public"
on public.resenas for insert
to authenticated
with check (true);

create policy "resenas_update_public"
on public.resenas for update
to authenticated
using (true)
with check (true);

create policy "resenas_delete_public"
on public.resenas for delete
to authenticated
using (true);

-- Seed inicial (solo si no existe por nombre)
insert into public.productos
  (nombre, precio, precio_anterior, categoria, rating, ventas, imagenes, descripcion)
select *
from (
  values
    (
      'Smartwatch X10',
      2450::numeric,
      3100::numeric,
      'Electronica',
      4.8::numeric,
      380,
      '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"]'::jsonb,
      'Pantalla tactil, monitoreo de salud y bateria de 5 dias.'
    ),
    (
      'Auriculares Pro Bass',
      1850::numeric,
      2400::numeric,
      'Electronica',
      4.6::numeric,
      890,
      '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80"]'::jsonb,
      'Sonido envolvente y estuche de carga compacto.'
    ),
    (
      'Mochila Travel Max',
      1300::numeric,
      1690::numeric,
      'Moda',
      4.5::numeric,
      560,
      '["https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80"]'::jsonb,
      'Impermeable y con espacio para laptop de 15 pulgadas.'
    )
) as v(nombre, precio, precio_anterior, categoria, rating, ventas, imagenes, descripcion)
where not exists (
  select 1 from public.productos p where p.nombre = v.nombre
);
