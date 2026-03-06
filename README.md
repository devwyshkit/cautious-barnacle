# WyshKit — The Hyperlocal Product Engine
> **"Hyperlocal Products. Optional Personalisation. Fast Delivery."**

---

### ❌ WHAT WE'RE **NOT**
- **NOT** a gifting marketplace (gifting is just ONE category)
- **NOT** a customization platform (it's **personalisation**)
- **NOT** a custom design tool (no Canva-style builders)
- **NOT** quick commerce in the Blinkit/Zepto sense — we own **zero inventory, zero dark stores**. Vendors own the stock. WyshKit delivers.

### ✅ WHAT WE **ARE**
**"The Hyperlocal Product OS for 2026"**

WyshKit rides the **"Store-as-Dark-Store"** wave. We don't build warehouses; we turn every local brand outlet (Apple, boAt, Decathlon) and premium artisan shop into a high-speed fulfillment node.

#### THE WHY (The VC Narrative)
In 2026, the $10B+ non-food hyperlocal market is converging. Branded retail (Apple Premium Resellers, Samsung Experience Zones, boAt) already has the inventory and 10-minute personalisation capacity; Quick Commerce has the last-mile rails. WyshKit is the **Intelligence + Identity Layer** that bridges them. We provide the high-trust interface for both stock-standard products and uniquely personalised ones.

#### THE ZERO-FRICTION BETS
1. **One Vendor, One Cart** — We follow the Swiggy Food principle. Mixing Apple AirPods with a local trophy is a logistics anti-pattern. One Order = One Vendor = One High-Speed Delivery.
2. **Address Gravity** — The app "knows" where you are. We pre-select the destination. We don't ask.
3. **Turbo Checkout** — 1-Tap prediction + Address Gravity = <10s checkout.
4. **The Preview Moat** — *(Personalised orders only)* Pay first. Preview after. The digital render is the legal contract between customer intent and vendor capability.

---

## The Mental Model

```
LAYER 1 — SWIGGY FOOD    Browse → Cart → Pay
          (Implicit persistent auth. Guest cart. One-page checkout. Address Gravity.)

LAYER 2 — INSTAMART      Physical product with inventory reality
          (Photo. Name. Vendor. Price. Variants. ETA. Stock. That's it.)
          Example A: Order AirPods from an Apple Premium Reseller. Delivered in 40 mins. No personalisation.
          Example B: Order a trophy + engraving from Trophy Palace. Layer 3 activates.

LAYER 3 — FIVERR         Post-payment work loop (personalised orders only)
          (Pay → Submit requirements → Receive preview → Approve → Production)
```

**Customisation** = selecting size/colour/material before payment. **Personalisation** = submitting engraving text or a logo after payment. Layer 3 only activates when the customer toggles personalisation. Zero new patterns. Zero reinvention.

---

## The 3 Bets

| # | Bet | Why |
|---|---|---|
| 1 | **Commitment Before Creativity** | Pay first, personalise after. Zero ghost orders. Vendor never touches a product that isn't sold. |
| 2 | **Time > Distance** | "Arriving by 5:15 PM." Never "2.4 km away." Users plan around time, not geography. |
| 3 | **Preview > Production** | *(personalised orders only)* A customer who approves a digital mockup cannot return the product. Return rate → ~0. |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Streaming) |
| Backend / Auth | Supabase (PostgreSQL, RLS, SECURITY DEFINER RPCs) |
| Payments | Razorpay (100% advance, idempotent, webhook-verified) |
| Logistics | WareIQ (3PL — zero fleet, zero CapEx) |
| Location | Google Maps Platform (autocomplete, geocoding, live map) |
| Vendor KYC | IDfy (OCR extraction-first — vendor verifies, never types) |
| UI | shadcn/ui + Radix primitives + Tailwind CSS |
| Validation | Zod (all mutations validated before any RPC) |
| Observability | OpenTelemetry (traces per commerce intent) + structured logger |
| Testing | Vitest (unit, 80% coverage gate) |

---

## Getting Started

```bash
npm install
cp .env.example .env        # Fill in Supabase + Razorpay keys
npm run dev
```

**Before every PR:**
```bash
npm run lint                # Code quality
npm test                    # 80% coverage gate
npm run build               # Production build validation
```

**Hard rules:**
- **Zero Shadow Math** — all commerce arithmetic lives in Postgres. Frontend is a display.
- **Zero Reinvention** — check Supabase or shadcn/ui before adding dependencies.
- **Mobile First** — all interfaces optimised for 44px tap targets.
- **Nomenclature** — never use 'Partner', 'Item', or 'Merchant'. Use 'Vendor', 'Product', 'Customer'.
- **Slug-First Routing** — using a UUID in a customer-facing URL is a P0 bug.
- **Zero `console.log`** — structured logger only.

---

## Documentation

4 Master Docs. One per work domain. Start with what your role needs.

| Doc | For | What It Answers |
|---|---|---|
| [KERNEL.md](./docs/KERNEL.md) | **Engineering** | The 7 Laws, hard engineering rules, Commerce Intent Engine, security, observability |
| [DOCTRINE.md](./docs/DOCTRINE.md) | **Product + Strategy** | Differentiation, the Preview Moat, product laws, messaging playbook, GTM |
| [WORKFLOW.md](./docs/WORKFLOW.md) | **Product + Engineering** | Full user journey (Home → Checkout → Tracking → Delivery), SLA table, refund policy |
| [OPERATIONS.md](./docs/OPERATIONS.md) | **Ops + BD** | Vendor onboarding funnel, KYC/KYB extraction-first, commission tiers, operator runbook |