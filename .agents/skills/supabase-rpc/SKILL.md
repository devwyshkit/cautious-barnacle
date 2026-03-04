---
description: How to write, modify, or debug a Supabase RPC (Remote Procedure Call) in WyshKit
---

# Supabase RPC Development

## The WyshKit RPC Rules

1. **One RPC per surface** (One-Trip Promise). If you're calling two RPCs for one screen, you have a design error.
2. **SECURITY DEFINER + explicit search_path** on all state-modifying RPCs:
   ```sql
   CREATE OR REPLACE FUNCTION my_rpc(...)
   RETURNS JSONB
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public, extensions
   AS $$ ... $$;
   ```
3. **Zero Shadow Math** — all price/tax/fee calculations happen inside the RPC, never in TypeScript.
4. **Structured errors** — never return raw SQL errors. Use machine-readable codes:
   ```sql
   RAISE EXCEPTION 'VENDOR_OFFLINE' USING HINT = 'This vendor is currently closed.';
   ```
5. **No silent swallowing** — `EXCEPTION WHEN OTHERS THEN RETURN json_build_object('success', false)` is forbidden in state-modifying RPCs.

## Creating a New RPC

### Step 1: Write the SQL

```sql
CREATE OR REPLACE FUNCTION public.my_new_rpc(
  p_user_id UUID DEFAULT NULL,
  p_param TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Your logic here
  RETURN json_build_object('success', true, 'data', v_result);
END;
$$;
```

### Step 2: Apply via migration

Use the Supabase MCP tool:
```
apply_migration(name: "add_my_new_rpc", query: "...")
```

Or via CLI:
```bash
supabase migration new add_my_new_rpc
# Edit the migration file, then:
supabase db push
```

### Step 3: Regenerate Types

// turbo
```bash
npx supabase gen types typescript --project-id $PROJECT_ID > src/lib/supabase/database.types.ts
```

### Step 4: Create Server Action

In `src/lib/actions/`:
```typescript
'use server'
import { createClient } from '@/lib/supabase/server'

export async function myNewAction(param: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('my_new_rpc', {
    p_param: param
  })
  
  if (error) throw new Error(error.message)
  return data
}
```

### Step 5: Validate with Zod

All mutations must be Zod-validated BEFORE calling the RPC:
```typescript
import { z } from 'zod'

const schema = z.object({
  param: z.string().min(1).max(100)
})

export async function myNewAction(input: unknown) {
  const parsed = schema.parse(input) // throws if invalid
  // ... call RPC
}
```

## Debugging RPCs

1. **Check Supabase logs**: Use the `get_logs` MCP tool with `service: "postgres"`
2. **Test directly**:
   ```sql
   SELECT my_new_rpc(p_user_id => 'test-uuid', p_param => 'test');
   ```
3. **Common issues**:
   - `PGRST203` = function overload ambiguity. Check for duplicate function signatures.
   - `permission denied` = RLS blocking. Check if SECURITY DEFINER is set.
   - `search_path` errors = missing `SET search_path = public, extensions`.

## Key Surface RPCs (The One-Trip Promise)

| Surface | RPC | Key Returns |
|---|---|---|
| Home | `get_global_init_surface()` | Categories, vendors, products, wallet |
| Vendor page | `get_vendor_surface()` | Vendor info, all products, reviews |
| Product detail | `get_product_surface_v1()` | Full product with variants, add-ons, schema |
| Checkout | `get_checkout_context(lat, lng, guest_cart)` | Items, address, bill, coupons, wallet |
| Orders | `get_user_orders_v1()` | All user orders with status |

## Naming Convention

- Surface RPCs: `get_[surface]_surface` or `get_[context]_context`
- Mutation RPCs: `[verb]_[noun]_atomic` (e.g., `place_order_atomic`, `execute_cart_mutation`)
- Recovery RPCs: `recover_[noun]_atomic`

## Testing

Write Vitest tests for all server actions in `src/lib/actions/__tests__/`:
```typescript
import { describe, it, expect } from 'vitest'
import { myNewAction } from '../myNewAction'

describe('myNewAction', () => {
  it('should return success for valid input', async () => {
    const result = await myNewAction('test')
    expect(result.success).toBe(true)
  })
  
  it('should throw on invalid input', async () => {
    await expect(myNewAction('')).rejects.toThrow()
  })
})
```
