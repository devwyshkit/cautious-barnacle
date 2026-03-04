---
description: How to handle errors in WyshKit following the structured error doctrine
---

# Error Handling in WyshKit

## The Error Doctrine

1. **Machine-readable codes from Postgres** — never expose raw SQL errors to the frontend.
2. **Human-readable messages in the UI** — users see friendly text, never error codes.
3. **Never auto-retry** — user decides what to do next.
4. **Never `window.confirm()` or `window.alert()`** — use inline UI or `Sonner` toast.

## Error Code Registry

| Code | Source | User-Facing Message | UI Pattern |
|---|---|---|---|
| `ORDER_ALREADY_EXISTS` | Idempotency hit | *(silent — return existing order)* | No visible error |
| `VENDOR_OFFLINE` | Vendor status | "This vendor is currently closed." | Toast |
| `VENDOR_MISMATCH` | Multi-vendor cart | *(triggers CartSwitchSheet)* | Sheet |
| `INSUFFICIENT_STOCK` | Stock check | "Sorry, [Product] just sold out." | Toast + remove from cart |
| `COUPON_INVALID` | Coupon validation | "This code isn't valid" | Inline red text |
| `PAYMENT_UNAUTHORIZED` | Razorpay | "Payment failed. Try again?" | Error bottom sheet |
| `PERSONALISATION_SCHEMA_INVALID` | Zod/schema | "Please check your personalisation details" | Inline field errors |
| `DETAILS_ALREADY_SUBMITTED` | Duplicate submit | *(silent — return existing)* | No visible error |

## Frontend Error Handling Pattern

```typescript
// In server action
export async function myAction(input: unknown) {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { success: false, code: 'VALIDATION_ERROR', message: parsed.error.message }
  }
  
  const { data, error } = await supabase.rpc('my_rpc', { ... })
  
  if (error) {
    // Map known codes to user-friendly messages
    const message = ERROR_MESSAGES[error.message] ?? 'Something went wrong. Please try again.'
    return { success: false, code: error.message, message }
  }
  
  return { success: true, data }
}
```

## UI Error Patterns

### READ Failure (data loading)
- Skeleton stays visible. No blank screens.
- Show: "Couldn't load [Component]" + `[↺ Retry]` button.
- Never show a full-page error for a partial component failure.

### WRITE Failure (mutations)
- Toast with human-readable error.
- Payment errors: `Retry same method` (primary) + `Try another method` (secondary).
- Never auto-retry. User decides.

### Network Failure
- Optimistic UI reverts.
- Toast: "Action failed. Please try again."

## What to NEVER Do

- ❌ `console.error(error)` in production — use structured logger
- ❌ Show stack traces or SQL errors to users
- ❌ `window.confirm()` or `window.alert()` — use `AlertDialog` or `Sonner`
- ❌ Auto-retry payments
- ❌ Swallow exceptions silently in state-modifying RPCs
