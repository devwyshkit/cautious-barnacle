# Wyshkit 2026: Hardening & Drift Prevention

To ensure that Wyshkit remains 100% aligned with the **Swiggy 2026** elite standards, we have implemented automated guardrails and structural patterns to prevent terminology drift (e.g., "partner" or "item" creeping back in).

## 1. Automated Nomenclature Guard
We have implemented a strict pre-commit/CI check that scans the `src` directory for legacy terms.

**Usage:**
```bash
npm run lint:nomenclature
```
This script (`scripts/nomenclature-guard.sh`) will fail the build if any forbidden terms are detected, ensuring that nomenclature decay never reaches production.

## 2. Schema-Driven Development (SSOT)
In 2026, we do not define types manually.
1. **Database is the Source of Truth**: All domain names (Vendor, Product, cart_products) are defined in Supabase.
2. **Type Generation**: Run `supabase gen types typescript` (or use the automated sync) to update `src/lib/supabase/database.types.ts`.
3. **Strict Mapping**: Always map RPC outputs directly to purified TypeScript interfaces (e.g., `DraftProductItem`) as seen in `src/lib/actions/cart/get-cart.ts`.

## 3. Forbidden Terms Rulebook
| Legacy Term | 2026 Standard | Context |
| :--- | :--- | :--- |
| Partner | **Vendor** | Supply side, store owner |
| Item | **Product** | Catalog entity, commerce object |
| SKU | **Variant** | Specific product configuration |
| Merchant | **Vendor** | Financial/Admin context |
| Delivery Partner | **Delivery Executive** | Logistics/Operations |

## 4. Zero Shadow Math Doctrine
Avoid "Shadow Math" in the frontend. If a calculation involves pricing, GST, or fees, it **MUST** be performed by a Supabase RPC or the pricing engine.
- **Good**: `const pricing = await supabase.rpc('get_cart_context')`
- **Bad**: `const total = cartItems.reduce(...)`

## 5. Maintenance
- Periodically run the `Nomenclature Guard` during code reviews.
- Update the `forbidden_terms` array in `scripts/nomenclature-guard.sh` as the domain evolves.

---
*Maintained by the Wyshkit 2026 Core Team.*
