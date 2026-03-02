# WyshKit 2026: WORKFLOW — The System Path

> *"A user who understands where they are in the journey has lower anxiety and higher conversion."*

---

## The Four Beliefs (Non-Negotiable)

1. **Commitment Before Creativity** — Pay first, personalise after. Always.
2. **Time > Distance** — "Arriving by 5:15 PM." Never "2.4 km away."
3. **Preview > Production** — A digital mockup (not a product photo) is approved before anything is made. This is the moat.
4. **Anticipatory UX** — Eliminate typing wherever possible. One-tap presets for delivery ("Gate Drop", "Silence Mode").

---

## Sheet vs Page (Non-Negotiable)

| Surface | Pattern | Reason |
|---|---|---|
| Product detail | **Sheet** (intercepted route) | Browsing context — no domain shift |
| Cart | **Floating bar + CartDrawer (Sheet)** | Transient; immersive review; no URL needed |
| Location picker | **Sheet** | Sub-decision within home |
| Address picker | **Sheet** (within checkout) | Sub-decision within checkout |
| Vendor storefront | **Page** `/vendor/[id]` | Domain shift |
| Checkout | **Page** `/checkout` | Money commitment |
| Order tracking | **Page** `/orders/[id]` | URL-addressable; supports deep-links |
| Preview mockup | **Inline** in tracking page | Never a new screen |
| Post-delivery rating | **Inline** in tracking page | Deferred section, not a separate screen |
| Support | **Sheet** | Overlay on current context |

---

## Canonical User Journey

### Step 1 — HOME FEED `/`

- Location resolved at session start (once per session, not per page).
- Feed: `BANNER_BENTO → CIRCLE_RAIL (categories, max 8) → VENDOR_GROUPED_GRID`
- If user has an active order: **order status widget appears above the Banner Bento** (Zeigarnik Effect — no exceptions).
- Each product card: photo · name · price · "~40 min" ETA chip (never km) · add button.
- First tap "Add" → opens product sheet.

---

### Step 2 — PRODUCT SHEET

Content order (mandatory):

1. Image carousel (3–5 photos)
2. Name · vendor badge ("By [Vendor], [Area]") · star rating
3. Price (large, prominent)
4. Variants — size / colour / material chips (max 6 visible; collapse rest)
5. Add-ons — toggles or steppers (gift wrap, express prep)
6. "Add personalisation +₹X" — toggle only. No input here. (Commitment Before Creativity)
7. Product info — dimensions, weight, material (collapsible)
8. ETA — "Arriving by 5:15 PM"
9. Return policy — "Personalised: no returns after preview approval | All others: 24 hrs (damaged/wrong only)"
10. "Add to cart" button (sticky at bottom)

**Cart switch rule**: Cart already has products from a different vendor → show bottom sheet with two options: "Start new order" (destructive) / "Continue with [Previous Vendor]."

---

### Step 3 — CART

- Persistent floating bar: product count · total.
- Tap → expands to **CartDrawer** (Sheet): product list · quantity controls · subtotal · "Checkout Now."
- One vendor per cart. Always.
- Pricing fetched via `v_active_cart_totals`. Database = Single Source of Truth.
- "Checkout Now" → navigates to `/checkout` (full page — domain shift).

---

### Step 4 — CHECKOUT `/checkout`

**One-Trip Promise.** `get_checkout_context()` returns everything in one RPC: products, addresses, pricing, wallet, coupons.

Section order (never change this):

1. **CHECKOUT_ITEMS** — products, quantities, personalisation flag
2. **CHECKOUT_ADDRESS** — saved addresses or add new (Google Autocomplete)
3. **CHECKOUT_SUMMARY** — full bill, line by line:
   - Product total
   - Personalisation fee(s)
   - Add-on fee(s)
   - Delivery fee + ETA
   - Platform fee (₹5 flat)
   - GST
   - Coupon discount (if applied)
   - Wallet deduction (if toggled)
   - **"You'll earn ₹X WyshKit Money"** ← Cashback flywheel shown here
   - **TOTAL**
4. **CouponSlot** — collapsed ("Have a promo code?") Always collapsed by default.
5. **Wallet toggle** — shown only if balance > 0.
6. **GstinSection** — collapsed ("Business purchase? Add GSTIN"). Optional.
7. **EstimateButton** — appears only after valid GSTIN entry. Downloads proforma invoice for corporate approvals (not a legal tax document).

**Footer (sticky)**:
- Mobile: `SlideToPay` gesture
- Desktop: "Place Order · ₹XXX" button
- No address selected → greyed out. Pricing error → retry button.

**Payment**: 100% advance. Razorpay. No COD. Ever.

---

### Step 5 — POST-PAYMENT

Redirect to `/orders/[id]?success=true`.

Brief success overlay (~2s):
- ✅ green checkmark
- "Order Confirmed!"
- Collapses inline → user lands on tracking page.

No loaders. No "Design Hub" language.

---

### Step 6 — ORDER TRACKING `/orders/[id]`

Single page. Everything inline. No modals. No extra navigation.

**Section A — STATUS CARD**
- Current status + icon + colour + order ref `#WK-YYYYMMDD-XXXX`
- ETA: "Arriving by 5:15 PM" (once rider assigned)

**Section B — PERSONALISATION FORM** (personalised products only)
- Auto-opens if `?success=true` and order contains personalised products.
- Fields driven by vendor's `personalization_schema` config (text, image upload, select).
- After submission → status: `DETAILS_RECEIVED`. Toast: "Details sent. Preview coming soon."

**Section C — THREE-LAYER PREVIEW HISTORY** (per personalised product)
```
┌─ WHAT YOU SENT ──────────────────────── [timestamp]
│  Customer's submitted text / image thumbnails
│
├─ WHAT YOU RECEIVED ──────────────────── [timestamp]
│  Mockup thumbnail (digital overlay — not a photo of the physical product)
│  Vendor note (optional)
│
│  Pre-approval notice:
│  "This is a digital preview. Minor rendering variations may occur.
│   Once approved, personalisation starts immediately and cannot be undone."
│
│  [Slide to Approve]        ← Liability shifts here
│  [Request a change — X free remaining]
│  [Purchase a revision — ₹49]  ← appears after free revisions exhausted
│  [Reject & get instant refund]  ← inline double-confirm (not window.confirm)
│
└─ WHAT CHANGED ───────────────────────── [timestamp] (if revision)
   Customer's revision request
   → New "WHAT YOU RECEIVED" entry when vendor uploads next mockup
```

**Approval = liability shift.** The product is non-refundable unless the physical item is damaged or factually wrong on delivery.
**Rejection = immediate line-product refund.** Other products in the order continue unaffected.

**SLA Breach** (vendor hasn't uploaded by their configured deadline):
- Customer sees: "Vendor is running late. Wait for free? Or cancel this product for a full refund."
- No auto-cancel. Customer decides. `cancel_order_product` handles liability checks + wallet credit.

**Section D — ORDER PRODUCTS LIST**
Each product with its own independent status badge:
- Non-personalised: `CONFIRMED → IN_PRODUCTION → PACKED → SHIPPED → DELIVERED`
- Personalised: `AWAITING_DETAILS → DETAILS_RECEIVED → PREVIEW_READY → IN_PRODUCTION → PACKED → SHIPPED → DELIVERED`
  > **Phase 2**: These personalisation sub-statuses (`AWAITING_DETAILS`, `DETAILS_RECEIVED`, `PREVIEW_READY`) are tracked in `order_products.status` and the order tracking UI — they are **not** part of the `order_status` Postgres enum (which tracks the parent order). Implementation via product-level status field.

**Section E — DELIVERY INFO** (once `SHIPPED`)
- Realtime engine: subscribe to `public:orders:id=eq.$order_id`, listen for `UPDATE` on `status` and `eta`.
- Trigger haptic on every status change.
- Rider name + masked phone.

**Section F — BILL SUMMARY**

**Section G — ORDER TIMELINE** — chronological, newest first.

**Section H — RATING** — deferred. Appears 30 mins post-delivery OR on next app open. Not at delivery moment.

**Section I — SUPPORT** — "Need help?" → WhatsApp + Call buttons. Hidden if env vars missing. No dead links.

---

### Step 7 — DELIVERED

- Haptic + brief confetti (≤2s — never 5+)
- Invoice PDF downloadable
- Cashback credited: "₹X WyshKit Money added" (toast + inline section)
- Rating prompt deferred (see Section H rules above)

---

## Handling Mixed Orders (Partial Fulfillment)

| Product | Path |
|---|---|
| Non-personalised | Fast-tracks: `CONFIRMED → IN_PRODUCTION → PACKED` |
| Personalised | Goes through preview loop independently |

If personalised product is rejected → that line product instantly refunded → non-personalised products continue unaffected → order stays `ACTIVE` (not cancelled).

If ALL products cancelled → full order `CANCELLED` + full refund including delivery fee.

---

## SLA Table (Vendor-Configurable)

| Metric | Default | Vendor-Configurable |
|---|---|---|
| Preview upload time | 2 hours | Yes — up to 6 hours |
| Free revisions | 2 | Yes — 0 to 5 |
| Paid revision fee | ₹49 | Yes — ₹0 to ₹500 |
| Production time (post-approval) | 5 mins | Yes — up to 60 mins |
| Total delivery SLA | 60–120 mins | Set by location + 3PL |

**SLA Breach Protocol**:
```
T + 0h              → Vendor accepts order
T + (SLA - 30min)   → Silent push reminder to vendor
T + SLA             → Urgent push + WhatsApp to vendor; in-app banner to customer
T + SLA + 30min     → Customer given choice: wait (free) or cancel + instant refund
T + SLA + 60min     → Auto-escalate to ops for manual intervention
```

---

## Refund Policy

| Scenario | Refund |
|---|---|
| Cancel before any production (non-personalised) | Full refund including delivery fee |
| Cancel after dispatch | No refund |
| Preview rejected (any stage) | Full product refund; delivery fee non-refundable if other products shipped |
| Preview approved, product delivered damaged | Full refund or replacement |
| Preview approved, product delivered correctly | No refund (liability shifted on approval) |
| All products cancelled | Full refund including delivery fee |
| SLA breach → customer cancels | Full refund including delivery fee (vendor bears cost) |

---

## Cashback Flywheel

Triggers: `ORDER DELIVERED` → automatic credit → visible in wallet + transaction history.

Surface at:
- **Checkout bill**: "You'll earn ₹X WyshKit Money on this order"
- **Order success**: "₹X WyshKit Money credited"
- **Wallet balance on home**: "₹X available — use it today"

Rate: Configured in `platform_settings` (never hardcoded). Current: 2%, min ₹10, max ₹500.

---

## Notification Architecture

### The Hierarchy (Least to Most Interruptive)

```
In-App Banner      (contextual, high relevance, non-interruptive)
      ↓
Push Notification  (interrupts; use sparingly)
      ↓
WhatsApp           (high open %; reserve for critical + compliance-safe)
      ↓
SMS                (fallback only — cost + regulatory overhead)
      ↓
Email              (invoices and legal documents only)
```

**Rule**: One event = one channel. Stacking channels on the same event is spam.

### Urgency Tiers

| Tier | Description | Channel | Delay |
|---|---|---|---|
| **P0 — Critical** | Order cancellation, refund, payment failed | Push + WhatsApp | Immediate |
| **P1 — Transactional** | Order placed, preview ready, rider assigned, delivered | Push | Immediate |
| **P2 — Operational** | SLA reminder (T-30min), vendor accepted | Push | <2 min |
| **P3 — Deferred** | Rating prompt, cashback credited, wallet expiry | In-App Banner | 30 min post-trigger |
| **P4 — Marketing** | Festival campaigns, re-engagement | Push (batched) | Operator-scheduled |

### Customer Trigger Matrix

| Trigger | Tier | Channel | Copy |
|---|---|---|---|
| Order placed | P1 | Push | "Order #WK-XXXX placed! Your vendor will confirm shortly." |
| Vendor confirms | P1 | Push | "[Vendor] accepted your order." |
| Preview ready | P1 | Push | "Your preview is ready! Approve or request a change." |
| Rider assigned | P1 | Push | "[Name] is picking up. Arriving by [time]." |
| Delivered | P0 | Push | "Delivered! ₹X WyshKit Money added." |
| SLA breach | P0 | Push + WhatsApp | "Vendor is running late. Wait or cancel for full refund." |
| Cancelled + refund | P0 | Push + WhatsApp | "Order cancelled. ₹X refunded." |
| Rating prompt | P3 | In-App | 30 mins after delivered or next app open. Never both. |

### Vendor Trigger Matrix

| Trigger | Tier | Channel | Copy |
|---|---|---|---|
| New order | P0 | Push + WhatsApp | "New order! #WK-XXXX — [Product]. Accept now." |
| Details submitted | P1 | Push | "[Customer] submitted details. Upload preview." |
| Revision requested | P1 | Push | "[Customer] requested a change. Check the feedback." |
| Preview approved | P1 | Push | "Preview approved! Start production now." |
| SLA warning (T-30min) | P2 | Push | "Reminder: preview due in 30 mins for #WK-XXXX." |
| SLA breach | P0 | Push + WhatsApp | "URGENT: Preview overdue. Customer notified." |
| Payout processed | P3 | In-App | "₹X payout processed for [date range]." |

### What We Never Do

- ❌ Promotional push between 10 PM–8 AM (DND window)
- ❌ More than 2 pushes for the same order within 60 minutes
- ❌ Push notification without a deep link (ghost pushes destroy trust)
- ❌ WhatsApp without an unsubscribe path (TRAI compliance)
- ❌ Rating prompt before delivery is logged in DB
- ❌ "You have a new notification" — always be specific

### Deep Link Standard

| Notification | Deep Link |
|---|---|
| Order push | `/orders/[id]` |
| Preview push | `/orders/[id]#preview` |
| Payout push | `/vendor/earnings` |

No push ever links to the home feed.

### Data Model

```sql
notifications {
  user_id:     UUID,        -- recipient (customer or vendor)
  type:        TEXT,        -- 'PREVIEW_READY', 'ORDER_PLACED', etc.
  title:       TEXT,        -- push title
  body:        TEXT,        -- push body / WhatsApp message
  entity_type: TEXT,        -- 'ORDER', 'ORDER_PRODUCT', 'PAYOUT'
  entity_id:   UUID,        -- deep link target
  channel:     TEXT,        -- 'PUSH', 'WHATSAPP', 'IN_APP'
  is_read:     BOOLEAN,
  sent_at:     TIMESTAMPTZ,
  read_at:     TIMESTAMPTZ
}
```
