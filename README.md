# WyshKit 2026

> **"The Shadow of Swiggy. The Speed of Instamart. Zero Reinvention."**

WyshKit turns local engraving and embroidery shops into on-demand personalisation nodes.  
**Last-minute gifts, personalised, delivered in under 60 minutes.**

> [!IMPORTANT]
> **Audit 2026 Phase 1 Complete**: All 4 critical flow blockages resolved (Auth E.164, Pricing NaN, Desktop Scroll, Personalization Select).

---

## The 3 Laws

| # | Law | Meaning |
|---|---|---|
| 1 | **Commitment Before Creativity** | Pay first, personalise after. Zero ghost orders. |
| 2 | **Time > Distance** | "Arriving by 5:15 PM." Never "2.4 km away." |
| 3 | **Zero Shadow Math** | The database is the only computer. The frontend is a display. |

> [!TIP]
> **Nomenclature Protection**: WyshKit 2026 maintains zero tolerance for legacy terms like Partner / Item / Merchant via structural type enforcement and code audits.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Streaming) |
| Backend / Auth | Supabase (PostgreSQL, RLS, SECURITY DEFINER RPCs) |
| Payments | Razorpay (100% advance, idempotent, webhook-verified) |
| Logistics | Shadowfax / Porter (3PL — zero fleet, zero CapEx) |
| Vendor KYC | IDfy (OCR extraction-first — vendor verifies, never types) |
| UI | shadcn/ui + Radix primitives + Tailwind CSS |
| Validation | Zod (all mutations validated before any RPC) |
| Observability | OpenTelemetry (traces per commerce intent) + structured logger |
| Testing | Vitest (unit, 80% coverage gate) |

---

## Getting Started

```bash
npm install
cp .env.example .env        # Fill in Supabase + Razorpay keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
npm run dev
```

> [!IMPORTANT]
> **Slug-First Routing**: WyshKit 2026 enforces human-readable slugs for all vendor/product URLs. Using a UUID in a customer-facing URL is considered a P0 architectural bug.

**Before every PR:**
```bash
npm run lint                # High density code quality check
npm test                    # 80% coverage gate
npm run build               # Production build validation
```

---

## Documentation

4 Master Docs. One per work domain. Start with what your role needs.

| Doc | For | What It Answers |
|---|---|---|
| [KERNEL.md](./docs/KERNEL.md) | **Engineering** | The 7 Laws, hard engineering rules, Commerce Intent Engine, security, observability |
| [DOCTRINE.md](./docs/DOCTRINE.md) | **Product + Strategy** | The WyshKit differentiation (The Preview Moat), 20+ behavioral science laws, messaging playbook, GTM |
| [WORKFLOW.md](./docs/WORKFLOW.md) | **Product + Engineering** | Full user journey (Home → Checkout → Tracking → Delivery), notification architecture, SLA table, refund policy |
| [OPERATIONS.md](./docs/OPERATIONS.md) | **Ops + BD** | Vendor onboarding funnel, KYC/KYB extraction-first, commission tiers, operator runbook (SLA breach, wallet, payment recovery) |