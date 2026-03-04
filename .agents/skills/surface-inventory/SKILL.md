---
description: How to add a new page or sheet to the WyshKit app following the Surface Inventory law
---

# Adding a New Page or Sheet

## The Surface Inventory Law

WyshKit has exactly **5 pages and 7 sheets**. Before adding anything, check if it already exists:

### Pages (routes in `app/`)
| Route | Component | Auth |
|---|---|---|
| `/` | HomeFeed | ❌ |
| `/vendor/[slug]` | VendorStorefront | ❌ |
| `/checkout` | CheckoutPage | ✅ |
| `/orders/[id]` | OrderTracking | ✅ |
| `/orders` | OrderHistory | ✅ |

### Sheets (components, not routes)
| Sheet | Trigger |
|---|---|
| `ProductSheet` | Tap product card |
| `CartDrawer` | Tap cart bar |
| `LocationSheet` | Tap address bar |
| `OTPSheet` | Checkout entry if guest |
| `AddressSheet` | Tap address in checkout |
| `CartSwitchSheet` | Vendor mismatch |
| `SupportSheet` | Tap "Need help?" |

### Routes That Must NOT Exist
`/cart` · `/product/[id]` · `/location` · `/address` · `/support` · `/success` · `/confirm`

If you find yourself creating one of these, **STOP**. It's a sheet, not a page.

## Adding a New Page

Only add a new page if it's a fundamentally new domain that doesn't belong in an existing page. This should be extremely rare.

### Step 1: Check Auth Requirement

- **No auth needed?** → Page is browsable by guests. Use IP geolocation if needed.
- **Auth required?** → Add route to auth middleware. Redirect to `/` if not logged in.

### Step 2: Create the Route

```
app/
  [new-route]/
    page.tsx        ← Server Component (RSC)
    loading.tsx     ← Skeleton (renders within 50ms)
    error.tsx       ← Error boundary
```

### Step 3: Create the One-Trip RPC

Every page needs exactly ONE RPC that returns all its data. See `supabase-rpc` skill.

### Step 4: Follow the Slug-First Rule

If the URL contains a user-facing identifier, it MUST be a slug, not a UUID.
```
✅ /vendor/trophy-palace
❌ /vendor/a1b2c3d4-e5f6-7890
```

## Adding a New Sheet

Sheets are bottom-rising modal surfaces (shadcn `Sheet` component).

### Step 1: Create Component

```tsx
// src/components/sheets/MySheet.tsx
'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface MySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MySheet({ open, onOpenChange }: MySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
        </SheetHeader>
        {/* Content */}
      </SheetContent>
    </Sheet>
  )
}
```

### Step 2: Prevent Background Scroll

Mobile: `body { overflow: hidden }` when sheet is open. The sheet handles its own scroll internally.

### Step 3: No Nesting

Sheets NEVER open inside other sheets. If opening a new sheet, close the current one first.

### Step 4: Swipe Down = Dismiss

All sheets must support swipe-down-to-dismiss. shadcn's `Sheet` handles this by default.

## Skeleton Mandate

Every page and sheet MUST render a skeleton within 50ms. No blank screens. Ever.

```tsx
// app/[route]/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}
```
