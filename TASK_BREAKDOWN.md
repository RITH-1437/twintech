# TwinTech — Backend API Task Breakdown & Integration Plan

> Status snapshot (as of 2026-08-08):
> - **Database:** designed & prepared (`TwinTech_Backend/ERD.sql` — 43 tables, 27 enums, indexes, RLS).
> - **Frontend:** fully built prototype (TanStack Start/Router + React + shadcn/ui) running 100% on mock data (`src/lib/mock-data.ts`, 45 import sites). TanStack Query is installed and wired but unused.
> - **Backend:** fresh Laravel 13 skeleton (PHP 8.3). Only default `User` model and root route exist. **No API, no models, no controllers, no migrations yet.**
> - **Scope of this document:** build the Laravel REST API on top of the existing schema, then integrate it into the frontend.

---

## 0. Architecture Decisions (resolve first)

| # | Decision | Notes / Recommendation |
|---|----------|------------------------|
| D1 | **Adopt existing ERD as-is** (no Laravel migrations that recreate tables) | Schema is already prepared. Laravel connects via `pgsql` and models map to existing tables. If schema drift is needed, version it with migrations against a local copy. |
| D2 | **Auth model** | ERD references `auth.users` (Supabase-style) and RLS uses `public.has_role(auth.uid(), ...)`. Decide: (a) keep Supabase auth and have Laravel accept Supabase JWTs, or (b) Laravel owns auth with its own `users` table and `profiles.id` is linked. Frontend `roles.ts` expects 5 roles: `owner, manager, technician, cashier, customer`. **Recommend (b): Laravel Sanctum tokens + `user_roles` table.** |
| D3 | **API style** | JSON REST under `/api/v1`, resource controllers, FormRequest validation, API Resources for serialization, cursor/paginated lists. |
| D4 | **Money** | All amounts `numeric(12,2)` — cast to string/decimal in API responses; never float. |
| D5 | **IDs** | UUID everywhere (`gen_random_uuid()` server-side; models use `HasUuids` or DB defaults). |
| D6 | **Enums** | PHP 8.3 backed enums + Eloquent enum casts matching the 27 Postgres enum types exactly. |
| D7 | **Frontend data layer** | TanStack Query `useQuery`/`useMutation` hooks in `src/hooks/` + fetch-based client `src/lib/api-client.ts` using `VITE_API_URL`. |

---

## Phase 1 — Backend Foundation

### Task 1.1 — Database connection & config
- [ ] Set `.env` to PostgreSQL (`DB_CONNECTION=pgsql`, host/port/db/user/pass matching the prepared database).
- [ ] Verify connection: `php artisan tinker` → `DB::select('select count(*) from public.products')`.
- [ ] Disable/ignore default Laravel `users` migration expectations; adopt existing `profiles` + `user_roles`.

### Task 1.2 — API scaffolding
- [ ] Create `routes/api.php`, register in `bootstrap/app.php` with `/api` prefix.
- [ ] Global JSON exception handler (validation errors, 404, auth failures → consistent envelope).
- [ ] Base API Resource conventions: snake_case fields, ISO-8601 dates (`timestamptz`), amounts as decimal strings.
- [ ] CORS config for the frontend origin (`config/cors.php`).
- [ ] Rate limiting (throttle) on auth + public endpoints.

### Task 1.3 — Auth (Sanctum) & RBAC
- [ ] `POST /api/v1/auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`.
- [ ] `auth/me` returns profile + `roles[]` + derived `permissions[]` matching frontend `src/lib/roles.ts` (8 permissions: insights, commerce, payments, inventory, service, people, settings, portal).
- [ ] Middleware `role:owner,manager,...` reading `user_roles` table (mirrors `public.has_role`).
- [ ] Optional: password reset flow (`forgot-password` page exists).

### Task 1.4 — Shared infrastructure
- [ ] PHP backed enums for all 27 DB enum types (`App\Enums\*`) + casts.
- [ ] Audit log helper (write to `audit_logs`: actor, action, entity_type, entity_id, ip, severity, metadata).
- [ ] Pagination/filter/sort query helpers; consistent query params (`page`, `per_page`, `q`, `sort`, filters).
- [ ] Reference-number generators: `order_number`, `job_number`, `customer_code`, `employee_code`, `appointment_code`, invoice numbers.

---

## Phase 2 — Eloquent Models (43 tables)

Create model + relationships + casts per ERD section. Grouped by domain:

| Domain | Tables (ERD section) |
|---|---|
| Identity & access (§3) | profiles, user_roles, employees, audit_logs |
| Catalog (§4) | categories, products, product_specs, product_images, product_reviews |
| Inventory (§5) | warehouses, inventory_items, stock_units, stock_movements, suppliers, purchase_orders, purchase_order_lines |
| Commerce (§7) | customers, carts, cart_items, orders, order_items, coupons, coupon_redemptions, wishlists |
| Payments (§8) | payway_batches, payments, payway_webhooks, invoices, invoice_lines |
| Service & warranty (§9) | services, repair_jobs, appointments, repair_events, repair_parts, warranties, warranty_claims |
| Org & misc (§10) | stores, support_tickets, ticket_messages, notifications, blog_posts, plans, reports |

Acceptance: `php artisan test` model relation tests green; factories for key models.

---

## Phase 3 — API Modules (controllers, requests, resources, routes)

> Endpoint prefix `/api/v1`. Each module: list (paginated + filters) / show / store / update / delete where the admin screen needs it.

### 3.1 Catalog — feeds `/products`, `/products/$productId`, admin products, reviews
- [ ] `GET categories` (tree), admin CRUD.
- [ ] `GET products` (search `pg_trgm`, category, price, stock filters), `GET products/{slug|id}` with specs + images + reviews.
- [ ] Admin CRUD products/specs/images; `POST products/{id}/stock-adjust` hook into inventory.
- [ ] `GET/POST products/{id}/reviews`, admin `PATCH reviews/{id}` (approve/reject → `review_status`).

### 3.2 Commerce — carts, checkout, orders, coupons, wishlist
- [ ] Cart: `GET/POST/PUT/DELETE cart/items` (per customer; `cart_status` open → checked_out).
- [ ] Checkout: create order (order_number, totals: subtotal/discount/tax/shipping/grand_total), apply coupon (validate + `coupon_redemptions`), decrement inventory (`inventory_items`, create `stock_units`/`stock_movements`).
- [ ] Orders admin CRUD + status transitions (`order_status`); customer-facing `GET dashboard/orders`, `GET orders/{id}` (receipt).
- [ ] Coupons admin CRUD (percent/fixed, expiry, usage limits).
- [ ] Wishlist add/remove/list.

### 3.3 Payments & Invoicing — `/dashboard/payments`, admin payments/invoices/payway
- [ ] `GET payments` (filters: status, method), `POST payments` (cash/manual), refunds.
- [ ] Invoices: generate from order/payment, `GET/PATCH invoices`, PDF export later.
- [ ] **ABA PayWay integration**: init payment (`payway_card`, `khqr`, `aba_deeplink`, `bakong`), create `payway_batches`, HMAC signing, payment status polling/redirect handling.
- [ ] `POST /webhooks/payway` — verify signature, insert `payway_webhooks`, idempotent processing (`webhook_event` → update payment/order status), retry semantics.

### 3.4 Inventory & Procurement — admin inventory, low-stock, suppliers, POs
- [ ] `GET inventory` per warehouse, low-stock report (`reorder_point`), stock movements history.
- [ ] Stock adjustments/transfers (`movement_reason` enum), serialized `stock_units` states (`in_stock/sold/rma/scrapped`).
- [ ] Suppliers CRUD; Purchase Orders CRUD + lines; PO lifecycle (`po_status`) → receive stock (updates qty_received, inventory, cost).

### 3.5 Service Center — repairs, appointments, warranties
- [ ] Repair jobs: create (job_number), status workflow (`received→…→completed/cancelled`), assign technician, quote approve, `repair_events` timeline, `repair_parts` (consume inventory).
- [ ] Customer repair tracking: lookup by job_number/serial (public `/repairs` page).
- [ ] Appointments: book (slot_at, service, store), approve/complete/cancel.
- [ ] Warranties: auto-create on order/repair completion; claims workflow (`claim_status`), link claim ↔ repair_job (circular FK).
- [ ] Services catalog CRUD (`/pricing` page).

### 3.6 People & Org — employees, technicians, customers, stores, roles
- [ ] Employees/technicians CRUD (employee_code, store, rating, jobs_completed).
- [ ] Customers CRUD + detail (lifetime_spend, orders_count, tier).
- [ ] Stores CRUD (address, hours, tax_rate → feeds `/stores` page).
- [ ] Roles management endpoint matching frontend roles matrix (`admin/roles`).

### 3.7 Support, Content, Misc
- [ ] Support tickets + messages (channel, status flow) → `dashboard/support`.
- [ ] Notifications: list, mark read (per user).
- [ ] Blog posts CRUD (public listing/detail).
- [ ] Plans CRUD (`/pricing`).

### 3.8 Insights & Reporting — admin dashboard/analytics/reports
- [ ] `GET admin/dashboard/summary` — KPIs: revenue, orders, repairs in progress, low stock counts, recent activity.
- [ ] `GET admin/analytics` — sales by period, category/technician breakdowns.
- [ ] Reports: queue generation (`report_status`, pdf/xlsx/csv) → `admin/reports`.
- [ ] `GET audit-logs` (owner/manager only).
- [ ] `GET/PUT settings` (store settings used by admin/settings page).

---

## Phase 4 — Business Logic & Integrity

- [ ] DB transactions around checkout, PO receiving, repair-part consumption.
- [ ] Status-transition guards (enums + allowed-next-state rules) for order/repair/payment/ticket/PO.
- [ ] Counters/denormalized fields kept in sync: `customers.lifetime_spend`, `orders_count`, `employees.jobs_completed`, inventory qty.
- [ ] Warranty expiry checks (scheduled command) → `claim_status=expired`.
- [ ] Seeders: roles, stores, categories, sample products, services, plans, demo users (one per role).

## Phase 5 — Backend Quality Gate

- [ ] Pest feature tests per module (auth, checkout e2e, repair workflow, webhook idempotency).
- [ ] `vendor/bin/pint` + `php artisan test` clean.
- [ ] API documentation (route list / OpenAPI export) as the integration contract.

---

## Phase 6 — Frontend Integration (TwinTech_Frontend)

> Integration surface = 45 direct `@/lib/mock-data` imports across `src/routes/**` and `src/components/shared/global-search.tsx`. Mapping guidance: `DATABASE_SCHEMA.md` §7.

### 6.1 API layer
- [ ] `src/lib/api-client.ts` — fetch wrapper, base URL from `VITE_API_URL`, token header, error normalization, typed responses.
- [ ] `src/lib/types.ts` (or per-module types) — TS types mirroring API resources.
- [ ] `src/services/*.ts` — one file per domain (auth, products, orders, repairs, inventory, payments…).

### 6.2 Auth integration
- [ ] Replace localStorage role mock (`RoleProvider`, `twintech.role`) with real session: login/register/forgot-password pages call backend, store token, load `auth/me` (role + permissions from roles.ts contract).
- [ ] Route guards use server-provided permissions instead of stored role.

### 6.3 Replace mock data module-by-module (use TanStack Query)
Priority order (public → customer → admin):
1. Products, product detail, categories (`routes/products/**`, home page)
2. Stores, pricing/plans, repairs lookup
3. Auth pages + dashboard overview
4. Customer dashboard: orders, payments, repairs, warranty, wishlist, notifications, support, settings
5. Admin: dashboard/analytics, products, orders, customers
6. Admin: inventory, suppliers, purchase-orders, payway/payments, invoices, coupons, reviews
7. Admin: repairs, technicians, appointments, warranty, roles, employees, audit-logs, reports, settings

Per page pattern: `useQuery` for reads, `useMutation` + cache invalidation for writes; keep UI components unchanged where shapes match; adapt field names to API contract.

### 6.4 Global search
- [ ] `global-search.tsx` → backend search endpoint (products/customers/repairs via `pg_trgm`).

### 6.5 Verify
- [ ] `bun run dev` (or `npm run dev`) against local Laravel API; remove `mock-data.ts` imports progressively; final check: zero references to `mock-data.ts`.
- [ ] `bun run lint` / `eslint` + `tsc` clean.

---

## Phase 7 — Hardening & Deployment

- [ ] HTTPS + production CORS; Sanctum token lifetimes/rotation.
- [ ] PayWay webhook secret in env (never committed); webhook replay tests.
- [ ] Postgres backups; note RLS exists in ERD — if Laravel connects as non-superuser, verify grants/RLS bypass role (ERD §14 grants).
- [ ] Laravel deploy (Forge/Vapor/Docker — repo has `docker-compose.yml`); frontend stays on Cloudflare Workers (Nitro) → confirm server-side fetch works in Workers if using `createServerFn` proxy.
- [ ] Monitoring: error reporting already scaffolded frontend-side (`error-capture.ts`); add `laravel/pail` log tailing.

---

## Suggested execution order

```
Phase 1 → 2 → 3.1 → 3.6 (stores/people) → 3.2 → 3.4 → 3.3 → 3.5 → 3.7 → 3.8 → 4 → 5
Then frontend: 6.1 → 6.2 → 6.3 (in listed order) → 6.4 → 6.5 → Phase 7
```

Each API module should be merged + tested before its frontend counterpart starts, so integration is a straight mock→API swap.
