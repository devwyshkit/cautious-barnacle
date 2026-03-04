---
description: Forbidden patterns and anti-patterns that must never appear in WyshKit code
---

# WyshKit Anti-Pattern Guard

## Forbidden Code Patterns

| Pattern | Why | Alternative |
|---|---|---|
| `window.confirm()` | Native browser dialog. Ugly. | `AlertDialog` from shadcn |
| `window.alert()` | Same | `Sonner` toast |
| `console.log` / `console.warn` / `console.error` | No structured logging | Use the structured `logger` |
| Frontend math for prices/taxes/fees | Zero Shadow Math violation | All arithmetic in Postgres RPCs |
| Hardcoded colours (`#FF0000`, `red`) | No design system compliance | CSS variables (`--primary`, etc.) |
| `localStorage` for cart | Security + stale data risk | Session storage (guest) / DB (auth) |
| Multiple RPCs per screen | One-Trip Promise violation | Single composite RPC |
| UUID in customer-facing URL | Slug-First Architecture violation | Human-readable slugs |
| Sheet inside sheet | No Surface Nesting (Law #4) | Close first, then open second |
| `EXCEPTION WHEN OTHERS THEN RETURN ...` | Silent swallowing | `RAISE` — let Postgres roll back |
| Raw SQL `UPDATE`/`DELETE` on production | Zero Manual SQL | Use atomic RPCs |
| Showing km/distance to user | Time > Distance | Show ETA: "~40 min" or "by 5:15 PM" |
| Pre-payment text input for personalisation | Commitment Before Creativity | Toggle only. Details post-payment. |
| Auto-retry on payment failure | User must decide | Show retry options |
| `Partner`, `Item`, `Merchant` | Nomenclature violation | `Vendor`, `Product`, `Customer` |
| `Design Hub`, `Creative Brief` | Deprecated terminology | `Preview Thread`, Requirements Form |
| Subscription tiers for customers | YAGNI + forced continuity | Zero subscriptions |

## Forbidden UX Patterns

| Pattern | Why |
|---|---|
| Confirmshaming ("Are you SURE you don't want this?") | Dark pattern |
| Hidden fees (fee appears only at payment) | Anti-dark-pattern doctrine |
| Pre-checked opt-ins | Must be unchecked by default |
| "Only 3 left!" without `stock_quantity <= 3` verified | Urgency theatre |
| Promotional push 10PM–8AM | DND window violation |
| Rating prompt before delivery is logged | Premature feedback capture |
| Separate `/cart` page | Cart is a sheet, not a page |
| Separate `/success` page | Success overlay on `/orders/[id]` |

## If You Find Yourself Doing This, STOP

1. **Creating a new page** → Check the Surface Inventory law first (5 pages only)
2. **Adding a third-party library** → Check if shadcn/ui or Supabase already handles it
3. **Computing a price in TypeScript** → Move it to the RPC
4. **Adding `useEffect` to fetch data** → Use Server Components + RSC streaming
5. **Building a custom component** → Check shadcn/ui first
6. **Adding `any` type** → Generate types from Supabase schema
