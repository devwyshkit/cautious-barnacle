# WyshKit — The Hyperlocal Product OS 2026
> **"Inventory + 10-Minute Personalisation. Swiggy Food for Physical Products."**

---

### 🎙 THE ORIGIN (Founder's Mandate)
In 2019, Prateek (Founder) left Cleartax without a backup to solve a fundamental friction in commerce. After moving thousands of corporate orders (starting with Google) and 5 years in the trenches, he discovered a **mental model error** that defines the $100B industry:

The industry treats personalized products as **custom manufacturing** — slow, centralized, and expensive. 
**Reality?** Personalization is just **Inventory + 10-minute services**. 

Think Apple doing laser engraving on AirPods they already have in stock. That insight is WyshKit.

### 🚀 MARKET VALIDATION
- **Performance**: Launched Month 1 (Zero Marketing) -> **$2,000 USD GMV**.
- **The Nike Benchmark**: Nike makes **$1 Billion+ yearly** from personalization alone (*Nike By You*). 
- **The Shift**: By 2026, 60% of urban purchases will shift to <30-minute delivery. WyshKit is the only platform built for this convergence.

### ❌ WHAT WE'RE **NOT**
- **NOT** a gifting company (Gifting is just ONE category).
- **NOT** a customization platform (it's **personalisation** — identity added post-payment).
- **NOT** quick commerce (we own **zero inventory/dark stores**). Vendors own stock; WyshKit provides the OS.

### ✅ WHAT WE **ARE**
**"Swiggy for Products with Optional Personalisation"**

We are a pure **B2C Marketplace** with 2026-standard business utilities (GSTIN, Estimate Downloads) baked into the core. We turn every local brand outlet (Apple, boAt, Decathlon) into a high-speed fulfillment node.

#### THE ZERO-FRICTION BETS
1. **One Vendor, One Cart** — Following the Swiggy Food principle. Mixing Apple AirPods with a local trophy is a logistics anti-pattern. One Order = One Vendor = One High-Speed Delivery.
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