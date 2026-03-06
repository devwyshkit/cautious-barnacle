# WyshKit 2026: WORKFLOW — The System Path

> *"A user who understands where they are in the journey has lower anxiety and higher conversion."*

---

## The Mental Model

WyshKit is three proven models stitched together. Zero new patterns invented. Note: While gifting is a high-volume category, these workflows apply to *any* product that supports identity-layer personalization.

```
LAYER 1 — SWIGGY FOOD    Browse → Cart → Pay
          (Deferred auth. Guest cart. One-page checkout. Saved address pre-selected.)

LAYER 2 — INSTAMART      Physical product sheet with inventory reality
          (Photo. Name. Vendor. Price. Variants. Add-ons. ETA. Stock. That's it.)

LAYER 3 — FIVERR         Post-payment work loop
          (Pay → Submit requirements → Receive preview → Approve/Revise → Production)
```

**The WyshKit insight** (from 5 years of founder experience): Personalised physical products are not custom manufacturing. They are inventory + a 10-minute service. Apple does this with AirPods engraving. Nike does $1B/year from it. WyshKit applies Uber Eats speed to this model.

---

## Customisation vs. Personalisation

This distinction determines the entire product architecture.

### Customisation — Choosing from what the vendor offers
- Customer selects from **vendor-defined, pre-existing options**
- Examples: Size (S/M/L), Colour (Black/Brown), Material (Leather/Canvas)
- No unique output. Every Medium Black Leather Wallet is identical.
- Happens **before payment**, in the product sheet
- No vendor work required — it's selecting a SKU

### Personalisation — Adding something uniquely yours to the product
- Customer provides **unique input** (text, image, name, date) that creates a one-of-a-kind item
- Examples: Engraving "Happy Birthday Priya ❤️", uploading a logo, adding a monogram
- Every output is unique and non-resellable if abandoned
- Happens **after payment**, in the order tracking page (Fiverr layer)
- Requires vendor work (preview, production)

| What happens | Correct term | When | Where |
|---|---|---|---|
| Selecting size, colour, material | **Customisation** | Before payment | Product Sheet |
| Toggling "Add personalisation +₹X" | **Personalisation add-on** | Before payment | Product Sheet |
| Submitting text/image/name | **Personalisation details** | After payment | `/orders/[id]` Section B |
| Seeing the digital render | **Personalisation preview** | After payment | `/orders/[id]` Section C |
| **Approving the render** | **Personalisation approval** | After payment | `/orders/[id]` Section C |

---

## The Personalization Model (The Apple Way)

WyshKit does NOT do customization. We do **Personalization**.

- **❌ NOT CANVA**: We are not a builder tool. We don't ask users to "design" layouts.
- **✅ ENGRAVING MODEL**: We follow the Apple AirPods model. The product exists; we add an "Identity Layer" (Text/Image) on top of it.

This distinction is critical for SLA discipline. Designing takes hours; Personalizing takes 10 minutes.

---

## The Four Beliefs (Non-Negotiable)

> These are the **product beliefs** (the WHY). For the **implementation rules** (the HOW), see [DOCTRINE.md → 7 Product Laws](./DOCTRINE.md).

1. **Commitment Before Creativity** — Pay first, personalise after. Always.
2. **Time > Distance** — "Arriving by 5:15 PM." Never "2.4 km away."
3. **Preview > Production** — A digital preview (not a product photo) is approved before anything is made. This is the moat.
4. **Anticipatory UX** — Eliminate typing wherever possible. Pre-fill and pre-select based on available data (address, past orders, location).

---

## Surface Inventory (The Law)

**5 PAGES. 7 SHEETS. Everything else is inline.**

### Pages

| Route | Component | Auth | Notes |
|---|---|---|---|
| `/` | HomeFeed | ❌ | IP geolocation on first load |
| `/vendor/[slug]` | VendorStorefront | ❌ | Full page, domain shift |
| `/checkout` | CheckoutPage | ✅ | OTPSheet on entry if not logged in |
| `/orders/[id]` | OrderTracking | ✅ | All post-payment UX lives here |
| `/orders` | OrderHistory | ✅ | Past orders list |

### Sheets

| Sheet | Trigger | Mounted In |
|---|---|---|
| `ProductSheet` | Tap product card | HomeFeed, VendorStorefront |
| `CartDrawer` | Tap cart bar | RootLayout (global) |
| `LocationSheet` | Tap address bar | RootLayout (global) |
| `OTPSheet` | Tap "Checkout Now" if not logged in | CheckoutPage |
| `AddressSheet` | Tap address in checkout | CheckoutPage |
| `CartSwitchSheet` | Vendor mismatch on add | ProductSheet |
| `SupportSheet` | Tap "Need help?" | RootLayout (global) |

### Inline (all inside `/orders/[id]` only)

SuccessOverlay · PersonalisationForm · PreviewThread · OrderProductsList · DeliveryInfo · BillSummary · OrderTimeline · RatingPrompt · SupportButtons

### Delete These If They Exist

`/cart` · `/product/[id]` · `/location` · `/address` · `/support` · `/success` · `/confirm`

---

## Auth Gate Table

| Surface | Auth Required | Behaviour |
|---|---|---|
| `/` | ❌ | Browse freely. IP geolocation for feed. |
| `/vendor/[slug]` | ❌ | Browse freely. |
| ProductSheet | ❌ | Add to cart without auth. Session storage. |
| CartDrawer | ❌ | View cart without auth. Session storage. |
| `/checkout` | ✅ | OTPSheet slides over. Page renders greyed behind. |
| `/orders/[id]` | ✅ | Redirect to `/` if not logged in. |
| `/orders` | ✅ | Redirect to `/` if not logged in. |

**Guest Cart Contract**: Cart stored in session storage. On OTP verify, merge guest cart into authenticated user's cart via `merge_guest_cart_atomic` RPC.

---

## Canonical User Journey

### Step 1 — HOME FEED `/`

**Location Resolution — 3 Tiers, automatic:**
1. **Tier 1**: IP geolocation → feed shows immediately with skeleton
2. **Tier 2**: Browser GPS (prompted with context, not cold)
3. **Tier 3**: Manual entry via LocationSheet

Address bar (persistent top): `📍 Koramangala · ~45 min ▾`

**Feed Layout:**
- `[Active order widget]` ← if order exists, above everything else (Zeigarnik — no exceptions)
- `[Banner Bento]` — promos
- `[Category Rail]` — max 8 icons, single row, horizontal scroll
- `[Vendor-Grouped Product Grid]`
  - Each card: photo · name · `~40 min` chip · price · `[+]` button
  - `"Promoted"` badge if promoted (always visible, never hidden)
- `[Wallet Balance]` — for logged-in users, above Banner Bento: "₹48 WyshKit Money — use today." Hidden wallet = broken Hook.

**Interactions:**
- Tap `[+]` on product card → ProductSheet slides up
- Tap vendor name/area → `/vendor/[slug]` (full page, domain shift)
- All links MUST use slugs. Using a UUID in a customer-facing URL is an architectural failure.

---

### Step 2 — THE INSTAMART-STANDARD PRODUCT SHEET

ProductSheet = everything needed for a confident purchase decision. Nothing else.

```
┌─────────────────────────────────────────────────────────┐
│  IMAGE CAROUSEL                                         │
│  3–5 photos. White/neutral background. Swipe to browse. │
│  Auto-advances. Tap to full-screen.                     │
├─────────────────────────────────────────────────────────┤
│  NAME                           ⭐ 4.8 (142 reviews)    │
│  By Trophy Palace · Koramangala                         │
├─────────────────────────────────────────────────────────┤
│  ₹499                                                   │
│  (Large, prominent. This is the primary signal.)        │
├─────────────────────────────────────────────────────────┤
│  CUSTOMISATION (vendor-defined, if configured)          │
│  Material:   [Crystal ✓] [Metal]  [Wood]               │
│  Size:       [Small]    [Medium ✓] [Large]             │
│  ← Chips. Mandatory selection before Add to Cart.       │
│  ← Max 4 variant groups. Max 4 options per group.       │
│  ← Price updates when variant changes. Always.          │
├─────────────────────────────────────────────────────────┤
│  ADD-ONS (vendor-defined, if configured)                │
│  [○] Gift wrapping           +₹50                      │
│  [○] Express prep            +₹99                      │
│  ← Toggles. Optional. Price updates on toggle.         │
├─────────────────────────────────────────────────────────┤
│  PERSONALISATION (vendor-defined, if enabled)           │
│  [○] Add personalisation     +₹149                     │
│  ← ONE TOGGLE. That's it.                              │
│  ← No text box. No instructions. No upload.            │
│  ← Exactly like "Extra Cheese +₹30" in Swiggy food.   │
│  ← No input collected at this stage. All               │
│    personalisation details (text, image, name) are      │
│    submitted after payment via the order tracking       │
│    page — the Fiverr Requirements model.               │
│  ← Price updates. Nothing else changes.                │
├─────────────────────────────────────────────────────────┤
│  PRODUCT INFO (collapsed by default)                    │
│  Tap to expand ▾                                       │
│  Weight: 450g · Dimensions: 15×10×8 cm                 │
│  Material: Premium optical crystal                      │
│  ← Mandatory for all physical product listings.        │
├─────────────────────────────────────────────────────────┤
│  🕐 Arriving by 5:15 PM                                 │
│  ← Time. Never distance. "~40 min" on card,            │
│     "Arriving by X:XX PM" in sheet (more precise).      │
├─────────────────────────────────────────────────────────┤
│  RETURN POLICY (one line. transparent.)                 │
│  Personalised: No returns after preview approval        │
│  Others: 24 hrs, damaged/wrong only                     │
├─────────────────────────────────────────────────────────┤
│  [          Add to Cart · ₹649          ]               │
│  Sticky bottom button. Full width. Large tap target.   │
│  Greyed out until mandatory customisation selected.     │
└─────────────────────────────────────────────────────────┘
```

**What changes on toggle "Add personalisation":**
1. Price chip updates: ₹499 → ₹648
2. Return policy line updates: adds "Personalised items: no returns after preview approval"
3. "Add to Cart" button adds a 🎨 indicator

That is everything. Three changes. No new sections appear. No input fields appear. No instructions appear.

**What does NOT exist in the product sheet:**

| Element | Why it's wrong |
|---|---|
| Text input for engraving | Personalisation detail. Post-payment only. |
| Image upload | Post-payment only. |
| Instructions ("English only...") | Post-payment, in the requirements form. |
| "Similar products" | Phase 2. YAGNI. |
| Social sharing | Dark pattern adjacent. YAGNI. |

**Cart Switch Sheet** (only non-standard sheet in product context):
```
┌─────────────────────────────────────────────────────────┐
│  Your cart has items from Trophy Palace                 │
│                                                         │
│  Add this item from Crystal Awards?                    │
│                                                         │
│  [Start new order]                                      │
│  (removes current cart items)                          │
│                                                         │
│  [Keep Trophy Palace items]                             │
│  (closes this sheet)                                   │
└─────────────────────────────────────────────────────────┘
```
No guilt. No confirmshaming. Two clear options. Swipe down = "Keep Trophy Palace items."

---

### Step 3 — CART

**CartDrawer** (Sheet, slides up from bottom):
```
├─ [Photo] Crystal Trophy · Medium · +Personalisation 🎨
│   🎨 "Details required after payment"  ← ONE LINE. Static.
│   [−] 1 [+]   ₹648
│
├─ [Photo] Gift Box · Standard
│   [−] 1 [+]   ₹450
│
├─ ──────────────────────────────
│   Subtotal  ₹1,098  (from Postgres, never frontend math)
│
├─ [Checkout Now →]
```

- **Cart bar** (bottom, persistent once items added): `🛒 2 items · ₹1,098` — tap opens CartDrawer.
- One vendor per cart. Always.
- Pricing from database. Database = Single Source of Truth.
- "Checkout Now" → navigates to `/checkout`.
- CartDrawer closes → navigate to `/checkout`. Never layers: cart sheet does not stay open under checkout.

---

### Step 4 — THE ONE-PAGE CHECKOUT `/checkout`

**Auth Gate**: If not logged in, OTPSheet slides UP over `/checkout`. Page renders behind it, greyed. OTP verified → sheet closes → checkout loads. If user closes OTPSheet → back to `/`. Cart preserved in session.

**Single scroll. No sub-pages. No drawers. Everything on one page.**

```
┌─────────────────────────────────────────────────────────┐
│  SECTION 1 — ITEMS                                     │
│  [📷] Crystal Trophy · Medium                          │
│       ₹648    🎨 "Details after payment — you'll       │
│       submit them on the order page"                   │
│  [📷] Gift Box · Standard                              │
│       ₹450                                             │
│  [+ Add more items]  ← link back to home or vendor     │
├─────────────────────────────────────────────────────────┤
│  SECTION 2 — DELIVERY ADDRESS                          │
│  📍 Home · 4th Floor, Brigade Rd, Koramangala  ▸       │
│  ← Auto-selected: nearest saved address matched to GPS │
│  ← Tap to change → AddressSheet (only sheet here)      │
│  [+ Add new address]                                   │
│                                                         │
│  Arriving by 5:15 PM                                   │
├─────────────────────────────────────────────────────────┤
│  SECTION 3 — BILL (complete transparency, every line)  │
│  Product total           ₹1,098                        │
│  Personalisation (×1)    ₹149                          │
│  Delivery                ₹30                           │
│  Platform fee            ₹5                            │
│  GST (18%)               ₹232                          │
│  ─────────────────────────────                         │
│  TOTAL                   ₹1,514                        │
│                                                         │
│  💰 You'll earn ₹30 WyshKit Money on this order        │
├─────────────────────────────────────────────────────────┤
│  [Have a promo code?  ▾]  ← collapsed, tap to expand   │
│  → Expands to show all available coupons with benefits  │
│  → Tap to apply. Text field for manual entry as         │
│    secondary fallback only. Recognition over Recall.    │
│  [Use ₹48 WyshKit Money]  toggle ← only if balance > 0 │
│  [Business purchase? Add GSTIN  ▾]  ← collapsed        │
├─────────────────────────────────────────────────────────┤
│  (sticky footer)                                       │
│  Mobile:   [────── Slide to Pay · ₹1,514 ──────]       │
│  Desktop:  [  Place Order · ₹1,514  ]                  │
│                                                         │
│  No address → button greyed + tooltip "Add address"    │
│  Pricing error → [↺ Retry] not spinner                 │
└─────────────────────────────────────────────────────────┘
```

> Amounts above are illustrative. Actual values computed by `get_checkout_context` RPC (Zero Shadow Math).

**Why one page?** Users can apply coupons, get the detailed bill containing tax details, and make a payment — all in one flow. By reducing checkout to bare essentials on a single page, you eliminate the tediousness that prevents people from buying.

**Address auto-selection**: `get_checkout_context()` returns `suggested_address_id`. Frontend pre-selects it. GPS matched to nearest saved address. User can tap to change.

**Payment**: 100% advance. Razorpay. No COD. Ever.

---

### Step 4b — PAYMENT ERROR STATES

```
[Slide to Pay] → Razorpay sheet opens (Razorpay owns this UX, not WyshKit)

├─ Payment success → redirect /orders/[id]?success=true
├─ Payment failure → Error bottom sheet:
│   "Payment failed. Try again?"
│   [Retry same method]  ← primary (users prefer retrying same method)
│   [Try another method] ← secondary
│   ← Never auto-retry. User decides.
└─ Payment pending (webhook delay) → "Confirming payment..."
   → Resolve via Razorpay webhook. Max 30s. Then show status.
```

---

### Step 5 — POST-PAYMENT

Redirect to `/orders/[id]?success=true`.

Brief success overlay (~2s):
- ✅ green checkmark
- "Order Confirmed! #WK-20260304-0042"
- Collapses inline → user lands on tracking page.

No separate success page. No loaders. No redirect to home.

---

### Step 6 — ORDER TRACKING `/orders/[id]`

Single page. Everything inline. No modals. No extra navigation.

**Section A — STATUS CARD**
- Current status + icon + colour + order ref `#WK-YYYYMMDD-XXXX`
- ETA: "Arriving by 5:15 PM" (once rider assigned)

**Section B — PERSONALISATION REQUIREMENTS** (personalised products only)
- Auto-opens if `?success=true` and order contains personalised products.
- Fields driven by vendor's `personalization_schema` config (max 3 fields).
- Inline validation. Character counter. Clear copy.
- After submission → status: `DETAILS_RECEIVED`. Toast: "Details sent ✓ Preview in ~2 hours."
- Section B collapses: "✓ Submitted · 14:32 [Edit]"

**Section C — PREVIEW THREAD** (per personalised product)
```
YOU SENT  ·  14:32
"Happy Birthday Priya ❤️"
(no logo uploaded)

VENDOR DELIVERED  ·  16:04
[preview-thumbnail.jpg]  ← tap to full-screen
Note: "Serif font, ivory background"

⚠️  Digital preview. Minor rendering variations may
    occur. Approving starts production immediately.

[────────── Slide to Approve ──────────]
[Request a change  (2 free remaining)]
[Reject & get instant refund]
```

- **Request a change** → expands INLINE (not a sheet, not a modal):
  "What needs to change?" + text field + [Send]
- **Reject & refund** → inline double-confirm (never `window.confirm()`):
  "₹648 refunded to wallet. Continue?" + [Yes, cancel] [Keep waiting]
- **Slide to Approve** → haptic pulse → Status: `IN_PRODUCTION` 🔵 → "Production started! ~30 mins." → Thread freezes: "✓ Approved · 16:07"

**Approval = liability shift.** The product is non-refundable unless the physical item is damaged or factually wrong on delivery.
**Rejection = immediate line-product refund.** Other products in the order continue unaffected.

**SLA Breach** (vendor hasn't uploaded by their configured deadline):
- Customer sees: "Vendor is running late. Wait for free? Or cancel this product for a full refund."
- No auto-cancel. Customer decides.

**Section D — ORDER PRODUCTS LIST** (collapse after 3)
Each product with its own independent status badge:
- Non-personalised: `CONFIRMED → IN_PRODUCTION → PACKED → SHIPPED → DELIVERED`
- Personalised: `AWAITING_DETAILS → DETAILS_RECEIVED → PREVIEW_READY → IN_PRODUCTION → PACKED → SHIPPED → DELIVERED`

**Section E — DELIVERY INFO** (once `SHIPPED`)
- Rider name + masked phone.
- Live map: Supabase Realtime subscribe.
- Haptic on every status change.

**Section F — BILL SUMMARY** (same as checkout, read-only)

**Section G — ORDER TIMELINE** — chronological, newest first.

**Section H — RATING** — deferred. Appears 30 mins post-delivery OR on next app open. Whichever comes first. Never both. Never during order.

**Section I — SUPPORT** — WhatsApp + Call buttons. Hidden if env vars missing. No dead links.

---

### Step 7 — DELIVERED

- Haptic + brief confetti (≤2s — auto-stops, never loops)
- Status: "Delivered at 5:48 PM ✓"
- Wallet credit: "💰 ₹30 WyshKit Money added to your wallet"
- Invoice PDF downloadable: `[📄 Download Invoice]`
- Rating prompt deferred (see Section H rules above)

What does NOT happen: ❌ No separate "Thank you" page. ❌ No redirect to home. ❌ No push to rate immediately.

---

## The 5-Moment Transparency Chain

Transparency before commitment. These 5 moments must exist across the flow, in order:

| # | Where | What the customer sees |
|---|---|---|
| 1 | Product Sheet — return policy | "Personalised: No returns after preview approval. Others: 24 hrs, damaged/wrong only." |
| 2 | Product Sheet — toggle on | Return policy updates. 🎨 indicator on Add to Cart. |
| 3 | Cart — personalised item | 🎨 "Details required after payment" — one static line. |
| 4 | Checkout — personalised item | 🎨 "Details after payment — you'll submit them on the order page" |
| 5 | Preview — before approval | "Digital preview. Minor rendering variations may occur. Approving starts production immediately." |

---

## Handling Mixed Orders (Partial Fulfillment)

| Product | Path |
|---|---|
| Non-personalised | Fast-tracks: `CONFIRMED → IN_PRODUCTION → PACKED` |
| Personalised | Goes through preview loop independently |

If personalised product is rejected → that line product instantly refunded → non-personalised products continue unaffected → order stays `ACTIVE` (not cancelled).

If ALL products cancelled → full order `CANCELLED` + full refund including delivery fee.

---

## Realtime & Skeleton Mandate

**Realtime-First**: Order tracking uses Supabase Realtime (`public:orders:id=eq.$order_id`).
- WebSocket fallback: if WebSocket fails 3×, switch to 30s polling.
- If polling fails 3× → show "Connection lost. Pull to refresh."

**Skeleton Mandate**: Every surface must render skeleton within 50ms. No blank screens. Ever.

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
  user_id:       UUID,        -- Recipient (Customer or Vendor)
  type:          TEXT,        -- 'PREVIEW_READY', 'ORDER_PLACED', etc.
  metadata:      JSONB,       -- {order_id, product_id, vendor_name, etc.}
  image_url:     TEXT,        -- Optional thumbnail
  is_persistent: BOOLEAN,     -- Stays in bell icon history?
  priority:      INTEGER,     -- UI sorting
  read_at:       TIMESTAMPTZ, -- Not NULL if clicked
  expires_at:    TIMESTAMPTZ  -- Auto-cleanup
}
```
