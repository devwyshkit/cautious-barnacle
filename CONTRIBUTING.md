# WyshKit 2026 Core Contributing Guide

> "The Shadow of Swiggy. The Speed of Instamart. Zero Reinvention."

Welcome to the WyshKit Salt Bae team. To maintain the "swiggy 2026" elite standard, follow these hard rules.

## 1. The Hard Doctrine
- **Zero Dark Mode**: No dark mode implementation allowed. Use light mode only. If adding new styles, use semantic tokens (`[var(--background)]`, `[var(--text-primary)]`).
- **Zero Shadow Math**: No hardcoded colors (`bg-white`, `text-black`) or magic numbers. Use CSS variables from `globals.css`.
- **Zero Reinvention**: Before adding a dependency or building a complex utility, check if Supabase or shadcn/ui already solves it.
- **Mobile First**: All interfaces (Customer, Admin, Vendor) MUST be mobile-first and optimized for 44px tap targets.

## 2. Technical Standards
- **Nomenclature Guard**: Never use 'Partner', 'Item', or 'Merchant'. Use 'Vendor', 'Product', and 'Customer' only.
- **Commitment Before Creativity**: Pay first, personalise after. Personalization happens *after* order creation in the "Preview Workflow."
- **One-Trip Promise**: Aim for single-trip server component data fetching. Use shared actions for common data.

## 3. Reference Architecture
- [KERNEL.md](./docs/KERNEL.md) - Hard engineering laws & Commerce Intent Engine.
- [DOCTRINE.md](./docs/DOCTRINE.md) - Product strategy & behavioral science laws.
- [WORKFLOW.md](./docs/WORKFLOW.md) - The full user journey from Home to Delivery.
- [OPERATIONS.md](./docs/OPERATIONS.md) - Vendor onboarding & KYC extraction-first rules.

## 4. Development Workflow
```bash
npm run dev               # Start dev server
npm test                  # Run unit tests (80% coverage gate)
npm run lint:nomenclature # Verify naming compliance
```

Before submitting a PR, ensure zero `console.log` leaks and zero "Magic Pixels" in your components.
