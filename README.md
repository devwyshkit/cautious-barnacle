# WyshKit 2026

**Last-minute gifts, personalised. Delivered in minutes.**

> *"We are what Swiggy would be if they delivered personalised gifts instead of biryani."*

---

## What We Are

```
Swiggy Food   = Restaurant → Cooks food → 3PL Delivery
WyshKit       = Local vendor → Personalises product → 3PL Delivery
```

One local vendor. One cart. One delivery. Always.

We are **not** a gifting marketplace. We are **not** quick commerce. We are **not** a design tool.

We are a **hyperlocal product marketplace** where local vendors sell physical goods with optional personalisation, and we handle digital discovery and last-mile delivery.

---

## 🦉 The Swiggy 2026 Mental Model

WyshKit is a fusion of two battle-tested operational models with one unique twist, governed by the **Laws of Elite UX** (Miller's Law, Fitts' Law).

**The Operational Equation:**
```
WyshKit = [Swiggy Food Logistics] + [Instamart Product Catalog] + [Personalization Workflow]
```

### Like Swiggy Food (Logistics)
- **One Vendor, One Order, One Delivery** — enforced at the DB level via `check_cart_vendor_consistency`. Not the app.
- **Time > Distance** — SLA is DB-computed (`promised_delivery_at`). Never shown as km. Always shown as "Arriving by 5:15 PM".
- **No CapEx** — Zero fleet. Zero dark stores. Zero inventory. 3PL (Shadowfax/Porter) handles delivery. We take margin.

### Like Instamart (Catalog)
- **Physical Hard Goods** — Products have dimensions, weight, shelf-life, material. Metrics are hard requirements.
- **50–100 curated SKUs per neighbourhood** — Not 10,000 pan-India SKUs. Depth over breadth.

### The Unique WyshKit Twist (Personalization)
- **Production Time = Cooking Time** — The SLA math for engraving/embroidery is identical to Swiggy's kitchen prep SLA model.
- **Preview Trust Moat** — The digital mockup (NOT a photo) is the commitment signal. Fiverr applied to physical goods.

---

## The Three Core Beliefs (Non-Negotiable)

### 1. Commitment Before Creativity
Pay 100% upfront. Then personalise. Always in that order.

| ❌ Traditional E-Commerce | ✅ WyshKit |
|---|---|
| Design → Cart → Pay | Pay → Design details → Preview → Approve → Production |
| High ghost orders | Zero ghost orders (payment = commitment) |
| Vendor designs for maybes | Vendor designs only for paying customers |
| Inventory blocked for unpaid orders | Inventory only committed post-payment |

**Implementation**: Personalisation is a toggle in the product sheet ("+₹X"). No input. No canvas. Just a flag. Details collected only after payment. This is the entire unlock.

### 2. Hyperlocal Time > Distance
We never show distance in km. We always show when it arrives.

Users don't care if a vendor is 2km or 5km away. They care: *"Will this arrive by 5 PM?"*

- ✅ "Arriving by 5:15 PM"
- ✅ "~45 min"
- ❌ "2.4 km away"
- ❌ "Nearby"

**Implementation**: `promised_delivery_at` is computed server-side using `calculate_promised_delivery_time()` RPC. Frontend never computes ETAs.

### 3. Preview Trust > Price Competition
A digital mockup before production = near-zero returns = premium pricing justified.

**The Liability Shift**: Customer approves (`Slide to Approve`) → `liability_shifted_at` is set in DB → item is non-refundable → production begins. Physical item is never touched until approval.

**Return rate**: Approaches zero for personalised items post-approval. This is the business model.

---

## 🏗️ Engineering Principles (Zero Reinvention)

These are the exact principles used. None invented. All borrowed from the best. See the [Engineering Conventions](docs/SWIGGY_2026_ENGINEERING_CONVENTIONS.md) for the full rulebook.

### 1. Database = Single Source of Truth
*Principle: Martin Fowler's Canonical Schema + PostgreSQL as an application platform.*

- All pricing computed in Postgres (`calculate_order_total`, `get_checkout_context`).
- All state transitions enforced in Postgres (`transition_order`).
- All mutations are atomic (`execute_cart_mutation`, `place_atomic_order`).
- Frontend reads only. Frontend never computes. **Zero Shadow Math.**

### 2. RPC-First API Design
*Principle: Stored procedure pattern, inherited from Oracle APEX / Supabase best practices.*

Every user-initiated mutation calls exactly one RPC. No chaining. No multi-trip. One round trip.

| Action | RPC |
|---|---|
| Add to cart | `execute_cart_mutation(p_mode='ADD')` |
| Update quantity | `execute_cart_mutation(p_mode='SET')` |
| Load checkout | `get_checkout_context()` |
| Place order | `place_atomic_order()` |
| Transition status | `transition_order()` |
| Submit personalisation | `submit_order_personalization()` |
| Approve preview | `approve_order_preview()` |

### 3. SECURITY DEFINER + Explicit search_path
*Principle: OWASP Secure Coding — prevent search_path injection.*

All RPCs are `SECURITY DEFINER` with `SET search_path TO 'public', 'extensions'`. Never `''`. Never implicit. This isolates function execution context from the calling session's privileges while retaining access to PostGIS and extensions.

### 4. RLS as the Policy Engine
*Principle: RBAC at the data layer (not app layer). Row-Level Security as enforcement, not suggestion.*

- Policies enforce user ↔ data ownership. No app-layer guards needed.
- `SECURITY DEFINER` RPCs bypass RLS intentionally for trusted internal operations only.
- All tables exposed to PostgREST have RLS enabled.

### 5. Unified Commerce Intent Engine
*Principle: Command Pattern (GoF) + Discriminated Union (Algebraic Data Types).*

All commerce mutations flow through a single typed entry point: `executeCommerceIntent(intent)`.

```typescript
// Every mutation is one of these. Nothing else.
type CommerceIntent =
  | { intent: 'ADD_TO_CART';          payload: { product_id, quantity, ... } }
  | { intent: 'UPDATE_CART_QUANTITY'; payload: { product_id, quantity } }
  | { intent: 'PLACE_ORDER';          payload: { razorpay_order_id, ... } }
  | { intent: 'TRANSITION_ORDER';     payload: { order_id, target_status } }
  | { intent: 'APPLY_COUPON';         payload: { code } }
  | { intent: 'TOGGLE_WALLET';        payload: { enabled } }
  | { intent: 'SET_ADDRESS';          payload: { address_id } }
  | ...
```

Validated with Zod. Logged with OpenTelemetry spans. One function to test. One function to audit.

### 6. Table-Driven State Machine (FSM)
*Principle: State Machine pattern — valid transitions stored in DB, not hardcoded in TypeScript.*

Order status is a Postgres enum:
```
PLACED → CONFIRMED → IN_PRODUCTION → PACKED → RIDER_ASSIGNED →
ARRIVED_PICKUP → OUT_FOR_DELIVERY → ARRIVED_DROP → DELIVERED

                                    ↘ CANCELLED → REFUNDED
```

`transition_order()` validates transitions atomically. No TypeScript FSM. No hardcoded `if status === X → allow Y`.

### 7. Zero Shadow Math
*Principle: Single Source of Truth for calculations — Fowler's "Calculation Encapsulation".*

- Cart total: computed by `get_cart_context()`, never in React.
- Delivery fee: computed by `calculate_order_total()` in Postgres.
- Refunds: computed by `recalculate_order_total()` after line-item cancellations.
- Cashback: computed by `credit_cashback()` RPC post-delivery.

### 8. Observability-First
*Principle: OpenTelemetry standard (CNCF) — instrument everything, not just errors.*

Every commerce intent is wrapped in `withTrace()`. Traces capture `intent`, `user_id`, `session_id`. Errors are logged via structured `logger.error()`. No `console.log` in production paths.

### 9. Idempotency Keys
*Principle: Exactly-once delivery semantics (distributed systems).*

`place_atomic_order()` uses `idempotency_key` (indexed unique). Double-submitting a payment returns the same order. No double charges. No duplicate orders.

### 10. FK Indexes = Join Performance
*Principle: PostgreSQL FK indexing best practice (unlike MySQL, Postgres does not auto-index FKs).*

Every foreign key in the `public` schema has a covering index. Verified via `pg_constraint` + `pg_index` cross-audit. 100% coverage. No sequential scans on join paths.

---

## 🎨 Design Principles (Zero Reinvention)

### 1. Sheet vs Page — The Law
*Principle: Progressive Disclosure + Mental Model Continuity (Nielsen Norman Group).*

| Surface | Pattern | Reason |
|---|---|---|
| Product detail | **Sheet** (intercepted route) | Browsing context – no domain shift |
| Cart | **Floating bar + Cart Drawer (Sheet)** | Transient, immersive, no URL needed |
| Location picker | **Sheet** | Sub-decision within home |
| Address picker | **Sheet** (within checkout) | Sub-decision within checkout |
| Vendor storefront | **Page** `/vendor/[slug]` | Domain shift |
| Checkout | **Page** `/checkout` | Money commitment |
| Order tracking | **Page** `/orders/[id]` | URL-addressable, supports deep-links |
| Preview mockup | **Inline in tracking page** | NOT a new sheet or screen |
| Post-delivery rating | **Inline in tracking page** | Deferred, NOT a forced prompt |
| Support | **Sheet** | Overlay on current context |

### 2. Mobile-First, Interaction-Decision Architecture
*Principle: Mobile-first design (Luke Wroblewski) + Fitts' Law for tap targets.*

- Primary action is always a large sticky footer button or `SlideToPay` gesture on mobile.
- Destructive actions require inline double-confirm (never `window.confirm()`).
- Desktop: `Place Order` button. Mobile: `Slide to Pay` gesture. Same RPC. Different affordance.

### 3. Progressive Disclosure
*Principle: Miller's Law (7±2 items in working memory) — reveal complexity on demand.*

- Coupon slot: collapsed by default. "Have a promo code?" tap to expand.
- GSTIN: collapsed. "Business purchase? Add GSTIN" tap to expand.
- Support section: only shown if `NEXT_PUBLIC_SUPPORT_WHATSAPP` env var is set. Never a dead link.

### 4. Deferred Feedback
*Principle: Non-interrupting UX (Krug's "Don't Make Me Think") — don't interrupt the flow.*

- **Miller's Law (UX)**: Never overwhelm. We limit primary actions to 7±2 items. Reveal complexity only when the user is ready (Progressive Disclosure).
- **Fitts' Law (Interactions)**: Primary buttons are large, high-contrast, and "thumb-friendly" on mobile (e.g., `Slide to Pay`).
- Rating prompt: NOT at delivery moment. Appears 30 mins post-delivery, OR on next app open, OR via push.
- Cashback toast: shown post-delivery. Not a modal. Not blocking.

### 5. Emotional Copy, Not Technical Copy
*Principle: Jobs-to-be-Done theory (Clayton Christensen) — sell the outcome, not the feature.*

| ❌ Technical | ✅ Emotional |
|---|---|
| "Hyperlocal personalised commerce" | "Last-minute gifts, personalised. Delivered in minutes." |
| "Add GSTIN" | "Business purchase? Add GSTIN" |
| "vendor panel" | "your shop" |
| "Design Hub" | (never used) |

---

## 📦 Product Flow (Canonical, Linear)

### Step 1 — Home Feed `/`
- Location resolved once at session start. Never per-page.
- Feed: `BANNER_BENTO → CIRCLE_RAIL (categories) → VENDOR_GROUPED_GRID`
- Each product card: photo · name · price · **"~45 min"** ETA chip (never km) · add button

### Step 2 — Product Sheet (intercepted route, no page reload)
Content order (mandatory):
1. Image carousel
2. Name · vendor badge · star rating
3. Price (large, prominent)
4. Variants (chips)
5. Add-ons (toggles/steppers)
6. **"Add personalisation +₹X"** — toggle only. No input. No canvas. (Commitment Before Creativity)
7. Product info (collapsible)
8. ETA — "Arriving by 5:15 PM"
9. Return policy

**Cart switch rule**: Item from different vendor? Bottom sheet: "Start new order" (destructive) | "Continue with [Previous Vendor]"

### Step 3 — Cart (floating bar + CartDrawer sheet)
- Persistent floating bar: item count · total
- Tap → CartDrawer: item list · quantity controls · subtotal · "Checkout Now"
- Pricing from `v_active_cart_totals` view. DB is truth. No frontend math.

### Step 4 — Checkout Page `/checkout`
One-trip RPC: `get_checkout_context()` returns items + addresses + pricing + wallet + coupons.

Section order:
1. Items (with personalisation + add-on flags)
2. Address picker (saved or new via Google Autocomplete)
3. Bill breakdown (item total → personalisation → delivery → platform fee → GST → coupon → wallet → **TOTAL**)
4. Coupon slot (collapsed)
5. Wallet toggle (shown only if balance > 0)
6. GSTIN (collapsed, optional, B2B)

**Payment**: 100% advance. Razorpay. No COD. Ever.

### Step 5 — Post-Payment
- Immediate redirect to `/orders/[id]?success=true`
- Brief success overlay (2–3s) → collapses inline → lands on tracking page
- Identity form auto-opens if order has personalised items

### Step 6 — Order Tracking `/orders/[id]` (The Heartbeat)
Everything inline. No modals. No extra navigation.
- Status card → Identity form → Preview history → Item list → Delivery info → Bill → Timeline → Rating (deferred) → Support

### Step 7 — Preview Loop (Personalised Products Only)
```
Customer submits details
  → DETAILS_RECEIVED
    → Vendor uploads mockup
      → PREVIEW_READY
        → Customer reviews:
            [Slide to Approve]  ← liability shifts
            [Request a change] (free revisions remain)
            [Purchase revision ₹49] (after free revisions exhausted)
            [Reject & get instant refund] (inline double-confirm)
```

### Step 8 — Delivered
- Cashback credited automatically (`credit_cashback()` RPC)
- Invoice PDF available
- Rating prompt deferred (30 mins / next open / push)

---

## SLA Framework

| Metric | Default | Vendor-Configurable |
|---|---|---|
| Preview upload time | 2 hours | Yes — up to 6 hours |
| Free revisions | 2 | Yes — 0 to 5 |
| Paid revision fee | ₹49 | Yes — ₹0 to ₹500 |
| Production time (post-approval) | 5 mins | Yes — up to 60 mins |
| Total delivery SLA | 60–120 mins | Set by location + 3PL |

**SLA Breach Protocol**:
1. T + 0h — vendor accepts order
2. T + (SLA − 30min) — silent reminder to vendor
3. T + SLA — urgent alert to vendor + customer notified
4. T + SLA + 30min — customer chooses: wait or cancel + instant refund

---

## Refund Policy

| Scenario | Refund |
|---|---|
| Cancel before production (non-personalised) | Full refund incl. delivery fee |
| Cancel after dispatch | No refund |
| Preview rejected (any stage) | Full item refund; delivery fee non-refundable if other items shipped |
| Preview approved → item delivered damaged | Full refund or replacement |
| Preview approved → item delivered correctly | No refund (liability shifted on approval) |
| All items cancelled | Full refund incl. delivery fee |
| SLA breach → customer cancels | Full refund incl. delivery fee (vendor bears cost) |

---

## Cashback Flywheel

- 5% on first order. 2% on subsequent. Credited only on successful delivery.
- Expires in 90 days. Used as wallet deduction on next order.
- Config stored in `platform_settings` DB table. Never hardcoded.

---

## 💬 Naming Conventions (Enforced)

### Backend / Code / DB
| Concept | Backend / DB |
|---|---|
| Store | `vendors` table |
| Product | `products` table |
| Personalisation | `personalization_details` column |
| Line item | `order_products` |
| Cart line | `cart_items` |
| Wallet | `user_wallets` |

### Customer-Facing UI
| Use | Never use |
|---|---|
| "personalisation" | "customisation", "Design Hub", "Identity" |
| "vendor", "local store" | "partner", "merchant", "seller", "SKU" |
| "your vendor is making it" | "IN_PRODUCTION" |
| "Arriving by 5:15 PM" | "2.4 km", "distance" |
| "preview" | "mockup", "proof" |

### Partner-Facing UI
| Use | Never use |
|---|---|
| "orders", "your shop", "earnings" | "vendor panel", "dashboard", "portal" |

---

## 🏪 The Competitive Moat

**Why Swiggy Instamart can't copy this:**
1. **CapEx trap** — Running dark stores with engravers + trained artisans is not the Instamart model.
2. **We use the Swiggy model against them** — We digitise the existing thousands of local shops with machines. We are their storefront. Zero CapEx. Shadowfax does our delivery.
3. **Return rate → near zero** — Preview-before-production eliminates the return rate problem that destroys personalised product margins.

---

## The Stack

| Layer | Tech |
|---|---|
| Database + Auth | Supabase (PostgreSQL, RLS, SECURITY DEFINER RPCs) |
| Payments | Razorpay (advance payment, split refunds, webhooks) |
| Logistics | Shadowfax / Porter (rider assignment, real-time tracking) |
| Mapping | Google Maps APIs (geocoding, distance matrix for ETA) |
| Vendor KYC | IDfy |
| UI | Next.js 15 + shadcn/ui |
| Observability | OpenTelemetry (traces on every commerce intent) |
| Validation | Zod (all mutations validated before RPC) |
| Testing | Vitest (unit) + Playwright (E2E) |

---

## Developer Setup

### Prerequisites
- Node.js 18+
- Supabase Project (DB & Auth)
- Razorpay Account (for testing payments)

### Installation
```bash
npm install
cp .env.example .env.local
# Fill in credentials
npm run dev
```

### Key Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY       # Admin operations only
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_SUPPORT_WHATSAPP    # Optional — hides support if missing
NEXT_PUBLIC_SUPPORT_PHONE       # Optional
```

### Scripts
```bash
npm run dev           # Local dev (Turbopack)
npm test              # Vitest unit tests
npm run test:e2e      # Playwright E2E
npm run build         # Production build
```

---

## Engineering Rules (Hard)

1. **No frontend price computation.** Use DB RPCs.
2. **No hardcoded FSM transitions.** Use `transition_order()`.
3. **No `console.log` in production paths.** Use `logger.info/error()`.
4. **No multi-trip mutations.** One RPC per user action.
5. **No `window.confirm()`.** Inline double-confirm only.
6. **No distance shown in UI.** Time only.
7. **No shadow math.** DB total is truth. Always.
8. **No COD.** Ever.
9. **No empty `search_path` on SECURITY DEFINER functions.** Always `SET search_path TO 'public', 'extensions'`.
10. **No unindexed foreign keys.** Every FK column has a covering index.