# WyshKit

**Last-minute gifts, personalised. Delivered in minutes.**

---

## What We Are

WyshKit is to personalised gifts what Swiggy is to food.

```
Swiggy Food   = Restaurant → Cooks food → 3PL Delivery
WyshKit       = Local vendor → Personalises product → 3PL Delivery
```

One local vendor. One cart. One delivery. Always.

We are **not** a gifting marketplace. We are **not** quick commerce. We are **not** a design tool.

We are a **hyperlocal product marketplace** where local partners sell physical goods with optional personalisation, and we handle digital discovery and last-mile delivery.

---

## 🦉 The Swiggy 2026 Mental Model for Wyshkit

Wyshkit is fundamentally a fusion of two battle-tested operational models with one unique twist.

**Equation:**
`Wyshkit = [Swiggy Food Logistics] + [Instamart Product Catalog] + [Personalization Workflow]`

### Like Swiggy Food (Logistics):
- **One Vendor, One Order, One Delivery**: You do not order from two restaurants in one cart. Wyshkit correctly enforces this.
- **Time > Distance**: SLA is calculated based on Preparation Time + Transit Time.
- **No CapEx**: Fleet is 3PL (Shadowfax/Porter). Wyshkit owns zero riders.

### Like Instamart (Catalog):
- **Physical Goods**: You sell physical, sometimes perishable items (cakes, flowers) and hard goods (electronics, apparel).
- **Hard Metrics**: Products require exact dimensions, weight, and shelf-life metrics.

### The Unique Wyshkit Twist (Personalization):
- **Production Time vs Cooking Time**: Food Prep Time is replaced by *Personalization Production Time*. It uses the same SLA mathematical model as cooking.
- **Preview Trust Moat**: The digital mockup is the commitment signal.

---

## The Three Core Beliefs

### 1. Commitment Before Creativity
Traditional e-commerce captures design upfront. The result: high friction, ghost orders, and wasted partner time.

**The WyshKit Way**:
1. Browse products from a local vendor.
2. Toggle "Add personalisation" (+₹X) — just like an add-on.
3. Pay 100% in advance via Razorpay.
4. *Then* submit your personalisation details. *Then* see a preview.

Payment is the commitment signal. Only committed users enter the preview flow. Vendors never design for maybes. Inventory is never blocked for ghost orders.

### 2. Hyperlocal Time > Distance
We do not show distance in km. We show **when it arrives**.

Users don't care if a vendor is 2km or 5km away. They care: *"Will this arrive by 5 PM?"*

**What this means**:
- "Arriving by 5:15 PM" — always. "2.4 km away" — never.
- 50–100 curated SKUs per neighbourhood. Not 10,000 pan-India SKUs.
- Same-day/next-day. Amazon says 2 days. We take 45 minutes.
- We own zero inventory. Zero dark stores. Zero CapEx.

### 3. Preview Trust > Price Competition
Personalised goods carry emotional weight. When it goes wrong, returns destroy margins.

**The WyshKit Moat**:
- Post-payment, vendor uploads a **digital mockup** — a template overlay showing how the product looks with the personalisation. Not a photo of the actual product. Think: Apple's engraving preview.
- Customer has free revisions (vendor-defined, default: 2) to request changes.
- If they definitively reject it: **instant refund**. Physical item untouched. Inventory saved.
- Once customer slides to approve: **liability shifts**. Non-refundable. Engraving starts.

Users pay a 20–30% premium for peace of mind. Returns collapse to near-zero.

---

---

## Developer Setup

### 1. Prerequisites
- Node.js 18+
- Supabase Project (for DB & Auth)
- Razorpay Account (for testing payments)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```
Key variables required:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for migrations/admin actions)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### 4. Running Locally
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## The Stack

| Layer | Tech |
|---|---|
| Database + Auth | Supabase (RLS, single source of truth) |
| Payments | Razorpay (advance payment, split refunds, webhooks) |
| Logistics | Shadowfax / Porter (rider assignment, real-time tracking) |
| Mapping | Google Maps APIs (geocoding, distance matrix for ETA) |
| Partner KYC | IDfy |
| UI | Next.js + shadcn/ui |

---

## The Cart Math

**Partial Fulfillment** (mixed personalised + non-personalised order):
- Non-personalised items fast-track: `CONFIRMED → IN_PRODUCTION → PACKED`.
- Personalised items go through the preview loop independently.
- If a personalised product is rejected: line-item cancelled + partial Razorpay refund. Other products proceed.
- We never cancel an entire order because one product failed.

**Delivery Fee**:
- **Flat distance-based fee only** (e.g., ₹40-60). 
- **NO surge pricing**. Physical products don't spoil rapidly like food; therefore, delivery is not minute-sensitive enough to warrant demand-based surge parsing. Flat fees equal predictable pricing.
- Shown upfront in cart. Never hidden until checkout.
- Non-refundable once a rider is dispatched.
- If order cancelled before `PACKED`: 100% full refund including delivery fee.

**Post-Approval Policy**:
- Slide to Approve = liability shifts to customer. Zero refunds for personalised items post-approval.
- Exception only: item arrives factually wrong or demonstrably broken → WhatsApp support within 2 hours of delivery.

**Cashback Flywheel**:
- First order earns 5% cashback. Subsequent orders earn 2%.
- Expiry is 90 days.
- Credited only *after* successful delivery. Usage unlocked on the *next* order.

---

## What We Say (And Don't Say)

**We sell**: *"Get a personalised gift delivered before the party starts."*

We use: "hyperlocal", "B2B2C", "vendor", "product", "personalisation", "delivered in minutes."

We say: "vendor", "local store", "personalisation", "delivered in minutes", "last-minute", "preview before production."

---

## Naming Conventions (Backend vs UI)

| Concept | UI (Customer-facing) | Database / Code |
|---|---|---|
| Local store | "Store" or "Vendor" | `vendors` table |
| Product | "Product" | `products` table |
| Personalisation | "personalisation" | `personalization_details` |
| Vendor/seller | Use "Vendor" | — |