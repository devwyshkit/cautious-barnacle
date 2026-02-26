# Swiggy 2026: Engineering Conventions & Principles

This document formalizes the "Swiggy 2026" engineering culture. These are not suggestions; they are the laws of the Wyshkit kernel.

## 🧠 Mental Models

### 1. The Swiggy Equation
`WyshKit = [Swiggy Food Logistics] + [Instamart Product Catalog] + [Personalization Workflow]`
- **Logistics**: Time > Distance. SLA-driven.
- **Catalog**: Physical hard goods. Neighborhood curation (50-100 SKUs).
- **Workflow**: Preview Trust Moat. Liability shift on approval.

### 2. Miller's Law (7±2 Rule)
Limit cognitive load. Never show more than 7 primary navigation or action items in a single view. Reveal complexity via **Progressive Disclosure**.

### 3. Fitts' Law (Tap Targets)
Primary actions (e.g., `Slide to Pay`, `Add to Cart`) must be large, high-contrast, and positioned for thumb-reach on mobile.

## 🛠️ Hard Engineering Rules

1. **Zero Shadow Math**: The database is the only computer. Frontend is only for display. If you are calculating a total or an ETA in TypeScript, you have failed.
2. **Atomic RPC First**: One user intent = One RPC. No multi-trip mutations.
3. **Commitment Before Creativity**: Payment first, personalization second. This eliminates ghost orders and protects vendor bandwidth.
4. **The Liability Shift**: No physical item is touched until the customer "Slides to Approve" the digital mockup. Once `liability_shifted_at` is set, the item is non-refundable.

## 💬 Nomenclature Guard (Purified)

| Concept | Canonical Name | Forbidden Terms |
|---|---|---|
| Vendor | **Vendor** | Partner, Merchant, Seller |
| Product | **Product** | Item, SKU, Good |
| Personalization| **Personalization** | Customization, Design |
| Line Item | **Order Product** | Order Item, Line |

## 📐 Design Patterns

- **Progressive Disclosure**: Collapse coupons, GSTIN, and secondary info by default.
- **Sheet vs Page**: Use Sheets for browsing context (Product Detail, Cart). Use Pages for commitment (Checkout, Tracking).
- **Interaction-Decision Architecture**: Every screen has ONE primary decision.

---
*Follow the best. Don't reinvent. This is the Swiggy 2026 way.*
