# WyshKit 2026

> **Inventory + 10-minute service. Delivered at Swiggy speed.**

WyshKit is the hyperlocal marketplace for products with optional personalisation. We turn local engraving and embroidery shops into on-demand personalisation nodes. **Last-minute gifts, personalised, delivered in under 60 minutes.**

---

## The Mental Model

```
LAYER 1 — SWIGGY FOOD    Browse → Cart → Pay
          (Deferred auth. Guest cart. One-page checkout. Auto-selected address.)

LAYER 2 — INSTAMART      Physical product sheet with inventory reality
          (Photo. Name. Vendor. Price. Variants. Add-ons. ETA. Stock.)

LAYER 3 — FIVERR         Post-payment work loop
          (Pay → Submit requirements → Receive preview → Approve/Revise → Production)
```

**Customisation** = selecting size/colour/material before payment. **Personalisation** = submitting engraving text or a logo after payment. Zero new patterns. Zero reinvention.

---

## The 3 Laws

| # | Law | Meaning |
|---|---|---|
| 1 | **Commitment Before Creativity** | Pay first, personalise after. Zero ghost orders. |
| 2 | **Time > Distance** | "Arriving by 5:15 PM." Never "2.4 km away." |
| 3 | **Zero Shadow Math** | The database is the only computer. The frontend is a display. |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Streaming) |
| Backend / Auth | Supabase (PostgreSQL, RLS, SECURITY DEFINER RPCs) |
| Payments | Razorpay (100% advance, idempotent, webhook-verified) |
| Logistics | Shadowfax / Porter (3PL — zero fleet, zero CapEx) |
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
- **Zero Shadow Math** — no hardcoded colours or magic numbers. Use CSS variables.
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
| [DOCTRINE.md](./docs/DOCTRINE.md) | **Product + Strategy** | The WyshKit differentiation (The Preview Moat), 20+ behavioral science laws, messaging playbook, GTM |
| [WORKFLOW.md](./docs/WORKFLOW.md) | **Product + Engineering** | Full user journey (Home → Checkout → Tracking → Delivery), notification architecture, SLA table, refund policy |
| [OPERATIONS.md](./docs/OPERATIONS.md) | **Ops + BD** | Vendor onboarding funnel, KYC/KYB extraction-first, commission tiers, operator runbook |