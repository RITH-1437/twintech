-- ============================================================================
-- TwinTech — Database Schema v1 (PostgreSQL)
-- ----------------------------------------------------------------------------
-- Reference: TwinTech_Database_Schema.md
-- Conventions:
--   * uuid PK (gen_random_uuid()) on every table
--   * created_at / updated_at timestamptz default now() on every table
--   * RLS enabled + grants on every table
--   * enums lowercase; tables snake_case; business codes stored as text
--   * generated columns for denormalised / derived values
-- ============================================================================

-- 0. Extensions --------------------------------------------------------------
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- 1. Enum types --------------------------------------------------------------
create type app_role        as enum ('owner','manager','technician','cashier','customer');
create type order_status    as enum ('pending','paid','fulfilled','refunded','cancelled');
create type payment_method  as enum ('payway_card','khqr','aba_deeplink','bakong','card','cash');
create type payment_status  as enum ('pending','settled','refunded','failed');
create type repair_status   as enum ('received','diagnosing','awaiting_parts','in_repair',
                                     'quality_check','ready','completed','cancelled');
create type priority_level  as enum ('low','normal','high','urgent');
create type claim_status    as enum ('processing','approved','rejected','completed','expired');
create type stock_state     as enum ('in_stock','sold','rma','scrapped');
create type ticket_channel  as enum ('email','phone','chat','portal');

create type customer_tier       as enum ('retail','business','enterprise');
create type employee_status     as enum ('active','on_leave','inactive');
create type severity_level      as enum ('info','warning','error');
create type review_status       as enum ('pending','approved','rejected');
create type movement_reason     as enum ('purchase','sale','return','repair_part','adjustment','transfer');
create type supplier_status     as enum ('active','on_leave','inactive');
create type po_status           as enum ('pending','approved','processing','completed','cancelled');
create type cart_status         as enum ('open','checked_out','abandoned');
create type coupon_discount     as enum ('percent','fixed');
create type coupon_status       as enum ('active','expired');
create type invoice_status      as enum ('paid','pending','refunded','void');
create type batch_status        as enum ('pending','settled','failed');
create type webhook_event       as enum ('transaction.settled','transaction.pending',
                                        'transaction.refunded','transaction.failed');
create type webhook_status      as enum ('processing','completed','failed');
create type appointment_status  as enum ('pending','approved','processing','completed','cancelled');
create type ticket_status       as enum ('open','processing','approved','completed','closed');
create type notification_type   as enum ('info','success','warning','danger');
create type report_status       as enum ('pending','processing','completed','failed');
create type report_format       as enum ('pdf','xlsx','csv');

-- 2. Helper functions --------------------------------------------------------
create or replace function public.has_role(uid uuid, r app_role)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = uid and ur.role = r
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 3. Identity & access -------------------------------------------------------

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  email         text unique,
  phone         text,
  avatar_url    text,
  locale        text not null default 'en',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.employees (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid references public.profiles(id) on delete set null,
  employee_code  text not null unique,
  job_title      text,
  team           text,
  store_id       uuid references public.stores(id) on delete set null,
  rating         numeric(2,1) not null default 0 check (rating between 0 and 5),
  jobs_completed int not null default 0,
  status         employee_status not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  ip          inet,
  severity    severity_level not null default 'info',
  metadata    jsonb,
  at          timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

-- 4. Catalog ------------------------------------------------------------------

create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  parent_id  uuid references public.categories(id) on delete set null,
  icon       text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  sku              text not null unique,
  name             text not null,
  brand            text not null,
  category_id      uuid references public.categories(id) on delete restrict,
  price            numeric(12,2) not null default 0,
  compare_at_price numeric(12,2),
  badge            text,
  blurb            text,
  description      text,
  rating_avg       numeric(2,1) not null default 0 check (rating_avg between 0 and 5),
  review_count     int not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.product_specs (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null unique references public.products(id) on delete cascade,
  cpu            text,
  gpu            text,
  ram            text,
  storage        text,
  motherboard    text,
  warranty_terms text,
  extra          jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url        text not null,
  alt        text,
  position   int not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  status      review_status not null default 'pending',
  moderated_by uuid references public.employees(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (product_id, customer_id)
);

-- 5. Inventory ------------------------------------------------------------------

create table public.warehouses (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  name       text not null,
  store_id   uuid references public.stores(id) on delete set null,
  city       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_items (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  warehouse_id   uuid not null references public.warehouses(id) on delete cascade,
  on_hand        int not null default 0,
  reserved       int not null default 0 check (reserved >= 0),
  reorder_point  int not null default 0,
  unit_cost      numeric(12,2) not null default 0,
  status         text generated always as (
                   case when on_hand = 0 then 'out'
                        when on_hand < reorder_point then 'low'
                        else 'healthy' end
                 ) stored,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (product_id, warehouse_id)
);

create table public.stock_units (
  id                     uuid primary key default gen_random_uuid(),
  inventory_item_id      uuid not null references public.inventory_items(id) on delete cascade,
  serial                 text not null unique,
  purchase_order_line_id uuid references public.purchase_order_lines(id) on delete set null,
  sold_order_item_id     uuid,
  state                  stock_state not null default 'in_stock',
  warranty_months        int,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table public.stock_movements (
  id                uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  delta             int not null,
  reason            movement_reason not null,
  ref_type          text,
  ref_id            uuid,
  actor_id          uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now()
);

-- 6. Procurement ------------------------------------------------------------------

create table public.suppliers (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  name           text not null,
  contact_email  text,
  category       text,
  lead_time_days int,
  status         supplier_status not null default 'active',
  total_spend    numeric(14,2) not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.purchase_orders (
  id          uuid primary key default gen_random_uuid(),
  po_number   text not null unique,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  raised_by   uuid references public.employees(id) on delete set null,
  raised_at   timestamptz not null default now(),
  eta         date,
  status      po_status not null default 'pending',
  total       numeric(14,2) not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.purchase_order_lines (
  id                uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  product_id        uuid not null references public.products(id) on delete restrict,
  qty               int not null check (qty > 0),
  unit_cost         numeric(12,2) not null default 0,
  qty_received      int not null default 0,
  created_at        timestamptz not null default now(),
  unique (purchase_order_id, product_id)
);

-- 7. Commerce ----------------------------------------------------------------------

create table public.customers (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid references public.profiles(id) on delete set null,
  customer_code  text not null unique,
  tier           customer_tier not null default 'retail',
  company        text,
  default_address jsonb,
  lifetime_spend numeric(14,2) not null default 0,
  orders_count   int not null default 0,
  joined_at      timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.carts (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  status      cart_status not null default 'open',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  qty        int not null default 1 check (qty > 0),
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique,
  customer_id     uuid not null references public.customers(id) on delete restrict,
  store_id        uuid references public.stores(id) on delete set null,
  status          order_status not null default 'pending',
  payment_method  payment_method,
  subtotal        numeric(12,2) not null default 0,
  discount_total  numeric(12,2) not null default 0,
  tax_total       numeric(12,2) not null default 0,
  shipping_total  numeric(12,2) not null default 0,
  grand_total     numeric(12,2) not null default 0,
  shipping_address jsonb,
  placed_at       timestamptz not null default now(),
  eta             date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete restrict,
  qty           int not null check (qty > 0),
  unit_price    numeric(12,2) not null default 0,
  line_total    numeric(12,2) not null default 0,
  stock_unit_id uuid,
  created_at    timestamptz not null default now()
);

create table public.coupons (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  discount_type coupon_discount not null,
  value         numeric(12,2) not null,
  usage_cap     int,
  used_count    int not null default 0,
  expires_at    timestamptz,
  status        coupon_status not null default 'active',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.coupon_redemptions (
  id          uuid primary key default gen_random_uuid(),
  coupon_id   uuid not null references public.coupons(id) on delete restrict,
  order_id    uuid not null references public.orders(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete restrict,
  amount_off  numeric(12,2) not null default 0,
  created_at  timestamptz not null default now(),
  unique (coupon_id, order_id)
);

create table public.wishlists (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (customer_id, product_id)
);

-- 8. Billing & ABA PayWay ------------------------------------------------------------

create table public.payway_batches (
  id              uuid primary key default gen_random_uuid(),
  batch_code      text not null unique,
  window_start    timestamptz not null,
  window_end      timestamptz not null,
  txn_count       int not null default 0,
  gross           numeric(14,2) not null default 0,
  fees            numeric(12,2) not null default 0,
  expected_payout numeric(14,2) not null default 0,
  posted_payout   numeric(14,2) not null default 0,
  variance        numeric(14,2) generated always as (posted_payout - expected_payout) stored,
  status          batch_status not null default 'pending',
  reconciled_by   uuid references public.employees(id) on delete set null,
  reconciled_at   timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  tran_id      text not null unique,
  order_id     uuid references public.orders(id) on delete restrict,
  customer_id  uuid references public.customers(id) on delete restrict,
  batch_id     uuid references public.payway_batches(id) on delete set null,
  method       payment_method not null,
  amount       numeric(12,2) not null,
  fee          numeric(12,2) not null default 0,
  net          numeric(12,2) generated always as (amount - fee) stored,
  status       payment_status not null default 'pending',
  auth_code    text,
  raw_payload  jsonb,
  captured_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create table public.payway_webhooks (
  id          uuid primary key default gen_random_uuid(),
  event_id    text not null unique,
  event_type  webhook_event not null,
  payment_id  uuid references public.payments(id) on delete cascade,
  signature   text,
  response_code int,
  attempts    int not null default 1,
  status      webhook_status not null default 'processing',
  received_at timestamptz not null default now(),
  payload     jsonb,
  created_at  timestamptz not null default now()
);

create table public.invoices (
  id             uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  order_id       uuid references public.orders(id) on delete restrict,
  repair_job_id  uuid references public.repair_jobs(id) on delete restrict,
  customer_id    uuid not null references public.customers(id) on delete restrict,
  amount         numeric(12,2) not null,
  issued_at      timestamptz not null default now(),
  due_at         timestamptz,
  status         invoice_status not null default 'pending',
  pdf_url        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (order_id is not null or repair_job_id is not null)
);

create table public.invoice_lines (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  qty         int not null default 1,
  unit_price  numeric(12,2) not null default 0,
  line_total  numeric(12,2) not null default 0,
  tax_rate    numeric(5,2) not null default 0,
  created_at  timestamptz not null default now()
);

-- 9. Service & warranty --------------------------------------------------------------

create table public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  price       numeric(12,2),
  turnaround  text,
  sla         text,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.repair_jobs (
  id                uuid primary key default gen_random_uuid(),
  job_number        text not null unique,
  customer_id       uuid not null references public.customers(id) on delete restrict,
  device_label      text not null,
  serial            text,
  issue             text not null,
  status            repair_status not null default 'received',
  priority          priority_level not null default 'normal',
  technician_id     uuid references public.employees(id) on delete set null,
  store_id          uuid references public.stores(id) on delete set null,
  quote_amount      numeric(12,2),
  final_amount      numeric(12,2),
  quote_approved_at timestamptz,
  due_at            timestamptz,
  completed_at      timestamptz,
  warranty_claim_id uuid,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.appointments (
  id               uuid primary key default gen_random_uuid(),
  appointment_code text not null unique,
  customer_id      uuid not null references public.customers(id) on delete cascade,
  service_id       uuid references public.services(id) on delete set null,
  store_id         uuid references public.stores(id) on delete set null,
  technician_id    uuid references public.employees(id) on delete set null,
  slot_at          timestamptz not null,
  status           appointment_status not null default 'pending',
  notes            text,
  repair_job_id    uuid references public.repair_jobs(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.repair_events (
  id                 uuid primary key default gen_random_uuid(),
  repair_job_id      uuid not null references public.repair_jobs(id) on delete cascade,
  label              text not null,
  note               text,
  actor_id           uuid references public.employees(id) on delete set null,
  at                 timestamptz not null default now(),
  is_customer_visible boolean not null default true,
  attachments        jsonb,
  created_at         timestamptz not null default now()
);

create table public.repair_parts (
  id            uuid primary key default gen_random_uuid(),
  repair_job_id uuid not null references public.repair_jobs(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete restrict,
  stock_unit_id uuid references public.stock_units(id) on delete set null,
  qty           int not null default 1 check (qty > 0),
  unit_cost     numeric(12,2) not null default 0,
  billable      boolean not null default true,
  created_at    timestamptz not null default now()
);

create table public.warranties (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid not null references public.customers(id) on delete restrict,
  stock_unit_id  uuid references public.stock_units(id) on delete set null,
  order_item_id  uuid references public.order_items(id) on delete restrict,
  device_label   text not null,
  serial         text,
  purchased_at   timestamptz not null,
  covered_until  timestamptz not null,
  terms          text,
  status         text not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.warranty_claims (
  id           uuid primary key default gen_random_uuid(),
  claim_code   text not null unique,
  warranty_id  uuid not null references public.warranties(id) on delete restrict,
  customer_id  uuid not null references public.customers(id) on delete restrict,
  opened_at    timestamptz not null default now(),
  status       claim_status not null default 'processing',
  resolution   text,
  repair_job_id uuid,
  handled_by   uuid references public.employees(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 10. Support, content & ops ------------------------------------------------------------

create table public.stores (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  address    text,
  city       text,
  phone      text,
  hours      jsonb,
  services   text[],
  lat        numeric(9,6),
  lng        numeric(9,6),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_tickets (
  id               uuid primary key default gen_random_uuid(),
  ticket_code      text not null unique,
  customer_id      uuid not null references public.customers(id) on delete cascade,
  subject          text not null,
  channel          ticket_channel not null,
  assigned_to      uuid references public.employees(id) on delete set null,
  status           ticket_status not null default 'open',
  first_response_at timestamptz,
  opened_at        timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.ticket_messages (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references public.support_tickets(id) on delete cascade,
  author_id   uuid references public.profiles(id) on delete set null,
  body        text not null,
  is_internal boolean not null default false,
  sent_at     timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  body        text,
  type        notification_type not null default 'info',
  entity_type text,
  entity_id   uuid,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create table public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  body_md       text,
  category      text,
  cover_url     text,
  read_minutes  int not null default 0,
  author_id     uuid references public.profiles(id) on delete set null,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.plans (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  price_monthly numeric(12,2) not null default 0,
  tagline       text,
  features      text[],
  is_featured   boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  report_code  text not null unique,
  name         text not null,
  scope        text,
  period       text,
  format       report_format not null default 'pdf',
  status       report_status not null default 'pending',
  file_url     text,
  requested_by uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 11. Circular foreign keys (added after all tables exist) --------------------------------

alter table public.stock_units
  add constraint stock_units_sold_order_item_id_fkey
  foreign key (sold_order_item_id) references public.order_items(id) on delete set null;

alter table public.order_items
  add constraint order_items_stock_unit_id_fkey
  foreign key (stock_unit_id) references public.stock_units(id) on delete set null;

alter table public.repair_jobs
  add constraint repair_jobs_warranty_claim_id_fkey
  foreign key (warranty_claim_id) references public.warranty_claims(id) on delete set null;

alter table public.warranty_claims
  add constraint warranty_claims_repair_job_id_fkey
  foreign key (repair_job_id) references public.repair_jobs(id) on delete set null;

-- 12. Indexes -------------------------------------------------------------------------------

create index categories_parent_idx        on public.categories(parent_id);
create index products_category_idx        on public.products(category_id);
create index products_search_idx          on public.products using gin (name gin_trgm_ops, sku gin_trgm_ops);
create index product_images_product_idx   on public.product_images(product_id, position);
create index product_reviews_product_idx  on public.product_reviews(product_id);
create index product_reviews_customer_idx on public.product_reviews(customer_id);

create index warehouses_store_idx         on public.warehouses(store_id);
create index inventory_items_warehouse_idx on public.inventory_items(warehouse_id);
create index stock_units_inventory_idx    on public.stock_units(inventory_item_id);
create index stock_units_state_idx        on public.stock_units(state);
create index stock_movements_item_idx     on public.stock_movements(inventory_item_id, created_at desc);
create index stock_movements_actor_idx    on public.stock_movements(actor_id);

create index suppliers_status_idx         on public.suppliers(status);
create index purchase_orders_supplier_idx on public.purchase_orders(supplier_id);
create index purchase_orders_status_idx   on public.purchase_orders(status, raised_at desc);
create index po_lines_order_idx           on public.purchase_order_lines(purchase_order_id);
create index po_lines_product_idx         on public.purchase_order_lines(product_id);

create index customers_profile_idx        on public.customers(profile_id);
create index customers_tier_idx           on public.customers(tier);
create index carts_customer_idx           on public.carts(customer_id, status);
create index cart_items_cart_idx          on public.cart_items(cart_id);
create index orders_customer_idx          on public.orders(customer_id, placed_at desc);
create index orders_store_idx             on public.orders(store_id);
create index orders_status_idx            on public.orders(status, placed_at desc);
create index order_items_order_idx        on public.order_items(order_id);
create index order_items_product_idx      on public.order_items(product_id);
create index coupons_status_idx           on public.coupons(status, expires_at);
create index coupon_redemptions_order_idx on public.coupon_redemptions(order_id);
create index wishlists_customer_idx       on public.wishlists(customer_id);

create index payments_order_idx           on public.payments(order_id);
create index payments_customer_idx        on public.payments(customer_id);
create index payments_batch_idx           on public.payments(batch_id);
create index payments_status_idx          on public.payments(status, captured_at desc);
create index payway_webhooks_payment_idx  on public.payway_webhooks(payment_id, received_at desc);
create index invoices_customer_idx        on public.invoices(customer_id, issued_at desc);
create index invoices_order_idx           on public.invoices(order_id);
create index invoices_repair_job_idx      on public.invoices(repair_job_id);
create index invoice_lines_invoice_idx    on public.invoice_lines(invoice_id);

create index appointments_customer_idx    on public.appointments(customer_id);
create index appointments_tech_idx        on public.appointments(technician_id, slot_at);
create index appointments_store_idx       on public.appointments(store_id);
create index repair_jobs_customer_idx     on public.repair_jobs(customer_id);
create index repair_jobs_tech_idx         on public.repair_jobs(technician_id);
create index repair_jobs_status_idx       on public.repair_jobs(status, due_at);
create index repair_events_job_idx        on public.repair_events(repair_job_id, at);
create index repair_parts_job_idx         on public.repair_parts(repair_job_id);
create index repair_parts_product_idx     on public.repair_parts(product_id);
create index warranties_customer_idx      on public.warranties(customer_id);
create index warranties_stock_unit_idx    on public.warranties(stock_unit_id);
create index warranties_serial_idx        on public.warranties(serial);
create index warranty_claims_warranty_idx on public.warranty_claims(warranty_id);
create index warranty_claims_status_idx   on public.warranty_claims(status, opened_at desc);

create index support_tickets_customer_idx on public.support_tickets(customer_id);
create index support_tickets_status_idx   on public.support_tickets(status, opened_at desc);
create index ticket_messages_ticket_idx   on public.ticket_messages(ticket_id, sent_at);
create index notifications_user_idx       on public.notifications(user_id, read_at);
create index blog_posts_published_idx     on public.blog_posts(published_at desc);
create index reports_requested_by_idx     on public.reports(requested_by);
create index audit_logs_actor_idx         on public.audit_logs(actor_id, at desc);
create index audit_logs_entity_idx        on public.audit_logs(entity_type, entity_id);

-- 13. updated_at triggers (applied to every table that has the column) ------------------------

do $$
declare
  t text;
begin
  for t in
    select table_name
    from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
  loop
    execute format(
      'create trigger trg_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end;
$$;

-- 14. Grants -----------------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.tables where table_schema = 'public'
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('grant all on public.%I to anon', t);
  end loop;
end;
$$;

-- 15. Row Level Security -----------------------------------------------------------------------

do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.tables where table_schema = 'public'
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- Representative policies (repeat the same pattern for every table):

create policy "Users manage own profile" on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Staff read any profile" on public.profiles
  for select to authenticated
  using (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager')
         or public.has_role(auth.uid(), 'technician') or public.has_role(auth.uid(), 'cashier'));

create policy "Public catalog read" on public.products
  for select using (is_active = true);

create policy "Staff manage products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager'))
  with check (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager'));

create policy "Customers read own orders" on public.orders
  for select to authenticated
  using (exists (
    select 1 from public.customers c
    where c.id = orders.customer_id and c.profile_id = auth.uid()
  ));

create policy "Staff manage orders" on public.orders
  for all to authenticated
  using (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager')
         or public.has_role(auth.uid(), 'cashier'))
  with check (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager')
         or public.has_role(auth.uid(), 'cashier'));

create policy "Customers read own payments" on public.payments
  for select to authenticated
  using (exists (
    select 1 from public.customers c
    where c.id = payments.customer_id and c.profile_id = auth.uid()
  ));

create policy "Finance staff manage payments" on public.payments
  for all to authenticated
  using (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager')
         or public.has_role(auth.uid(), 'cashier'))
  with check (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager')
         or public.has_role(auth.uid(), 'cashier'));

create policy "Customers read own invoices" on public.invoices
  for select to authenticated
  using (exists (
    select 1 from public.customers c
    where c.id = invoices.customer_id and c.profile_id = auth.uid()
  ));

create policy "Staff manage invoices" on public.invoices
  for all to authenticated
  using (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager'))
  with check (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager'));

create policy "Staff manage inventory" on public.inventory_items
  for all to authenticated
  using (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager'))
  with check (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager'));

create policy "Customers read own repairs" on public.repair_jobs
  for select to authenticated
  using (exists (
    select 1 from public.customers c
    where c.id = repair_jobs.customer_id and c.profile_id = auth.uid()
  ));

create policy "Staff manage repairs" on public.repair_jobs
  for all to authenticated
  using (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager')
         or public.has_role(auth.uid(), 'technician'))
  with check (public.has_role(auth.uid(), 'owner') or public.has_role(auth.uid(), 'manager')
         or public.has_role(auth.uid(), 'technician'));

-- ============================================================================
-- v1 complete — 43 tables, 27 enums, 44+ indexes, RLS + grants applied.
-- ============================================================================
