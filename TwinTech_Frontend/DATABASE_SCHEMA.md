# TwinTech Admin Suite — Database Schema & Relationships

> **Note:** This project is currently a frontend prototype using mock data (`src/lib/mock-data.ts`).  
> This document defines the **logical database schema** derived from the data structures, intended  
> as a blueprint for a future backend implementation.

---

## Table of Contents

1. [Entity Relationship Diagram (ERD)](#entity-relationship-diagram)
2. [Core Tables](#core-tables)
3. [Commerce Tables](#commerce-tables)
4. [Service & Repair Tables](#service--repair-tables)
5. [Inventory & Procurement Tables](#inventory--procurement-tables)
6. [Finance & Payment Tables](#finance--payment-tables)
7. [People & Access Tables](#people--access-tables)
8. [Customer Portal Tables](#customer-portal-tables)
9. [Enums & Status Values](#enums--status-values)
10. [Role-Based Access Control](#role-based-access-control)

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│  customers   │──1:N──│    orders     │──1:N──│ order_items  │
└──────┬──────┘       └──────┬───────┘       └──────────────┘
       │                     │
       │ 1:N                 │ 1:1
       │                     ▼
       │              ┌──────────────┐
       │              │  invoices    │
       │              └──────┬───────┘
       │                     │ 1:1
       │                     ▼
       │              ┌──────────────┐
       │              │ transactions │
       │              └──────┬───────┘
       │                     │ N:1
       │                     ▼
       │              ┌──────────────┐
       │              │ payway_      │
       │              │ payments     │
       │              └──────┬───────┘
       │                     │ N:1
       │                     ▼
       │              ┌──────────────┐
       │              │ payway_      │
       │              │ batches      │
       │              └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐       ┌──────────────┐
│ repair_jobs  │──N:1──│  employees   │
└──────┬───────┘       └──────┬───────┘
       │                      │
       │ 1:N                  │ N:1
       ▼                      ▼
┌──────────────┐       ┌──────────────┐
│ repair_      │       │    roles     │
│ timeline     │       └──────────────┘
└──────────────┘
       │
┌──────┴───────┐       ┌──────────────┐
│  products    │──1:N──│  inventory   │
└──────┬───────┘       └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│  product_    │
│  reviews     │
└──────────────┘

┌──────────────┐       ┌──────────────┐
│  suppliers   │──1:N──│ purchase_    │
└──────────────┘       │ orders       │
                       └──────┬───────┘
                              │ 1:N
                              ▼
                       ┌──────────────┐
                       │  po_items    │
                       └──────────────┘

┌──────────────┐       ┌──────────────┐
│  employees   │──1:N──│  audit_logs  │
└──────────────┘       └──────────────┘

┌──────────────┐       ┌──────────────┐
│  customers   │──1:N──│ warranty_    │
└──────────────┘       │ claims       │
                       └──────────────┘

┌──────────────┐       ┌──────────────┐
│  customers   │──1:N──│ appointments │
└──────────────┘       └──────────────┘

┌──────────────┐       ┌──────────────┐
│  customers   │──1:N──│   coupons    │ (usage tracking)
└──────────────┘       └──────────────┘
```

---

## Core Tables

### `customers`

| Column     | Type         | Constraints       | Description                        |
|------------|--------------|-------------------|------------------------------------|
| id         | VARCHAR(10)  | PK                | e.g. `CUS-4821`                   |
| name       | VARCHAR(100) | NOT NULL          | Full name                          |
| email      | VARCHAR(255) | UNIQUE, NOT NULL  | Login / contact email              |
| tier       | ENUM         | NOT NULL          | `Retail`, `Business`, `Enterprise` |
| orders     | INT          | DEFAULT 0         | Total order count (denormalized)   |
| spend      | DECIMAL(12,2)| DEFAULT 0         | Lifetime spend (denormalized)      |
| joined     | YEAR         | NOT NULL          | Account creation year              |
| created_at | TIMESTAMP    | DEFAULT NOW()     | Row creation time                  |
| updated_at | TIMESTAMP    | DEFAULT NOW()     | Last modification time             |

**Relationships:**
- `customers` 1:N `orders`
- `customers` 1:N `repair_jobs`
- `customers` 1:N `invoices`
- `customers` 1:N `warranty_claims`
- `customers` 1:N `appointments`
- `customers` 1:N `product_reviews`

---

### `products`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | VARCHAR(20)    | PK                | e.g. `tt-apex-15`             |
| name       | VARCHAR(200)   | NOT NULL          | Product display name           |
| brand      | VARCHAR(100)   | NOT NULL          | Brand / manufacturer           |
| category   | VARCHAR(50)    | FK → categories   | Product category               |
| price      | DECIMAL(10,2)  | NOT NULL          | Current selling price (USD)    |
| compare_at | DECIMAL(10,2)  | NULLABLE          | Original / MSRP price          |
| rating     | DECIMAL(2,1)   | DEFAULT 0         | Average star rating (0–5)      |
| reviews    | INT            | DEFAULT 0         | Review count (denormalized)    |
| stock      | INT            | DEFAULT 0         | Available stock quantity       |
| sku        | VARCHAR(20)    | UNIQUE, NOT NULL  | Stock Keeping Unit code        |
| badge      | VARCHAR(30)    | NULLABLE          | e.g. `Best seller`, `New`, `Low stock`, `Out of stock` |
| blurb      | TEXT           | NOT NULL          | Short marketing description    |
| created_at | TIMESTAMP      | DEFAULT NOW()     |                                |
| updated_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**JSON Column — `specs`:**

| Field        | Type    | Description                     |
|--------------|---------|---------------------------------|
| cpu          | VARCHAR | Processor model                 |
| gpu          | VARCHAR | Graphics card model             |
| ram          | VARCHAR | Memory config                   |
| storage      | VARCHAR | Storage config                  |
| motherboard  | VARCHAR | Motherboard model               |
| warranty     | VARCHAR | Warranty term                   |

**Relationships:**
- `products` N:1 `categories`
- `products` 1:N `order_items`
- `products` 1:N `inventory`
- `products` 1:N `product_reviews`

---

### `categories`

| Column | Type        | Constraints | Description           |
|--------|-------------|-------------|-----------------------|
| id     | INT         | PK, AUTO    | Auto-increment        |
| name   | VARCHAR(50) | UNIQUE      | e.g. `Laptops`        |
| count  | INT         | DEFAULT 0   | Product count         |
| icon   | VARCHAR(50) | NOT NULL    | Lucide icon name      |

**Relationships:**
- `categories` 1:N `products`

---

## Commerce Tables

### `orders`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | VARCHAR(10)    | PK                | e.g. `TT-10428`               |
| customer_id| VARCHAR(10)    | FK → customers    | Ordering customer              |
| items      | INT            | NOT NULL          | Line-item count (denormalized) |
| total      | DECIMAL(10,2)  | NOT NULL          | Order total (USD)              |
| status     | ENUM           | NOT NULL          | `Pending`, `Paid`, `Fulfilled`, `Refunded`, `Cancelled` |
| method     | VARCHAR(30)    | NOT NULL          | `ABA PayWay`, `KHQR`, `Card`, `Cash` |
| date       | DATE           | NOT NULL          | Order date                     |
| created_at | TIMESTAMP      | DEFAULT NOW()     |                                |
| updated_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `orders` N:1 `customers`
- `orders` 1:N `order_items`
- `orders` 1:1 `invoices`
- `orders` 1:N `transactions`
- `orders` 1:N `payway_payments`

---

### `order_items`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | INT            | PK, AUTO          |                                |
| order_id   | VARCHAR(10)    | FK → orders       | Parent order                   |
| product_id | VARCHAR(20)    | FK → products     | Purchased product              |
| quantity   | INT            | NOT NULL          | Units ordered                  |
| unit_price | DECIMAL(10,2)  | NOT NULL          | Price at time of order         |
| total      | DECIMAL(10,2)  | NOT NULL          | Line total (qty × unit_price)  |

**Relationships:**
- `order_items` N:1 `orders`
- `order_items` N:1 `products`

---

### `invoices`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | VARCHAR(10)    | PK                | e.g. `INV-20428`              |
| customer_id| VARCHAR(10)    | FK → customers    | Bill-to customer               |
| order_id   | VARCHAR(10)    | FK → orders, UNIQUE | 1:1 with order              |
| amount     | DECIMAL(10,2)  | NOT NULL          | Invoice amount (USD)           |
| issued     | DATE           | NOT NULL          | Issue date                     |
| due        | DATE           | NULLABLE          | Payment due date               |
| status     | ENUM           | NOT NULL          | `Paid`, `Pending`, `Refunded`  |
| created_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `invoices` N:1 `customers`
- `invoices` N:1 `orders` (1:1)

---

### `coupons`

| Column  | Type           | Constraints | Description                              |
|---------|----------------|-------------|------------------------------------------|
| code    | VARCHAR(20)    | PK          | Coupon code, e.g. `BACKTOWORK15`        |
| type    | ENUM           | NOT NULL    | `Percent`, `Fixed`                       |
| value   | VARCHAR(10)    | NOT NULL    | e.g. `15%`, `$20`                       |
| uses    | INT            | DEFAULT 0   | Redemption count                         |
| cap     | INT            | NOT NULL    | Max redemptions                          |
| expires | DATE           | NOT NULL    | Expiration date                          |
| status  | ENUM           | NOT NULL    | `Active`, `Expired`                      |

---

### `product_reviews`

| Column      | Type           | Constraints       | Description                    |
|-------------|----------------|-------------------|--------------------------------|
| id          | VARCHAR(10)    | PK                | e.g. `REV-881`                 |
| product_id  | VARCHAR(20)    | FK → products     | Reviewed product               |
| customer_id | VARCHAR(10)    | FK → customers    | Reviewer                       |
| rating      | INT            | NOT NULL          | 1–5 stars                      |
| comment     | TEXT           | NOT NULL          | Review text                    |
| date        | DATE           | NOT NULL          | Review date                    |
| status      | ENUM           | NOT NULL          | `Approved`, `Pending`          |

**Relationships:**
- `product_reviews` N:1 `products`
- `product_reviews` N:1 `customers`

---

## Service & Repair Tables

### `repair_jobs`

| Column       | Type           | Constraints       | Description                    |
|--------------|----------------|-------------------|--------------------------------|
| id           | VARCHAR(10)    | PK                | e.g. `RPR-2481`               |
| customer_id  | VARCHAR(10)    | FK → customers    | Device owner                   |
| technician_id| VARCHAR(10)    | FK → employees    | Assigned technician            |
| device       | VARCHAR(100)   | NOT NULL          | Device make/model              |
| issue        | VARCHAR(200)   | NOT NULL          | Problem description            |
| status       | ENUM           | NOT NULL          | See [RepairStatus](#repairstatus) |
| cost         | DECIMAL(10,2)  | DEFAULT 0         | Estimated / final cost (USD)   |
| due          | DATE           | NULLABLE          | Expected completion date       |
| priority     | ENUM           | NOT NULL          | `High`, `Normal`, `Low`        |
| created_at   | TIMESTAMP      | DEFAULT NOW()     |                                |
| updated_at   | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `repair_jobs` N:1 `customers`
- `repair_jobs` N:1 `employees` (technician)
- `repair_jobs` 1:N `repair_timeline`
- `repair_jobs` 1:N `appointments` (service link)
- `repair_jobs` 1:N `warranty_claims`

---

### `repair_timeline`

| Column      | Type           | Constraints       | Description                    |
|-------------|----------------|-------------------|--------------------------------|
| id          | INT            | PK, AUTO          |                                |
| repair_id   | VARCHAR(10)    | FK → repair_jobs  | Parent repair job              |
| label       | VARCHAR(100)   | NOT NULL          | Step name, e.g. "Device received" |
| at          | VARCHAR(30)    | NOT NULL          | Timestamp or "Pending"         |
| note        | TEXT           | NOT NULL          | Step detail / technician note  |
| done        | BOOLEAN        | DEFAULT false     | Step completed flag            |
| active      | BOOLEAN        | DEFAULT false     | Currently in-progress step     |

**Relationships:**
- `repair_timeline` N:1 `repair_jobs`

---

### `appointments`

| Column      | Type           | Constraints       | Description                    |
|-------------|----------------|-------------------|--------------------------------|
| id          | VARCHAR(10)    | PK                | e.g. `APT-2201`               |
| customer_id | VARCHAR(10)    | FK → customers    | Booking customer               |
| service     | VARCHAR(100)   | NOT NULL          | Service type                   |
| branch      | VARCHAR(100)   | NOT NULL          | Store branch                   |
| tech        | VARCHAR(50)    | NOT NULL          | Assigned technician name       |
| slot        | VARCHAR(30)    | NOT NULL          | Scheduled date/time            |
| status      | ENUM           | NOT NULL          | `Approved`, `Pending`, `Processing`, `Cancelled` |

**Relationships:**
- `appointments` N:1 `customers`
- `appointments` can link to `repair_jobs` (service connection)

---

### `warranty_claims`

| Column      | Type           | Constraints       | Description                    |
|-------------|----------------|-------------------|--------------------------------|
| id          | VARCHAR(10)    | PK                | e.g. `WTY-771`                |
| customer_id | VARCHAR(10)    | FK → customers    | Claimant                       |
| device      | VARCHAR(100)   | NOT NULL          | Device name                    |
| serial      | VARCHAR(30)    | NOT NULL          | Serial number                  |
| opened      | DATE           | NOT NULL          | Claim opened date              |
| coverage    | VARCHAR(30)    | NOT NULL          | e.g. `Until Mar 2027`, `Expired Jun 2026` |
| status      | ENUM           | NOT NULL          | `Processing`, `Approved`, `Completed`, `Expired` |

**Relationships:**
- `warranty_claims` N:1 `customers`
- `warranty_claims` can reference `repair_jobs`
- `warranty_claims` references product serial (links to `inventory.serials`)

---

## Inventory & Procurement Tables

### `inventory`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | INT            | PK, AUTO          |                                |
| sku        | VARCHAR(20)    | FK → products.sku | Product SKU                    |
| name       | VARCHAR(100)   | NOT NULL          | Product name (denormalized)    |
| warehouse  | VARCHAR(50)    | NOT NULL          | e.g. `Phnom Penh · A1`        |
| stock      | INT            | DEFAULT 0         | Current stock count            |
| reorder    | INT            | NOT NULL          | Reorder point threshold        |
| serials    | INT            | DEFAULT 0         | Serialized unit count          |
| value      | DECIMAL(12,2)  | DEFAULT 0         | Total inventory value (USD)    |
| status     | ENUM           | NOT NULL          | `Healthy`, `Low`, `Out`        |
| updated_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `inventory` N:1 `products` (via SKU)
- `inventory` 1:N `serial_units` (individual serial records)

---

### `serial_units`

| Column      | Type           | Constraints       | Description                    |
|-------------|----------------|-------------------|--------------------------------|
| id          | INT            | PK, AUTO          |                                |
| sku         | VARCHAR(20)    | FK → products.sku | Parent product SKU             |
| serial      | VARCHAR(30)    | UNIQUE, NOT NULL  | Unit serial / barcode          |
| purchase_order_id | VARCHAR(10) | FK → purchase_orders | Received via PO          |
| warranty_until | DATE        | NULLABLE          | Warranty expiration            |
| status      | ENUM           | NOT NULL          | `In stock`, `Sold`, `Returned`, `In service` |
| owner_id    | VARCHAR(10)    | FK → customers    | Current asset owner (if sold)  |
| created_at  | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `serial_units` N:1 `products`
- `serial_units` N:1 `purchase_orders`
- `serial_units` N:1 `customers` (asset owner)
- `serial_units` 1:N `warranty_claims`
- `serial_units` 1:N `repair_jobs` (via device serial)

---

### `suppliers`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | VARCHAR(10)    | PK                | e.g. `SUP-101`                |
| name       | VARCHAR(100)   | NOT NULL          | Company name                   |
| contact    | VARCHAR(200)   | NOT NULL          | Contact email                  |
| category   | VARCHAR(50)    | NOT NULL          | Supply category                |
| lead_time  | VARCHAR(20)    | NOT NULL          | e.g. `5 days`, `12 days`      |
| open_pos   | INT            | DEFAULT 0         | Open purchase orders (denormalized) |
| spend      | DECIMAL(12,2)  | DEFAULT 0         | Total spend (denormalized)     |
| status     | ENUM           | NOT NULL          | `Active`, `On leave`, `Inactive` |
| created_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `suppliers` 1:N `purchase_orders`

---

### `purchase_orders`

| Column      | Type           | Constraints       | Description                    |
|-------------|----------------|-------------------|--------------------------------|
| id          | VARCHAR(10)    | PK                | e.g. `PO-3391`                |
| supplier_id | VARCHAR(10)    | FK → suppliers    | Ordering supplier              |
| items       | INT            | NOT NULL          | Line-item count                |
| total       | DECIMAL(10,2)  | NOT NULL          | PO total (USD)                 |
| eta         | DATE           | NOT NULL          | Expected delivery date         |
| status      | ENUM           | NOT NULL          | `Pending`, `Approved`, `Processing`, `Completed`, `Cancelled` |
| raised      | DATE           | NOT NULL          | PO creation date               |
| created_at  | TIMESTAMP      | DEFAULT NOW()     |                                |
| updated_at  | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `purchase_orders` N:1 `suppliers`
- `purchase_orders` 1:N `po_items`

---

### `po_items`

| Column          | Type           | Constraints       | Description                    |
|-----------------|----------------|-------------------|--------------------------------|
| id              | INT            | PK, AUTO          |                                |
| purchase_order_id | VARCHAR(10) | FK → purchase_orders | Parent PO                  |
| product_id      | VARCHAR(20)    | FK → products     | Ordered product                |
| quantity        | INT            | NOT NULL          | Units ordered                  |
| unit_cost       | DECIMAL(10,2)  | NOT NULL          | Cost per unit (USD)            |

**Relationships:**
- `po_items` N:1 `purchase_orders`
- `po_items` N:1 `products`

---

## Finance & Payment Tables

### `transactions`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | VARCHAR(15)    | PK                | e.g. `ABA-9F27C1`             |
| order_id   | VARCHAR(10)    | FK → orders       | Related order                  |
| amount     | DECIMAL(10,2)  | NOT NULL          | Transaction amount (negative = refund) |
| status     | ENUM           | NOT NULL          | `Settled`, `Pending`, `Refunded`, `Failed` |
| channel    | VARCHAR(30)    | NOT NULL          | `ABA PayWay`, `KHQR`, `Card`  |
| fee        | DECIMAL(10,2)  | DEFAULT 0         | Processing fee (USD)           |
| at         | VARCHAR(30)    | NOT NULL          | Transaction timestamp          |
| created_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `transactions` N:1 `orders`
- `transactions` 1:N `payway_payments` (detailed PayWay record)

---

### `payway_payments`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| tran       | VARCHAR(15)    | PK → transactions | FK to transaction              |
| order_id   | VARCHAR(10)    | FK → orders       | Related order                  |
| customer_id| VARCHAR(10)    | FK → customers    | Payer                          |
| method     | ENUM           | NOT NULL          | `ABA PayWay card`, `KHQR`, `ABA Pay deeplink`, `Bakong wallet` |
| amount     | DECIMAL(10,2)  | NOT NULL          | Gross amount (USD)             |
| fee        | DECIMAL(10,2)  | NOT NULL          | Processing fee (USD)           |
| net        | DECIMAL(10,2)  | NOT NULL          | Net amount after fee (USD)     |
| status     | ENUM           | NOT NULL          | `Settled`, `Pending`, `Refunded`, `Failed` |
| batch      | VARCHAR(15)    | NULLABLE          | Settlement batch ID            |
| at         | VARCHAR(30)    | NOT NULL          | Transaction timestamp          |
| auth_code  | VARCHAR(10)    | NULLABLE          | Authorization code             |
| created_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `payway_payments` N:1 `transactions`
- `payway_payments` N:1 `orders`
- `payway_payments` N:1 `customers`
- `payway_payments` N:1 `payway_batches`

---

### `payway_batches`

| Column   | Type           | Constraints       | Description                    |
|----------|----------------|-------------------|--------------------------------|
| batch    | VARCHAR(15)    | PK                | e.g. `PWB-2607-01`           |
| window   | VARCHAR(30)    | NOT NULL          | Settlement window              |
| count    | INT            | NOT NULL          | Transactions in batch          |
| gross    | DECIMAL(12,2)  | NOT NULL          | Total gross amount (USD)       |
| fees     | DECIMAL(10,2)  | NOT NULL          | Total fees (USD)               |
| expected | DECIMAL(12,2)  | NOT NULL          | Expected net (USD)             |
| posted   | DECIMAL(12,2)  | NOT NULL          | Actually posted net (USD)      |
| status   | ENUM           | NOT NULL          | `Settled`, `Pending`, `Failed` |
| created_at | TIMESTAMP    | DEFAULT NOW()     |                                |

**Relationships:**
- `payway_batches` 1:N `payway_payments`

---

### `payway_webhooks`

| Column   | Type           | Constraints       | Description                    |
|----------|----------------|-------------------|--------------------------------|
| id       | VARCHAR(10)    | PK                | e.g. `WHK-88214`              |
| event    | VARCHAR(50)    | NOT NULL          | e.g. `transaction.settled`     |
| tran     | VARCHAR(15)    | FK → transactions | Related transaction            |
| code     | INT            | NOT NULL          | HTTP response code             |
| attempts | INT            | DEFAULT 1         | Delivery attempt count         |
| at       | VARCHAR(30)    | NOT NULL          | Webhook timestamp              |
| status   | ENUM           | NOT NULL          | `Completed`, `Failed`, `Processing` |

**Relationships:**
- `payway_webhooks` N:1 `transactions`

---

### `payway_volume`

| Column | Type           | Constraints | Description              |
|--------|----------------|-------------|--------------------------|
| month  | VARCHAR(10)    | PK          | e.g. `Jul`               |
| volume | DECIMAL(12,2)  | NOT NULL    | Monthly payment volume   |

> *Aggregate / analytics table — not directly linked via FK.*

---

## People & Access Tables

### `employees`

| Column     | Type           | Constraints       | Description                    |
|------------|----------------|-------------------|--------------------------------|
| id         | VARCHAR(10)    | PK                | e.g. `EMP-11`                 |
| name       | VARCHAR(100)   | NOT NULL          | Full name                      |
| role       | VARCHAR(50)    | NOT NULL          | Job title                      |
| team       | VARCHAR(30)    | NOT NULL          | `Repairs`, `Warehouse`, `Retail` |
| jobs       | INT            | DEFAULT 0         | Completed jobs (denormalized)  |
| rating     | DECIMAL(2,1)   | DEFAULT 0         | Performance rating (0–5)       |
| status     | ENUM           | NOT NULL          | `Active`, `On leave`           |
| created_at | TIMESTAMP      | DEFAULT NOW()     |                                |

**Relationships:**
- `employees` 1:N `repair_jobs` (as technician)
- `employees` 1:N `audit_logs` (as actor)
- `employees` N:1 `roles` (system role assignment)

---

### `roles`

| Column | Type        | Constraints | Description              |
|--------|-------------|-------------|--------------------------|
| id     | VARCHAR(20) | PK          | e.g. `owner`, `manager`  |
| label  | VARCHAR(50) | NOT NULL    | Display name             |
| description | TEXT  | NOT NULL    | Role description         |

**Permission assignments** (defined in `src/lib/roles.ts`):

| Role         | Permissions                                          |
|--------------|------------------------------------------------------|
| `owner`      | insights, commerce, payments, inventory, service, people, settings, portal |
| `manager`    | insights, commerce, payments, inventory, service, portal |
| `technician` | service, portal                                      |
| `cashier`    | commerce, payments, portal                           |
| `customer`   | portal                                               |

---

### `audit_logs`

| Column   | Type           | Constraints       | Description                    |
|----------|----------------|-------------------|--------------------------------|
| id       | VARCHAR(10)    | PK                | e.g. `LOG-99120`              |
| actor    | VARCHAR(100)   | NOT NULL          | User or `System`               |
| action   | VARCHAR(100)   | NOT NULL          | e.g. `Updated price`, `Adjusted stock` |
| target   | VARCHAR(50)    | NOT NULL          | Affected entity ID / SKU       |
| ip       | VARCHAR(45)    | NOT NULL          | Source IP address              |
| at       | VARCHAR(30)    | NOT NULL          | Event timestamp                |
| severity | ENUM           | NOT NULL          | `Active`, `Pending`, `Failed`  |
| created_at | TIMESTAMP    | DEFAULT NOW()     |                                |

**Relationships:**
- `audit_logs` references `employees` (actor)
- `audit_logs.target` can reference any entity (polymorphic)

---

## Customer Portal Tables

### `support_tickets`

| Column      | Type           | Constraints       | Description                    |
|-------------|----------------|-------------------|--------------------------------|
| id          | VARCHAR(10)    | PK                | e.g. `TCK-5521`               |
| subject     | VARCHAR(200)   | NOT NULL          | Ticket subject                 |
| channel     | VARCHAR(20)    | NOT NULL          | `Email`, `Phone`, `Chat`       |
| opened      | DATE           | NOT NULL          | Creation date                  |
| agent       | VARCHAR(50)    | NULLABLE          | Assigned agent name            |
| status      | ENUM           | NOT NULL          | `Processing`, `Approved`, `Completed` |

---

### `reports_list`

| Column   | Type           | Constraints | Description                              |
|----------|----------------|-------------|------------------------------------------|
| id       | VARCHAR(10)    | PK          | e.g. `RPT-01`                           |
| name     | VARCHAR(100)   | NOT NULL    | Report name                              |
| scope    | VARCHAR(50)    | NOT NULL    | e.g. `All branches`, `Warehouses`       |
| period   | VARCHAR(20)    | NOT NULL    | e.g. `Jul 2026`, `Q2 2026`              |
| format   | VARCHAR(5)     | NOT NULL    | `PDF`, `XLSX`, `CSV`                     |
| status   | ENUM           | NOT NULL    | `Completed`, `Processing`, `Pending`     |

---

### `notifications`

| Column | Type        | Constraints | Description                          |
|--------|-------------|-------------|--------------------------------------|
| id     | INT         | PK, AUTO    |                                      |
| title  | VARCHAR(200)| NOT NULL    | Notification text                    |
| time   | VARCHAR(30) | NOT NULL    | Relative time, e.g. `12 min ago`     |
| type   | ENUM        | NOT NULL    | `info`, `success`, `warning`, `danger` |

---

## Enums & Status Values

### `RepairStatus`

Used in `repair_jobs.status`:

| Value             | Badge Color | Description                        |
|-------------------|-------------|------------------------------------|
| `Received`        | Secondary   | Device intake logged               |
| `Diagnosing`      | Warning     | Under technical diagnosis          |
| `Awaiting parts`  | Warning     | Waiting for replacement parts      |
| `In repair`       | Soft        | Active repair work                 |
| `Quality check`   | Soft        | Post-repair QC validation          |
| `Ready`           | Success     | Ready for customer pickup          |
| `Completed`       | Success     | Handed over to customer            |

### `PayWayMethod`

Used in `payway_payments.method`:

| Value                  | Description                          |
|------------------------|--------------------------------------|
| `ABA PayWay card`      | Credit/debit card via ABA PayWay     |
| `KHQR`                 | QR code scan-to-pay                  |
| `ABA Pay deeplink`     | ABA Mobile app deep link             |
| `Bakong wallet`        | Bakong digital wallet                |

### Order Status

| Value       | Badge Color | Description                        |
|-------------|-------------|------------------------------------|
| `Pending`   | Warning     | Awaiting payment                   |
| `Paid`      | Success     | Payment received                   |
| `Fulfilled` | Success     | Order shipped / delivered          |
| `Refunded`  | Destructive | Refund processed                   |
| `Cancelled` | Destructive | Order cancelled                    |

### Inventory Status

| Value      | Badge Color | Description                        |
|------------|-------------|------------------------------------|
| `Healthy`  | Success     | Stock above reorder point          |
| `Low`      | Warning     | Stock at or below reorder point    |
| `Out`      | Destructive | Zero stock                         |

### Purchase Order Status

| Value        | Badge Color | Description                        |
|--------------|-------------|------------------------------------|
| `Pending`    | Warning     | Awaiting approval                  |
| `Approved`   | Success     | Approved, awaiting processing      |
| `Processing` | Warning     | Being fulfilled by supplier        |
| `Completed`  | Success     | Received and checked in            |
| `Cancelled`  | Destructive | PO cancelled                       |

---

## Role-Based Access Control

**File:** `src/lib/roles.ts`

### Permissions

| Permission   | Label                        | Routes                                                 |
|--------------|--------------------------------------------------------------|--------------------------------------------------------|
| `insights`   | Insights & analytics             | `/admin/analytics`, `/admin/reports`, `/admin`         |
| `commerce`   | Orders, products & promos        | `/admin/orders`, `/admin/products`, `/admin/coupons`, `/admin/reviews` |
| `payments`   | Payments & invoicing             | `/admin/payments`, `/admin/payway`, `/admin/invoices`  |
| `inventory`  | Inventory & procurement          | `/admin/inventory`, `/admin/suppliers`, `/admin/purchase-orders` |
| `service`    | Repair & service desk            | `/admin/repairs`, `/admin/technicians`, `/admin/appointments`, `/admin/warranty` |
| `people`     | People, roles & audit            | `/admin/customers`, `/admin/employees`, `/admin/roles`, `/admin/audit-logs` |
| `settings`   | Workspace settings               | `/admin/settings`                                      |
| `portal`     | Customer portal                  | `/dashboard`                                           |

### Role → Permission Matrix

```
Permission     │ Owner │ Manager │ Technician │ Cashier │ Customer
───────────────┼───────┼─────────┼────────────┼─────────┼──────────
insights       │  ✔    │   ✔     │            │         │
commerce       │  ✔    │   ✔     │            │   ✔     │
payments       │  ✔    │   ✔     │            │   ✔     │
inventory      │  ✔    │   ✔     │            │         │
service        │  ✔    │   ✔     │     ✔      │         │
people         │  ✔    │         │            │         │
settings       │  ✔    │         │            │         │
portal         │  ✔    │   ✔     │     ✔      │   ✔     │   ✔
```

---

## Summary Statistics

| Entity Count       | Value |
|--------------------|-------|
| Core tables        | 3     |
| Commerce tables    | 5     |
| Service tables     | 4     |
| Inventory tables   | 4     |
| Finance tables     | 5     |
| People tables      | 3     |
| Portal tables      | 3     |
| **Total tables**   | **27**|
| Enum types         | 10+   |
| Role types         | 5     |
| Permission types   | 8     |
