# Swiggy 2026: Engineering Conventions & Principles

This document formalizes the "Swiggy 2026" engineering culture. These are not suggestions; they are the laws of the Wyshkit kernel.

## 🧠 Mental Models

### 1. The Swiggy Equation
`WyshKit = [Swiggy Food Logistics] + [Instamart Product Catalog] + [Personalization Workflow]`
- **Logistics**: Time > Distance. SLA-driven. Never show km. Always show "Arriving by 5:15 PM".
- **Catalog**: Physical hard goods. Neighbourhood curation (50-100 SKUs). Depth over breadth.
- **Workflow**: Preview Trust Moat. Liability shift on approval. Production Time = Cooking Time.

### 2. Miller's Law (7±2 Rule)
Limit cognitive load. Never show more than 7 primary navigation or action items in a single view. Reveal complexity via **Progressive Disclosure**.

### 3. Fitts' Law (Tap Targets)
Primary actions (e.g., `Slide to Pay`, `Add to Cart`) must be large, high-contrast, and positioned for thumb-reach on mobile. Min touch target: 44×44px.

### 4. Hick's Law (Decision Time)
Decision time grows logarithmically with the number of choices. **Every extra option is a conversion tax.**
- Max 6 variant chips visible above fold (collapse rest)
- Max 8 categories in CIRCLE_RAIL
- Single payment method (Razorpay). Zero friction. No COD.
- Personalisation schema: ≤3 fields per product

### 5. Nir Eyal's Hook Model (Habit Formation)
`Trigger → Action → Variable Reward → Investment`
- The cashback flywheel IS the Hook. The preview mockup IS the variable reward.
- Surface wallet balance prominently after every delivery. It IS the investment.
- See `docs/PRINCIPLES_AND_MENTAL_MODELS.md` for full implementation.

### 6. Peak-End Rule (Kahneman)
Users remember experiences by their peak (most intense moment) and their end.
- **Peak** = Preview approval (`Slide to Approve`). Make it emotionally resonant.
- **End** = Delivery + cashback credit. Confetti (≤2s). Large cashback display. Not a plain toast.

### 7. Zeigarnik Effect (Open Loops)
Active orders MUST appear at the top of the home feed (above banner bento).
They create psychological pull. Never de-prioritise the active order widget.

### 8. Recovery UX (The Salvation Model)
In hyperlocal, failures are inevitable. Recovery is the product.
- **Rule**: If a primary path fails (Rider fail, Vendor breach), proactively offer an "SLA Salvation" (Credit + Auto-shift).
- **Goal**: Turn an error into an investment moment.

## 🛠️ Hard Engineering Rules

1. **Zero Shadow Math**: The database is the only computer. Frontend is only for display. If you are calculating a total or an ETA in TypeScript, you have failed.
2. **Atomic RPC First**: One user intent = One RPC. No multi-trip mutations.
3. **Commitment Before Creativity**: Payment first, personalization second. This eliminates ghost orders and protects vendor bandwidth.
4. **The Liability Shift**: No physical item is touched until the customer "Slides to Approve" the digital mockup. Once `liability_shifted_at` is set, the item is non-refundable.
5. **SECURITY DEFINER + explicit search_path**: Every RPC that is `SECURITY DEFINER` MUST have `SET search_path = public, extensions`. No exceptions. Missing `search_path` = search_path injection risk.
6. **Structured Error Codes, Not Raw SQLERRM**: Never expose raw database error strings to the API response. Always return machine-readable codes like `ORDER_ALREADY_EXISTS`. See `docs/PRINCIPLES_AND_MENTAL_MODELS.md` for the full error code table.
7. **No silent EXCEPTION swallowing**: `EXCEPTION WHEN OTHERS THEN RETURN json_build_object('success', false, 'error', SQLERRM)` is forbidden in production RPCs that modify state. RAISE the exception. Let the transaction roll back. Never silently succeed on a partial write.
9. **FK Indexes**: PostgreSQL does NOT auto-index foreign keys. Every FK column must have a covering index.
10. **Docs-First Onboarding**: Friction is a bug. OCR (IDfy) extraction must pre-fill all KYB forms. The vendor is a verifier, not an inputter.
11. **Anti-Fragile State**: Decouple 3PL logistics from the order state machine. A Shadowfax API failure must NOT block a vendor from marking an order as 'PACKED'.

## 💬 Nomenclature Guard (Purified)

| Concept | Canonical Name | Forbidden Terms |
|---|---|---|
| Vendor | **Vendor** | Partner, Merchant, Seller |
| Product | **Product** | Item, SKU, Good |
| Personalization| **Personalization** | Customization, Design |
| Line Item | **Order Product** | Order Item, Line |
| Delivery Executive | **Delivery Executive** | Delivery Partner, Driver |

## 📐 Design Patterns

- **Progressive Disclosure**: Collapse coupons, GSTIN, and secondary info by default.
- **Sheet vs Page**: Use Sheets for browsing context (Product Detail, Cart). Use Pages for commitment (Checkout, Tracking).
- **Interaction-Decision Architecture**: Every screen has ONE primary decision. One CTA per screen.
- **Anti-Dark-Patterns**: No confirmshaming. No urgency theatre. No hidden fees. No pre-checked opt-ins. See `docs/PRINCIPLES_AND_MENTAL_MODELS.md` for the full prohibition list.
- **Zero-State Design**: Every screen must have a designed empty state. A blank page is a broken page.
- **Accessibility Baseline**: All interactive elements meet WCAG 2.1 AA. Min contrast 4.5:1 for body text. All images have `alt` text. Tap targets ≥44px.

## 🔒 Security Principles

- **RLS as Policy Engine**: All tables exposed to PostgREST have RLS enabled. `SECURITY DEFINER` bypasses RLS intentionally, only for trusted internal operations.
- **Webhook Signature Verification**: All Razorpay webhooks MUST verify `x-razorpay-signature` using HMAC-SHA256. Never process an unsigned webhook.
- **Rate Limiting**: API endpoints accept max 60 req/min per IP (Next.js middleware + Vercel edge config). Cart mutation RPCs: max 10 req/min per user (enforced at edge).
- **API Key Rotation**: `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_KEY_SECRET` must be rotated every 90 days. Scheduled in ops calendar.
- **No Secrets in Code**: All secrets via environment variables only. Never committed to git.
- **CSP Headers**: `Content-Security-Policy` header set in `next.config.ts`. `frame-ancestors 'none'`. `script-src 'self' cdn.razorpay.com maps.googleapis.com`.

## 🧪 Testing Standards

- **Unit tests** (Vitest): All RPC caller functions in `src/lib/actions/` must have unit tests. Coverage gate: 80%.
- **E2E tests** (Playwright): Happy path coverage mandatory — browse → add to cart → checkout → payment → order tracking.
- **Mutation testing**: Commerce intent functions must be tested for all error branches (vendor offline, insufficient stock, vendor mismatch).

---

*Follow the best. Don't reinvent. This is the Swiggy 2026 way.*
